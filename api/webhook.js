import fetch from 'node-fetch';

const PAGE_ACCESS_TOKEN = "EAAhcezkPqUsBQgEPMNIZAh6f0GCsj1HaB2FIRBnEvqiBD0ogf1fZCTlLOwYhEW0XC7G59AHeGlVFklDB04jf5WQ7wsLFajFA7NgJ1M01lyzSv0XBFc4QIeHSdvHZBIDoiqI6pdUTwmh1ZBmMhoWFV1Tat2YQyzLZBHGKQZCMD5TVtTi1LYBWVLu8mXZBN6hgOQWXnns62uMkwZDZD"; // تأكد من الرمز!

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (token === "MY_SECRET_BOT_2026") return res.status(200).send(challenge);
  }

  if (req.method === 'POST') {
    console.log("📥 وصل إشعار من فيسبوك:", JSON.stringify(req.body)); // سطر كاشف

    const entry = req.body.entry?.[0];
    const messaging = entry?.messaging?.[0];

    if (messaging && messaging.message) {
      const sender_psid = messaging.sender.id;
      const text = messaging.message.text;
      
      console.log(`👤 المرسل: ${sender_psid} | 📝 النص: ${text}`);
      
      await sendReply(sender_psid, `رد تلقائي: استلمت "${text}"`);
    } else {
      console.log("⚠️ الإشعار لا يحتوي على رسالة نصية (ربما إشعار قراءة أو تسليم).");
    }

    return res.status(200).send('EVENT_RECEIVED');
  }
  return res.status(404).end();
}

async function sendReply(psid, text) {
  console.log("📤 محاولة إرسال الرد...");
  const response = { "recipient": { "id": psid }, "message": { "text": text } };
  
  const res = await fetch(`https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response)
  });
  
  const result = await res.json();
  console.log("📢 نتيجة فيسبوك النهائية:", JSON.stringify(result)); 
}