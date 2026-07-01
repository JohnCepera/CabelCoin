"use client";

import { CoinImage } from "@/components/CoinImage";
import { getTapVisual } from "@/lib/tap-visuals";

interface TapButtonProps {
  tapPowerLevel: number;
  tapping: boolean;
  disabled: boolean;
  pulse: boolean;
  onTap: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function TapButton({
  tapPowerLevel,
  tapping,
  disabled,
  pulse,
  onTap,
}: TapButtonProps) {
  const visual = getTapVisual(tapPowerLevel);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[14.5rem] w-[14.5rem] items-center justify-center">
        {pulse && (
          <span
            className={`tap-ring absolute inset-0 rounded-full ${visual.ringColor}`}
          />
        )}
        <button
          onClick={onTap}
          disabled={disabled || tapping}
          className={`relative rounded-full bg-transparent p-0 transition-transform duration-300 active:scale-95 disabled:opacity-60 ${visual.glowColor}`}
          aria-label={`Tap — ${visual.name}`}
        >
          {tapping ? (
            <span className="flex h-[13.5rem] w-[13.5rem] items-center justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </span>
          ) : (
            <CoinImage
              src={visual.image}
              alt={visual.name}
              size="tap"
              className="drop-shadow-2xl transition-transform duration-300 active:scale-90"
            />
          )}
        </button>
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-300">{visual.name}</p>
      <p className="mt-1 text-xs text-zinc-500">Нажимай и зарабатывай монеты</p>
    </div>
  );
}
