'use client';

import { useState, useEffect } from 'react';
import { loadState, saveState, genId } from '@/lib/store';
import { buildBrainContext } from '@/lib/brain';
import { Competitor, TopContent, Platform } from '@/lib/types';
import {
  Plus,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  BarChart3,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setCompetitors(loadState().competitors);
  }, []);

  function persist(updated: Competitor[]) {
    setCompetitors(updated);
    const state = loadState();
    state.competitors = updated;
    saveState(state);
  }

  function handleAddCompetitor(comp: Competitor) {
    persist([...competitors, comp]);
    setShowAdd(false);
  }

  function handleDelete(id: string) {
    persist(competitors.filter((c) => c.id !== id));
  }

  async function handleAnalyze(comp: Competitor) {
    setAnalyzing(comp.id);
    setError('');

    const state = loadState();
    const brainContext = buildBrainContext(state);
    const { claudeApiKey, niche } = state.settings;

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: claudeApiKey,
          handle: comp.handle,
          platform: comp.platform,
          niche: niche || comp.niche,
          notes: comp.notes,
          topContent: comp.topContent,
          brainContext,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const updated = competitors.map((c) =>
        c.id === comp.id
          ? { ...c, analysis: data.content, lastAnalyzed: new Date().toISOString() }
          : c
      );
      persist(updated);
      setExpanded(comp.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(null);
    }
  }

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="max-w-4xl animate-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Competitors</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and analyze competitor strategies
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Competitor
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-4 bg-red-500/5 border border-red-500/20 rounded-xl mb-6">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {competitors.length === 0 && !showAdd ? (
        <div className="text-center py-16 bg-dark-800 border border-dark-500 rounded-xl">
          <BarChart3 className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400 mb-1">No competitors tracked yet</p>
          <p className="text-xs text-gray-600 mb-4">
            Add competitors to analyze their content strategies
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-accent hover:bg-accent-dark rounded-lg text-sm font-medium transition-colors"
          >
            Add Your First Competitor
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {competitors.map((comp) => (
            <div
              key={comp.id}
              className="bg-dark-800 border border-dark-500 rounded-xl overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-dark-600 flex items-center justify-center text-sm font-bold text-gray-400">
                      {comp.handle.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">@{comp.handle}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                            comp.platform === 'tiktok'
                              ? 'bg-tiktok/10 text-tiktok'
                              : comp.platform === 'x'
                                ? 'bg-xblue/10 text-xblue'
                                : 'bg-accent/10 text-accent'
                          }`}
                        >
                          {comp.platform === 'tiktok'
                            ? 'TikTok'
                            : comp.platform === 'x'
                              ? 'X'
                              : 'Both'}
                        </span>
                        {comp.niche && (
                          <span className="text-[10px] text-gray-500">{comp.niche}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAnalyze(comp)}
                      disabled={analyzing === comp.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 disabled:opacity-50 rounded-lg transition-colors"
                    >
                      {analyzing === comp.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <BarChart3 className="w-3.5 h-3.5" />
                      )}
                      {analyzing === comp.id ? 'Analyzing...' : 'Analyze'}
                    </button>
                    <button
                      onClick={() => handleDelete(comp.id)}
                      className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {comp.notes && (
                  <p className="text-xs text-gray-500 mt-3">{comp.notes}</p>
                )}

                {comp.topContent.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                      Tracked Content
                    </p>
                    {comp.topContent.slice(0, 3).map((tc, i) => (
                      <p key={i} className="text-xs text-gray-400 truncate pl-2 border-l border-dark-400">
                        {tc.description}
                        {tc.engagement && (
                          <span className="text-gray-600"> — {tc.engagement}</span>
                        )}
                      </p>
                    ))}
                    {comp.topContent.length > 3 && (
                      <p className="text-[10px] text-gray-600 pl-2">
                        +{comp.topContent.length - 3} more
                      </p>
                    )}
                  </div>
                )}
              </div>

              {comp.analysis && (
                <div className="border-t border-dark-500">
                  <button
                    onClick={() => setExpanded(expanded === comp.id ? null : comp.id)}
                    className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      Analysis
                      {comp.lastAnalyzed && (
                        <span className="text-gray-600">
                          — {new Date(comp.lastAnalyzed).toLocaleDateString()}
                        </span>
                      )}
                    </span>
                    {expanded === comp.id ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {expanded === comp.id && (
                    <div className="px-5 pb-5">
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => handleCopy(comp.id, comp.analysis!)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {copied === comp.id ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          {copied === comp.id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="prose-output text-sm whitespace-pre-wrap text-gray-300">
                        {comp.analysis}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddCompetitorModal
          onAdd={handleAddCompetitor}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}

function AddCompetitorModal({
  onAdd,
  onClose,
}: {
  onAdd: (comp: Competitor) => void;
  onClose: () => void;
}) {
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState<Platform>('tiktok');
  const [niche, setNiche] = useState('');
  const [notes, setNotes] = useState('');
  const [contentEntries, setContentEntries] = useState<TopContent[]>([
    { description: '', engagement: '', date: '' },
  ]);

  function addContentEntry() {
    setContentEntries([...contentEntries, { description: '', engagement: '', date: '' }]);
  }

  function updateContent(index: number, field: keyof TopContent, value: string) {
    const updated = [...contentEntries];
    updated[index] = { ...updated[index], [field]: value };
    setContentEntries(updated);
  }

  function removeContent(index: number) {
    setContentEntries(contentEntries.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!handle.trim()) return;

    onAdd({
      id: genId(),
      handle: handle.replace('@', ''),
      platform,
      niche,
      notes,
      topContent: contentEntries.filter((c) => c.description.trim()),
      addedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-dark-800 border border-dark-500 rounded-xl shadow-2xl animate-in">
        <div className="flex items-center justify-between p-5 border-b border-dark-500">
          <h2 className="text-sm font-semibold">Add Competitor</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Handle</label>
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@username"
                className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Platform</label>
              <div className="relative">
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 appearance-none"
                >
                  <option value="tiktok">TikTok</option>
                  <option value="x">X</option>
                  <option value="both">Both</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Their Niche</label>
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. fitness, tech reviews, cooking..."
              className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What do you know about their strategy? What makes them stand out?"
              rows={2}
              className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-400">
                Their Top Content <span className="text-gray-600">(helps analysis)</span>
              </label>
              <button
                type="button"
                onClick={addContentEntry}
                className="text-[10px] text-accent hover:text-accent-light"
              >
                + Add more
              </button>
            </div>
            <div className="space-y-2">
              {contentEntries.map((entry, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-1.5">
                    <input
                      value={entry.description}
                      onChange={(e) => updateContent(i, 'description', e.target.value)}
                      placeholder="Describe their post/video..."
                      className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-accent/50"
                    />
                    <div className="flex gap-2">
                      <input
                        value={entry.engagement || ''}
                        onChange={(e) => updateContent(i, 'engagement', e.target.value)}
                        placeholder="Engagement (e.g. 50K views)"
                        className="flex-1 bg-dark-700 border border-dark-500 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-accent/50"
                      />
                      <input
                        value={entry.date || ''}
                        onChange={(e) => updateContent(i, 'date', e.target.value)}
                        placeholder="Date"
                        className="w-28 bg-dark-700 border border-dark-500 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-accent/50"
                      />
                    </div>
                  </div>
                  {contentEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContent(i)}
                      className="p-1 text-gray-600 hover:text-red-400 mt-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-accent hover:bg-accent-dark rounded-lg transition-colors"
            >
              Add Competitor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
