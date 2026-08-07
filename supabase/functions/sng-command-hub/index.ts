const FUNCTION_NAME = "sng-command-hub";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = Deno.env.get("ANTHROPIC_MODEL") || "claude-sonnet-4-20250514";
const SITE_URL = Deno.env.get("SNG_SITE_URL") || "https://sngcycles.com";
const DEPOSIT_URL = Deno.env.get("SNG_DEPOSIT_URL") || "request via allocation form";
const SHOP_URL = Deno.env.get("SNG_SHOP_URL") || "https://payhip.com/";
const DB_URL = (Deno.env.get("SUPABASE_URL") || "").replace(/\/$/, "");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const LEADS_TABLE = Deno.env.get("SNG_LEADS_TABLE") || "sng_chat_leads";
const APPOINTMENTS_TABLE = Deno.env.get("SNG_APPOINTMENTS_TABLE") || "sng_chat_appointments";

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

const DEFAULT_SYSTEM = `You are the SNG Cycles website sales assistant for the SNG 520E Mako Founders Series.
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
- If booking: confirm you'll log it and a human will confirm.
- Site: ${SITE_URL}.
- Deposit: ${DEPOSIT_URL}.
- Shop: ${SHOP_URL}.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return reply(204, "");
  }

  const route = getRoute(req.url);

  try {
    if (req.method === "GET" && route === "health") {
      return reply(200, {
        ok: true,
        function: FUNCTION_NAME,
        model: MODEL,
        anthropicConfigured: Boolean(Deno.env.get("ANTHROPIC_API_KEY")),
        telegramConfigured: Boolean(Deno.env.get("TELEGRAM_BOT_TOKEN") && Deno.env.get("TELEGRAM_CHAT_ID")),
        storageConfigured: Boolean(DB_URL && SERVICE_ROLE_KEY),
      });
    }

    if (req.method !== "POST") {
      return reply(405, { error: "Method not allowed" });
    }

    const body = await parseJson(req);

    if (route === "chat") {
      return await handleChat(body);
    }
    if (route === "lead") {
      return await handleLead(body);
    }
    if (route === "appointment") {
      return await handleAppointment(body);
    }

    return reply(404, { error: "Unknown route" });
  } catch (error) {
    return reply(500, { error: error instanceof Error ? error.message : "Unhandled error" });
  }
});

async function handleChat(payload: Record<string, unknown>) {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return reply(503, { error: "ANTHROPIC_API_KEY not configured" });
  }

  const system = typeof payload.system === "string" && payload.system.trim() ? payload.system : DEFAULT_SYSTEM;
  const messages = normalizeMessages(payload.messages);
  if (!messages.length) {
    return reply(400, { error: "At least one message is required" });
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      system,
      max_tokens: 900,
      messages: messages.map((message) => ({
        role: message.role,
        content: [{ type: "text", text: message.content }],
      })),
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    return reply(response.status, {
      error: data?.error?.message || "Anthropic request failed",
    });
  }

  return reply(200, { reply: extractText(data) });
}

async function handleLead(payload: Record<string, unknown>) {
  const id = "L-" + Date.now();
  const lead = {
    id,
    type: asString(payload.type) || "site_chat",
    name: asString(payload.name),
    contact: asString(payload.contact),
    preferredSerial: asString(payload.preferredSerial),
    message: asString(payload.message),
    reply: asString(payload.reply),
    source: asString(payload.source) || "website_chat_widget",
    createdAt: new Date().toISOString(),
  };

  await storeRecord(LEADS_TABLE, {
    external_id: lead.id,
    lead_type: lead.type,
    name: lead.name,
    contact: lead.contact,
    preferred_serial: lead.preferredSerial,
    message: lead.message,
    reply: lead.reply,
    source: lead.source,
    created_at: lead.createdAt,
  });
  await notifyTelegram(buildLeadAlert(lead));

  return reply(200, { ok: true, id });
}

async function handleAppointment(payload: Record<string, unknown>) {
  const id = "A-" + Date.now();
  const appointment = {
    id,
    name: asString(payload.name),
    contact: asString(payload.contact),
    when: asString(payload.when),
    purpose: asString(payload.purpose),
    source: asString(payload.source) || "website_chat_widget",
    createdAt: new Date().toISOString(),
  };

  await storeRecord(APPOINTMENTS_TABLE, {
    external_id: appointment.id,
    name: appointment.name,
    contact: appointment.contact,
    requested_when: appointment.when,
    purpose: appointment.purpose,
    source: appointment.source,
    created_at: appointment.createdAt,
  });
  await notifyTelegram(buildAppointmentAlert(appointment));

  return reply(200, { ok: true, id });
}

function getRoute(requestUrl: string) {
  const parts = new URL(requestUrl).pathname.split("/").filter(Boolean);
  const index = parts.indexOf(FUNCTION_NAME);
  if (index === -1) {
    return parts.at(-1) || "health";
  }
  return parts[index + 1] || "health";
}

async function parseJson(req: Request): Promise<Record<string, unknown>> {
  try {
    return await req.json();
  } catch {
    throw new Error("Invalid JSON");
  }
}

function normalizeMessages(messages: unknown): ChatMessage[] {
  return (Array.isArray(messages) ? messages : [])
    .filter((message): message is ChatMessage => {
      return Boolean(
        message &&
          typeof message === "object" &&
          ("role" in message) &&
          ("content" in message) &&
          (((message as ChatMessage).role === "user") || ((message as ChatMessage).role === "assistant"))
      );
    })
    .map((message) => ({
      role: message.role,
      content: String(message.content || ""),
    }))
    .filter((message) => message.content.trim().length > 0);
}

function extractText(data: Record<string, unknown>) {
  const content = Array.isArray(data.content) ? data.content : [];
  return content
    .filter((block) => block && typeof block === "object" && (block as { type?: string }).type === "text")
    .map((block) => String((block as { text?: string }).text || ""))
    .join("\n")
    .trim();
}

async function storeRecord(table: string, payload: Record<string, unknown>) {
  if (!DB_URL || !SERVICE_ROLE_KEY) return;
  await fetch(`${DB_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

function buildLeadAlert(lead: Record<string, string>) {
  const lines = [
    lead.type === "deposit_ready" ? "SNG deposit-ready lead" : "SNG site lead",
    `${lead.id} · ${lead.type || "general"}`,
    `${lead.name || "Unknown"} · ${lead.contact || "No contact"}`,
  ];
  if (lead.preferredSerial) lines.push(`Serial: ${lead.preferredSerial}`);
  if (lead.message) lines.push(lead.message.slice(0, 1200));
  return lines.join("\n");
}

function buildAppointmentAlert(appointment: Record<string, string>) {
  return [
    "SNG appointment request",
    `${appointment.id} · ${appointment.when || "time not set"}`,
    `${appointment.name || "Unknown"} · ${appointment.contact || "No contact"}`,
    appointment.purpose || "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function notifyTelegram(text: string) {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: text.slice(0, 3500) }),
  }).catch(() => {});
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function reply(status: number, body: string | Record<string, unknown>) {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  if (typeof body === "string") {
    headers.set("Content-Type", "text/plain; charset=utf-8");
    return new Response(body, { status, headers });
  }
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { status, headers });
}
