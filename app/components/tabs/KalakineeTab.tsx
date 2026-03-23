import type { NameResult } from "../../types";
import {
  kalakineeMap,
  getTaksaCategory,
  taksaDefinitions,
  planetPowerPredictions,
} from "../../lib/numerology";

interface Props {
  fn: NameResult;
  dayIdx: number;
  total: number;
  badInFirst: string[];
}

export default function KalakineeTab({ fn, dayIdx, total, badInFirst }: Props) {
  const dayData = kalakineeMap[dayIdx as keyof typeof kalakineeMap];

  return (
    <div className="space-y-6">
      {/* Kalakinee */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-accent-400" />
        <h3 className="text-base font-bold text-primary-900 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          ตรวจอักษรกาลกิณี
        </h3>
        <div className="text-primary-800 mb-4 pl-7">
          วันเกิด: <span className="font-bold text-primary-900">วัน{dayData?.day}</span>
          <span className="mx-2 text-primary-300">|</span>
          ควรหลีกเลี่ยง:{" "}
          <span className="font-bold text-accent-600">
            {dayIdx === 1 ? "สระทั้งหมด (ยกเว้นไม้หันอากาศและการันต์)" : dayData?.chars.join(" ")}
          </span>
        </div>
        <div className="pl-7">
          {badInFirst.length === 0 ? (
            <div className="inline-flex items-center gap-2 font-medium text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              ดีเยี่ยม! ไม่พบอักษรกาลกิณีในชื่อ
            </div>
          ) : (
            <div className="flex items-center gap-2 font-medium text-accent-700 bg-accent-50 px-3 py-2 rounded-lg border border-accent-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              พบในชื่อ: <strong className="text-accent-800">{badInFirst.join(", ")}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Taksa */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-200">
        <h3 className="text-base font-bold text-primary-900 mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          หลักทักษาปกรณ์ (พลังสะท้อน / พลังเงา)
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-primary-800 mb-2">ชื่อ (ทักษาของแต่ละหมวดอักษร):</h4>
            <div className="flex flex-wrap items-center gap-2">
              {fn.breakdown.map((x, i) => {
                const cat = getTaksaCategory(dayIdx, x.ch);
                if (!cat) return null;
                return (
                  <div key={i} className="flex flex-col items-center bg-primary-50 rounded-lg px-3 py-2 border border-primary-100 shadow-sm">
                    <span className="text-lg font-bold text-primary-900">{x.ch}</span>
                    <span className={`text-xs font-bold mt-1 ${cat === "กาลกิณี" ? "text-red-500" : "text-green-600"}`}>{cat}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-semibold text-primary-800 mb-3">ความหมายหลักทักษา:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(taksaDefinitions).map(([key, desc]) => (
              <div key={key} className="flex flex-col p-3 rounded bg-secondary-50 border border-secondary-100">
                <span className={`font-bold ${key === "กาลกิณี" ? "text-red-500" : "text-primary-700"}`}>{key}</span>
                <span className="text-slate-600 mt-1">{desc}</span>
              </div>
            ))}
          </div>
        </div>
        {planetPowerPredictions[total] && (
          <div className="mt-6 border-t border-primary-100 pt-4">
            <h4 className="font-semibold text-primary-800 mb-3">นิยามความหมายกำลังดาวพระเคราะห์ (พลังสะท้อนจากเลขรวม):</h4>
            <div className="bg-primary-50 border border-primary-200 p-4 rounded-xl">
              <div className="font-bold text-primary-900 text-lg mb-1">{planetPowerPredictions[total].title} (กำลัง {total})</div>
              <div className="text-slate-700">{planetPowerPredictions[total].desc}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
