import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getCoinsPerTap,
  isClickRateLimited,
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

    if (isClickRateLimited(user.lastClickAt)) {
      return NextResponse.json(
        { error: "Too many clicks. Slow down!" },
        { status: 429 }
      );
    }

    const coinsEarned = getCoinsPerTap(user.tapPowerLevel);
    const now = new Date();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        coins: { increment: coinsEarned },
        lastClickAt: now,
      },
    });

    return NextResponse.json({
      user: toUserGameState(updatedUser),
      coinsEarned,
    });
  } catch (error) {
    if (error instanceof TelegramAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Click error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
