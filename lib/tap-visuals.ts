export interface TapVisual {
  tier: number;
  name: string;
  image: string;
  ringColor: string;
  glowColor: string;
}

const TAP_VISUALS: TapVisual[] = [
  {
    tier: 0,
    name: "Wood Cabel",
    image: "/tap/wood.png",
    ringColor: "bg-amber-900/30",
    glowColor: "shadow-[0_0_40px_rgba(120,53,15,0.45)]",
  },
  {
    tier: 1,
    name: "Bronze Cabel",
    image: "/tap/bronze.png",
    ringColor: "bg-orange-700/30",
    glowColor: "shadow-[0_0_40px_rgba(194,65,12,0.4)]",
  },
  {
    tier: 2,
    name: "Silver Cabel",
    image: "/tap/silver.png",
    ringColor: "bg-slate-400/30",
    glowColor: "shadow-[0_0_40px_rgba(148,163,184,0.4)]",
  },
  {
    tier: 3,
    name: "Gold Cabel",
    image: "/tap/gold.png",
    ringColor: "bg-telegram-gold/30",
    glowColor: "shadow-gold",
  },
  {
    tier: 4,
    name: "Diamond Cabel",
    image: "/tap/diamond.png",
    ringColor: "bg-cyan-300/30",
    glowColor: "shadow-[0_0_40px_rgba(103,232,249,0.45)]",
  },
];

// Ур. 0–2: Wood | 3–4: Bronze | 5–6: Silver | 7–9: Gold | 10+: Diamond
function getTierIndex(tapPowerLevel: number): number {
  if (tapPowerLevel >= 10) return 4;
  if (tapPowerLevel >= 7) return 3;
  if (tapPowerLevel >= 5) return 2;
  if (tapPowerLevel >= 3) return 1;
  return 0;
}

export function getTapVisual(tapPowerLevel: number): TapVisual {
  return TAP_VISUALS[getTierIndex(tapPowerLevel)];
}

export function getNextTapVisual(tapPowerLevel: number): TapVisual | null {
  const nextIndex = getTierIndex(tapPowerLevel) + 1;
  if (nextIndex >= TAP_VISUALS.length) return null;
  return TAP_VISUALS[nextIndex];
}

export function getLevelForNextVisual(tapPowerLevel: number): number | null {
  if (tapPowerLevel < 3) return 3;
  if (tapPowerLevel < 5) return 5;
  if (tapPowerLevel < 7) return 7;
  if (tapPowerLevel < 10) return 10;
  return null;
}
