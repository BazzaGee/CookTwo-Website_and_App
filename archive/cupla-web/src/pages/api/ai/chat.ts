export const prerender = false;

export async function POST({ request }: { request: Request }) {
  try {
    const { messages, context } = await request.json();
    
    const OPENROUTER_API_KEY = import.meta.env.OPENROUTER_API_KEY;
    
    if (!OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: 'OpenRouter API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: `You are CookTwo AI, a helpful relationship assistant for couples. You help plan dates, organize tasks, and find free time in schedules.
            
When helping with dates:
- Suggest specific, actionable date ideas
- Consider the couple's schedule and preferences
- Be encouraging and positive

When organizing tasks:
- Parse natural language into structured todo items
- Categorize items appropriately
- Suggest due dates when mentioned

Current context: ${JSON.stringify(context)}`,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
