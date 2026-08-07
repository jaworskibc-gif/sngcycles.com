# SNG Command Hub (simplified)

One place to run the brand after hours:

| Module | What it does |
|--------|----------------|
| **Social Engine** | Weekly content queue + Claude hook generator |
| **Garage Calendar** | Build / validation / shoot days (localStorage + optional server log) |
| **CapCut Pipeline** | Capture → cut → post checklist + script expand |
| **Sales Bot** | Site widget + hub tester — allocation, merch, appointments |
| **Appointments** | Manual + bot-driven bookings |
| **Telegram** | You chat with Claude; hot leads push to your phone |

## Preview

1. Public site: `python3 -m http.server 8765` from `sng-website/`
2. Hub UI: open `http://127.0.0.1:8765/hub/`
3. Hub API (Claude):

```bash
cd hub
cp .env.example .env
# put ANTHROPIC_API_KEY=... in .env
npm install
npm start
```

4. Telegram (optional):

```bash
# BotFather → token → .env TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
npm run telegram
```

## Logos

CCM asset removed from the public site. Using SVG SNG mark + large **SNG Cycles** type until you drop better logos into `assets/`.

## You said you’ll

- Use **Anthropic API tokens** (`ANTHROPIC_API_KEY` from https://console.anthropic.com/)
- Talk to ops via **Telegram** (`TELEGRAM_BOT_TOKEN`)

Never put API keys in public JS — only in `hub/.env`.
