'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadState, saveState, genId } from '@/lib/store';
import {
  AppState,
  PIPELINE_STAGES,
  BRAIN_CATEGORIES,
  ContentCard,
} from '@/lib/types';
import { buildBrainContext } from '@/lib/brain';
import {
  Search,
  Sparkles,
  Columns3,
  FileText,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Brain,
  MessageSquare,
  Loader2,
  Plus,
  Check,
  Zap,
  BarChart3,
} from 'lucide-react';

interface ParsedSuggestion {
  title: string;
  platform: string;
  contentType: string;
  why: string;
  hook: string;
  priority: string;
}

function parseSuggestions(markdown: string): ParsedSuggestion[] {
  const suggestions: ParsedSuggestion[] = [];
  // Split by numbered items (1. 2. 3. etc)
  const blocks = markdown.split(/\n(?=\d+\.\s)/);

  for (const block of blocks) {
    if (!block.trim()) continue;
    const titleMatch = block.match(/\*\*Title\*\*[:\s—–-]*(.+)/i);
    const platformMatch = block.match(/\*\*Platform\*\*[:\s—–-]*(.+)/i);
    const typeMatch = block.match(/\*\*Content Type\*\*[:\s—–-]*(.+)/i);
    const whyMatch = block.match(/\*\*Why This Will Work\*\*[:\s—–-]*(.+)/i);
    const hookMatch = block.match(/\*\*Hook\*\*[:\s—–-]*(.+)/i);
    const priorityMatch = block.match(/\*\*Priority\*\*[:\s—–-]*(.+)/i);

    if (titleMatch) {
      suggestions.push({
        title: titleMatch[1].trim().replace(/\*+/g, ''),
        platform: (platformMatch?.[1] || 'tiktok').trim().toLowerCase().replace(/\*+/g, ''),
        contentType: (typeMatch?.[1] || 'concept').trim().toLowerCase().replace(/\*+/g, ''),
        why: (whyMatch?.[1] || '').trim().replace(/\*+/g, ''),
        hook: (hookMatch?.[1] || '').trim().replace(/^\"|\"$/g, '').replace(/\*+/g, ''),
        priority: (priorityMatch?.[1] || 'medium').trim().toLowerCase().replace(/\*+/g, ''),
      });
    }
  }

  return suggestions.slice(0, 5);
}

function getEngagementScore(metrics: ContentCard['metrics']): number {
  if (!metrics) return 0;
  return (
    (metrics.views || 0) +
    (metrics.likes || 0) * 10 +
    (metrics.comments || 0) * 20 +
    (metrics.shares || 0) * 30 +
    (metrics.saves || 0) * 15
  );
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function Dashboard() {
  const [state, setState] = useState<AppState | null>(null);
  const [suggestions, setSuggestions] = useState<ParsedSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestError, setSuggestError] = useState('');
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    setState(loadState());
  }, []);

  if (!state) {
    return (
      <div className="max-w-6xl animate-in">
        <div className="h-8 w-48 bg-dark-700 rounded mb-2" />
        <div className="h-4 w-64 bg-dark-800 rounded mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-dark-800 rounded-xl border border-dark-500" />
          ))}
        </div>
      </div>
    );
  }

  const totalCards = state.cards.length;
  const byStage = PIPELINE_STAGES.map((s) => ({
    ...s,
    count: state.cards.filter((c) => c.stage === s.key).length,
  }));
  const tiktokCount = state.cards.filter(
    (c) => c.platform === 'tiktok' || c.platform === 'both'
  ).length;
  const xCount = state.cards.filter(
    (c) => c.platform === 'x' || c.platform === 'both'
  ).length;
  const publishedCount = byStage.find((s) => s.key === 'published')?.count || 0;
  const hasApiKey = !!state.settings.claudeApiKey;

  // Top performers: published cards with metrics, sorted by engagement
  const publishedWithMetrics = state.cards.filter(
    (c) => c.stage === 'published' && c.metrics
  );
  const topPerformers = [...publishedWithMetrics]
    .sort((a, b) => getEngagementScore(b.metrics) - getEngagementScore(a.metrics))
    .slice(0, 3);

  // Brain snapshot
  const brainCounts = BRAIN_CATEGORIES.map((cat) => ({
    ...cat,
    count: state.brain.filter((e) => e.category === cat.key).length,
  }));
  const totalBrainEntries = state.brain.length;

  async function handleGenerateSuggestions() {
    if (!state) return;
    setLoadingSuggestions(true);
    setSuggestError('');
    setSuggestions([]);
    setAddedIds(new Set());

    try {
      const brainContext = buildBrainContext(state);
      const topContent = publishedWithMetrics.map((c) => ({
        title: c.title,
        platform: c.platform,
        contentType: c.contentType,
        metrics: c.metrics,
      }));
      const stageCounts: Record<string, number> = {};
      state.cards.forEach((c) => {
        stageCounts[c.stage] = (stageCounts[c.stage] || 0) + 1;
      });

      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: state.settings.claudeApiKey,
          brainContext,
          topContent,
          competitors: state.competitors,
          currentPipeline: stageCounts,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSuggestError(data.error || 'Failed to generate suggestions');
        return;
      }

      const parsed = parseSuggestions(data.content);
      setSuggestions(parsed);
    } catch (err) {
      setSuggestError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoadingSuggestions(false);
    }
  }

  function handleAddToPipeline(suggestion: ParsedSuggestion, index: number) {
    if (!state) return;

    const platformMap: Record<string, 'tiktok' | 'x' | 'both'> = {
      tiktok: 'tiktok',
      x: 'x',
      twitter: 'x',
      both: 'both',
    };
    const typeMap: Record<string, 'script' | 'thread' | 'post' | 'hook' | 'concept'> = {
      script: 'script',
      thread: 'thread',
      post: 'post',
      hook: 'hook',
      concept: 'concept',
    };
    const priorityMap: Record<string, 'high' | 'medium' | 'low'> = {
      high: 'high',
      medium: 'medium',
      low: 'low',
    };

    const newCard: ContentCard = {
      id: genId(),
      title: suggestion.title,
      description: suggestion.why,
      platform: platformMap[suggestion.platform] || 'tiktok',
      contentType: typeMap[suggestion.contentType] || 'concept',
      priority: priorityMap[suggestion.priority] || 'medium',
      stage: 'idea',
      notes: `Hook: ${suggestion.hook}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = { ...state, cards: [...state.cards, newCard] };
    saveState(updated);
    setState(updated);
    setAddedIds((prev) => new Set([...prev, index]));
  }

  const quickActions = [
    { href: '/research', label: 'Research', icon: Search, color: 'text-purple-400' },
    { href: '/create', label: 'Create', icon: Sparkles, color: 'text-amber-400' },
    { href: '/pipeline', label: 'Pipeline', icon: Columns3, color: 'text-blue-400' },
    { href: '/chat', label: 'Chat', icon: MessageSquare, color: 'text-green-400' },
    { href: '/brain', label: 'Brain', icon: Brain, color: 'text-pink-400' },
  ];

  return (
    <div className="max-w-6xl animate-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your AI-powered content operations dashboard
        </p>
      </div>

      {/* API Key Warning */}
      {!hasApiKey && (
        <Link
          href="/settings"
          className="flex items-center gap-3 p-4 mb-6 bg-accent/5 border border-accent/20 rounded-xl hover:bg-accent/10 transition-colors"
        >
          <AlertCircle className="w-5 h-5 text-accent shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">Add your Claude API key to unlock AI features</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Research, content generation, and competitor analysis require an API key
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-accent" />
        </Link>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Content" value={totalCards} icon={FileText} />
        <StatCard label="TikTok" value={tiktokCount} color="#ff0050" />
        <StatCard label="X" value={xCount} color="#1d9bf0" />
        <StatCard label="Published" value={publishedCount} icon={TrendingUp} color="#22c55e" />
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* What's Working */}
          <div className="bg-dark-800 border border-dark-500 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <h2 className="text-sm font-semibold">What&apos;s Working</h2>
            </div>

            {topPerformers.length > 0 ? (
              <div className="space-y-3">
                {topPerformers.map((card) => {
                  const m = card.metrics!;
                  return (
                    <div
                      key={card.id}
                      className="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{card.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                              card.platform === 'tiktok'
                                ? 'bg-tiktok/10 text-tiktok'
                                : card.platform === 'x'
                                  ? 'bg-xblue/10 text-xblue'
                                  : 'bg-accent/10 text-accent'
                            }`}
                          >
                            {card.platform === 'both'
                              ? 'All'
                              : card.platform === 'x'
                                ? 'X'
                                : 'TikTok'}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            {card.contentType}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 shrink-0 ml-4">
                        {m.views != null && (
                          <span>{formatNum(m.views)} views</span>
                        )}
                        {m.likes != null && (
                          <span>{formatNum(m.likes)} likes</span>
                        )}
                        {m.comments != null && (
                          <span>{formatNum(m.comments)} comments</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  Publish content and log metrics to see what&apos;s working
                </p>
              </div>
            )}
          </div>

          {/* Smart Suggestions */}
          <div className="bg-dark-800 border border-dark-500 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-semibold">Smart Suggestions</h2>
              </div>
              <p className="text-[11px] text-gray-600">Powered by your Brain context</p>
            </div>

            {suggestions.length === 0 && !loadingSuggestions && !suggestError && (
              <div className="text-center py-6">
                <button
                  onClick={handleGenerateSuggestions}
                  disabled={!hasApiKey}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Fresh Ideas
                </button>
                {!hasApiKey && (
                  <p className="text-[11px] text-gray-600 mt-2">
                    Add your API key in Settings first
                  </p>
                )}
              </div>
            )}

            {loadingSuggestions && (
              <div className="flex items-center justify-center py-10 gap-3">
                <Loader2 className="w-5 h-5 text-accent animate-spin" />
                <span className="text-sm text-gray-400">
                  Analyzing your brain context and generating ideas...
                </span>
              </div>
            )}

            {suggestError && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-400">{suggestError}</p>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="space-y-3">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="p-4 bg-dark-700 rounded-lg border border-dark-500 hover:border-dark-400 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{s.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                              s.platform.includes('x') || s.platform.includes('twitter')
                                ? 'bg-xblue/10 text-xblue'
                                : 'bg-tiktok/10 text-tiktok'
                            }`}
                          >
                            {s.platform.includes('x') || s.platform.includes('twitter')
                              ? 'X'
                              : 'TikTok'}
                          </span>
                          <span className="text-[11px] text-gray-500">{s.contentType}</span>
                          <span
                            className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                              s.priority === 'high'
                                ? 'bg-red-500/10 text-red-400'
                                : s.priority === 'low'
                                  ? 'bg-gray-500/10 text-gray-400'
                                  : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {s.priority}
                          </span>
                        </div>
                        {s.hook && (
                          <p className="text-xs text-gray-400 mt-2 italic">
                            &ldquo;{s.hook}&rdquo;
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToPipeline(s, i)}
                        disabled={addedIds.has(i)}
                        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          addedIds.has(i)
                            ? 'bg-green-500/10 text-green-400 cursor-default'
                            : 'bg-accent/10 text-accent hover:bg-accent/20'
                        }`}
                      >
                        {addedIds.has(i) ? (
                          <>
                            <Check className="w-3 h-3" />
                            Added
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            Add to Pipeline
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="pt-2 text-center">
                  <button
                    onClick={handleGenerateSuggestions}
                    className="text-xs text-gray-500 hover:text-accent transition-colors"
                  >
                    Regenerate suggestions
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pipeline Overview */}
          <div className="bg-dark-800 rounded-xl border border-dark-500 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold">Pipeline Overview</h2>
            </div>
            <div className="space-y-3">
              {byStage.map((stage) => (
                <div key={stage.key} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-20 shrink-0">{stage.label}</span>
                  <div className="flex-1 h-2 bg-dark-600 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${totalCards > 0 ? (stage.count / totalCards) * 100 : 0}%`,
                        backgroundColor: stage.color,
                        minWidth: stage.count > 0 ? '8px' : '0',
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-300 w-6 text-right">
                    {stage.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — 1/3 */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-dark-800 border border-dark-500 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-3">Quick Actions</h2>
            <div className="space-y-1">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-400 hover:text-white hover:bg-dark-700 transition-colors group"
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span className="flex-1">{action.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Research */}
          {state.research.length > 0 && (
            <div className="bg-dark-800 border border-dark-500 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold">Recent Research</h2>
                <Link
                  href="/research"
                  className="text-[11px] text-accent hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-2">
                {state.research.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="p-3 bg-dark-700 rounded-lg"
                  >
                    <p className="text-sm font-medium truncate">{r.topic}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[11px] text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                          r.platform === 'tiktok'
                            ? 'bg-tiktok/10 text-tiktok'
                            : r.platform === 'x'
                              ? 'bg-xblue/10 text-xblue'
                              : 'bg-accent/10 text-accent'
                        }`}
                      >
                        {r.platform === 'both' ? 'All' : r.platform === 'x' ? 'X' : 'TikTok'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Brain Snapshot */}
          <div className="bg-dark-800 border border-dark-500 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-pink-400" />
                <h2 className="text-sm font-semibold">Brain Snapshot</h2>
              </div>
              <Link
                href="/brain"
                className="text-[11px] text-accent hover:underline"
              >
                Open Brain
              </Link>
            </div>

            {totalBrainEntries === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">
                No entries yet. Add context to your Brain to power smarter AI.
              </p>
            ) : (
              <div className="space-y-2">
                {brainCounts.map((cat) => (
                  <div
                    key={cat.key}
                    className="flex items-center justify-between px-3 py-2 bg-dark-700 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{cat.icon}</span>
                      <span className="text-xs text-gray-300">{cat.label}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-400">
                      {cat.count} {cat.count === 1 ? 'entry' : 'entries'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
}) {
  return (
    <div className="p-4 bg-dark-800 border border-dark-500 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        {!Icon && color && (
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        )}
      </div>
      <p className="text-2xl font-bold" style={color ? { color } : undefined}>
        {value}
      </p>
    </div>
  );
}
