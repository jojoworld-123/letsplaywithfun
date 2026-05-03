import { Star } from "lucide-react";

export default function StarRow({ count = 0, max = 3, size = 24, testId = "star-row" }) {
  return (
    <div data-testid={testId} className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < count ? "text-amber-400" : "text-slate-300"}
          fill={i < count ? "#F59E0B" : "transparent"}
          stroke={i < count ? "#F59E0B" : "#CBD5E1"}
        />
      ))}
    </div>
  );
}
