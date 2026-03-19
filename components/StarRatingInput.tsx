"use client";

import { useMemo, useState } from "react";

export function StarRatingInput({
  label,
  value,
  onChange,
  size = "md",
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
}) {
  const [hover, setHover] = useState<number | null>(null);
  const px = size === "sm" ? 16 : 18;

  const active = useMemo(() => (hover ?? value) || 0, [hover, value]);

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm font-medium text-zinc-700">{label}</div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const starValue = i + 1;
          const isActive = active >= starValue;
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onChange(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(null)}
              className="rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              aria-label={`${label}: ${starValue} star${starValue === 1 ? "" : "s"}`}
            >
              <Star
                width={px}
                height={px}
                className={isActive ? "text-amber-500" : "text-zinc-200"}
              />
            </button>
          );
        })}
        <span className="ml-2 text-xs font-medium tabular-nums text-zinc-600">
          {value.toFixed(0)}/5
        </span>
      </div>
    </div>
  );
}

function Star({
  className,
  width,
  height,
}: {
  className?: string;
  width: number;
  height: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      className={className}
      fill="currentColor"
    >
      <path d="M12 17.27l-5.18 3.06 1.4-5.98-4.64-4.02 6.11-.52L12 4.2l2.29 5.61 6.11.52-4.64 4.02 1.4 5.98z" />
    </svg>
  );
}

