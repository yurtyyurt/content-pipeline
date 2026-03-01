export type Platform = 'tiktok' | 'x' | 'both';
export type ContentType = 'script' | 'thread' | 'post' | 'hook' | 'concept';
export type Priority = 'high' | 'medium' | 'low';
export type PipelineStage = 'idea' | 'research' | 'draft' | 'review' | 'scheduled' | 'published';

export type BrainCategory = 'identity' | 'content_dna' | 'audience' | 'lessons' | 'goals';

export interface ContentMetrics {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  followers?: number;
}

export interface ContentCard {
  id: string;
  title: string;
  description: string;
  platform: Platform;
  contentType: ContentType;
  priority: Priority;
  stage: PipelineStage;
  dueDate?: string;
  assignee?: string;
  notes: string;
  content?: string;
  metrics?: ContentMetrics;
  publishedUrl?: string;
  publishedAt?: string;
  performanceNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Competitor {
  id: string;
  handle: string;
  platform: Platform;
  niche: string;
  notes: string;
  topContent: TopContent[];
  analysis?: string;
  lastAnalyzed?: string;
  addedAt: string;
}

export interface TopContent {
  description: string;
  engagement?: string;
  date?: string;
}

export interface ResearchResult {
  id: string;
  topic: string;
  platform: Platform;
  result: string;
  createdAt: string;
}

export interface BrainEntry {
  id: string;
  category: BrainCategory;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface AppSettings {
  claudeApiKey: string;
  niche: string;
  brandVoice: string;
  targetAudience: string;
}

export interface AppState {
  cards: ContentCard[];
  competitors: Competitor[];
  research: ResearchResult[];
  brain: BrainEntry[];
  chat: ChatMessage[];
  settings: AppSettings;
}

export const BRAIN_CATEGORIES: { key: BrainCategory; label: string; icon: string; description: string }[] = [
  { key: 'identity', label: 'Identity', icon: '🧬', description: 'Who you are, your background, positioning, and thesis' },
  { key: 'content_dna', label: 'Content DNA', icon: '🎯', description: 'What topics, formats, and hooks perform best for you' },
  { key: 'audience', label: 'Audience', icon: '👥', description: 'What your audience responds to, engagement patterns' },
  { key: 'lessons', label: 'Lessons', icon: '💡', description: 'What you\'ve learned about content and growth' },
  { key: 'goals', label: 'Goals', icon: '🎯', description: 'Your 30/60/90 day content and growth goals' },
];

export const PIPELINE_STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: 'idea', label: 'Ideas', color: '#6366f1' },
  { key: 'research', label: 'Research', color: '#8b5cf6' },
  { key: 'draft', label: 'Draft', color: '#f59e0b' },
  { key: 'review', label: 'Review', color: '#3b82f6' },
  { key: 'scheduled', label: 'Scheduled', color: '#10b981' },
  { key: 'published', label: 'Published', color: '#22c55e' },
];

export const CONTENT_TYPES: { key: ContentType; label: string; platforms: Platform[] }[] = [
  { key: 'script', label: 'TikTok Script', platforms: ['tiktok', 'both'] },
  { key: 'hook', label: 'Hook Ideas', platforms: ['tiktok', 'x', 'both'] },
  { key: 'concept', label: 'Video Concept', platforms: ['tiktok', 'both'] },
  { key: 'thread', label: 'X Thread', platforms: ['x', 'both'] },
  { key: 'post', label: 'X Post', platforms: ['x', 'both'] },
];

export const DEFAULT_SETTINGS: AppSettings = {
  claudeApiKey: '',
  niche: '',
  brandVoice: '',
  targetAudience: '',
};
