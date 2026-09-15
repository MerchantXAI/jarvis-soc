export async function onRequestPost(context) {
  const { request, env } = context;
  const { prompt } = await request.json();

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are JARVIS, an elite CISO and cybersecurity data analytics analyst.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  const data = await groqRes.json();
  const analysis = data.choices[0]?.message?.content || "Error processing request.";
  return new Response(JSON.stringify({ analysis }), { headers: { 'Content-Type': 'application/json' } });
}