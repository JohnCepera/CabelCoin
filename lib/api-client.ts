import type { UserGameState } from "@/lib/game";

export type { UserGameState };

export async function apiPost<T>(
  endpoint: string,
  initData: string
): Promise<T> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ initData }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data as T;
}

export function getInitData(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return window.Telegram?.WebApp?.initData ?? "";
}

export function isTelegramWebApp(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(window.Telegram?.WebApp?.initData);
}
