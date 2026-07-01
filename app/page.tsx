"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  apiPost,
  getInitData,
  isTelegramWebApp,
  type UserGameState,
} from "@/lib/api-client";
import { CoinImage } from "@/components/CoinImage";
import { TapButton } from "@/components/TapButton";
import { DAILY_REWARD_AMOUNT, formatDuration } from "@/lib/game";
import {
  getLevelForNextVisual,
  getNextTapVisual,
} from "@/lib/tap-visuals";

interface AuthResponse {
  user: UserGameState;
}

interface ClickResponse {
  user: UserGameState;
  coinsEarned: number;
}

interface UpgradeResponse {
  user: UserGameState;
  pricePaid: number;
}

interface DailyRewardResponse {
  user: UserGameState;
  reward: number;
}

interface FloatingCoin {
  id: number;
  amount: number;
  x: number;
  y: number;
}

function formatNumber(value: number): string {
  return value.toLocaleString("ru-RU");
}

export default function HomePage() {
  const [user, setUser] = useState<UserGameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [tapping, setTapping] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [claimingReward, setClaimingReward] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tapPulse, setTapPulse] = useState(false);
  const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
  const [devMode, setDevMode] = useState(false);
  const coinIdRef = useRef(0);

  const initTelegram = useCallback(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;

    webApp.ready();
    webApp.expand();
    webApp.setHeaderColor("#0f0f14");
    webApp.setBackgroundColor("#0f0f14");
  }, []);

  const authenticate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const initData = getInitData();

      if (!initData) {
        setDevMode(true);
        setError(
          "Откройте приложение через Telegram. В браузере без initData игра недоступна."
        );
        return;
      }

      const data = await apiPost<AuthResponse>("/api/auth", initData);
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initTelegram();
    authenticate();
  }, [initTelegram, authenticate]);

  const showFloatingCoin = (amount: number, event?: React.MouseEvent) => {
    const id = ++coinIdRef.current;
    const x = event ? event.clientX : window.innerWidth / 2;
    const y = event ? event.clientY : window.innerHeight / 2;

    setFloatingCoins((prev) => [...prev, { id, amount, x, y }]);

    setTimeout(() => {
      setFloatingCoins((prev) => prev.filter((coin) => coin.id !== id));
    }, 800);
  };

  const handleTap = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!user || tapping || devMode) return;

    const initData = getInitData();
    if (!initData) return;

    setTapping(true);
    setError(null);
    setTapPulse(true);
    setTimeout(() => setTapPulse(false), 300);

    try {
      const data = await apiPost<ClickResponse>("/api/click", initData);
      setUser(data.user);
      showFloatingCoin(data.coinsEarned, event);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка клика");
    } finally {
      setTapping(false);
    }
  };

  const handleUpgrade = async () => {
    if (!user || upgrading || devMode) return;

    const initData = getInitData();
    if (!initData) return;

    setUpgrading(true);
    setError(null);

    try {
      const data = await apiPost<UpgradeResponse>("/api/upgrades/buy", initData);
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка покупки");
    } finally {
      setUpgrading(false);
    }
  };

  const handleDailyReward = async () => {
    if (!user || claimingReward || devMode || !user.canClaimDailyReward) return;

    const initData = getInitData();
    if (!initData) return;

    setClaimingReward(true);
    setError(null);

    try {
      const data = await apiPost<DailyRewardResponse>("/api/daily-reward", initData);
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Награда недоступна");
    } finally {
      setClaimingReward(false);
    }
  };

  const displayName =
    user?.firstName || user?.username || (devMode ? "Гость" : "Игрок");

  const nextVisual = user ? getNextTapVisual(user.tapPowerLevel) : null;
  const nextVisualLevel = user ? getLevelForNextVisual(user.tapPowerLevel) : null;

  return (
    <main className="min-h-screen bg-telegram-bg px-4 pb-8 pt-6">
      <div className="mx-auto flex max-w-md flex-col gap-5">
        {/* Header */}
        <header className="text-center">
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            CabelCoin
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">
            Привет, {displayName}!
          </h1>
        </header>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-telegram-accent border-t-transparent" />
            <p className="text-zinc-400">Загрузка...</p>
          </div>
        )}

        {!loading && user && (
          <>
            {/* Balance card */}
            <section className="rounded-3xl border border-zinc-800 bg-telegram-card p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Баланс</p>
                  <p className="text-4xl font-bold text-telegram-gold">
                    {formatNumber(user.coins)}
                    <span className="ml-2 text-lg text-telegram-gold/70">coins</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-400">За тап</p>
                  <p className="text-2xl font-semibold text-telegram-accent">
                    +{user.coinsPerTap}
                  </p>
                </div>
              </div>
            </section>

            {/* TAP button */}
            <section className="flex flex-col items-center py-4">
              <TapButton
                tapPowerLevel={user.tapPowerLevel}
                tapping={tapping}
                disabled={devMode}
                pulse={tapPulse}
                onTap={handleTap}
              />
            </section>

            {/* Upgrade */}
            <section className="rounded-3xl border border-zinc-800 bg-telegram-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Tap Power</h2>
                <span className="rounded-full bg-telegram-accent/20 px-3 py-1 text-sm font-medium text-telegram-accent">
                  Ур. {user.tapPowerLevel}
                </span>
              </div>
              <p className="mb-4 text-sm text-zinc-400">
                Увеличивает монеты за каждый тап. Сейчас:{" "}
                <span className="text-white">+{user.coinsPerTap}</span> за клик
              </p>
              {nextVisual && nextVisualLevel !== null && (
                <div className="mb-4 flex items-center gap-3 rounded-2xl bg-zinc-800/50 px-3 py-2">
                  <CoinImage
                    src={nextVisual.image}
                    alt={nextVisual.name}
                    size="preview"
                  />
                  <p className="text-xs text-zinc-400">
                    На ур. {nextVisualLevel} иконка сменится на{" "}
                    <span className="text-white">{nextVisual.name}</span>
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-zinc-500">Следующий уровень</p>
                  <p className="text-lg font-bold text-telegram-gold">
                    {formatNumber(user.nextUpgradePrice)} coins
                  </p>
                </div>
                <button
                  onClick={handleUpgrade}
                  disabled={
                    upgrading ||
                    devMode ||
                    user.coins < user.nextUpgradePrice
                  }
                  className="rounded-2xl bg-telegram-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {upgrading ? "Покупка..." : "Купить"}
                </button>
              </div>
            </section>

            {/* Daily reward */}
            <section className="rounded-3xl border border-zinc-800 bg-telegram-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Daily Reward</h2>
                <span className="text-2xl">🎁</span>
              </div>
              <p className="mb-4 text-sm text-zinc-400">
                Забирай {formatNumber(DAILY_REWARD_AMOUNT)} coins раз в 24 часа
              </p>
              {user.canClaimDailyReward ? (
                <button
                  onClick={handleDailyReward}
                  disabled={claimingReward || devMode}
                  className="w-full rounded-2xl bg-gradient-to-r from-telegram-gold to-yellow-500 py-3 text-sm font-bold text-zinc-900 shadow-gold transition-transform active:scale-[0.98] disabled:opacity-50"
                >
                  {claimingReward
                    ? "Получение..."
                    : `Забрать ${formatNumber(DAILY_REWARD_AMOUNT)} coins`}
                </button>
              ) : (
                <div className="rounded-2xl bg-zinc-800/60 px-4 py-3 text-center">
                  <p className="text-sm text-zinc-400">Следующая награда через</p>
                  <p className="text-lg font-semibold text-telegram-gold">
                    {formatDuration(user.dailyRewardCooldownMs)}
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {!loading && !user && !isTelegramWebApp() && (
          <section className="rounded-3xl border border-zinc-800 bg-telegram-card p-6 text-center">
            <p className="text-4xl">📱</p>
            <h2 className="mt-3 text-lg font-semibold">Telegram Mini App</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Это приложение работает только внутри Telegram. Откройте его через
              своего бота.
            </p>
          </section>
        )}
      </div>

      {/* Floating coins */}
      {floatingCoins.map((coin) => (
        <span
          key={coin.id}
          className="coin-float pointer-events-none fixed z-50 text-lg font-bold text-telegram-gold"
          style={{ left: coin.x - 20, top: coin.y - 20 }}
        >
          +{coin.amount}
        </span>
      ))}
    </main>
  );
}
