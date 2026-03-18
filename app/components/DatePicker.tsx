"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
}

const THAI_MONTHS = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const THAI_MONTHS_SHORT = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
const WEEKDAY_LABELS = ["อา","จ","อ","พ","พฤ","ศ","ส"];

const TODAY = new Date();
const FROM_YEAR = 1900;
const TO_YEAR = TODAY.getFullYear();

// สร้าง list ปี พ.ศ. จากมากไปน้อย
const YEARS_TH = Array.from({ length: TO_YEAR - FROM_YEAR + 1 }, (_, i) => TO_YEAR - i + 543);

function parseDate(str: string): Date | undefined {
  if (!str) return undefined;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? undefined : date;
}

function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(str: string): string {
  if (!str) return "";
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${d} ${THAI_MONTHS_SHORT[m - 1]} ${y + 543}`;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(() => parseDate(value) ?? new Date(2000, 0, 1));
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = parseDate(value);

  // ปิดเมื่อคลิกนอก
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // คำนวณตำแหน่ง dropdown
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    function calcPos() {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const dropH = 400;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow < dropH && rect.top > dropH
        ? rect.top + window.scrollY - dropH - 4
        : rect.bottom + window.scrollY + 4;
      setDropdownPos({ top, left: rect.left + window.scrollX });
    }
    calcPos();
    window.addEventListener("scroll", calcPos, true);
    window.addEventListener("resize", calcPos);
    return () => {
      window.removeEventListener("scroll", calcPos, true);
      window.removeEventListener("resize", calcPos);
    };
  }, [open]);

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    onChange(toDateStr(date));
    setOpen(false);
  }

  function handleMonthSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setMonth(new Date(month.getFullYear(), +e.target.value, 1));
  }

  function handleYearSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const ce = +e.target.value - 543;
    setMonth(new Date(ce, month.getMonth(), 1));
  }

  const isFutureMonth = (m: Date) =>
    m.getFullYear() > TO_YEAR || (m.getFullYear() === TO_YEAR && m.getMonth() > TODAY.getMonth());

  const dropdown = open ? (
    <div
      ref={dropdownRef}
      style={{ position: "absolute", top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999 }}
      className="bg-white rounded-2xl shadow-2xl border border-primary-200 p-4 w-[300px]"
    >
      {/* Month + Year selects */}
      <div className="flex gap-2 mb-3">
        <select
          value={month.getMonth()}
          onChange={handleMonthSelect}
          className="flex-1 bg-primary-50 border border-primary-200 text-primary-900 text-sm font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-400/50 cursor-pointer"
        >
          {THAI_MONTHS.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>
        <select
          value={month.getFullYear() + 543}
          onChange={handleYearSelect}
          className="w-28 bg-primary-50 border border-primary-200 text-primary-900 text-sm font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-400/50 cursor-pointer"
        >
          {YEARS_TH.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Day grid */}
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        month={month}
        onMonthChange={setMonth}
        hideNavigation
        disabled={[{ after: TODAY }]}
        fromYear={FROM_YEAR}
        toYear={TO_YEAR}
        formatters={{
          formatWeekdayName: (d) => WEEKDAY_LABELS[d.getDay()],
        }}
        classNames={{
          root: "w-full",
          months: "w-full",
          month: "w-full space-y-1",
          month_caption: "hidden",
          nav: "hidden",
          weeks: "space-y-0.5",
          weekdays: "grid grid-cols-7 mb-1",
          weekday: "text-center text-xs font-semibold text-primary-400 py-1",
          week: "grid grid-cols-7",
          day: "flex items-center justify-center",
          day_button: [
            "w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium",
            "transition-all cursor-pointer hover:bg-primary-100 text-slate-700",
          ].join(" "),
          selected: "[&>button]:!bg-primary-600 [&>button]:!text-white [&>button]:shadow-sm",
          today: "[&>button]:font-bold [&>button]:text-primary-600 [&>button]:ring-1 [&>button]:ring-primary-400",
          outside: "[&>button]:text-slate-300 [&>button]:hover:bg-transparent",
          disabled: "[&>button]:text-slate-200 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent",
          hidden: "invisible",
        }}
      />

      {/* Prev / Next month nav */}
      <div className="flex justify-between mt-2 pt-2 border-t border-primary-100">
        <button
          type="button"
          onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          disabled={month.getFullYear() <= FROM_YEAR && month.getMonth() === 0}
          className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-900 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-primary-50"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          เดือนก่อน
        </button>
        <button
          type="button"
          onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          disabled={isFutureMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-900 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-primary-50"
        >
          เดือนถัดไป
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div ref={triggerRef} className="relative w-full sm:w-auto">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => {
          if (!open && value) setMonth(parseDate(value) ?? new Date(2000, 0, 1));
          setOpen(v => !v);
        }}
        className={`w-full sm:w-auto flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left cursor-pointer ${
          open
            ? "border-primary-500 ring-2 ring-primary-400/50 bg-white"
            : "border-primary-300 bg-secondary-50 hover:bg-white hover:border-primary-400"
        }`}
      >
        <svg className="h-5 w-5 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className={value ? "text-slate-900 font-medium" : "text-slate-400"}>
          {value ? formatDisplay(value) : "เลือกวันเกิด"}
        </span>
        {value ? (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onChange(""); setOpen(false); }}
            className="ml-auto text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <svg className="h-4 w-4 text-slate-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {typeof document !== "undefined" && createPortal(dropdown, document.body)}
    </div>
  );
}
