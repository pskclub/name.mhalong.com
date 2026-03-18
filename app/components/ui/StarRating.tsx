export default function StarRating({ score, id }: { score: number; id: string }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = score >= i + 1;
        const half = !filled && score >= i + 0.5;
        const uid = `${id}-${i}`;
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
      <span className="ml-1 text-xs font-semibold text-slate-500">{score}/5</span>
    </div>
  );
}
