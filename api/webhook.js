const PAGE_ACCESS_TOKEN = "EAAhcezkPqUsBQgEPMNIZAh6f0GCsj1HaB2FIRBnEvqiBD0ogf1fZCTlLOwYhEW0XC7G59AHeGlVFklDB04jf5WQ7wsLFajFA7NgJ1M01lyzSv0XBFc4QIeHSdvHZBIDoiqI6pdUTwmh1ZBmMhoWFV1Tat2YQyzLZBHGKQZCMD5TVtTi1LYBWVLu8mXZBN6hgOQWXnns62uMkwZDZD";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === "MY_SECRET_BOT_2026") {
      return res.status(200).send(challenge);
    }
  }

  if (req.method === 'POST') {
    const body = req.body;
    if (body.object === 'page') {
      body.entry.forEach(entry => {
        // فحص ما إذا كان هناك رسالة فعلية أم مجرد إشعار تقني
        if (entry.messaging && entry.messaging[0] && entry.messaging[0].message) {
          const webhook_event = entry.messaging[0];
          const sender_psid = webhook_event.sender.id;
          const messageText = webhook_event.message.text;

          if (messageText) {
             sendReply(sender_psid, `تم الاستلام بنجاح: ${messageText}`);
          }
        }
      });
      return res.status(200).send('EVENT_RECEIVED');
    }
  }
  return res.status(404).end();
}

async function sendReply(psid, text) {
  const response = { "recipient": { "id": psid }, "message": { "text": text } };
  try {
    const res = await fetch(`https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response)
    });
    const result = await res.json();
    console.log("Facebook Response:", result);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}