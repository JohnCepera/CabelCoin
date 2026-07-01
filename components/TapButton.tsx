"use client";

import Image from "next/image";
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
      <div className="relative">
        {pulse && (
          <span
            className={`tap-ring absolute inset-0 rounded-full ${visual.ringColor}`}
          />
        )}
        <button
          onClick={onTap}
          disabled={disabled || tapping}
          className={`relative flex h-48 w-48 items-center justify-center rounded-full bg-telegram-card/40 ${visual.glowColor} transition-all duration-500 active:scale-95 disabled:opacity-60`}
          aria-label={`Tap — ${visual.name}`}
        >
          {tapping ? (
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Image
              src={visual.image}
              alt={visual.name}
              width={176}
              height={176}
              className="h-44 w-44 object-contain drop-shadow-2xl transition-transform duration-300 active:scale-90"
              priority
            />
          )}
        </button>
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-300">{visual.name}</p>
      <p className="mt-1 text-xs text-zinc-500">Нажимай и зарабатывай монеты</p>
    </div>
  );
}
