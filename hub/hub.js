/* SNG Command Hub — local UI + API client */
(function () {
  "use strict";

  const API = window.SNG_HUB_API || "";
  const CHAT_URL = API ? API + "/api/chat" : "/.netlify/functions/chat";

  // Tabs
  document.querySelectorAll(".hub-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".hub-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".hub-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("panel-" + tab.dataset.panel)?.classList.add("active");
    });
  });

  // Storage helpers
  function load(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }
  function save(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  // —— Calendar ——
  let calCursor = new Date();
  calCursor.setDate(1);

  function renderCal() {
    const grid = document.getElementById("cal-grid");
    const label = document.getElementById("cal-label");
    const events = load("sng_garage_events", []);
    if (!grid || !label) return;

    const y = calCursor.getFullYear();
    const m = calCursor.getMonth();
    label.textContent = calCursor.toLocaleString(undefined, { month: "long", year: "numeric" });

    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const heads = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let html = heads.map((h) => `<div class="cal-cell head">${h}</div>`).join("");

    for (let i = 0; i < firstDow; i++) html += `<div class="cal-cell"></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayEvents = events.filter((e) => e.date === key);
      const cls = dayEvents.length ? "cal-cell has" : "cal-cell";
      const dots = dayEvents
        .slice(0, 2)
        .map((e) => `<span class="dot">${e.title}</span>`)
        .join("");
      html += `<div class="${cls}" data-date="${key}"><span class="n">${d}</span>${dots}</div>`;
    }
    grid.innerHTML = html;
    renderEventList();
  }

  function renderEventList() {
    const list = document.getElementById("cal-events");
    if (!list) return;
    const events = load("sng_garage_events", []).sort((a, b) => a.date.localeCompare(b.date));
    list.innerHTML = events.length
      ? events
          .map(
            (e) =>
              `<li><strong>${e.date}</strong> [${e.type}] ${e.title}${e.notes ? " — " + e.notes : ""}</li>`
          )
          .join("")
      : "<li>No garage events yet.</li>";
  }

  document.getElementById("cal-prev")?.addEventListener("click", () => {
    calCursor.setMonth(calCursor.getMonth() - 1);
    renderCal();
  });
  document.getElementById("cal-next")?.addEventListener("click", () => {
    calCursor.setMonth(calCursor.getMonth() + 1);
    renderCal();
  });

  document.getElementById("cal-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const events = load("sng_garage_events", []);
    events.push({
      date: fd.get("date"),
      title: fd.get("title"),
      type: fd.get("type"),
      notes: fd.get("notes") || "",
      id: "G-" + Date.now(),
    });
    save("sng_garage_events", events);
    e.target.reset();
    renderCal();
  });

  renderCal();

  // —— Appointments ——
  function renderAppts() {
    const list = document.getElementById("appt-list");
    if (!list) return;
    const appts = load("sng_appointments", []).sort((a, b) => (a.when || "").localeCompare(b.when || ""));
    list.innerHTML = appts.length
      ? appts
          .map(
            (a) =>
              `<li><strong>${a.when}</strong> ${a.name} · ${a.contact} · ${a.purpose}${a.notes ? " — " + a.notes : ""}</li>`
          )
          .join("")
      : "<li>No appointments yet. Bot + form will fill this.</li>";
  }

  document.getElementById("appt-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const appts = load("sng_appointments", []);
    const when = fd.get("when");
    const item = {
      name: fd.get("name"),
      contact: fd.get("contact"),
      when,
      purpose: fd.get("purpose"),
      notes: fd.get("notes") || "",
      id: "A-" + Date.now(),
    };
    appts.push(item);
    save("sng_appointments", appts);

    // Mirror into garage calendar on that date
    const date = String(when).slice(0, 10);
    const events = load("sng_garage_events", []);
    events.push({
      date,
      title: `Appt: ${item.name} (${item.purpose})`,
      type: "customer",
      notes: item.contact,
      id: "G-A-" + Date.now(),
    });
    save("sng_garage_events", events);
    e.target.reset();
    renderAppts();
    renderCal();
  });
  renderAppts();

  // —— Claude API helpers ——
  async function askClaude(messages, system) {
    const res = await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, system }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || res.statusText);
    }
    const data = await res.json();
    return data.reply || data.output_text || JSON.stringify(data);
  }

  document.getElementById("gen-hooks")?.addEventListener("click", async () => {
    const out = document.getElementById("hook-out");
    const prompt = document.getElementById("hook-prompt")?.value || "";
    out.textContent = "Generating…";
    try {
      out.textContent = await askClaude(
        [{ role: "user", content: prompt }],
        "You write tight SNG Cycles social hooks. No e-bike language. Premium + aggressive. Short lines."
      );
    } catch (e) {
      out.textContent =
        "Hub API not reachable (" +
        e.message +
        ").\n\nStart the hub:\n  cd hub && npm install && export ANTHROPIC_API_KEY=... && npm start\n\nFallback hooks:\n1. Internet says fake. Garage says parked.\n2. 40\" seat. Leave the school behind.\n3. 30 units. $1k holds the serial.\n4. Gold full-panel. Not a render.\n5. Ducati money. Tall-rider geometry.";
    }
  });

  document.getElementById("gen-script")?.addEventListener("click", async () => {
    const out = document.getElementById("script-out");
    const base = document.getElementById("capcut-script")?.value || "";
    out.textContent = "Expanding…";
    try {
      out.textContent = await askClaude(
        [
          {
            role: "user",
            content:
              "Expand this CapCut outline into on-screen text + VO lines (12–18s vertical). Keep brand rules.\n\n" +
              base,
          },
        ],
        "SNG CapCut writer. Tight. No e-bike words."
      );
    } catch (e) {
      out.textContent = "Start hub API for Claude expansion.\n\n" + base;
    }
  });

  // —— Sales bot test ——
  const botForm = document.getElementById("bot-form");
  const botMessages = document.getElementById("bot-messages");
  const botHistory = [];

  function addMsg(role, text) {
    const div = document.createElement("div");
    div.className = "bot-msg " + (role === "user" ? "user" : "bot");
    div.innerHTML = `<strong>${role === "user" ? "You" : "SNG Bot"}</strong><p></p>`;
    div.querySelector("p").textContent = text;
    botMessages?.appendChild(div);
    botMessages.scrollTop = botMessages.scrollHeight;
  }

  botForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("bot-input");
    const text = (input?.value || "").trim();
    if (!text) return;
    input.value = "";
    addMsg("user", text);
    botHistory.push({ role: "user", content: text });
    const system = document.getElementById("bot-system")?.value;
    try {
      const reply = await askClaude(botHistory, system);
      botHistory.push({ role: "assistant", content: reply });
      addMsg("assistant", reply);

      // crude appointment capture
      if (/appointment|book|schedule|come by|visit/i.test(text + " " + reply)) {
        // leave human to confirm in Appointments panel
      }
    } catch (err) {
      addMsg(
        "assistant",
        "Bot API offline. Start hub with ANTHROPIC_API_KEY.\n\nQuick answer: 270-E gold full-panel — ~70HP, under 200lbs, 100+ MPH, ~40\" seat. $20k · $1k refundable deposit · founders.html"
      );
    }
  });
})();
