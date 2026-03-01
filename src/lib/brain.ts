import { AppState, BrainEntry, ContentCard } from './types';

/**
 * Builds a rich context string from the brain + performance data
 * to inject into every AI prompt. This is what makes the AI "know" you.
 */
export function buildBrainContext(state: AppState): string {
  const sections: string[] = [];

  // 1. Brain entries grouped by category
  const grouped = groupBrainEntries(state.brain);

  if (grouped.identity.length > 0) {
    sections.push(`## WHO YOU ARE\n${grouped.identity.map(e => `- ${e.title}: ${e.content}`).join('\n')}`);
  }

  if (grouped.content_dna.length > 0) {
    sections.push(`## CONTENT DNA\n${grouped.content_dna.map(e => `- ${e.title}: ${e.content}`).join('\n')}`);
  }

  if (grouped.audience.length > 0) {
    sections.push(`## AUDIENCE INSIGHTS\n${grouped.audience.map(e => `- ${e.title}: ${e.content}`).join('\n')}`);
  }

  if (grouped.lessons.length > 0) {
    sections.push(`## LESSONS LEARNED\n${grouped.lessons.map(e => `- ${e.title}: ${e.content}`).join('\n')}`);
  }

  if (grouped.goals.length > 0) {
    sections.push(`## CURRENT GOALS\n${grouped.goals.map(e => `- ${e.title}: ${e.content}`).join('\n')}`);
  }

  // 2. Settings context
  const { niche, targetAudience, brandVoice } = state.settings;
  if (niche || targetAudience || brandVoice) {
    const profile = [
      niche && `Niche: ${niche}`,
      targetAudience && `Target Audience: ${targetAudience}`,
      brandVoice && `Brand Voice: ${brandVoice}`,
    ].filter(Boolean).join('\n');
    sections.push(`## CREATOR PROFILE\n${profile}`);
  }

  // 3. Performance data from published cards
  const published = state.cards.filter(c => c.stage === 'published' && c.metrics);
  if (published.length > 0) {
    const topPerformers = getTopPerformers(published, 5);
    if (topPerformers.length > 0) {
      sections.push(`## TOP PERFORMING CONTENT\n${topPerformers.map(c => {
        const m = c.metrics!;
        const stats = [
          m.views && `${formatNum(m.views)} views`,
          m.likes && `${formatNum(m.likes)} likes`,
          m.comments && `${formatNum(m.comments)} comments`,
          m.shares && `${formatNum(m.shares)} shares`,
        ].filter(Boolean).join(', ');
        return `- "${c.title}" (${c.platform}, ${c.contentType}) — ${stats}`;
      }).join('\n')}`);
    }
  }

  // 4. Pipeline summary
  const pipeline = state.cards;
  if (pipeline.length > 0) {
    const byStage: Record<string, number> = {};
    pipeline.forEach(c => { byStage[c.stage] = (byStage[c.stage] || 0) + 1; });
    sections.push(`## CURRENT PIPELINE\n${Object.entries(byStage).map(([s, n]) => `- ${s}: ${n} items`).join('\n')}`);
  }

  // 5. Competitor landscape
  if (state.competitors.length > 0) {
    sections.push(`## COMPETITOR LANDSCAPE\n${state.competitors.map(c =>
      `- ${c.handle} (${c.platform}): ${c.niche}`
    ).join('\n')}`);
  }

  if (sections.length === 0) return '';

  return `--- BRAIN CONTEXT (What you know about this creator) ---\n\n${sections.join('\n\n')}\n\n--- END BRAIN CONTEXT ---`;
}

/**
 * Builds a shorter context for quick operations (suggestions, chat)
 */
export function buildQuickContext(state: AppState): string {
  const parts: string[] = [];
  const { niche, brandVoice, targetAudience } = state.settings;

  if (niche) parts.push(`Niche: ${niche}`);
  if (targetAudience) parts.push(`Audience: ${targetAudience}`);
  if (brandVoice) parts.push(`Voice: ${brandVoice}`);

  const identity = state.brain.filter(e => e.category === 'identity');
  if (identity.length > 0) {
    parts.push(`Background: ${identity.map(e => e.content).join('. ')}`);
  }

  const goals = state.brain.filter(e => e.category === 'goals');
  if (goals.length > 0) {
    parts.push(`Goals: ${goals.map(e => e.content).join('. ')}`);
  }

  return parts.join('\n');
}

function groupBrainEntries(entries: BrainEntry[]) {
  return {
    identity: entries.filter(e => e.category === 'identity'),
    content_dna: entries.filter(e => e.category === 'content_dna'),
    audience: entries.filter(e => e.category === 'audience'),
    lessons: entries.filter(e => e.category === 'lessons'),
    goals: entries.filter(e => e.category === 'goals'),
  };
}

function getTopPerformers(cards: ContentCard[], limit: number): ContentCard[] {
  return cards
    .filter(c => c.metrics)
    .sort((a, b) => {
      const scoreA = getEngagementScore(a.metrics!);
      const scoreB = getEngagementScore(b.metrics!);
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

function getEngagementScore(m: NonNullable<ContentCard['metrics']>): number {
  return (m.views || 0) + (m.likes || 0) * 10 + (m.comments || 0) * 20 + (m.shares || 0) * 30 + (m.saves || 0) * 15;
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
