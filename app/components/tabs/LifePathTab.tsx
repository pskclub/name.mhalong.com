import { lifePathPredictions } from "../../lib/numerology";

export default function LifePathTab({ lifePath }: { lifePath: number }) {
  const lp = lifePathPredictions[lifePath];
  if (!lp) return null;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="shrink-0 w-20 h-20 rounded-full bg-primary-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg shadow-primary-200">
            {lifePath}
          </div>
          <div>
            <div className="font-bold text-primary-900 text-lg leading-tight">{lp.title}</div>
            <div className="text-primary-600 mt-1">ดาวประจำ: {lp.planet}</div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-secondary-50 rounded-xl p-4 border border-secondary-100">
            <div className="text-xs font-bold text-primary-700 mb-2 uppercase tracking-wide">บุคลิกและนิสัย</div>
            <p className="text-slate-700 leading-relaxed">{lp.traits}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <div className="text-xs font-bold text-emerald-700 mb-2 uppercase tracking-wide">อาชีพที่เหมาะสม</div>
            <p className="text-slate-700 leading-relaxed">{lp.career}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <div className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">ข้อควรระวัง</div>
            <p className="text-slate-700 leading-relaxed">{lp.caution}</p>
          </div>
        </div>
      </div>
      <p className="text-xs text-center text-slate-500">เลขชะตาคำนวณจากผลรวมของวัน เดือน และปีเกิด (ค.ศ.) จนเหลือหลักเดียว</p>
    </div>
  );
}
