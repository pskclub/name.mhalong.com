import { zodiacMap } from "../../lib/numerology";

export default function ZodiacTab({ zodiac }: { zodiac: number }) {
  const z = zodiacMap[zodiac];
  if (!z) return null;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-200">
        <div className="flex items-center gap-5 mb-6">
          <div className="shrink-0 w-20 h-20 rounded-full bg-primary-50 border-2 border-primary-200 flex items-center justify-center text-5xl shadow-sm">
            {z.emoji}
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-900">ปี{z.name} ({z.animal})</div>
            <div className="text-sm text-primary-600 mt-1">ธาตุประจำปี: {z.element}</div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-secondary-50 rounded-xl p-4 border border-secondary-100">
            <div className="text-xs font-bold text-primary-700 mb-2 uppercase tracking-wide">บุคลิกลักษณะ</div>
            <p className="text-sm text-slate-700 leading-relaxed">{z.traits}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="text-xs font-bold text-emerald-700 mb-2 uppercase tracking-wide">จุดแข็ง</div>
              <p className="text-sm text-slate-700 leading-relaxed">{z.strengths}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">จุดอ่อน</div>
              <p className="text-sm text-slate-700 leading-relaxed">{z.weaknesses}</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">โชคชะตาโดยรวม</div>
            <p className="text-sm text-slate-700 leading-relaxed">{z.fortune}</p>
          </div>
          <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
            <div className="text-xs font-bold text-pink-700 mb-2 uppercase tracking-wide">ความรักและความสัมพันธ์</div>
            <p className="text-sm text-slate-700 leading-relaxed">{z.love}</p>
          </div>
          <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 flex items-center gap-3">
            <span className="text-2xl">🍀</span>
            <div>
              <div className="text-xs font-bold text-primary-700 mb-0.5 uppercase tracking-wide">เลขและสีมงคล</div>
              <p className="text-sm text-slate-700">{z.lucky}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-center text-slate-500">นักษัตรคำนวณจากปีเกิด (ค.ศ.) วนรอบทุก 12 ปี</p>
    </div>
  );
}
