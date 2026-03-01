'use client';

import { useState, useEffect } from 'react';
import { loadState, saveState, genId } from '@/lib/store';
import { ContentType, Platform, CONTENT_TYPES } from '@/lib/types';
import { Sparkles, Copy, Save, Check, Loader2, AlertCircle, ChevronDown } from 'lucide-react';

export default function CreatePage() {
  const [platform, setPlatform] = useState<Platform>('tiktok');
  const [contentType, setContentType] = useState<ContentType>('script');
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const availableTypes = CONTENT_TYPES.filter(
    (t) => t.platforms.includes(platform) || t.platforms.includes('both')
  );

  useEffect(() => {
    const valid = availableTypes.find((t) => t.key === contentType);
    if (!valid && availableTypes.length > 0) {
      setContentType(availableTypes[0].key);
    }
  }, [platform, availableTypes, contentType]);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setOutput('');

    const state = loadState();
    const { claudeApiKey, brandVoice, niche, targetAudience } = state.settings;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: claudeApiKey,
          platform,
          contentType,
          topic,
          context,
          brandVoice,
          niche,
          targetAudience,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOutput(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSaveToPipeline() {
    const state = loadState();
    state.cards.push({
      id: genId(),
      title: topic,
      description: `Generated ${contentType} for ${platform}`,
      platform,
      contentType,
      priority: 'medium',
      stage: 'draft',
      notes: '',
      content: output,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    saveState(state);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  }

  return (
    <div className="max-w-4xl animate-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Create Content</h1>
        <p className="text-sm text-gray-500 mt-1">
          AI-powered content generation for TikTok &amp; X
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="bg-dark-800 border border-dark-500 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4">Configure</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Platform</label>
                <div className="flex gap-2">
                  {(['tiktok', 'x', 'both'] as Platform[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                        platform === p
                          ? p === 'tiktok'
                            ? 'border-tiktok/50 bg-tiktok/10 text-tiktok'
                            : p === 'x'
                              ? 'border-xblue/50 bg-xblue/10 text-xblue'
                              : 'border-accent/50 bg-accent/10 text-accent'
                          : 'border-dark-500 bg-dark-700 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {p === 'tiktok' ? 'TikTok' : p === 'x' ? 'X' : 'Both'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Content Type
                </label>
                <div className="relative">
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as ContentType)}
                    className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent/50 appearance-none"
                  >
                    {availableTypes.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Topic <span className="text-tiktok">*</span>
                </label>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What's this content about?"
                  className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent/50 placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Additional Context{' '}
                  <span className="text-gray-600 font-normal">(optional)</span>
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Key points, target angle, references, things to include..."
                  rows={3}
                  className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent/50 resize-none placeholder:text-gray-600"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-dark disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-dark-800 border border-dark-500 rounded-xl p-5 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Output</h2>
              {output && (
                <div className="flex gap-2">
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
                  <button
                    onClick={handleSaveToPipeline}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                  >
                    {savedToast ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    {savedToast ? 'Saved!' : 'Save to Pipeline'}
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-lg mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="flex gap-1.5 justify-center mb-3">
                    <div className="w-2 h-2 rounded-full bg-accent loading-dot" />
                    <div className="w-2 h-2 rounded-full bg-accent loading-dot" />
                    <div className="w-2 h-2 rounded-full bg-accent loading-dot" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Generating your{' '}
                    {CONTENT_TYPES.find((t) => t.key === contentType)?.label || contentType}...
                  </p>
                </div>
              </div>
            )}

            {!loading && !output && !error && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-600 text-center">
                  Choose your settings and hit Generate
                  <br />
                  <span className="text-xs">AI will create platform-optimized content</span>
                </p>
              </div>
            )}

            {output && (
              <div className="flex-1 overflow-y-auto">
                <div className="prose-output text-sm whitespace-pre-wrap">{formatOutput(output)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatOutput(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-base font-semibold text-white mt-4 mb-2">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <p key={i} className="font-semibold text-white mt-3 mb-1">
          {line.slice(2, -2)}
        </p>
      );
    } else if (line.startsWith('**')) {
      const boldEnd = line.indexOf('**', 2);
      if (boldEnd > 0) {
        elements.push(
          <p key={i} className="mt-1">
            <strong className="text-white">{line.slice(2, boldEnd)}</strong>
            {line.slice(boldEnd + 2)}
          </p>
        );
      } else {
        elements.push(<p key={i}>{line}</p>);
      }
    } else if (line.startsWith('---')) {
      elements.push(<hr key={i} className="border-dark-500 my-3" />);
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
