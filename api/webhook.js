export default function handler(req, res) {
  // --- الجزء الأول: المصافحة مع فيسبوك (GET) ---
  if (req.method === 'GET') {
    // هذا هو الـ Verify Token الذي ستضعه في Meta Developers
    const VERIFY_TOKEN = "MY_SECRET_BOT_2026"; 

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ WEBHOOK_VERIFIED');
      return res.status(200).send(challenge);
    } else {
      console.error('❌ VERIFICATION_FAILED');
      return res.status(403).end();
    }
  }

  // --- الجزء الثاني: استقبال الرسائل (POST) ---
  if (req.method === 'POST') {
    const body = req.body;

    if (body.object === 'page') {
      body.entry.forEach(function(entry) {
        const webhook_event = entry.messaging[0];
        console.log('📩 Message Received:', webhook_event);
        
        // هنا يمكنك إضافة منطق الرد التلقائي لاحقاً
      });

      return res.status(200).send('EVENT_RECEIVED');
    } else {
      return res.status(404).end();
    }
  }
}