'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadState, saveState, genId } from '@/lib/store';
import {
  ContentCard,
  ContentMetrics,
  PipelineStage,
  Platform,
  ContentType,
  Priority,
  PIPELINE_STAGES,
} from '@/lib/types';
import { Plus, X, GripVertical, Calendar, Trash2, Edit3, ChevronDown, BarChart3 } from 'lucide-react';

function formatCompact(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

export default function PipelinePage() {
  const [cards, setCards] = useState<ContentCard[]>([]);
  const [dragCardId, setDragCardId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<PipelineStage | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addToStage, setAddToStage] = useState<PipelineStage>('idea');
  const [editCard, setEditCard] = useState<ContentCard | null>(null);
  const [filter, setFilter] = useState<'all' | Platform>('all');

  const persist = useCallback(
    (updated: ContentCard[]) => {
      setCards(updated);
      const state = loadState();
      state.cards = updated;
      saveState(state);
    },
    []
  );

  useEffect(() => {
    setCards(loadState().cards);
  }, []);

  const filtered =
    filter === 'all'
      ? cards
      : cards.filter((c) => c.platform === filter || c.platform === 'both');

  function handleDragStart(id: string) {
    setDragCardId(id);
  }

  function handleDragOver(e: React.DragEvent, stage: PipelineStage) {
    e.preventDefault();
    setDragOverCol(stage);
  }

  function handleDrop(stage: PipelineStage) {
    if (dragCardId) {
      const updated = cards.map((c) => {
        if (c.id !== dragCardId) return c;
        const changes: Partial<ContentCard> = { stage, updatedAt: new Date().toISOString() };
        if (stage === 'published' && !c.publishedAt) {
          changes.publishedAt = new Date().toISOString().split('T')[0];
        }
        return { ...c, ...changes };
      });
      persist(updated);
    }
    setDragCardId(null);
    setDragOverCol(null);
  }

  function handleDragEnd() {
    setDragCardId(null);
    setDragOverCol(null);
  }

  function openAdd(stage: PipelineStage) {
    setAddToStage(stage);
    setShowAdd(true);
    setEditCard(null);
  }

  function handleSaveCard(card: ContentCard) {
    const exists = cards.find((c) => c.id === card.id);
    const updated = exists ? cards.map((c) => (c.id === card.id ? card : c)) : [...cards, card];
    persist(updated);
    setShowAdd(false);
    setEditCard(null);
  }

  function handleDeleteCard(id: string) {
    persist(cards.filter((c) => c.id !== id));
    setEditCard(null);
  }

  return (
    <div className="animate-in h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">{cards.length} items total</p>
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'tiktok', 'x', 'both'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === f
                  ? 'bg-accent/10 text-accent'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-dark-700'
              }`}
            >
              {f === 'all' ? 'All' : f === 'tiktok' ? 'TikTok' : f === 'x' ? 'X' : 'Both'}
            </button>
          ))}
        </div>
      </div>

      <div className="kanban-scroll flex gap-4 pb-4" style={{ minHeight: 'calc(100vh - 180px)' }}>
        {PIPELINE_STAGES.map((stage) => {
          const stageCards = filtered.filter((c) => c.stage === stage.key);
          return (
            <div
              key={stage.key}
              className={`kanban-col flex-shrink-0 w-72 bg-dark-800 rounded-xl border transition-colors ${
                dragOverCol === stage.key ? 'drag-over border-accent/30' : 'border-dark-500'
              }`}
              onDragOver={(e) => handleDragOver(e, stage.key)}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={() => handleDrop(stage.key)}
            >
              <div className="p-3 border-b border-dark-500 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="text-xs font-semibold">{stage.label}</span>
                  <span className="text-[11px] text-gray-500 bg-dark-600 px-1.5 py-0.5 rounded">
                    {stageCards.length}
                  </span>
                </div>
                <button
                  onClick={() => openAdd(stage.key)}
                  className="p-1 text-gray-500 hover:text-accent transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="p-2 space-y-2 min-h-[100px] max-h-[calc(100vh-280px)] overflow-y-auto">
                {stageCards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => handleDragStart(card.id)}
                    onDragEnd={handleDragEnd}
                    className={`group p-3 bg-dark-700 border border-dark-500 rounded-lg cursor-grab active:cursor-grabbing hover:border-dark-400 transition-all ${
                      dragCardId === card.id ? 'card-dragging' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-3 h-3 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{card.title}</p>
                        {card.description && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {card.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setEditCard(card)}
                        className="p-1 text-gray-600 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <PlatformBadge platform={card.platform} />
                      <span className="text-[10px] text-gray-500">{card.contentType}</span>
                      <PriorityDot priority={card.priority} />
                      {card.dueDate && (
                        <span className="flex items-center gap-0.5 text-[10px] text-gray-500 ml-auto">
                          <Calendar className="w-2.5 h-2.5" />
                          {new Date(card.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                    {card.stage === 'published' && card.metrics && (card.metrics.views || card.metrics.likes || card.metrics.comments) && (
                      <div className="flex items-center gap-2.5 mt-1.5 text-[10px] text-gray-400">
                        {card.metrics.views != null && <span>👁 {formatCompact(card.metrics.views)}</span>}
                        {card.metrics.likes != null && <span>❤️ {formatCompact(card.metrics.likes)}</span>}
                        {card.metrics.comments != null && <span>💬 {formatCompact(card.metrics.comments)}</span>}
                        {card.metrics.shares != null && <span>🔄 {formatCompact(card.metrics.shares)}</span>}
                        {card.metrics.saves != null && <span>🔖 {formatCompact(card.metrics.saves)}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {(showAdd || editCard) && (
        <CardModal
          card={editCard}
          stage={addToStage}
          onSave={handleSaveCard}
          onDelete={editCard ? () => handleDeleteCard(editCard.id) : undefined}
          onClose={() => {
            setShowAdd(false);
            setEditCard(null);
          }}
        />
      )}
    </div>
  );
}

function PlatformBadge({ platform }: { platform: Platform }) {
  if (platform === 'tiktok')
    return (
      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-tiktok/10 text-tiktok">
        TikTok
      </span>
    );
  if (platform === 'x')
    return (
      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-xblue/10 text-xblue">
        X
      </span>
    );
  return (
    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-accent/10 text-accent">
      Both
    </span>
  );
}

function PriorityDot({ priority }: { priority: Priority }) {
  const color =
    priority === 'high' ? 'bg-red-400' : priority === 'medium' ? 'bg-yellow-400' : 'bg-gray-500';
  return <div className={`w-1.5 h-1.5 rounded-full ${color}`} title={priority} />;
}

function CardModal({
  card,
  stage,
  onSave,
  onDelete,
  onClose,
}: {
  card: ContentCard | null;
  stage: PipelineStage;
  onSave: (card: ContentCard) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ContentCard>(
    card || {
      id: genId(),
      title: '',
      description: '',
      platform: 'tiktok',
      contentType: 'script',
      priority: 'medium',
      stage,
      notes: '',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, updatedAt: new Date().toISOString() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-dark-800 border border-dark-500 rounded-xl shadow-2xl animate-in">
        <div className="flex items-center justify-between p-5 border-b border-dark-500">
          <h2 className="text-sm font-semibold">{card ? 'Edit Card' : 'New Card'}</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Content title..."
              className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description..."
              rows={2}
              className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <SelectField
              label="Platform"
              value={form.platform}
              onChange={(v) => setForm({ ...form, platform: v as Platform })}
              options={[
                { value: 'tiktok', label: 'TikTok' },
                { value: 'x', label: 'X' },
                { value: 'both', label: 'Both' },
              ]}
            />
            <SelectField
              label="Type"
              value={form.contentType}
              onChange={(v) => setForm({ ...form, contentType: v as ContentType })}
              options={[
                { value: 'script', label: 'Script' },
                { value: 'thread', label: 'Thread' },
                { value: 'post', label: 'Post' },
                { value: 'hook', label: 'Hook' },
                { value: 'concept', label: 'Concept' },
              ]}
            />
            <SelectField
              label="Priority"
              value={form.priority}
              onChange={(v) => setForm({ ...form, priority: v as Priority })}
              options={[
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Stage</label>
              <div className="relative">
                <select
                  value={form.stage}
                  onChange={(e) => setForm({ ...form, stage: e.target.value as PipelineStage })}
                  className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 appearance-none"
                >
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Due Date</label>
              <input
                type="date"
                value={form.dueDate || ''}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Content / Notes</label>
            <textarea
              value={form.content || ''}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Drafted content, scripts, notes..."
              rows={4}
              className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 resize-none font-mono text-xs"
            />
          </div>
          {form.stage === 'published' && (
            <>
              <div className="border-t border-dark-500 pt-4 mt-2">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold text-gray-300">Performance Metrics</span>
                </div>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {(['views', 'likes', 'comments', 'shares', 'saves'] as const).map((metric) => (
                    <div key={metric}>
                      <label className="block text-[10px] font-medium text-gray-500 mb-1 capitalize">{metric}</label>
                      <input
                        type="number"
                        min={0}
                        value={form.metrics?.[metric] ?? ''}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            metrics: {
                              ...form.metrics,
                              [metric]: e.target.value === '' ? undefined : Number(e.target.value),
                            },
                          })
                        }
                        placeholder="0"
                        className="w-full bg-dark-700 border border-dark-500 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-accent/50"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Published URL</label>
                    <input
                      type="text"
                      value={form.publishedUrl || ''}
                      onChange={(e) => setForm({ ...form, publishedUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Published Date</label>
                    <input
                      type="date"
                      value={form.publishedAt || ''}
                      onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                      className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Performance Notes</label>
                  <textarea
                    value={form.performanceNotes || ''}
                    onChange={(e) => setForm({ ...form, performanceNotes: e.target.value })}
                    placeholder="What worked, what didn't, insights..."
                    rows={2}
                    className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 resize-none"
                  />
                </div>
              </div>
            </>
          )}
          <div className="flex items-center justify-between pt-2">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
            <div className="flex gap-2 ml-auto">
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
                {card ? 'Save Changes' : 'Add Card'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 appearance-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}
