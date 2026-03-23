import { luckyColorMap, luckyDirectionMap, kalakineeMap } from "../../lib/numerology";

export default function LuckyTab({ dayIdx }: { dayIdx: number }) {
  const colorData = luckyColorMap[dayIdx];
  const dirData = luckyDirectionMap[dayIdx];
  if (!colorData || !dirData) return null;
  const dayName = kalakineeMap[dayIdx as keyof typeof kalakineeMap]?.day;

  return (
    <div className="space-y-6">
      {/* สีมงคล */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-200">
        <h3 className="text-base font-bold text-primary-900 mb-4 flex items-center gap-2">
          <span className="text-xl">🎨</span>
          สีมงคลประจำวันเกิด
        </h3>
        <div className="flex gap-4 mb-4">
          {colorData.colors.map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className="w-16 h-16 rounded-2xl shadow-md border-2 border-white ring-2 ring-primary-100"
                style={{ backgroundColor: c.hex }}
              />
              <span className="font-semibold text-primary-800">{c.name}</span>
            </div>
          ))}
        </div>
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
          <p className="text-slate-700">{colorData.note}</p>
          <p className="text-xs text-slate-500 mt-2">วันเกิด: วัน{dayName}</p>
        </div>
      </div>

      {/* ทิศมงคล */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-200">
        <h3 className="text-base font-bold text-primary-900 mb-4 flex items-center gap-2">
          <span className="text-xl">🧭</span>
          ทิศมงคลประจำวันเกิด
        </h3>
        <div className="flex items-center gap-6 mb-4">
          <div className="w-20 h-20 rounded-full bg-primary-50 border-2 border-primary-200 flex items-center justify-center text-4xl font-bold text-primary-700 shrink-0">
            {dirData.icon}
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-900">{dirData.direction}</div>
            <div className="text-slate-500 mt-1">{dirData.en}</div>
          </div>
        </div>
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
          <p className="text-slate-700">ทิศที่เหมาะสำหรับการหันหน้าทำงาน นอนหลับ หรือประกอบพิธีมงคล เพื่อเสริมพลังชีวิตให้ราบรื่น</p>
          <p className="text-xs text-slate-500 mt-2">วันเกิด: วัน{dayName}</p>
        </div>
      </div>
    </div>
  );
}
