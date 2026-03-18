"use client";

import { useState, useEffect, useRef } from "react";
import DatePicker from "./components/DatePicker";
import NumerologyTab from "./components/tabs/NumerologyTab";
import KalakineeTab from "./components/tabs/KalakineeTab";
import LuckyTab from "./components/tabs/LuckyTab";
import ZodiacTab from "./components/tabs/ZodiacTab";
import LifePathTab from "./components/tabs/LifePathTab";
import ShareCard from "./components/ShareCard";
import { kalakineeMap } from "./lib/numerology";
import { getDayIdxFromDate, calcFromParams } from "./lib/calc";
import type { ResultType } from "./types";

type TabId = "numerology" | "kalakinee" | "lucky" | "zodiac" | "lifepath";

function getTabs(result: ResultType) {
  const { dayIdx, lifePath, zodiac } = result;
  return [
    { id: "numerology" as TabId, label: "เลขศาสตร์", icon: "🔢" },
    ...(dayIdx !== null ? [{ id: "kalakinee" as TabId, label: "กาลกิณี & ทักษา", icon: "📖" }] : []),
    ...(dayIdx !== null ? [{ id: "lucky" as TabId, label: "มงคล", icon: "✨" }] : []),
    ...(zodiac !== null ? [{ id: "zodiac" as TabId, label: "นักษัตร", icon: "🐾" }] : []),
    ...(lifePath !== null ? [{ id: "lifepath" as TabId, label: "เลขชะตา", icon: "🌟" }] : []),
  ];
}

const INPUT_CLASS = "w-full bg-secondary-50 border border-primary-300 text-slate-900 rounded-xl px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary-400/50 focus:border-primary-500 focus:bg-white placeholder:text-slate-400";

