import fetch from 'node-fetch';

const PAGE_ACCESS_TOKEN = "EAAhcezkPqUsBQgEPMNIZAh6f0GCsj1HaB2FIRBnEvqiBD0ogf1fZCTlLOwYhEW0XC7G59AHeGlVFklDB04jf5WQ7wsLFajFA7NgJ1M01lyzSv0XBFc4QIeHSdvHZBIDoiqI6pdUTwmh1ZBmMhoWFV1Tat2YQyzLZBHGKQZCMD5TVtTi1LYBWVLu8mXZBN6hgOQWXnns62uMkwZDZD";
const GEMINI_API_KEY = "AIzaSyA4J7J_mAUylbi5ps1Ijrp98hB6uIq6X-o";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (token === "MY_SECRET_BOT_2026") return res.status(200).send(challenge);
  }

  if (req.method === 'POST') {
    const body = req.body;
    if (body.object === 'page') {
      for (const entry of body.entry) {
        const messaging = entry.messaging?.[0];
        if (messaging && messaging.message && messaging.message.text) {
          const sender_psid = messaging.sender.id;
          const userText = messaging.message.text;

          // نداء ذكاء جوجل الاصطناعي
          const aiReply = await askGemini(userText);
          await sendReply(sender_psid, aiReply);
        }
      }
      return res.status(200).send('EVENT_RECEIVED');
    }
  }
  return res.status(404).end();
}

async function askGemini(prompt) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `أنت مساعد ذكي لصفحة Napoli Web. رد باختصار وذكاء وبلهجة ودودة: ${prompt}` }] }]
      })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    return "عذراً، عقلي مشغول قليلاً الآن. حاول لاحقاً!";
  }
}

async function sendReply(psid, text) {
  await fetch(`https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "recipient": { "id": psid }, "message": { "text": text } })
  });
}