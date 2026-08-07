/**
 * Telegram worker — message your bot to talk to Claude / pull hub context.
 * Requires TELEGRAM_BOT_TOKEN (+ ANTHROPIC_API_KEY for /ask).
 */
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("Set TELEGRAM_BOT_TOKEN in hub/.env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
const DATA = path.join(__dirname, "data");

function tailJsonl(file, n = 8) {
  const fp = path.join(DATA, file);
  if (!fs.existsSync(fp)) return [];
  const lines = fs.readFileSync(fp, "utf8").trim().split("\n").filter(Boolean);
  return lines.slice(-n).map((l) => {
    try {
      return JSON.parse(l);
    } catch {
      return null;
    }
  }).filter(Boolean);
}

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `SNG Command Hub bot online.\n\n/ask <question> — Claude sales brain\n/leads — recent site leads\n/appts — appointments\n/health — API status\n\nYour chat id: ${msg.chat.id}\n(Add as TELEGRAM_CHAT_ID for alerts)`
  );
});

bot.onText(/\/health/, async (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `Claude: ${hasAnthropic ? "yes" : "no key"}\nModel: ${MODEL}\nChat ID: ${msg.chat.id}`
  );
});

bot.onText(/\/leads/, (msg) => {
  const leads = tailJsonl("leads.jsonl", 10);
  if (!leads.length) return bot.sendMessage(msg.chat.id, "No leads logged yet.");
  bot.sendMessage(
    msg.chat.id,
    leads
      .map((l) => `• ${l.at?.slice(0, 16)} ${l.name || "?"} ${l.contact || ""}\n  ${l.message || l.type || ""}`)
      .join("\n\n")
  );
});

bot.onText(/\/appts/, (msg) => {
  const rows = tailJsonl("appointments.jsonl", 10);
  if (!rows.length) return bot.sendMessage(msg.chat.id, "No appointments file yet.");
  bot.sendMessage(
    msg.chat.id,
    rows.map((a) => `• ${a.when || a.at} ${a.name} (${a.purpose || ""})`).join("\n")
  );
});

bot.onText(/\/ask(?:\s+(.+))?/s, async (msg, match) => {
  const q = (match[1] || "").trim();
  if (!q) return bot.sendMessage(msg.chat.id, "Usage: /ask How do I answer a 6'5 rider about seat height?");
  if (!hasAnthropic) return bot.sendMessage(msg.chat.id, "ANTHROPIC_API_KEY missing.");
  try {
    const reply = await askClaude(
      [
        { role: "user", content: q },
      ],
      "You are SNG founder ops co-pilot. Help run social, sales, allocation, garage. No e-bike language. Tight answers.",
    );
    bot.sendMessage(msg.chat.id, reply.slice(0, 3500));
  } catch (e) {
    bot.sendMessage(msg.chat.id, "Error: " + e.message);
  }
});

// Free text → treat as /ask for convenience
bot.on("message", async (msg) => {
  if (!msg.text || msg.text.startsWith("/")) return;
  if (!hasAnthropic) return;
  try {
    const reply = await askClaude(
      [{ role: "user", content: msg.text }],
      "You are the SNG Cycles command co-pilot via Telegram. Help with sales, social, garage, appointments. No e-bike language.",
    );
    bot.sendMessage(msg.chat.id, reply.slice(0, 3500));
  } catch (e) {
    bot.sendMessage(msg.chat.id, "Error: " + e.message);
  }
});

console.log("SNG Telegram bot polling…");

async function askClaude(messages, system) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      system,
      max_tokens: 700,
      messages: normalizeMessages(messages),
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Anthropic request failed");
  }
  return extractText(data) || "(empty)";
}

function normalizeMessages(messages) {
  return (Array.isArray(messages) ? messages : [])
    .filter((message) => message && (message.role === "user" || message.role === "assistant"))
    .map((message) => ({
      role: message.role,
      content: [{ type: "text", text: String(message.content || "") }],
    }));
}

function extractText(payload) {
  return (payload.content || [])
    .filter((block) => block?.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}
