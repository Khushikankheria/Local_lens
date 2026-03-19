export function RatingStars({
  value,
  size = "md",
  showValue = false,
}: {
  value: number;
  size?: "sm" | "md";
  showValue?: boolean;
}) {
  const clamped = Math.max(0, Math.min(5, value));
  const rounded = Math.round(clamped * 10) / 10;

  const px = size === "sm" ? 14 : 16;
  const gap = size === "sm" ? "gap-0.5" : "gap-1";

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center ${gap}`} aria-label={`${rounded} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, clamped - i));
          return (
            <span
              key={i}
              className="relative inline-block"
              style={{ width: px, height: px }}
              aria-hidden="true"
            >
              <Star
                className="absolute inset-0 text-zinc-200"
                width={px}
                height={px}
              />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  className="text-amber-500"
                  width={px}
                  height={px}
                />
              </span>
            </span>
          );
        })}
      </div>
      {showValue ? (
        <span className="text-sm font-medium tabular-nums text-zinc-800">
          {rounded.toFixed(1)}
        </span>
      ) : null}
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

