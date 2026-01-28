import fetch from 'node-fetch';

const PAGE_ACCESS_TOKEN = "EAAhcezkPqUsBQgEPMNIZAh6f0GCsj1HaB2FIRBnEvqiBD0ogf1fZCTlLOwYhEW0XC7G59AHeGlVFklDB04jf5WQ7wsLFajFA7NgJ1M01lyzSv0XBFc4QIeHSdvHZBIDoiqI6pdUTwmh1ZBmMhoWFV1Tat2YQyzLZBHGKQZCMD5TVtTi1LYBWVLu8mXZBN6hgOQWXnns62uMkwZDZD";
const GEMINI_API_KEY = "AIzaSyCiLyfOOK7JwoSwW9RnGHSVAuy8UgUeOy4";

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
  // هنا نضع "كتيب التعليمات" الخاص بالبوت
  const systemInstruction = `
    أنت "ناپولي بوت" (Napoli Bot)، الذكاء الاصطناعي لشركة Napoli Web.
    
    [قواعد العمل]:
    1. إذا سألك المستخدم عن خدماتنا: نحن نصمم المواقع، التطبيقات، وندير صفحات السوشيال ميديا.
    2. إذا طلب المستخدم "لعبة عقل": قدم له لغزاً ذكياً أو تحدي منطقي واطلب منه الحل.
    3. إذا طلب "مسابقة": اسأله سؤالاً في الثقافة أو التقنية بـ 3 خيارات.
    
    [أسلوب الرد]:
    - استخدم الإيموجي المناسب (🤖, 💡, 🎮, ✨).
    - كن مرحاً وذكياً في الرد.
    - إذا لم تعرف الإجابة، قل "سأبحث في سيرفراتي وأرد عليك لاحقاً!".
    
    [سؤال المستخدم الحالي]: ${prompt}
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemInstruction }] }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }
    return "أهلاً! أنا نابولي بوت، كيف يمكنني تسليتك أو مساعدتك اليوم؟ 🤖";
  } catch (err) {
    console.error("Gemini Error:", err);
    return "يبدو أنني أفكر بعمق زائد حالياً.. جرب مراسلتي بعد لحظة! 🧠";
  }
}

async function sendReply(psid, text) {
  await fetch(`https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "recipient": { "id": psid }, "message": { "text": text } })
  });
}