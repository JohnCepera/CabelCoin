# Деплой CabelCoin на Vercel

## Что понадобится

- Аккаунт [Vercel](https://vercel.com) (можно через GitHub)
- Облачная база [Neon](https://neon.tech) (бесплатно)
- Токен бота от BotFather

---

## Шаг 1: Создай базу на Neon

1. Зайди на https://neon.tech и зарегистрируйся
2. **New Project** → имя `cabelcoin`
3. Скопируй **Connection string** (PostgreSQL)
4. Добавь в конец строки `?sslmode=require` если его нет

Пример:
```
postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

---

## Шаг 2: Залей проект на GitHub

### Если Git не установлен

Скачай: https://git-scm.com/download/win  
Установи с настройками по умолчанию.

### Команды в папке проекта

```bash
cd C:\Users\Vi\OneDrive\Рабочий стол\cabelcoin
git init
git add .
git commit -m "Initial commit"
```

На https://github.com создай новый репозиторий `cabelcoin` (без README).

```bash
git remote add origin https://github.com/ТВОЙ_ЛОГИН/cabelcoin.git
git branch -M main
git push -u origin main
```

---

## Шаг 3: Деплой на Vercel

1. https://vercel.com → **Sign Up** (через GitHub)
2. **Add New…** → **Project**
3. Импортируй репозиторий `cabelcoin`
4. В **Environment Variables** добавь:

| Name | Value |
|------|-------|
| `DATABASE_URL` | строка из Neon |
| `TELEGRAM_BOT_TOKEN` | токен от BotFather |

5. **Deploy**

Дождись зелёной галочки. URL будет вида:
```
https://cabelcoin-xxx.vercel.app
```

---

## Шаг 4: BotFather

1. [@BotFather](https://t.me/BotFather) → `/mybots` → **cabelcoinbot**
2. **Bot Settings** → **Menu Button** → **Configure menu button**
3. URL: `https://твой-проект.vercel.app`
4. Готово — терминалы на ПК больше не нужны

---

## Обновление после правок кода

```bash
git add .
git commit -m "описание изменений"
git push
```

Vercel пересоберёт проект автоматически (~1–2 мин).

---

## Альтернатива без GitHub

```bash
npm i -g vercel
cd C:\Users\Vi\OneDrive\Рабочий стол\cabelcoin
vercel login
vercel
```

При запросе переменных добавь `DATABASE_URL` и `TELEGRAM_BOT_TOKEN`.
Потом для продакшена: `vercel --prod`
