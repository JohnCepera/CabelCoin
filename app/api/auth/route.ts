import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toUserGameState } from "@/lib/game";
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

    const user = await prisma.user.upsert({
      where: { telegramId },
      update: {
        username: parsed.user.username ?? null,
        firstName: parsed.user.first_name ?? null,
        lastName: parsed.user.last_name ?? null,
      },
      create: {
        telegramId,
        username: parsed.user.username ?? null,
        firstName: parsed.user.first_name ?? null,
        lastName: parsed.user.last_name ?? null,
      },
    });

    return NextResponse.json({ user: toUserGameState(user) });
  } catch (error) {
    if (error instanceof TelegramAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
