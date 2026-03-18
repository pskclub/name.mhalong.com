export default function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 4 ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : score >= 3 ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-red-100 text-red-600 border-red-200";
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border mt-2 inline-block ${color}`}>
      ★ {score}/5
    </span>
  );
}
