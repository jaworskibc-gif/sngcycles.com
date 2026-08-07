# SNG Supabase Command Hub

This moves only the live website chat bot off dead Netlify routes and onto a Supabase Edge Function. The oxide GitHub Pages site stays static.

## What To Deploy

- Edge Function: `supabase/functions/sng-command-hub`
- Optional tables:
  - `public.sng_chat_leads`
  - `public.sng_chat_appointments`

## Required Secrets

Set these in the Supabase project:

- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL=claude-sonnet-4-20250514`
- `SNG_SITE_URL=https://sngcycles.com`
- `SNG_DEPOSIT_URL=` if you have a live deposit URL
- `SNG_SHOP_URL=https://payhip.com/`

Optional:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `SUPABASE_SERVICE_ROLE_KEY`

## Deploy Sequence

1. `supabase login`
2. `supabase link --project-ref <new-project-ref>`
3. `supabase db push`
4. `supabase functions deploy sng-command-hub --no-verify-jwt`
5. Put the live function base URL into `js/chat-config.js`:

```js
window.SNG_BOT_API_BASE = "https://<project-ref>.functions.supabase.co/sng-command-hub";
```

6. Push the site again so GitHub Pages serves the updated config file.

## Live Endpoints

- `GET /health`
- `POST /chat`
- `POST /lead`
- `POST /appointment`

Example health URL:

```text
https://<project-ref>.functions.supabase.co/sng-command-hub/health
```
