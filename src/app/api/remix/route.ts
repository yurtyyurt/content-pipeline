import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const {
      apiKey,
      brainContext,
      originalContent,
      originalPlatform,
      originalType,
      targetPlatform,
      targetType,
    } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'Claude API key is required. Add it in Settings.' }, { status: 400 });
    }

    if (!originalContent) {
      return NextResponse.json({ error: 'Original content is required for remixing.' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey });

    const formatPlatform = (p: string) =>
      p === 'x' ? 'X/Twitter' : p === 'tiktok' ? 'TikTok' : p || 'Unknown';

    const systemPrompt = `You are an expert at repurposing content across platforms. You understand the nuances of TikTok vs X/Twitter — what hooks work, what formats perform, how to adapt tone and length. You have context about this creator's brand and audience.

${brainContext || ''}`;

    const userPrompt = `Take the following content and remix it for a new platform and format.

**Original Platform:** ${formatPlatform(originalPlatform)}
**Original Format:** ${originalType || 'general'}
**Original Content:**
${originalContent}

---

**Target Platform:** ${formatPlatform(targetPlatform)}
**Target Format:** ${targetType || 'general'}

Remix this content for the target platform and format. Requirements:
- Maintain the core insight, value, or message from the original
- Optimize for the target platform's algorithm, format constraints, and audience behavior
- Adapt the tone, length, and structure to feel native to the target platform
- Write a new hook that works specifically for the target platform
- Include any platform-specific elements (hashtags for TikTok, thread structure for X, etc.)

Provide the complete remixed content ready to publish, followed by:

**ADAPTATION NOTES:**
- What was changed and why
- Key differences in approach between the platforms
- Any additional tips for maximizing performance on the target platform`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ content: text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Content remix failed';
    const status = message.includes('authentication') || message.includes('API key') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
