/**
 * SNG Command Hub API
 * - POST /api/chat  { messages, system } → Claude (Anthropic)
 * - POST /api/lead  { name, contact, message, type } → store + optional Telegram notify
 * - GET  /api/health
 *
 * Keys stay server-side. Public site chat widget hits this API.
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8787;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
const DATA = path.join(__dirname, "data");
if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true });

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);

const PRODUCT_BRIEF = `Product truth:
- There are two relevant model references buyers may ask about:
  1. SNG 270E / 270-E: earlier ~27 kW class bike / naming.
  2. SNG 520E Mako Founders Series: current ~52 kW class flagship / Founders allocation bike.
- If a buyer says "270E" or "520E", do not treat them as identical. Ask which one they mean if context is unclear.
- Positioning: street-legal full-size electric hyper-moto, custom billet platform, daily-driver capable, tall-rider-first.
- Price / scarcity: $20,000 MSRP, 30 serialized Founders units, $1,000 fully refundable deposit to hold place in allocation.
- 520E powertrain: Torp TM40 Pro motor, Torp TC1000 2.0 controller, 1,000 phase amps, 72V nominal, ChiBatterySystems Gladiator 72V 60Ah Colossus battery, 4,320 Wh, ~52 kW, roughly ~67-70 HP claim.
- 270E power class: earlier ~27 kW class reference. Only state exact 270E specs when explicitly supported by current docs or page context. If not fully locked in current materials, say so.
- Performance / geometry: under 200 lbs target, 100+ MPH target, ~39.5-40 inch seat, ~58 inch wheelbase, full-size stance for tall riders.
- Drive: Warp9 jackshaft, Warp9 14T / 54T sprockets, 3.86:1 ratio, GritShift Heavy Hitter 420 drive, RK 420 gold chain, 25-30 mm slack.
- Chassis: bare metal billet aluminum main frame, EV Freaks frame extender, SurRon Shop 7075 billet extended swingarm, UltraBee 12-gauge steel subframe, Cognito Moto custom billet triples.
- Suspension: WP XACT path front, progressive mono rear (YSS or EBMX path not fully frozen in docs), red rear spring / reservoir / linkage details.
- Brakes: Lewis 6-piston front with oversized rotor, Lewis 8-piston rear, billet bare-metal levers.
- Wheels / tires: Warp9 21 front / 18 rear, magnesium-color rims/hubs, white spokes, red nipples, Shinko all-purpose tires.
- Cockpit / rider fit: ProTaper EVO bars red/yellow, ROX pivoting risers, Tusk full-wrap black guards with signal LEDs, full Husky seat with padded top and grippy sides, Warp9 + SKR riser setup.
- Street equipment: CNC windshield, CNC GPS bracket, 5 inch Chojie CarPlay HD LCD display, Warp9 big headlight, LED taillight / brake light, locking charge inlet, fingerprint start if installed.
- Bodywork: Kinetic Canopy battery cover system with tool-less access concept, Mako Gold Founders visual, Torp electric only, no gas motor / no exhaust / no ICE language.`;

const DEFAULT_SYSTEM = `You are the SNG Cycles after-hours sales assistant for the SNG 520E Mako Founders Series.
${PRODUCT_BRIEF}
Rules:
- Never say: e-bike, Surron, Light Bee, gadget, cheap.
- Use exact specs when asked. If a detail is still open in the build docs, say it is not fully locked yet instead of guessing.
- If the buyer is ambiguous about model, ask exactly: "Are you interested in the 27kW or 52kW model?" before going deep.
- The buyer is often educated and spec-driven. Answer with concrete engineering, geometry, and component detail.
- You can help close, but only in a limited way: qualify the buyer, answer objections, explain allocation, and move serious buyers toward deposit handoff or a garage appointment.
- Do not act like payment is finished inside chat. If someone is ready, collect enough detail for a human to take deposit and issue receipt.
- Preferred language: custom billet platform, hyper-moto, 520E Mako, Founders Series, Shark Not Goldfish.
- Tone: luxury automotive restraint + counter-culture bite. Short, precise answers.
If booking: confirm you'll log it and a human will confirm.
Site: ${process.env.SNG_SITE_URL || "sngcycles.com"}.
Deposit: ${process.env.SNG_DEPOSIT_URL || "request via allocation form"}.
Shop: ${process.env.SNG_SHOP_URL || "payhip.com"}.`;

async function notifyTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: text.slice(0, 3500) }),
    });
  } catch (e) {
    console.warn("Telegram notify failed", e.message);
  }
}

function appendJsonl(file, obj) {
  fs.appendFileSync(path.join(DATA, file), JSON.stringify(obj) + "\n");
}

function classifyLead(lead) {
  const blob = JSON.stringify(lead || {}).toLowerCase();
  if (/deposit_ready|deposit ready|take my deposit|send deposit|i'm in|i am in/.test(blob)) {
    return "deposit_ready";
  }
  if (/appointment|garage|visit|book/.test(blob)) {
    return "appointment";
  }
  if (/reserve|allocation|serial|founders/.test(blob)) {
    return "reservation";
  }
  if (/hoodie|tee|hat|merch|apparel/.test(blob)) {
    return "apparel";
  }
  return "general";
}

function buildLeadAlert(lead) {
  const stage = classifyLead(lead);
  const lines = [
    stage === "deposit_ready" ? "🚨 SNG deposit-ready lead" : "🔥 SNG interested lead",
    `${lead.id || "L-?"} · ${stage}`,
    `${lead.name || "Unknown"} · ${lead.contact || "No contact"}`,
  ];
  if (lead.preferredSerial) lines.push(`Serial: ${lead.preferredSerial}`);
  if (lead.message) lines.push(String(lead.message).slice(0, 1200));
  return lines.join("\n");
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    anthropic: hasAnthropic,
    model: MODEL,
    telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!hasAnthropic) {
      return res.status(503).json({
        error: "ANTHROPIC_API_KEY not set. Add hub/.env and restart.",
      });
    }
    const { messages = [], system } = req.body || {};
    const sys = system || DEFAULT_SYSTEM;

    const completion = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        system: sys,
        max_tokens: 900,
        messages: normalizeMessages(messages),
      }),
    });

    const data = await completion.json();
    if (!completion.ok) {
      throw new Error(data.error?.message || "Anthropic chat failed");
    }

    const reply = extractText(data);
    appendJsonl("chat-log.jsonl", {
      at: new Date().toISOString(),
      messages,
      reply: reply.slice(0, 2000),
    });

    // Hot lead heuristics
    const blob = JSON.stringify(messages) + reply;
    if (/deposit|allocate|buy one|reserve|serial|\$20|20000|appointment|come see/i.test(blob)) {
      await notifyTelegram("🔥 SNG hot chat signal\n" + blob.slice(0, 800));
    }

    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "chat failed" });
  }
});

app.post("/api/lead", async (req, res) => {
  const lead = {
    ...req.body,
    at: new Date().toISOString(),
    id: "L-" + Date.now(),
  };
  appendJsonl("leads.jsonl", lead);
  await notifyTelegram(buildLeadAlert(lead));
  res.json({ ok: true, id: lead.id });
});

app.post("/api/appointment", async (req, res) => {
  const appt = {
    ...req.body,
    at: new Date().toISOString(),
    id: "A-" + Date.now(),
  };
  appendJsonl("appointments.jsonl", appt);
  await notifyTelegram(
    `📅 Appointment ${appt.id}\n${appt.name} · ${appt.contact}\n${appt.when} · ${appt.purpose || ""}`
  );
  res.json({ ok: true, id: appt.id });
});

// Static hub UI
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`SNG Command Hub API on http://127.0.0.1:${PORT}`);
  console.log(`Claude: ${hasAnthropic ? "ready (" + MODEL + ")" : "MISSING ANTHROPIC_API_KEY"}`);
});

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
