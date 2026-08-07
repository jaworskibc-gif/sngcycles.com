const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return reply(204, "");
  }

  if (event.httpMethod !== "POST") {
    return reply(405, { error: "Method not allowed" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return reply(503, { error: "ANTHROPIC_API_KEY not configured" });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return reply(400, { error: "Invalid JSON" });
  }

  const system = payload.system || DEFAULT_SYSTEM;
  const messages = normalizeMessages(payload.messages);
  if (!messages.length) {
    return reply(400, { error: "At least one message is required" });
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        system,
        max_tokens: 900,
        messages,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return reply(response.status, {
        error: data.error?.message || "Anthropic request failed",
      });
    }

    return reply(200, { reply: extractText(data) });
  } catch (error) {
    return reply(500, { error: error.message || "Chat failed" });
  }
};

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
- Site: ${process.env.SNG_SITE_URL || "sngcycles.com"}.
- Deposit: ${process.env.SNG_DEPOSIT_URL || "request via allocation form"}.
- Shop: ${process.env.SNG_SHOP_URL || "payhip.com"}.`;

function normalizeMessages(messages) {
  return (Array.isArray(messages) ? messages : [])
    .filter((message) => message && (message.role === "user" || message.role === "assistant"))
    .map((message) => ({
      role: message.role,
      content: [{ type: "text", text: String(message.content || "") }],
    }));
}

function extractText(data) {
  return (data.content || [])
    .filter((block) => block && block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

function reply(statusCode, body) {
  const isString = typeof body === "string";
  return {
    statusCode,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "Content-Type",
      "content-type": isString ? "text/plain" : "application/json",
    },
    body: isString ? body : JSON.stringify(body),
  };
}
