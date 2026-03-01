'use client';

import { useState, useEffect } from 'react';
import { loadState, saveState, genId } from '@/lib/store';
import { BrainEntry, BrainCategory, BRAIN_CATEGORIES } from '@/lib/types';
import {
  Brain,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export default function BrainPage() {
  const [entries, setEntries] = useState<BrainEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BrainCategory>('identity');
  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [aiSummaryOpen, setAiSummaryOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setEntries(loadState().brain);
  }, []);

  const filteredEntries = entries.filter((e) => e.category === selectedCategory);

  function getCategoryCount(key: BrainCategory) {
    return entries.filter((e) => e.category === key).length;
  }

  function handleAdd() {
    if (!newTitle.trim() || !newContent.trim()) return;
    const now = new Date().toISOString();
    const entry: BrainEntry = {
      id: genId(),
      category: selectedCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      createdAt: now,
      updatedAt: now,
    };
    const state = loadState();
    state.brain.unshift(entry);
    saveState(state);
    setEntries(state.brain);
    setNewTitle('');
    setNewContent('');
    setAddingNew(false);
  }

  function handleDelete(id: string) {
    const state = loadState();
    state.brain = state.brain.filter((e) => e.id !== id);
    saveState(state);
    setEntries(state.brain);
  }

  function handleEditStart(entry: BrainEntry) {
    setEditingId(entry.id);
    setEditTitle(entry.title);
    setEditContent(entry.content);
  }

  function handleEditSave() {
    if (!editingId || !editTitle.trim() || !editContent.trim()) return;
    const state = loadState();
    const idx = state.brain.findIndex((e) => e.id === editingId);
    if (idx !== -1) {
      state.brain[idx] = {
        ...state.brain[idx],
        title: editTitle.trim(),
        content: editContent.trim(),
        updatedAt: new Date().toISOString(),
      };
      saveState(state);
      setEntries(state.brain);
    }
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  }

  function handleEditCancel() {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  }

  function handleAiSummary() {
    setAiSummaryOpen(true);
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
    }, 1500);
  }

  return (
    <div className="max-w-5xl animate-in">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <Brain className="w-6 h-6 text-accent" />
            Brain
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your AI&apos;s persistent memory &mdash; everything it knows about you
          </p>
        </div>
        <button
          onClick={handleAiSummary}
          className="flex items-center gap-2 px-4 py-2.5 bg-dark-800 border border-dark-500 hover:border-accent/50 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          <Sparkles className="w-4 h-4 text-accent" />
          AI Summary
        </button>
      </div>

      {/* AI Summary panel */}
      {aiSummaryOpen && (
        <div className="mb-6 bg-dark-800 border border-dark-500 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              AI Brain Summary
            </h2>
            <button
              onClick={() => setAiSummaryOpen(false)}
              className="p-1 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {aiLoading ? (
            <div className="flex items-center gap-2 py-4 justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              <span className="text-sm text-gray-400">Analyzing your brain entries...</span>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-dark-700 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-400">
                Add your Claude API key in Settings to enable AI brain summary.
                The AI will analyze all your brain entries and generate insights about your content strategy.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {BRAIN_CATEGORIES.map((cat) => {
          const count = getCategoryCount(cat.key);
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => {
                setSelectedCategory(cat.key);
                setAddingNew(false);
                setEditingId(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-dark-500 text-gray-500 hover:text-gray-300 hover:border-dark-400'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-accent/20 text-accent'
                      : 'bg-dark-600 text-gray-500'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category description */}
      <div className="mb-5">
        <p className="text-xs text-gray-500">
          {BRAIN_CATEGORIES.find((c) => c.key === selectedCategory)?.description}
        </p>
      </div>

      {/* Add New Entry Button / Form */}
      {!addingNew ? (
        <button
          onClick={() => {
            setAddingNew(true);
            setEditingId(null);
          }}
          className="flex items-center gap-2 px-4 py-2.5 mb-5 bg-accent hover:bg-accent-dark rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Entry
        </button>
      ) : (
        <div className="bg-dark-800 border border-dark-500 rounded-xl p-5 mb-5">
          <h3 className="text-sm font-semibold mb-3">New Entry</h3>
          <div className="space-y-3">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Entry title"
              className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent/50 placeholder:text-gray-600"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="What should the AI remember?"
              rows={4}
              className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent/50 placeholder:text-gray-600 resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleAdd}
                disabled={!newTitle.trim() || !newContent.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
              <button
                onClick={() => {
                  setAddingNew(false);
                  setNewTitle('');
                  setNewContent('');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entries List */}
      {filteredEntries.length === 0 && !addingNew ? (
        <div className="bg-dark-800 border border-dark-500 rounded-xl p-12 text-center">
          <Brain className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No entries yet. Add your first insight.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="group bg-dark-800 border border-dark-500 rounded-xl p-5 transition-colors hover:border-dark-400"
            >
              {editingId === entry.id ? (
                /* Edit mode */
                <div className="space-y-3">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Entry title"
                    className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent/50 placeholder:text-gray-600"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="What should the AI remember?"
                    rows={4}
                    className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent/50 placeholder:text-gray-600 resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleEditSave}
                      disabled={!editTitle.trim() || !editContent.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-white">{entry.title}</h3>
                      <p className="text-sm text-gray-400 mt-1.5 leading-relaxed whitespace-pre-wrap">
                        {entry.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditStart(entry)}
                        className="p-1.5 text-gray-500 hover:text-white hover:bg-dark-600 rounded-lg transition-colors"
                        title="Edit entry"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-dark-600 rounded-lg transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-3">
                    Updated {new Date(entry.updatedAt).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
