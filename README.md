# CabelCoin — Telegram Mini App Clicker

MVP игры-тапалки для Telegram на Next.js 14, TypeScript, Tailwind CSS, Prisma и PostgreSQL.

## Стек

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma** + **PostgreSQL**
- **Telegram WebApp** авторизация через `initData`

## Возможности

- Авторизация через Telegram `initData` с проверкой подписи на backend
- Кликер с начислением монет (`coinsPerTap = 1 + tapPowerLevel`)
- Улучшение Tap Power с растущей ценой
- Ежедневная награда 500 coins (раз в 24 часа)
- Защита от спама кликов (не чаще 10 кликов/сек)

## Установка

### 1. Клонирование и зависимости

```bash
npm install
```

### 2. Настройка `.env`

Скопируйте пример и заполните значения:

```bash
cp .env.example .env
```

Переменные:

| Переменная | Описание |
|---|---|
| `DATABASE_URL` | Строка подключения к PostgreSQL |
| `TELEGRAM_BOT_TOKEN` | Токен бота от [@BotFather](https://t.me/BotFather) |

Пример `DATABASE_URL`:

```
postgresql://postgres:password@localhost:5432/cabelcoin?schema=public
```

### 3. PostgreSQL

Убедитесь, что PostgreSQL запущен и база `cabelcoin` создана:

```bash
createdb cabelcoin
```

Или создайте базу через pgAdmin / Docker.

### 4. Prisma миграции

```bash
npx prisma migrate dev --name init
```

Сгенерировать клиент (если нужно отдельно):

```bash
npx prisma generate
```

### 5. Запуск проекта

```bash
npm run dev
```

Приложение будет доступно на [http://localhost:3000](http://localhost:3000).

> **Важно:** без Telegram `initData` игра не авторизуется. Для тестирования используйте ngrok + BotFather (см. ниже).

## Подключение к Telegram

### 1. Создайте бота

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям и сохраните **Bot Token** в `.env` как `TELEGRAM_BOT_TOKEN`

### 2. Запустите ngrok

Установите [ngrok](https://ngrok.com/) и пробросьте локальный сервер:

```bash
ngrok http 3000
```

Скопируйте HTTPS URL (например `https://abc123.ngrok-free.app`).

### 3. Настройте Mini App в BotFather

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/mybots` → выберите своего бота
3. **Bot Settings** → **Menu Button** → **Configure menu button**
4. Укажите URL: `https://abc123.ngrok-free.app`
5. Задайте название кнопки (например «Играть»)

Или создайте Mini App через `/newapp`:

1. `/newapp` → выберите бота
2. Укажите название и описание
3. Загрузите иконку (опционально)
4. Укажите Web App URL: ваш ngrok HTTPS URL

### 4. Откройте Mini App

Откройте бота в Telegram и нажмите кнопку меню / Mini App. Telegram передаст `initData`, и приложение авторизует пользователя.

## API Endpoints

| Метод | Путь | Описание |
|---|---|---|
| POST | `/api/auth` | Авторизация / регистрация пользователя |
| POST | `/api/click` | Клик (начисление монет) |
| POST | `/api/upgrades/buy` | Покупка улучшения Tap Power |
| POST | `/api/daily-reward` | Получение ежедневной награды |

Все запросы принимают JSON:

```json
{
  "initData": "<строка из window.Telegram.WebApp.initData>"
}
```

## Структура проекта

```
app/
  api/
    auth/route.ts
    click/route.ts
    upgrades/buy/route.ts
    daily-reward/route.ts
  globals.css
  layout.tsx
  page.tsx
lib/
  api-client.ts
  game.ts
  prisma.ts
  telegram.ts
prisma/
  schema.prisma
```

## Игровая логика

- **Монеты за тап:** `1 + tapPowerLevel`
- **Цена улучшения:** `Math.floor(100 * 1.5^currentLevel)`
- **Ежедневная награда:** 500 coins, кулдаун 24 часа
- **Антиспам:** максимум 10 кликов в секунду

## Production

```bash
npm run build
npm start
```

Для production используйте постоянный HTTPS домен (Vercel, Railway и т.д.) вместо ngrok.
