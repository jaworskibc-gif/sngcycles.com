exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return reply(204, "");
  }

  if (event.httpMethod !== "POST") {
    return reply(405, { error: "Method not allowed" });
  }

  let appointment;
  try {
    appointment = JSON.parse(event.body || "{}");
  } catch {
    return reply(400, { error: "Invalid JSON" });
  }

  const id = "A-" + Date.now();
  await notifyTelegram(buildAppointmentAlert({ ...appointment, id }));
  return reply(200, { ok: true, id });
};

function buildAppointmentAlert(appointment) {
  return [
    "SNG appointment request",
    `${appointment.id} · ${appointment.when || "time not set"}`,
    `${appointment.name || "Unknown"} · ${appointment.contact || "No contact"}`,
    appointment.purpose || "",
  ]
    .filter(Boolean)
    .join("\n");
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
