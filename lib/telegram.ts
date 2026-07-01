import crypto from "crypto";

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface ParsedInitData {
  user: TelegramUser;
  authDate: number;
  hash: string;
  queryId?: string;
}

export class TelegramAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TelegramAuthError";
  }
}

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new TelegramAuthError("TELEGRAM_BOT_TOKEN is not configured");
  }
  return token;
}

function parseInitData(initData: string): Record<string, string> {
  const params = new URLSearchParams(initData);
  const data: Record<string, string> = {};

  params.forEach((value, key) => {
    data[key] = value;
  });

  return data;
}

function buildDataCheckString(data: Record<string, string>): string {
  return Object.keys(data)
    .filter((key) => key !== "hash")
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");
}

function verifyHash(data: Record<string, string>, botToken: string): boolean {
  const hash = data.hash;
  if (!hash) {
    return false;
  }

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const dataCheckString = buildDataCheckString(data);
  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(calculatedHash, "hex"),
      Buffer.from(hash, "hex")
    );
  } catch {
    return false;
  }
}

export function validateInitData(initData: string): ParsedInitData {
  if (!initData || initData.trim() === "") {
    throw new TelegramAuthError("initData is required");
  }

  const botToken = getBotToken();
  const data = parseInitData(initData);

  if (!verifyHash(data, botToken)) {
    throw new TelegramAuthError("Invalid initData signature");
  }

  const authDate = Number(data.auth_date);
  if (!authDate || Number.isNaN(authDate)) {
    throw new TelegramAuthError("Invalid auth_date");
  }

  const maxAgeSeconds = 24 * 60 * 60;
  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > maxAgeSeconds) {
    throw new TelegramAuthError("initData has expired");
  }

  const userRaw = data.user;
  if (!userRaw) {
    throw new TelegramAuthError("User data is missing in initData");
  }

  let user: TelegramUser;
  try {
    user = JSON.parse(userRaw) as TelegramUser;
  } catch {
    throw new TelegramAuthError("Invalid user data in initData");
  }

  if (!user?.id) {
    throw new TelegramAuthError("Invalid telegram user id");
  }

  return {
    user,
    authDate,
    hash: data.hash,
    queryId: data.query_id,
  };
}

export function getTelegramIdFromInitData(initData: string): string {
  const parsed = validateInitData(initData);
  return String(parsed.user.id);
}
