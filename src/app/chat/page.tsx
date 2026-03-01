'use client';

import { useState, useEffect, useRef } from 'react';
import { loadState, saveState, genId } from '@/lib/store';
import { ChatMessage } from '@/lib/types';
import {
  Send,
  Trash2,
  Loader2,
  MessageSquare,
  Bot,
  User,
} from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages(loadState().chat);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setError('');

    const state = loadState();
    const { claudeApiKey } = state.settings;

    if (!claudeApiKey) {
      setError('Claude API key is required. Add it in Settings.');
      return;
    }

    const userMsg: ChatMessage = {
      id: genId(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // Save user message immediately
    state.chat = updatedMessages;
    saveState(state);

    setLoading(true);

    try {
      // Build context string from full app state
      const context = buildContextString(state);

      // Build history array for the API
      const history = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: claudeApiKey,
          message: text,
          context,
          history,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const assistantMsg: ChatMessage = {
        id: genId(),
        role: 'assistant',
        content: data.content,
        createdAt: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);

      // Save with assistant response
      const freshState = loadState();
      freshState.chat = finalMessages;
      saveState(freshState);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleClear() {
    setMessages([]);
    setError('');
    const state = loadState();
    state.chat = [];
    saveState(state);
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="max-w-4xl animate-in flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chat</h1>
          <p className="text-sm text-gray-500 mt-1">
            Your AI content strategist &mdash; ask anything about your content strategy
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-red-400 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear chat
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-3 p-3 bg-red-500/5 border border-red-500/20 rounded-xl shrink-0">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-0"
      >
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">
              Start a conversation
            </h3>
            <p className="text-xs text-gray-600 max-w-sm">
              Ask about content ideas, strategy, hooks, trends, or anything
              related to your content business. I have full context on your
              pipeline, brain, and research.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-accent/10 border border-accent/20 rounded-xl rounded-br-sm'
                  : 'bg-dark-800 border border-dark-500 rounded-xl rounded-bl-sm'
              } px-4 py-3`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {msg.role === 'assistant' ? (
                  <Bot className="w-3.5 h-3.5 text-accent" />
                ) : (
                  <User className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span className="text-[10px] text-gray-500">
                  {msg.role === 'assistant' ? 'AI Strategist' : 'You'} &middot;{' '}
                  {formatTime(msg.createdAt)}
                </span>
              </div>
              {msg.role === 'assistant' ? (
                <div className="prose-output text-sm">
                  <FormattedOutput text={msg.content} />
                </div>
              ) : (
                <p className="text-sm text-gray-200 whitespace-pre-wrap">
                  {msg.content}
                </p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-dark-800 border border-dark-500 rounded-xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Bot className="w-3.5 h-3.5 text-accent" />
                <span className="text-[10px] text-gray-500">AI Strategist</span>
              </div>
              <div className="flex gap-1.5 py-1">
                <div className="w-2 h-2 rounded-full bg-accent loading-dot" />
                <div className="w-2 h-2 rounded-full bg-accent loading-dot" />
                <div className="w-2 h-2 rounded-full bg-accent loading-dot" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="mt-4 shrink-0">
        <div className="bg-dark-800 border border-dark-500 rounded-xl p-3 flex gap-3 items-center">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about your content strategy..."
            disabled={loading}
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-600 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function buildContextString(state: ReturnType<typeof loadState>): string {
  const parts: string[] = [];

  // Settings context
  if (state.settings.niche) parts.push(`Creator niche: ${state.settings.niche}`);
  if (state.settings.brandVoice) parts.push(`Brand voice: ${state.settings.brandVoice}`);
  if (state.settings.targetAudience) parts.push(`Target audience: ${state.settings.targetAudience}`);

  // Brain entries
  if (state.brain.length > 0) {
    parts.push('\n--- BRAIN (Creator Knowledge Base) ---');
    state.brain.forEach((entry) => {
      parts.push(`[${entry.category}] ${entry.title}: ${entry.content}`);
    });
  }

  // Pipeline summary
  if (state.cards.length > 0) {
    parts.push('\n--- CONTENT PIPELINE ---');
    const stageCounts: Record<string, number> = {};
    state.cards.forEach((card) => {
      stageCounts[card.stage] = (stageCounts[card.stage] || 0) + 1;
    });
    parts.push(`Pipeline overview: ${Object.entries(stageCounts).map(([s, c]) => `${s}: ${c}`).join(', ')}`);
    const recent = state.cards.slice(0, 10);
    recent.forEach((card) => {
      parts.push(`- [${card.stage}] ${card.title} (${card.platform}, ${card.contentType})`);
    });
  }

  // Competitors
  if (state.competitors.length > 0) {
    parts.push('\n--- COMPETITORS ---');
    state.competitors.forEach((c) => {
      parts.push(`- @${c.handle} (${c.platform}, ${c.niche})${c.analysis ? ': ' + c.analysis.slice(0, 200) : ''}`);
    });
  }

  // Recent research
  if (state.research.length > 0) {
    parts.push('\n--- RECENT RESEARCH ---');
    state.research.slice(0, 5).forEach((r) => {
      parts.push(`- "${r.topic}" (${r.platform}): ${r.result.slice(0, 300)}...`);
    });
  }

  return parts.join('\n');
}

function FormattedOutput({ text }: { text: string }) {
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
        <div key={i} className="flex items-start gap-2 py-1 pl-3">
          <span className="text-accent mt-0.5">•</span>
          <div className="flex-1 min-w-0">
            <span className="font-medium text-white">{title}</span>
            {boldEnd > 0 && (
              <span className="text-gray-400">{cleaned.slice(boldEnd + 2)}</span>
            )}
          </div>
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
