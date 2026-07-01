export const DAILY_REWARD_AMOUNT = 500;
export const DAILY_REWARD_COOLDOWN_MS = 24 * 60 * 60 * 1000;
export const MAX_CLICKS_PER_SECOND = 10;
export const MIN_CLICK_INTERVAL_MS = 1000 / MAX_CLICKS_PER_SECOND;

export function getCoinsPerTap(tapPowerLevel: number): number {
  return 1 + tapPowerLevel;
}

export function getUpgradePrice(currentLevel: number): number {
  return Math.floor(100 * Math.pow(1.5, currentLevel));
}

export function canClaimDailyReward(lastDailyRewardAt: Date | null): boolean {
  if (!lastDailyRewardAt) {
    return true;
  }

  return Date.now() - lastDailyRewardAt.getTime() >= DAILY_REWARD_COOLDOWN_MS;
}

export function getTimeUntilNextDailyReward(lastDailyRewardAt: Date | null): number {
  if (!lastDailyRewardAt) {
    return 0;
  }

  const elapsed = Date.now() - lastDailyRewardAt.getTime();
  const remaining = DAILY_REWARD_COOLDOWN_MS - elapsed;
  return remaining > 0 ? remaining : 0;
}

export function isClickRateLimited(lastClickAt: Date | null): boolean {
  if (!lastClickAt) {
    return false;
  }

  return Date.now() - lastClickAt.getTime() < MIN_CLICK_INTERVAL_MS;
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  }

  if (minutes > 0) {
    return `${minutes}м ${seconds}с`;
  }

  return `${seconds}с`;
}

export interface UserGameState {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  coins: number;
  tapPowerLevel: number;
  coinsPerTap: number;
  nextUpgradePrice: number;
  lastDailyRewardAt: string | null;
  canClaimDailyReward: boolean;
  dailyRewardCooldownMs: number;
}

export function toUserGameState(user: {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  coins: number;
  tapPowerLevel: number;
  lastDailyRewardAt: Date | null;
}): UserGameState {
  return {
    id: user.id,
    telegramId: user.telegramId,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    coins: user.coins,
    tapPowerLevel: user.tapPowerLevel,
    coinsPerTap: getCoinsPerTap(user.tapPowerLevel),
    nextUpgradePrice: getUpgradePrice(user.tapPowerLevel),
    lastDailyRewardAt: user.lastDailyRewardAt?.toISOString() ?? null,
    canClaimDailyReward: canClaimDailyReward(user.lastDailyRewardAt),
    dailyRewardCooldownMs: getTimeUntilNextDailyReward(user.lastDailyRewardAt),
  };
}
