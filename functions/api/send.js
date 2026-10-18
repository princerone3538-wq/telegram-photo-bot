export async function onRequestPost({ request, env }) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    return new Response("Server configuration missing", {
      status: 500
    });
  }

  const form = await request.formData();
  const photo = form.get("photo");

  if (!photo || typeof photo === "string" ||
      !photo.type.startsWith("image/") ||
      photo.size > 5 * 1024 * 1024) {
    return new Response("Invalid image", { status: 400 });
  }

  const telegramForm = new FormData();
  telegramForm.append("chat_id", env.TELEGRAM_CHAT_ID);
  telegramForm.append("photo", photo, "photo.jpg");
  telegramForm.append(
    "caption",
    "ব্যবহারকারীর অনুমতিতে পাঠানো ছবি"
  );

  const result = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendPhoto`,
    {
      method: "POST",
      body: telegramForm
    }
  );

  if (!result.ok) {
    return new Response("Telegram could not send the photo", {
      status: 502
    });
  }

  return Response.json({ success: true });
}
