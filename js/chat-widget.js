/* SNG site sales bot widget — talks to local hub or Supabase edge function */
(function () {
  "use strict";
  const API = window.SNG_HUB_API || "";
  const FUNCTION_BASE = "https://tttrbnivjkveqorfrfng.functions.supabase.co/sng-command-hub";
  const LOCAL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
  const CHAT_URL = API
    ? API + "/api/chat"
    : FUNCTION_BASE
      ? FUNCTION_BASE + "/chat"
      : LOCAL
        ? "http://127.0.0.1:8787/api/chat"
        : "";
  const LEAD_URL = API
    ? API + "/api/lead"
    : FUNCTION_BASE
      ? FUNCTION_BASE + "/lead"
      : LOCAL
        ? "http://127.0.0.1:8787/api/lead"
        : "";
  const APPOINTMENT_URL = API
    ? API + "/api/appointment"
    : FUNCTION_BASE
      ? FUNCTION_BASE + "/appointment"
      : LOCAL
        ? "http://127.0.0.1:8787/api/appointment"
        : "";
  const PRODUCT_BRIEF = `Product truth:
- There are two relevant model references buyers may ask about:
  1. SNG 270E / 270-E: earlier ~27 kW class bike / naming.
  2. SNG 520E Mako Founders Series: current ~52 kW class flagship / Founders allocation bike.
- If a buyer says "270E" or "520E", do not collapse them into the same thing. Ask which one they mean if context is unclear.
- Positioning: street-legal, full-size electric hyper-moto, custom billet platform, daily-driver capable, tall-rider-first.
- Price / scarcity: $20,000 MSRP, 30 serialized Founders units, $1,000 refundable deposit to hold place in allocation.
- 520E powertrain: Torp TM40 Pro motor, Torp TC1000 2.0 controller, 1,000 phase amps, 72V nominal, ChiBatterySystems Gladiator 72V 60Ah Colossus battery, 4,320 Wh, ~52 kW, roughly ~67-70 HP claim.
- 270E power class: earlier ~27 kW class reference. Only speak to exact 270E specs when they are explicitly known from the docs or page context. If not fully locked in current materials, say so.
- Performance / geometry: under 200 lbs target, 100+ MPH target, ~39.5-40 inch seat height, ~58 inch wheelbase, full-size stance for tall riders.
- Drive: Warp9 jackshaft, Warp9 14T / 54T sprockets, 3.86:1 ratio, GritShift Heavy Hitter 420 drive, RK 420 gold chain, 25-30 mm slack.
- Chassis: bare metal billet aluminum main frame, EV Freaks frame extender, SurRon Shop 7075 billet aluminum extended swingarm, UltraBee 12-gauge steel subframe, Cognito Moto custom billet triples.
- Suspension: WP XACT path front, progressive mono rear (YSS or EBMX path still open in docs), red rear spring / reservoir / linkage details.
- Brakes: Lewis 6-piston front with oversized rotor, Lewis 8-piston rear, billet bare-metal levers.
- Wheels / tires: Warp9 21 inch front / 18 inch rear, magnesium-color rims/hubs, white spokes, red nipples, Shinko all-purpose tires.
- Cockpit / rider fit: ProTaper EVO bars red/yellow, ROX pivoting risers, Tusk full-wrap black guards with signal LEDs, full Husky seat with padded top and grippy sides, Warp9 + SKR riser setup.
- Street equipment: CNC windshield, CNC GPS bracket, 5 inch Chojie CarPlay HD LCD display, Warp9 big headlight, LED taillight / brake light, locking charge inlet, fingerprint start if installed.
- Bodywork: Kinetic Canopy battery cover system with tool-less access concept, Mako Gold Founders visual, Torp electric only, no gas motor / no exhaust / no ICE language.`;
  const SYSTEM =
    window.SNG_BOT_SYSTEM ||
    `You are the SNG Cycles website sales assistant for the SNG 520E Mako Founders Series.
${PRODUCT_BRIEF}
Rules:
- Never say e-bike, Surron, Light Bee, cheap, toy, pit bike, or gadget.
- Use exact specs when asked. If a spec is still open in the docs, say it is not fully locked yet instead of guessing.
- If the buyer is ambiguous about model, ask exactly: "Are you interested in the 27kW or 52kW model?" before giving detailed specs.
- Buyers are often highly educated spec shoppers. Answer directly, concretely, and with component-level detail.
- You can help close, but only in a limited way: qualify fit, answer objections, explain allocation, and move serious buyers toward deposit handoff or a garage appointment.
- Do not pretend payment is completed in chat. When someone is ready, collect name, contact, serial preference, and hand off for deposit / receipt handling.
- Tone: premium, technical, concise, Shark Not Goldfish.`;

  const history = [];
  const state = {
    lead: { intent: "", name: "", contact: "", serial: "", notes: "" },
    appointment: { name: "", contact: "", when: "", purpose: "" },
    mode: null,
    requestSent: false,
  };

  const style = document.createElement("style");
  style.textContent = `
    .sng-chat-fab{position:fixed;right:18px;bottom:18px;z-index:200;background:#e85d04;color:#fff;border:none;padding:14px 18px;font:700 12px Impact,"Arial Black",sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 28px rgba(232,93,4,.35)}
    .sng-chat-fab:hover{filter:brightness(1.08)}
    .sng-chat-panel{position:fixed;right:18px;bottom:70px;z-index:200;width:min(380px,calc(100vw - 24px));height:min(520px,70vh);background:#0a0a0a;border:1px solid #2a2a2a;display:none;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.55)}
    .sng-chat-panel.open{display:flex}
    .sng-chat-head{padding:12px 14px;border-bottom:1px solid #1e1e1e;font:900 13px Impact,"Arial Black",sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#e4e2dc;font-style:italic}
    .sng-chat-head span{color:#e85d04;display:block;font-size:10px;letter-spacing:.16em;margin-top:2px;font-style:normal}
    .sng-chat-body{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
    .sng-chat-m{padding:10px;font:13px/1.45 Arial,sans-serif;border:1px solid #1e1e1e;background:#111;color:#ddd}
    .sng-chat-m.bot{border-color:rgba(232,93,4,.35)}
    .sng-chat-m b{display:block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#e85d04;margin-bottom:4px}
    .sng-chat-actions{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 10px}
    .sng-chat-chip{background:#121212;border:1px solid rgba(232,93,4,.28);color:#f1e7df;padding:8px 10px;font:700 10px Impact,"Arial Black",sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
    .sng-chat-chip:hover{background:#171717}
    .sng-chat-note{padding:0 12px 10px;color:#9b9b9b;font:11px/1.4 Arial,sans-serif}
    .sng-chat-capture{display:none;padding:10px 12px;border-top:1px solid #1e1e1e;background:#0d0d0d}
    .sng-chat-capture.open{display:block}
    .sng-chat-capture h4{font:900 12px Impact,"Arial Black",sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#f4efe9;margin-bottom:8px}
    .sng-chat-capture p{font:12px/1.45 Arial,sans-serif;color:#b7b7b7;margin-bottom:10px}
    .sng-chat-capture-grid{display:grid;gap:8px}
    .sng-chat-capture input,.sng-chat-capture textarea{width:100%;background:#080808;border:1px solid #2a2a2a;color:#eee;padding:10px;font:13px Arial}
    .sng-chat-capture textarea{min-height:72px;resize:vertical}
    .sng-chat-capture-row{display:flex;gap:8px}
    .sng-chat-capture-row button{flex:1}
    .sng-chat-secondary{background:transparent;border:1px solid #2a2a2a;color:#cfcfcf;padding:0 14px;font:700 11px Impact,sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}
    .sng-chat-form{display:flex;gap:6px;padding:10px;border-top:1px solid #1e1e1e}
    .sng-chat-form input{flex:1;background:#080808;border:1px solid #2a2a2a;color:#eee;padding:10px;font:13px Arial}
    .sng-chat-form button{background:#e85d04;border:none;color:#fff;padding:0 14px;font:700 11px Impact,sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}
    @media(max-width:600px){.sng-chat-fab{bottom:78px}}
  `;
  document.head.appendChild(style);

  const fab = document.createElement("button");
  fab.className = "sng-chat-fab";
  fab.type = "button";
  fab.textContent = "Chat · SNG";
  const panel = document.createElement("div");
  panel.className = "sng-chat-panel";
  panel.innerHTML = `
    <div class="sng-chat-head">SNG Sales Bot<span>After hours · Allocation · Appointments</span></div>
    <div class="sng-chat-body"></div>
    <div class="sng-chat-actions">
      <button class="sng-chat-chip" type="button" data-action="reserve">Reserve a serial</button>
      <button class="sng-chat-chip" type="button" data-action="deposit">Ready for deposit</button>
      <button class="sng-chat-chip" type="button" data-action="appointment">Book garage time</button>
      <button class="sng-chat-chip" type="button" data-action="apparel">Shop apparel</button>
    </div>
    <div class="sng-chat-note">Ask anything, or use a quick action to leave details now.</div>
    <div class="sng-chat-capture" aria-live="polite"></div>
    <form class="sng-chat-form"><input placeholder="Ask about the 270-E…" /><button type="submit">Send</button></form>
  `;
  document.body.appendChild(fab);
  document.body.appendChild(panel);

  const body = panel.querySelector(".sng-chat-body");
  const actions = panel.querySelector(".sng-chat-actions");
  const capture = panel.querySelector(".sng-chat-capture");
  const form = panel.querySelector("form");
  const input = panel.querySelector("input");

  function escapeAttr(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  }

  function openCapture(mode) {
    state.mode = mode;
    if (mode === "lead") {
      capture.innerHTML = `
        <h4>${state.lead.intent === "deposit_ready" ? "Deposit-ready handoff" : "Reserve / pricing follow-up"}</h4>
        <p>${state.lead.intent === "deposit_ready" ? "Leave enough detail for immediate payment follow-up and receipt handling." : "Leave your details and the bot will log the lead for human follow-up."}</p>
        <div class="sng-chat-capture-grid">
          <input name="name" placeholder="Full name" value="${escapeAttr(state.lead.name)}" />
          <input name="contact" placeholder="Email or phone" value="${escapeAttr(state.lead.contact)}" />
          <input name="serial" placeholder="Preferred serial (optional)" value="${escapeAttr(state.lead.serial)}" />
          <textarea name="notes" placeholder="${state.lead.intent === "deposit_ready" ? "Anything needed to take the deposit now? Best time to call, bike questions, receipt name…" : "What are you after? Preferred serial, specs, deposit questions…"}">${state.lead.notes || ""}</textarea>
          <div class="sng-chat-capture-row">
            <button type="button" class="sng-chat-secondary" data-cancel="true">Cancel</button>
            <button type="button" class="sng-chat-submit">${state.lead.intent === "deposit_ready" ? "Send hot lead" : "Send lead"}</button>
          </div>
        </div>
      `;
    } else if (mode === "appointment") {
      capture.innerHTML = `
        <h4>Book garage time</h4>
        <p>Drop the basics. A human will confirm the time.</p>
        <div class="sng-chat-capture-grid">
          <input name="name" placeholder="Full name" value="${escapeAttr(state.appointment.name)}" />
          <input name="contact" placeholder="Email or phone" value="${escapeAttr(state.appointment.contact)}" />
          <input name="when" placeholder="Preferred day/time" value="${escapeAttr(state.appointment.when)}" />
          <textarea name="purpose" placeholder="What do you want to see or discuss?">${state.appointment.purpose || ""}</textarea>
          <div class="sng-chat-capture-row">
            <button type="button" class="sng-chat-secondary" data-cancel="true">Cancel</button>
            <button type="button" class="sng-chat-submit">Book request</button>
          </div>
        </div>
      `;
    } else {
      capture.innerHTML = "";
    }
    capture.classList.toggle("open", Boolean(mode));
  }

  function closeCapture() {
    state.mode = null;
    capture.classList.remove("open");
    capture.innerHTML = "";
  }

  function add(role, text) {
    const d = document.createElement("div");
    d.className = "sng-chat-m " + (role === "bot" ? "bot" : "user");
    d.innerHTML = "<b></b><div></div>";
    d.querySelector("b").textContent = role === "bot" ? "SNG Bot" : "You";
    d.querySelector("div").textContent = text;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }

  add(
    "bot",
    "270E or 520E Mako Founders. Ask for specs, geometry, components, allocation, or garage time."
  );

  fab.addEventListener("click", () => panel.classList.toggle("open"));

  actions.addEventListener("click", (e) => {
    const button = e.target.closest("[data-action]");
    if (!button) return;
    panel.classList.add("open");
    if (button.dataset.action === "reserve") {
      state.lead.intent = "founders_reservation";
      add("bot", "Send your name, contact, and what you want to know. I can log the lead right here.");
      openCapture("lead");
      return;
    }
    if (button.dataset.action === "deposit") {
      state.lead.intent = "deposit_ready";
      add("bot", "If you're ready to move, leave your name, contact, and any serial preference. This gets pushed for immediate follow-up.");
      openCapture("lead");
      return;
    }
    if (button.dataset.action === "appointment") {
      add("bot", "Leave your name, contact, and preferred garage time. A human will confirm it.");
      openCapture("appointment");
      return;
    }
    if (button.dataset.action === "apparel") {
      add("bot", "Apparel is live. Ask for the right piece, or go straight to Payhip for the current drop.");
      history.push({
        role: "assistant",
        content: "Apparel is live. Ask for the right piece, or go straight to Payhip for the current drop.",
      });
      input.value = "Which apparel piece should I buy first?";
      input.focus();
    }
  });

  capture.addEventListener("click", async (e) => {
    const cancel = e.target.closest("[data-cancel]");
    if (cancel) {
      closeCapture();
      return;
    }
    const submit = e.target.closest(".sng-chat-submit");
    if (!submit) return;

    if (state.mode === "lead") {
      const name = capture.querySelector('[name="name"]').value.trim();
      const contact = capture.querySelector('[name="contact"]').value.trim();
      const serial = capture.querySelector('[name="serial"]').value.trim();
      const notes = capture.querySelector('[name="notes"]').value.trim();
      state.lead = { intent: state.lead.intent || "site_chat", name, contact, serial, notes };

      if (!name || !contact) {
        add("bot", "Need both name and contact to log the lead.");
        return;
      }

      submit.disabled = true;
      try {
        const res = await fetch(LEAD_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: state.lead.intent || "site_chat",
            name,
            contact,
            preferredSerial: serial,
            message:
              notes ||
              history
                .slice(-4)
                .map((m) => `${m.role}: ${m.content}`)
                .join("\n"),
            source: "website_chat_widget",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || res.statusText);
        state.requestSent = true;
        closeCapture();
        add(
          "bot",
          state.lead.intent === "deposit_ready"
            ? `Hot lead logged. Reference ${data.id}. Human follow-up should hit fast for deposit and receipt handling.`
            : `Lead logged. Reference ${data.id}. Human follow-up comes next.`
        );
      } catch (err) {
        add("bot", "Lead capture failed right now. Email hello@sngcycles.com with your name and contact.");
      } finally {
        submit.disabled = false;
      }
      return;
    }

    if (state.mode === "appointment") {
      const name = capture.querySelector('[name="name"]').value.trim();
      const contact = capture.querySelector('[name="contact"]').value.trim();
      const when = capture.querySelector('[name="when"]').value.trim();
      const purpose = capture.querySelector('[name="purpose"]').value.trim();
      state.appointment = { name, contact, when, purpose };

      if (!name || !contact || !when) {
        add("bot", "Need name, contact, and preferred time to request the appointment.");
        return;
      }

      submit.disabled = true;
      try {
        const res = await fetch(APPOINTMENT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            contact,
            when,
            purpose: purpose || "Garage visit requested from website chat",
            source: "website_chat_widget",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || res.statusText);
        state.requestSent = true;
        closeCapture();
        add("bot", `Garage request logged. Reference ${data.id}. A human will confirm the time.`);
      } catch (err) {
        add("bot", "Appointment logging failed right now. Email hello@sngcycles.com to lock a time.");
      } finally {
        submit.disabled = false;
      }
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    add("user", text);
    history.push({ role: "user", content: text });
    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, system: SYSTEM }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || res.statusText);
      const reply = data.reply || "…";
      history.push({ role: "assistant", content: reply });
      add("bot", reply);

      if (/appointment|book|garage|come by|visit/i.test(text + " " + reply)) {
        openCapture("appointment");
      } else if (/ready|deposit now|take my deposit|send deposit|i want one|i'm in|i am in/i.test(text + " " + reply)) {
        state.lead.intent = "deposit_ready";
        openCapture("lead");
      } else if (/deposit|allocate|buy|reserve|serial|price|pricing/i.test(text + " " + reply)) {
        state.lead.intent = /apparel|hoodie|tee|hat|merch/i.test(text + " " + reply)
          ? "apparel_interest"
          : "founders_reservation";
        openCapture("lead");
      }

      if (/deposit|allocate|appointment|buy|reserve/i.test(text) && !state.requestSent) {
        fetch(LEAD_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "site_chat",
            message: text,
            reply: reply.slice(0, 500),
          }),
        }).catch(() => {});
      }
    } catch (err) {
      add(
        "bot",
        "Bot offline right now — email hello@sngcycles.com or open Founders allocation. (Hub: " +
          err.message +
          ")"
      );
    }
  });
})();
