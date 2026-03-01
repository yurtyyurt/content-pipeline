'use client';

import { useState, useEffect } from 'react';
import { loadState, saveState } from '@/lib/store';
import { AppSettings, DEFAULT_SETTINGS } from '@/lib/types';
import { Save, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const state = loadState();
    setSettings(state.settings);
  }, []);

  function handleSave() {
    const state = loadState();
    state.settings = settings;
    saveState(state);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl animate-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your content engine</p>
      </div>

      <div className="space-y-6">
        <Section title="API Keys" description="Required for AI-powered features">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Claude API Key <span className="text-tiktok">*</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={settings.claudeApiKey}
                onChange={(e) => setSettings({ ...settings, claudeApiKey: e.target.value })}
                placeholder="sk-ant-..."
                className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm pr-10 focus:outline-none focus:border-accent/50 placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-gray-600 mt-1.5">
              Get yours at{' '}
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                console.anthropic.com
              </a>
            </p>
          </div>
        </Section>

        <Section title="Content Profile" description="Helps AI generate better content for you">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Niche / Industry</label>
            <input
              type="text"
              value={settings.niche}
              onChange={(e) => setSettings({ ...settings, niche: e.target.value })}
              placeholder="e.g. SaaS marketing, fitness coaching, personal finance..."
              className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent/50 placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Target Audience</label>
            <input
              type="text"
              value={settings.targetAudience}
              onChange={(e) => setSettings({ ...settings, targetAudience: e.target.value })}
              placeholder="e.g. 18-35 year old entrepreneurs, working moms, tech enthusiasts..."
              className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent/50 placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Brand Voice</label>
            <textarea
              value={settings.brandVoice}
              onChange={(e) => setSettings({ ...settings, brandVoice: e.target.value })}
              placeholder="Describe your tone and style. e.g. Casual and witty, like talking to a smart friend. Use short punchy sentences. Drop knowledge bombs without being preachy..."
              rows={4}
              className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent/50 placeholder:text-gray-600 resize-none"
            />
          </div>
        </Section>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark rounded-lg text-sm font-medium transition-colors"
          >
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
          {saved && <span className="text-xs text-green-400">Settings saved to local storage</span>}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-dark-800 border border-dark-500 rounded-xl p-6">
      <h2 className="text-sm font-semibold mb-0.5">{title}</h2>
      <p className="text-xs text-gray-500 mb-5">{description}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
