export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { freeText, curseName } = req.body;
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: `あなたはスピリチュアルカウンセラーです。天秤座満月の夜に、ユーザーが人間関係の診断を受けました。ユーザーの呪いのタイプは「${curseName}」です。ユーザーが書いた本音の一言を受け取り、その人だけへの短いメッセージを日本語で書いてください。200字以内。売り込みなし。詩的で静かで深い言葉。説教や助言はしない。ただ受け取って返すだけ。`,
        messages: [{ role: 'user', content: `ユーザーの本音：「${freeText}」` }],
      }),
    });
    const data = await response.json();
    const text = data?.content?.find(b => b.type === 'text')?.text;
    res.status(200).json({ message: text || '今夜あなたが書いた言葉は、ここに届きました。' });
  } catch (e) {
    res.status(200).json({ message: '今夜あなたが書いた言葉は、ここに届きました。満月はすべてを受け取っています。' });
  }
}
