export default function handler(req, res) {

  // --- الجزء الأول: للتحقق (المصافحة) ---
  // يعمل فقط عندما تضغط "Verify" في صفحة Meta
  if (req.method === 'GET') {
    const VERIFY_TOKEN = "MY_SECRET_BOT_2026"; 
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Wrong Token');
  }

  // --- الجزء الثاني: لاستلام الرسائل ---
  // يعمل عندما يقوم شخص ما بإرسال رسالة لصفحتك
  if (req.method === 'POST') {
    console.log("وصلت رسالة جديدة:", req.body);
    // هنا سنضع كود الرد التلقائي لاحقاً
    return res.status(200).send('EVENT_RECEIVED');
  }

}