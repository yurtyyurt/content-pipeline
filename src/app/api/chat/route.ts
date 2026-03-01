import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { apiKey, message, context, history } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Claude API key is required. Add it in Settings.' },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey });

    const systemPrompt = `You are an elite AI content strategist and chief of staff. You have deep context about this creator (provided below). You help brainstorm content ideas, refine hooks, analyze strategy, suggest improvements, and answer any questions about their content business. Be specific, actionable, and data-driven. Reference what you know about them. Never be generic.

${context || 'No additional context available.'}`;

    // Build messages array: last 20 from history + current message
    const recentHistory: { role: 'user' | 'assistant'; content: string }[] = Array.isArray(history)
      ? history.slice(-20)
      : [];

    // If the current message isn't already the last in history, append it
    const lastMsg = recentHistory[recentHistory.length - 1];
    if (!lastMsg || lastMsg.content !== message || lastMsg.role !== 'user') {
      recentHistory.push({ role: 'user', content: message });
    }

    // Ensure messages alternate correctly and start with 'user'
    const messages: { role: 'user' | 'assistant'; content: string }[] = [];
    for (const msg of recentHistory) {
      const prev = messages[messages.length - 1];
      if (prev && prev.role === msg.role) {
        // Skip duplicate role to maintain alternation
        messages[messages.length - 1] = msg;
      } else {
        messages.push(msg);
      }
    }

    // Ensure first message is from user
    if (messages.length > 0 && messages[0].role !== 'user') {
      messages.shift();
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages,
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ content: text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Chat failed';
    const status =
      message.includes('authentication') || message.includes('API key')
        ? 401
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
