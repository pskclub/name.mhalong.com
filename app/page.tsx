"use client";

import { useState, useEffect, useRef } from "react";

import {
  calcName,
  checkKalakinee,
  fullPredictions,
  kalakineeMap,
  getTaksaCategory,
  taksaDefinitions,
  planetPowerPredictions,
  type PredictionDetail,
} from "./lib/numerology";

interface NameBreakdown {
  ch: string;
  v: number;
}

interface NameResult {
  sum: number;
  breakdown: NameBreakdown[];
}

interface ResultType {
  fn: NameResult;
  ln: NameResult | null;
  total: number;
  dayIdx: number | null;
  badInFirst: string[];
  badInLast: string[];
}

function calcFromParams(fn: string, ln: string, bd: string): ResultType | null {
  if (!fn.trim()) return null;
  const fnResult = calcName(fn.trim());
  const lnResult = ln.trim() ? calcName(ln.trim()) : null;
  const total = lnResult ? fnResult.sum + lnResult.sum : fnResult.sum;
  const dayIdx = bd !== "" ? parseInt(bd, 10) : null;
  const badInFirst = dayIdx !== null ? checkKalakinee(fn.trim(), dayIdx) : [];
  const badInLast = dayIdx !== null && ln.trim() ? checkKalakinee(ln.trim(), dayIdx) : [];
  return { fn: fnResult, ln: lnResult, total, dayIdx, badInFirst, badInLast };
}

