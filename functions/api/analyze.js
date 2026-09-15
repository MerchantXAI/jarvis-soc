export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const prompt = body.prompt;

    if (!env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ analysis: "Error: GROQ_API_KEY is missing from Cloudflare environment variables." }), { headers: { 'Content-Type': 'application/json' } });
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are JARVIS, an elite CISO and cybersecurity data analytics analyst.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await groqRes.json();
    const analysis = data.choices?.[0]?.message?.content || JSON.stringify(data);

    return new Response(JSON.stringify({ analysis }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ analysis: "Server error: " + err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
