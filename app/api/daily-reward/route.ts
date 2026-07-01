import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  DAILY_REWARD_AMOUNT,
  canClaimDailyReward,
  formatDuration,
  getTimeUntilNextDailyReward,
  toUserGameState,
} from "@/lib/game";
import { TelegramAuthError, validateInitData } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const initData = body.initData as string | undefined;

    if (!initData) {
      return NextResponse.json({ error: "initData is required" }, { status: 400 });
    }

    const parsed = validateInitData(initData);
    const telegramId = String(parsed.user.id);

    const user = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!canClaimDailyReward(user.lastDailyRewardAt)) {
      const cooldownMs = getTimeUntilNextDailyReward(user.lastDailyRewardAt);
      return NextResponse.json(
        {
          error: "Daily reward is not available yet",
          cooldownMs,
          nextRewardIn: formatDuration(cooldownMs),
        },
        { status: 400 }
      );
    }

    const now = new Date();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        coins: { increment: DAILY_REWARD_AMOUNT },
        lastDailyRewardAt: now,
      },
    });

    return NextResponse.json({
      user: toUserGameState(updatedUser),
      reward: DAILY_REWARD_AMOUNT,
    });
  } catch (error) {
    if (error instanceof TelegramAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Daily reward error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