export default function App() {
  const [firstName, setFirstName] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("fn") ?? "";
  });
  const [lastName, setLastName] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("ln") ?? "";
  });
  const [birthDay, setBirthDay] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("bd") ?? "";
  });
  const [result, setResult] = useState<ResultType | null>(() => {
    if (typeof window === "undefined") return null;
    const p = new URLSearchParams(window.location.search);
    return calcFromParams(p.get("fn") ?? "", p.get("ln") ?? "", p.get("bd") ?? "");
  });
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

  function share() {
    const params = new URLSearchParams();
    if (firstName.trim()) params.set("fn", firstName.trim());
    if (lastName.trim()) params.set("ln", lastName.trim());
    if (birthDay) params.set("bd", birthDay);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    if (navigator.share) {
      navigator.share({ title: `ผลเลขศาสตร์ ${fullName ? ` ${fullName} | ดูดวงชื่อ-นามสกุล วันนี้ดวงเป็นยังไง? มาเช็กกับมหาหลง` : "ดูดวงชื่อ-นามสกุล วันนี้ดวงเป็นยังไง? มาเช็กกับมหาหลง"}`, url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  function calculate() {
    if (!firstName.trim()) return;
    const fn = calcName(firstName.trim());
    const ln = lastName.trim() ? calcName(lastName.trim()) : null;
    const total = ln ? fn.sum + ln.sum : fn.sum;
    const dayIdx = birthDay !== "" ? parseInt(birthDay, 10) : null;
    const badInFirst = dayIdx !== null ? checkKalakinee(firstName.trim(), dayIdx) : [];
    const badInLast = dayIdx !== null && lastName.trim() ? checkKalakinee(lastName.trim(), dayIdx) : [];
    setResult({ fn, ln, total, dayIdx, badInFirst, badInLast });
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  async function saveAsImage() {
    if (!shareCardRef.current) return;
    setSaving(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(shareCardRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `เลขศาสตร์-${fullName ? `${fullName}-mhalong.com` : "ดูดวงชื่อ-นามสกุล วันนี้ดวงเป็นยังไง? มาเช็กกับมหาหลง"}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setSaving(false);
    }
  }

  function getNumPred(n: number): PredictionDetail {
    if (n in fullPredictions) return fullPredictions[n as keyof typeof fullPredictions];
    const base = n % 9 || 9;
    return fullPredictions[base as keyof typeof fullPredictions] ?? { title: "", score: 0, text: "", titleAlter: "", scoreAlter: 0, textAlter: "" };
  }



  return (
    <div className="min-h-screen bg-linear-to-br from-secondary-100 via-secondary-50 to-white text-slate-800 p-4 sm:p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2 mt-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900 drop-shadow-sm">
            คำนวณเลขศาสตร์
          </h1>
          <p className="text-primary-800 text-sm sm:text-base font-medium">
            วิเคราะห์ชื่อและนามสกุลตามหลักเลขศาสตร์และอักษรกาลกิณี (รองรับภาษาไทยและภาษาอังกฤษ)
          </p>
        </div>

        {/* Form Card */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            calculate();
          }}
          className="bg-white rounded-3xl shadow-xl shadow-secondary-200/50 p-6 sm:p-8 border border-primary-200 backdrop-blur-sm transition-all"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary-800">ชื่อ (ภาษาไทยหรืออังกฤษ)</label>
              <input
                className="w-full bg-secondary-50 border border-primary-300 text-slate-900 rounded-xl px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary-400/50 focus:border-primary-500 focus:bg-white placeholder:text-slate-400"
                value={firstName}
                onChange={e => setFirstName(e.target.value.replace(/[^ก-๙a-zA-Z\s]/g, ''))}
                placeholder="เช่น ธันยพร หรือ John"
              />
              <p className="text-[11px] text-slate-500 mt-1">* รองรับทั้งภาษาไทยและภาษาอังกฤษ</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary-800">นามสกุล (ภาษาไทยหรืออังกฤษ)</label>
              <input
                className="w-full bg-secondary-50 border border-primary-300 text-slate-900 rounded-xl px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary-400/50 focus:border-primary-500 focus:bg-white placeholder:text-slate-400"
                value={lastName}
                onChange={e => setLastName(e.target.value.replace(/[^ก-๙a-zA-Z\s]/g, ''))}
                placeholder="เช่น พุทธสุวรรณ หรือ Doe"
              />
              <p className="text-[11px] text-slate-500 mt-1">* หากไม่มีเว้นว่างไว้ได้</p>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <label className="block text-sm font-semibold text-primary-800">วันเกิด <span className="text-primary-600 font-normal">(สำหรับตรวจอักษรกาลกิณี)</span></label>
            <select
              className="w-full sm:w-1/2 bg-secondary-50 border border-primary-300 text-slate-900 rounded-xl px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-primary-400/50 focus:border-primary-500 focus:bg-white"
              value={birthDay} 
              onChange={e => setBirthDay(e.target.value)} 
            >
              <option value="">-- เลือกวันเกิด --</option>
              {Object.entries(kalakineeMap).map(([idx, data]) => (
                <option key={idx} value={idx}>{data.day}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={!firstName.trim()}
            className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3.5 px-4 shadow-lg shadow-accent-200/50 transition-all hover:shadow-accent-300/50 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            วิเคราะห์ผลลัพธ์
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>

        {/* Results Section */}
        {result && (() => {
          const { fn, ln, total, dayIdx, badInFirst } = result;
          const fnInfo = getNumPred(fn.sum);
          const lnInfo = ln ? getNumPred(ln.sum) : null;
          const totalInfo = getNumPred(total);

          function ScoreBadge({ score }: { score: number }) {
            const color = score >= 4 ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : score >= 3 ? "bg-amber-100 text-amber-700 border-amber-200"
              : "bg-red-100 text-red-600 border-red-200";
            return (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border mt-2 inline-block ${color}`}>
                ★ {score}/5
              </span>
            );
          }

          return (
            <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-6">
              
              {/* Summary Cards */}
              <div className={`grid grid-cols-1 ${ln ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-primary-200 flex flex-col items-center justify-center text-center">
                  <div className="text-primary-600 text-xs font-medium uppercase tracking-wider mb-1">เลขชื่อ</div>
                  <div className="text-4xl font-bold text-primary-900">{fn.sum}</div>
                  <div className="text-sm font-medium text-primary-700 mt-2">{fnInfo?.title}</div>
                  <ScoreBadge score={fnInfo.score} />
                </div>

                {ln && (
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-primary-200 flex flex-col items-center justify-center text-center">
                    <div className="text-primary-600 text-xs font-medium uppercase tracking-wider mb-1">เลขนามสกุล</div>
                    <div className="text-4xl font-bold text-primary-900">{ln.sum}</div>
                    <div className="text-sm font-medium text-primary-700 mt-2">{lnInfo?.title}</div>
                    <ScoreBadge score={lnInfo!.score} />
                  </div>
                )}

                <div className="bg-primary-600 rounded-2xl p-5 shadow-md shadow-primary-200 border border-primary-500 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                  <div className="text-primary-50 text-xs font-medium uppercase tracking-wider mb-1 relative z-10">เลขรวม</div>
                  <div className="text-4xl font-bold relative z-10">{total}</div>
                  <div className="text-sm font-medium text-primary-100 mt-2 relative z-10">{totalInfo?.title}</div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border mt-2 inline-block bg-white/20 text-white border-white/30">★ {totalInfo.score}/5</span>
                </div>
              </div>

              {/* Kalakinee */}
              {dayIdx !== null && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent-400"></div>
                  <h3 className="text-base font-bold text-primary-900 mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    ตรวจอักษรกาลกิณี
                  </h3>
                  <div className="text-sm text-primary-800 mb-4 pl-7">
                    วันเกิด: <span className="font-bold text-primary-900">วัน{kalakineeMap[dayIdx as keyof typeof kalakineeMap]?.day}</span>
                    <span className="mx-2 text-primary-300">|</span>
                    ควรหลีกเลี่ยง: <span className="font-bold text-accent-600">{dayIdx === 1 ? "สระทั้งหมด (ยกเว้นไม้หันอากาศและการันต์)" : kalakineeMap[dayIdx as keyof typeof kalakineeMap]?.chars.join(" ")}</span>
                  </div>
                  <div className="pl-7">
                    {badInFirst.length === 0 ? (
                      <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        ดีเยี่ยม! ไม่พบอักษรกาลกิณีในชื่อ
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm font-medium text-accent-700 bg-accent-50 px-3 py-2 rounded-lg border border-accent-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        พบในชื่อ: <strong className="text-accent-800">{badInFirst.join(", ")}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-200">
                <h3 className="text-sm font-bold text-primary-900 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  การถอดค่าตัวอักษร
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-primary-800 mr-2 min-w-16">ชื่อ:</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {fn.breakdown.map((x, i) => (
                        <div key={i} className="flex flex-col items-center bg-secondary-50 rounded px-2 py-1 border border-primary-300 shadow-sm">
                          <span className="text-base font-bold text-primary-900">{x.ch}</span>
                          <span className="text-[11px] text-primary-600 font-mono font-bold mt-0.5">{x.v}</span>
                        </div>
                      ))}
                      <span className="ml-2 text-sm font-medium text-slate-600">= <strong className="text-accent-600 text-xl font-bold ml-1">{fn.sum}</strong></span>
                    </div>
                  </div>
                  
                  {ln && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-primary-100">
                      <span className="text-sm font-semibold text-primary-800 mr-2 min-w-16">นามสกุล:</span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {ln.breakdown.map((x, i) => (
                          <div key={i} className="flex flex-col items-center bg-secondary-50 rounded px-2 py-1 border border-primary-300 shadow-sm">
                            <span className="text-base font-bold text-primary-900">{x.ch}</span>
                            <span className="text-[11px] text-primary-600 font-mono font-bold mt-0.5">{x.v}</span>
                          </div>
                        ))}
                        <span className="ml-2 text-sm font-medium text-slate-600">= <strong className="text-accent-600 text-xl font-bold ml-1">{ln.sum}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Predictions */}
              <div className="space-y-4">
                {[
                  { label: `คำทำนายเลขชื่อ`, num: fn.sum, info: fnInfo, highlight: false },
                  ...(ln ? [{ label: `คำทำนายเลขนามสกุล`, num: ln.sum, info: lnInfo, highlight: false }] : []),
                  { label: `คำทำนายเลขรวม`, num: total, info: totalInfo, highlight: true },
                ].map((item, idx) => (
                  <div key={idx} className={`rounded-2xl p-6 transition-all ${
                    item.highlight 
                      ? "bg-primary-50 border-2 border-primary-300 shadow-sm"
                      : "bg-white border border-primary-200 shadow-sm"
                  }`}>
                    <div className="flex items-start gap-4 mb-3">
                      <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                        ${item.highlight ? "bg-primary-600 text-white shadow-md shadow-primary-200" : "bg-primary-100 text-primary-900"}`}>
                        {item.num}
                      </div>
                      <div className="pt-1">
                        <h4 className={`font-bold ${item.highlight ? "text-primary-900" : "text-primary-950"}`}>
                          {item.label}
                        </h4>
                        <div className={`text-sm mt-0.5 font-medium ${item.highlight ? "text-primary-700" : "text-primary-600"}`}>
                          {item.info?.title}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const score = getNumPred(item.num).score;
                        const filled = score >= i + 1;
                        const half = !filled && score >= i + 0.5;
                        const uid = `half-${idx}-${i}`;
                        return (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20">
                            {half && (
                              <defs>
                                <linearGradient id={uid}>
                                  <stop offset="50%" stopColor="#fbbf24" />
                                  <stop offset="50%" stopColor="#e2e8f0" />
                                </linearGradient>
                              </defs>
                            )}
                            <path
                              fill={filled ? "#fbbf24" : half ? `url(#${uid})` : "#e2e8f0"}
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                        );
                      })}
                      <span className={`ml-1 text-xs font-semibold ${item.highlight ? "text-primary-700" : "text-slate-500"}`}>
                        {getNumPred(item.num).score}/5
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed mt-3 ${item.highlight ? "text-primary-950/90 font-medium" : "text-slate-700"}`}>
                      {getNumPred(item.num).text}
                    </p>

                    {/* Alter (อีกตำราหนึ่ง) */}
                    <div className="mt-4 pt-4 border-t border-primary-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-primary-600 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full">
                          อีกตำราหนึ่ง
                        </span>
                        <span className={`text-xs font-medium ${item.highlight ? "text-primary-700" : "text-slate-500"}`}>
                          {getNumPred(item.num).titleAlter}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const s = getNumPred(item.num).scoreAlter;
                          const filled = s >= i + 1;
                          const half = !filled && s >= i + 0.5;
                          const uid = `half-alt-${idx}-${i}`;
                          return (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20">
                              {half && (
                                <defs>
                                  <linearGradient id={uid}>
                                    <stop offset="50%" stopColor="#fbbf24" />
                                    <stop offset="50%" stopColor="#e2e8f0" />
                                  </linearGradient>
                                </defs>
                              )}
                              <path
                                fill={filled ? "#fbbf24" : half ? `url(#${uid})` : "#e2e8f0"}
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                              />
                            </svg>
                          );
                        })}
                        <span className={`ml-1 text-xs font-semibold ${item.highlight ? "text-primary-700" : "text-slate-500"}`}>
                          {getNumPred(item.num).scoreAlter}/5
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {getNumPred(item.num).textAlter}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              

              {/* Taksa Analysis */}
              {dayIdx !== null && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-200 mt-4">
                  <h3 className="text-base font-bold text-primary-900 mb-4 flex items-center gap-2">
                    <svg className="h-5 w-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    หลักทักษาปกรณ์ (พลังสะท้อน / พลังเงา)
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-primary-800 mb-2">ชื่อ (ทักษาของแต่ละหมวดอักษร):</h4>
                      <div className="flex flex-wrap items-center gap-2">
                        {fn.breakdown.map((x, i) => getTaksaCategory(dayIdx, x.ch) && (
                          <div key={i} className="flex flex-col items-center bg-primary-50 rounded-lg px-3 py-2 border border-primary-100 shadow-sm">
                            <span className="text-lg font-bold text-primary-900">{x.ch}</span>
                            <span className={`text-xs font-bold mt-1 ${getTaksaCategory(dayIdx, x.ch) === "กาลกิณี" ? "text-red-500" : "text-green-600"}`}>
                              {getTaksaCategory(dayIdx, x.ch)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                      <h4 className="text-sm font-semibold text-primary-800 mb-3">ความหมายหลักทักษา:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(taksaDefinitions).map(([key, desc]) => (
                          <div key={key} className="flex flex-col p-3 rounded bg-secondary-50 border border-secondary-100">
                             <span className={`text-sm font-bold ${key === "กาลกิณี" ? "text-red-500" : "text-primary-700"}`}>{key}</span>
                             <span className="text-xs text-slate-600 mt-1">{desc}</span>
                          </div>
                        ))}
                      </div>
                  </div>
                  
                  {planetPowerPredictions[total] && (
                     <div className="mt-8 border-t border-primary-100 pt-4">
                        <h4 className="text-sm font-semibold text-primary-800 mb-3">นิยามความหมายกำลังดาวพระเคราะห์ (พลังสะท้อนจากเลขรวม):</h4>
                        <div className="bg-primary-50 border border-primary-200 p-4 rounded-xl">
                          <div className="font-bold text-primary-900 text-lg mb-1">{planetPowerPredictions[total].title} (กำลัง {total})</div>
                          <div className="text-sm text-slate-700">{planetPowerPredictions[total].desc}</div>
                        </div>
                     </div>
                  )}
                </div>
              )}

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
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
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
          );
        })()}
      </div>

      {/* Share card — hidden off-screen, captured by saveAsImage */}
      {result && (() => {
        const { fn, ln, total, dayIdx, badInFirst } = result;
        const fnInfo = getNumPred(fn.sum);
        const lnInfo = ln ? getNumPred(ln.sum) : null;
        const totalInfo = getNumPred(total);
        const scoreColor = (s: number) => s >= 4 ? "#059669" : s >= 3 ? "#d97706" : "#dc2626";
        const scoreBg = (s: number) => s >= 4 ? "#d1fae5" : s >= 3 ? "#fef3c7" : "#fee2e2";
        const kalaOk = badInFirst.length === 0;

        return (
          <div
            ref={shareCardRef}
            style={{
              position: "fixed", top: 0, left: 0, zIndex: -1, pointerEvents: "none",
              width: 600, fontFamily: "'Noto Sans Thai', 'Sarabun', sans-serif",
              background: "linear-gradient(135deg, #eceae1 0%, #fdfdf5 60%, #F5F5DC 100%)",
              padding: 32, boxSizing: "border-box",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#28261c" }}>เลขศาสตร์</div>
                <div style={{ fontSize: 12, color: "#98926c", marginTop: 2 }}>name.mhalong.com</div>
              </div>
              {fullName && (
                <div style={{ fontSize: 20, fontWeight: 700, color: "#28261c", textAlign: "right" }}>{fullName}</div>
              )}
            </div>

            {/* Score Cards */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, background: "#fefdfb", borderRadius: 16, padding: "16px 12px", textAlign: "center", border: "1px solid #dad5c3" }}>
                <div style={{ fontSize: 11, color: "#7b7556", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>เลขชื่อ</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#28261c", lineHeight: 1 }}>{fn.sum}</div>
                <div style={{ fontSize: 12, color: "#625d45", marginTop: 6 }}>{fnInfo.title}</div>
                <div style={{ display: "inline-block", marginTop: 6, padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: scoreBg(fnInfo.score), color: scoreColor(fnInfo.score) }}>★ {fnInfo.score}/5</div>
              </div>
              {ln && lnInfo && (
                <div style={{ flex: 1, background: "#fefdfb", borderRadius: 16, padding: "16px 12px", textAlign: "center", border: "1px solid #dad5c3" }}>
                  <div style={{ fontSize: 11, color: "#7b7556", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>เลขนามสกุล</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: "#28261c", lineHeight: 1 }}>{ln.sum}</div>
                  <div style={{ fontSize: 12, color: "#625d45", marginTop: 6 }}>{lnInfo.title}</div>
                  <div style={{ display: "inline-block", marginTop: 6, padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: scoreBg(lnInfo.score), color: scoreColor(lnInfo.score) }}>★ {lnInfo.score}/5</div>
                </div>
              )}
              <div style={{ flex: 1, background: "#98926c", borderRadius: 16, padding: "16px 12px", textAlign: "center", border: "1px solid #7b7556" }}>
                <div style={{ fontSize: 11, color: "#eceae1", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>เลขรวม</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{total}</div>
                <div style={{ fontSize: 12, color: "#f6f5f0", marginTop: 6 }}>{totalInfo.title}</div>
                <div style={{ display: "inline-block", marginTop: 6, padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.25)", color: "#fff" }}>★ {totalInfo.score}/5</div>
              </div>
            </div>

            {/* Predictions */}
            {[
              { label: "คำทำนายเลขชื่อ", info: fnInfo, highlight: false },
              ...(ln && lnInfo ? [{ label: "คำทำนายเลขนามสกุล", info: lnInfo, highlight: false }] : []),
              { label: "คำทำนายเลขรวม", info: totalInfo, highlight: true },
            ].map((item, i) => (
              <div key={i} style={{
                background: item.highlight ? "#eceae1" : "#fefdfb",
                borderRadius: 16, padding: 20, marginBottom: 12,
                border: item.highlight ? "1.5px solid #b9b28f" : "1.5px solid #dad5c3",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#28261c", marginBottom: 6 }}>
                  {item.label} — {item.info.title}
                </div>
                <div style={{ fontSize: 11, color: "#28261c", fontWeight: 700, display: "inline-block", background: scoreBg(item.info.score), padding: "1px 8px", borderRadius: 99, marginBottom: 6 }}>★ {item.info.score}/5</div>
                <div style={{ fontSize: 12, color: "#4f4a38", lineHeight: 1.8, marginBottom: 12 }}>{item.info.text}</div>
                {/* Alter */}
                <div style={{ borderTop: "1px solid #d4cfbb", paddingTop: 12, marginTop: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#625d45", background: "#f0ece0", border: "1px solid #c8c4a8", padding: "1px 8px", borderRadius: 99 }}>อีกตำราหนึ่ง</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#4f4a38" }}>{item.info.titleAlter}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#28261c", fontWeight: 700, display: "inline-block", background: scoreBg(item.info.scoreAlter), padding: "1px 8px", borderRadius: 99, marginBottom: 6 }}>★ {item.info.scoreAlter}/5</div>
                  <div style={{ fontSize: 12, color: "#4f4a38", lineHeight: 1.8 }}>{item.info.textAlter}</div>
                </div>
              </div>
            ))}

            {/* Kalakinee */}
            {dayIdx !== null && (
              <div style={{
                borderRadius: 16, padding: "14px 18px",
                background: kalaOk ? "#f0fdf4" : "#fff7ed",
                border: `1.5px solid ${kalaOk ? "#86efac" : "#fdba74"}`,
                display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
              }}>
                <div style={{ fontSize: 22 }}>{kalaOk ? "✅" : "⚠️"}</div>
                <div>
                  <div style={{ fontSize: 11, color: "#625d45", marginBottom: 2 }}>
                    วันเกิด: <strong>วัน{kalakineeMap[dayIdx as keyof typeof kalakineeMap]?.day}</strong>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: kalaOk ? "#166534" : "#9a3412" }}>
                    {kalaOk ? "ไม่พบอักษรกาลกิณีในชื่อ" : "พบอักษรกาลกิณีในชื่อ"}
                  </div>
                  {!kalaOk && (
                    <div style={{ fontSize: 12, color: "#9a3412", marginTop: 2 }}>
                      {`ชื่อ: ${badInFirst.join(", ")}`}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{ textAlign: "center", fontSize: 11, color: "#98926c", marginTop: 8 }}>
              name.mhalong.com · ดูดวงชื่อ-นามสกุล วันนี้ดวงเป็นยังไง? มาเช็กกับมหาหลง
            </div>
          </div>
        );
      })()}
    </div>
  );
}