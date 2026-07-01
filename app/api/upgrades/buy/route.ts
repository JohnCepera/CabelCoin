import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUpgradePrice, toUserGameState } from "@/lib/game";
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

    const price = getUpgradePrice(user.tapPowerLevel);

    if (user.coins < price) {
      return NextResponse.json(
        {
          error: "Not enough coins",
          required: price,
          current: user.coins,
        },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        coins: { decrement: price },
        tapPowerLevel: { increment: 1 },
      },
    });

    return NextResponse.json({
      user: toUserGameState(updatedUser),
      pricePaid: price,
    });
  } catch (error) {
    if (error instanceof TelegramAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Upgrade error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
