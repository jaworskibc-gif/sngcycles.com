exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return reply(204, "");
  }

  if (event.httpMethod !== "POST") {
    return reply(405, { error: "Method not allowed" });
  }

  let lead;
  try {
    lead = JSON.parse(event.body || "{}");
  } catch {
    return reply(400, { error: "Invalid JSON" });
  }

  const id = "L-" + Date.now();
  await notifyTelegram(buildLeadAlert({ ...lead, id }));
  return reply(200, { ok: true, id });
};

function buildLeadAlert(lead) {
  const lines = [
    lead.type === "deposit_ready" ? "SNG deposit-ready lead" : "SNG site lead",
    `${lead.id} · ${lead.type || "general"}`,
    `${lead.name || "Unknown"} · ${lead.contact || "No contact"}`,
  ];
  if (lead.preferredSerial) lines.push(`Serial: ${lead.preferredSerial}`);
  if (lead.message) lines.push(String(lead.message).slice(0, 1200));
  return lines.join("\n");
}

async function notifyTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: text.slice(0, 3500) }),
  }).catch(() => {});
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
