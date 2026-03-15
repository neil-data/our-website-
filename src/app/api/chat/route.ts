import { NextRequest, NextResponse } from 'next/server';
import { mockTeam } from '@/data/team';
import { mockEvents } from '@/data/events';
import { mockLeaderboard } from '@/data/leaderboard';

// Build context from site data
function buildSystemContext() {
  const teamInfo = mockTeam.slice(0, 5).map(m => `${m.name} (${m.role})`).join(', ');
  const upcomingEvents = mockEvents.slice(0, 3).map(e => `${e.title} on ${e.date}`).join('; ');
  const topMembers = mockLeaderboard.slice(0, 3).map(m => `${m.name} - ${m.points} points`).join(', ');

return `You are the official GDGOC IAR Chatbot, an AI assistant strictly for the Google Developer Group on Campus at IAR.
Your sole purpose is to answer questions related to GDGOC, our events, our team, the leaderboard, and Google technologies.

Here is the current context about our college chapter:
- Key Team Members: ${teamInfo}
- Notable Upcoming Events: ${upcomingEvents}
- Top Leaderboard Members: ${topMembers}

CRITICAL RULES:
1. You must ONLY answer questions related to GDGOC, technology, programming, our college community (Institute of Advanced Research), and the provided context.
2. If a user asks something unrelated (e.g., cooking, politics, general unrelated trivia), you must politely but firmly refuse to answer and redirect them to ask about GDGOC or tech topics.
3. Be friendly, helpful, and concise. Use simple, engaging language.`;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: buildSystemContext(),
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      return NextResponse.json(
        { error: 'Failed to get response from Groq API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';

    return NextResponse.json({
      message: assistantMessage,
      usage: data.usage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
