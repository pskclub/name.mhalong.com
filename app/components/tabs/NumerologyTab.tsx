import type { NameResult } from "../../types";
import { getNumPred } from "../../lib/calc";
import ScoreBadge from "../ui/ScoreBadge";
import StarRating from "../ui/StarRating";

interface Props {
  fn: NameResult;
  ln: NameResult | null;
  total: number;
}

function BreakdownRow({ label, items, sum }: { label: string; items: { ch: string; v: number }[]; sum: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-primary-800 mr-2 min-w-16">{label}</span>
      <div className="flex flex-wrap items-center gap-1.5">
        {items.map((x, i) => (
          <div key={i} className="flex flex-col items-center bg-secondary-50 rounded px-2 py-1 border border-primary-300 shadow-sm">
            <span className="text-base font-bold text-primary-900">{x.ch}</span>
            <span className="text-[11px] text-primary-600 font-mono font-bold mt-0.5">{x.v}</span>
          </div>
        ))}
        <span className="ml-2 text-sm font-medium text-slate-600">= <strong className="text-accent-600 text-xl font-bold ml-1">{sum}</strong></span>
      </div>
    </div>
  );
}

export default function NumerologyTab({ fn, ln, total }: Props) {
  const fnInfo = getNumPred(fn.sum);
  const lnInfo = ln ? getNumPred(ln.sum) : null;
  const totalInfo = getNumPred(total);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className={`grid grid-cols-1 ${ln ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-4`}>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-primary-200 flex flex-col items-center justify-center text-center">
          <div className="text-primary-600 text-xs font-medium uppercase tracking-wider mb-1">เลขชื่อ</div>
          <div className="text-4xl font-bold text-primary-900">{fn.sum}</div>
          <div className="text-sm font-medium text-primary-700 mt-2">{fnInfo.title}</div>
          <ScoreBadge score={fnInfo.score} />
        </div>
        {ln && lnInfo && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-primary-200 flex flex-col items-center justify-center text-center">
            <div className="text-primary-600 text-xs font-medium uppercase tracking-wider mb-1">เลขนามสกุล</div>
            <div className="text-4xl font-bold text-primary-900">{ln.sum}</div>
            <div className="text-sm font-medium text-primary-700 mt-2">{lnInfo.title}</div>
            <ScoreBadge score={lnInfo.score} />
          </div>
        )}
        <div className="bg-primary-600 rounded-2xl p-5 shadow-md shadow-primary-200 border border-primary-500 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="text-primary-50 text-xs font-medium uppercase tracking-wider mb-1 relative z-10">เลขรวม</div>
          <div className="text-4xl font-bold relative z-10">{total}</div>
          <div className="text-sm font-medium text-primary-100 mt-2 relative z-10">{totalInfo.title}</div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full border mt-2 inline-block bg-white/20 text-white border-white/30">★ {totalInfo.score}/5</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-200">
        <h3 className="text-sm font-bold text-primary-900 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          การถอดค่าตัวอักษร
        </h3>
        <div className="space-y-4">
          <BreakdownRow label="ชื่อ:" items={fn.breakdown} sum={fn.sum} />
          {ln && (
            <div className="pt-2 border-t border-primary-100">
              <BreakdownRow label="นามสกุล:" items={ln.breakdown} sum={ln.sum} />
            </div>
          )}
        </div>
      </div>

      {/* Predictions */}
      <div className="space-y-4">
        {[
          { label: "คำทำนายเลขชื่อ", num: fn.sum },
          ...(ln ? [{ label: "คำทำนายเลขนามสกุล", num: ln.sum }] : []),
          { label: "คำทำนายเลขรวม", num: total },
        ].map((item, idx) => {
          const pred = getNumPred(item.num);
          return (
            <div key={idx} className="rounded-2xl p-6 bg-white border border-primary-200 shadow-sm">
              <div className="flex items-start gap-4 mb-3">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary-100 text-primary-900 flex items-center justify-center font-bold text-lg">
                  {item.num}
                </div>
                <div className="pt-1">
                  <h4 className="font-bold text-primary-950">{item.label}</h4>
                  <div className="text-sm mt-0.5 font-medium text-primary-600">{pred.title}</div>
                </div>
              </div>
              <StarRating score={pred.score} id={`pred-${idx}`} />
              <p className="text-sm leading-relaxed mt-3 text-slate-700">{pred.text}</p>
              <div className="mt-4 pt-4 border-t border-primary-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full">อีกตำราหนึ่ง</span>
                  <span className="text-xs font-medium text-slate-500">{pred.titleAlter}</span>
                </div>
                <StarRating score={pred.scoreAlter} id={`pred-alt-${idx}`} />
                <p className="text-sm leading-relaxed mt-2 text-slate-600">{pred.textAlter}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