export default function App() {
  const [firstName, setFirstName] = useState(() =>
    typeof window !== "undefined" ? (new URLSearchParams(window.location.search).get("fn") ?? "") : ""
  );
  const [lastName, setLastName] = useState(() =>
    typeof window !== "undefined" ? (new URLSearchParams(window.location.search).get("ln") ?? "") : ""
  );
  const [birthDate, setBirthDate] = useState(() =>
    typeof window !== "undefined" ? (new URLSearchParams(window.location.search).get("bdate") ?? "") : ""
  );
  const [wednesdayNight, setWednesdayNight] = useState(() =>
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("bdn") === "1" : false
  );
  const [result, setResult] = useState<ResultType | null>(() => {
    if (typeof window === "undefined") return null;
    const p = new URLSearchParams(window.location.search);
    return calcFromParams(p.get("fn") ?? "", p.get("ln") ?? "", p.get("bdate") ?? "", p.get("bdn") === "1");
  });
  const [activeTab, setActiveTab] = useState<TabId>("numerology");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");

  useEffect(() => {
    document.title = result && fullName
      ? `เลขศาสตร์ - ${fullName} | ดูดวงชื่อ-นามสกุล วันนี้ดวงเป็นยังไง? มาเช็กกับมหาหลง`
      : "ดูดวงชื่อ-นามสกุล วันนี้ดวงเป็นยังไง? มาเช็กกับมหาหลง";
  }, [result, fullName]);

  function calculate() {
    if (!firstName.trim()) return;
    const res = calcFromParams(firstName, lastName, birthDate, wednesdayNight);
    if (!res) return;
    setResult(res);
    setActiveTab("numerology");
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function share() {
    const params = new URLSearchParams();
    if (firstName.trim()) params.set("fn", firstName.trim());
    if (lastName.trim()) params.set("ln", lastName.trim());
    if (birthDate) params.set("bdate", birthDate);
    if (wednesdayNight) params.set("bdn", "1");
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    if (navigator.share) {
      navigator.share({ title: `ผลเลขศาสตร์${fullName ? ` ${fullName}` : ""} | ดูดวงชื่อ-นามสกุล`, url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  async function saveAsImage() {
    if (!shareCardRef.current) return;
    setSaving(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(shareCardRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `เลขศาสตร์-${fullName || "mhalong.com"}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setSaving(false);
    }
  }

  const isWednesday = birthDate ? new Date(birthDate + "T12:00:00").getDay() === 3 : false;
  const computedDayIdx = getDayIdxFromDate(birthDate, wednesdayNight);
  const dayName = computedDayIdx !== null
    ? `วัน${kalakineeMap[computedDayIdx as keyof typeof kalakineeMap]?.day}`
    : null;

  return (
    <div className="min-h-screen text-slate-800 p-4 sm:p-8 font-sans bg">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2 mt-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900 drop-shadow-sm">
            คำนวณเลขศาสตร์
          </h1>
          <p className="text-primary-800 text-sm sm:text-base font-medium">
            วิเคราะห์ชื่อและนามสกุลตามหลักเลขศาสตร์และอักษรกาลกิณี (รองรับภาษาไทยและภาษาอังกฤษ)
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => { e.preventDefault(); calculate(); }}
          className="bg-white rounded-3xl shadow-xl shadow-secondary-200/50 p-6 sm:p-8 border border-primary-200 transition-all"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary-800">ชื่อ (ภาษาไทยหรืออังกฤษ)</label>
              <input
                className={INPUT_CLASS}
                value={firstName}
                onChange={e => setFirstName(e.target.value.replace(/[^ก-๙a-zA-Z\s]/g, ""))}
                placeholder="เช่น ธันยพร หรือ John"
              />
              <p className="text-[11px] text-slate-500 mt-1">* รองรับทั้งภาษาไทยและภาษาอังกฤษ</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary-800">นามสกุล (ภาษาไทยหรืออังกฤษ)</label>
              <input
                className={INPUT_CLASS}
                value={lastName}
                onChange={e => setLastName(e.target.value.replace(/[^ก-๙a-zA-Z\s]/g, ""))}
                placeholder="เช่น พุทธสุวรรณ หรือ Doe"
              />
              <p className="text-[11px] text-slate-500 mt-1">* หากไม่มีเว้นว่างไว้ได้</p>
            </div>
          </div>

          {/* Birth date */}
          <div className="space-y-3 mb-8">
            <label className="block text-sm font-semibold text-primary-800">
              วันเดือนปีเกิด
              <span className="text-primary-600 font-normal ml-1">(สำหรับกาลกิณี ทักษา สีมงคล และเลขชะตา)</span>
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              <DatePicker
                value={birthDate}
                onChange={v => { setBirthDate(v); setWednesdayNight(false); }}
              />
              {dayName && (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 bg-primary-50 border border-primary-200 rounded-full px-3 py-1.5">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {dayName}
                </span>
              )}
            </div>
            {isWednesday && (
              <div className="flex gap-2">
                {[
                  { night: false, label: "☀️ เกิดกลางวัน (พุธ)" },
                  { night: true, label: "🌙 เกิดกลางคืน (ราหู)" },
                ].map(({ night, label }) => (
                  <button
                    key={String(night)}
                    type="button"
                    onClick={() => setWednesdayNight(night)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                      wednesdayNight === night
                        ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                        : "bg-secondary-50 text-primary-700 border-primary-300 hover:bg-primary-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!firstName.trim()}
            className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-accent-500/30 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3.5 px-4 shadow-lg disabled:shadow-none shadow-accent-200/50 transition-all hover:shadow-accent-300/50 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            วิเคราะห์ผลลัพธ์
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>

        {/* Results */}
        {result && (
          <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-6">

            {/* Tab nav */}
            <div className="flex gap-1 bg-primary-50 border border-primary-200 rounded-2xl p-1.5 overflow-x-auto">
              {getTabs(result).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-fit whitespace-nowrap flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-white text-primary-900 shadow-sm border border-primary-200"
                      : "text-primary-600 hover:text-primary-800 hover:bg-white/50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "numerology" && (
              <NumerologyTab fn={result.fn} ln={result.ln} total={result.total} />
            )}
            {activeTab === "kalakinee" && result.dayIdx !== null && (
              <KalakineeTab fn={result.fn} dayIdx={result.dayIdx} total={result.total} badInFirst={result.badInFirst} />
            )}
            {activeTab === "lucky" && result.dayIdx !== null && (
              <LuckyTab dayIdx={result.dayIdx} />
            )}
            {activeTab === "zodiac" && result.zodiac !== null && (
              <ZodiacTab zodiac={result.zodiac} />
            )}
            {activeTab === "lifepath" && result.lifePath !== null && (
              <LifePathTab lifePath={result.lifePath} />
            )}

            {/* Actions */}
            <div className="text-center pt-8 pb-4 space-y-4">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={share}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl py-2.5 px-5 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      คัดลอกลิงก์แล้ว!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      แชร์ผลลัพธ์
                    </>
                  )}
                </button>
                <button
                  onClick={saveAsImage}
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-2.5 px-5 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  {saving ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      บันทึกเป็นรูป
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-primary-600 max-w-lg mx-auto leading-relaxed">
                * เลขศาสตร์และหลักเกณฑ์เหล่านี้เป็นเพียงทางเลือกหนึ่งในการพิจารณาหาชื่อมงคลเท่านั้น ชะตาชีวิตยังต้องพึ่งพากรรมดีและการปฏิบัติตนของท่านเอง
              </p>
            </div>
          </div>
        )}

        <footer className="mt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-primary-200/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <span className="text-primary-800 text-sm font-medium">Made with</span>
            <span className="inline-block text-secondary-600 group-hover:scale-125 transition-transform duration-300">❤️</span>
            <span className="text-primary-800 text-sm font-medium">for everyone By</span>
            <span className="text-primary-950 font-bold text-sm tracking-tight border-secondary-400 group-hover:border-secondary-500 transition-colors">PskCluB</span>
          </div>
        </footer>
      </div>

      {/* Hidden share card for image export */}
      {result && <ShareCard result={result} fullName={fullName} cardRef={shareCardRef} />}
    </div>
  );
}
