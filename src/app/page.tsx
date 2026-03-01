'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadState } from '@/lib/store';
import { AppState, PIPELINE_STAGES } from '@/lib/types';
import {
  Search,
  Sparkles,
  Columns3,
  FileText,
  TrendingUp,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export default function Dashboard() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  if (!state) {
    return (
      <div className="max-w-5xl animate-in">
        <div className="h-8 w-48 bg-dark-700 rounded mb-2" />
        <div className="h-4 w-64 bg-dark-800 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
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

  return (
    <div className="max-w-5xl animate-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Your content engine overview</p>
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/research"
          className="group flex items-center gap-4 p-5 bg-dark-800 border border-dark-500 rounded-xl hover:border-accent/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Search className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium group-hover:text-accent transition-colors">
              Research Trends
            </p>
            <p className="text-xs text-gray-500">Discover what&apos;s working</p>
          </div>
        </Link>
        <Link
          href="/create"
          className="group flex items-center gap-4 p-5 bg-dark-800 border border-dark-500 rounded-xl hover:border-accent/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium group-hover:text-accent transition-colors">
              Generate Content
            </p>
            <p className="text-xs text-gray-500">AI-powered scripts &amp; posts</p>
          </div>
        </Link>
        <Link
          href="/pipeline"
          className="group flex items-center gap-4 p-5 bg-dark-800 border border-dark-500 rounded-xl hover:border-accent/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Columns3 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium group-hover:text-accent transition-colors">
              View Pipeline
            </p>
            <p className="text-xs text-gray-500">Manage your content flow</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Content" value={totalCards} icon={FileText} />
        <StatCard label="TikTok" value={tiktokCount} color="#ff0050" />
        <StatCard label="X" value={xCount} color="#1d9bf0" />
        <StatCard label="Published" value={publishedCount} icon={TrendingUp} color="#22c55e" />
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-500 p-6">
        <h2 className="text-sm font-semibold mb-4">Pipeline Overview</h2>
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

      {state.research.length > 0 && (
        <div className="mt-6 bg-dark-800 rounded-xl border border-dark-500 p-6">
          <h2 className="text-sm font-semibold mb-4">Recent Research</h2>
          <div className="space-y-2">
            {state.research.slice(0, 5).map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium">{r.topic}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
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
            ))}
          </div>
        </div>
      )}
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
