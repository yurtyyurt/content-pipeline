'use client';

import { useState, useEffect } from 'react';
import { loadState, saveState, genId } from '@/lib/store';
import { Platform, ResearchResult } from '@/lib/types';
import {
  Search,
  Loader2,
  AlertCircle,
  Clock,
  Trash2,
  Plus,
  Copy,
  Check,
} from 'lucide-react';

export default function ResearchPage() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>('both');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentResult, setCurrentResult] = useState('');
  const [history, setHistory] = useState<ResearchResult[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setHistory(loadState().research);
  }, []);

  async function handleResearch() {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setCurrentResult('');

    const state = loadState();
    const { claudeApiKey, niche, targetAudience } = state.settings;

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: claudeApiKey, topic, platform, niche, targetAudience }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCurrentResult(data.content);

      const result: ResearchResult = {
        id: genId(),
        topic,
        platform,
        result: data.content,
        createdAt: new Date().toISOString(),
      };
      state.research.unshift(result);
      saveState(state);
      setHistory(state.research);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Research failed');
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(id: string) {
    const state = loadState();
    state.research = state.research.filter((r) => r.id !== id);
    saveState(state);
    setHistory(state.research);
  }

  function handleSaveIdea(idea: string) {
    const state = loadState();
    state.cards.push({
      id: genId(),
      title: idea,
      description: `From research: ${topic}`,
      platform,
      contentType: 'concept',
      priority: 'medium',
      stage: 'idea',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    saveState(state);
  }

  function handleCopy() {
    navigator.clipboard.writeText(currentResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-5xl animate-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Research</h1>
        <p className="text-sm text-gray-500 mt-1">
          Discover trends, ideas, and opportunities for your content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-dark-800 border border-dark-500 rounded-xl p-5">
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
                  placeholder="What topic do you want to research?"
                  className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent/50 placeholder:text-gray-600"
                />
              </div>
              <button
                onClick={handleResearch}
                disabled={loading || !topic.trim()}
                className="flex items-center gap-2 px-5 py-3 bg-accent hover:bg-accent-dark disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Research
              </button>
            </div>

            <div className="flex gap-2">
              {(['both', 'tiktok', 'x'] as Platform[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    platform === p
                      ? 'border-accent/50 bg-accent/10 text-accent'
                      : 'border-dark-500 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {p === 'both' ? 'All Platforms' : p === 'tiktok' ? 'TikTok' : 'X'}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {loading && (
            <div className="bg-dark-800 border border-dark-500 rounded-xl p-12 text-center">
              <div className="flex gap-1.5 justify-center mb-3">
                <div className="w-2 h-2 rounded-full bg-accent loading-dot" />
                <div className="w-2 h-2 rounded-full bg-accent loading-dot" />
                <div className="w-2 h-2 rounded-full bg-accent loading-dot" />
              </div>
              <p className="text-sm text-gray-500">
                Researching &ldquo;{topic}&rdquo;...
              </p>
              <p className="text-xs text-gray-600 mt-1">This usually takes 10-20 seconds</p>
            </div>
          )}

          {currentResult && !loading && (
            <div className="bg-dark-800 border border-dark-500 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold">Results for &ldquo;{topic}&rdquo;</h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="prose-output text-sm">
                <FormattedOutput text={currentResult} onSaveIdea={handleSaveIdea} />
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-dark-800 border border-dark-500 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              History
            </h2>
            {history.length === 0 ? (
              <p className="text-xs text-gray-600 text-center py-6">
                No research yet. Try searching a topic.
              </p>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {history.map((r) => (
                  <div
                    key={r.id}
                    className="group p-3 bg-dark-700 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors"
                    onClick={() => {
                      setCurrentResult(r.result);
                      setTopic(r.topic);
                      setPlatform(r.platform);
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{r.topic}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(r.id);
                        }}
                        className="p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <span
                      className={`inline-block mt-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded ${
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormattedOutput({
  text,
  onSaveIdea,
}: {
  text: string;
  onSaveIdea: (idea: string) => void;
}) {
  const [savedIdeas, setSavedIdeas] = useState<Set<number>>(new Set());
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-base font-semibold text-white mt-5 mb-2">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-sm font-semibold text-gray-200 mt-3 mb-1">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <p key={i} className="font-semibold text-white mt-3 mb-1">
          {line.slice(2, -2)}
        </p>
      );
    } else if (line.startsWith('- **') || line.startsWith('• **')) {
      const cleaned = line.slice(2);
      const boldEnd = cleaned.indexOf('**', 2);
      const title = boldEnd > 0 ? cleaned.slice(2, boldEnd) : cleaned;

      elements.push(
        <div key={i} className="flex items-start gap-2 py-1 pl-3 group/idea">
          <span className="text-accent mt-0.5">•</span>
          <div className="flex-1 min-w-0">
            <span className="font-medium text-white">{title}</span>
            {boldEnd > 0 && (
              <span className="text-gray-400">{cleaned.slice(boldEnd + 2)}</span>
            )}
          </div>
          <button
            onClick={() => {
              onSaveIdea(title);
              setSavedIdeas(new Set([...savedIdeas, i]));
            }}
            className={`shrink-0 p-1 rounded transition-all ${
              savedIdeas.has(i)
                ? 'text-green-400'
                : 'text-gray-600 hover:text-accent opacity-0 group-hover/idea:opacity-100'
            }`}
            title="Save to Pipeline"
          >
            {savedIdeas.has(i) ? (
              <Check className="w-3 h-3" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
          </button>
        </div>
      );
    } else if (line.startsWith('- ') || line.startsWith('• ')) {
      elements.push(
        <p key={i} className="text-gray-300 pl-3 py-0.5">
          <span className="text-accent mr-1.5">•</span>
          {line.slice(2)}
        </p>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s(.*)/);
      if (match) {
        elements.push(
          <p key={i} className="text-gray-300 pl-3 py-0.5">
            <span className="text-accent mr-1.5 font-medium">{match[1]}.</span>
            {match[2]}
          </p>
        );
      }
    } else if (line.startsWith('---')) {
      elements.push(<hr key={i} className="border-dark-500 my-3" />);
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-gray-300 leading-relaxed">
          {line}
        </p>
      );
    }
  }

  return <>{elements}</>;
}
