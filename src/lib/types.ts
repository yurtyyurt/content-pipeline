export type Platform = 'tiktok' | 'x' | 'both';
export type ContentType = 'script' | 'thread' | 'post' | 'hook' | 'concept';
export type Priority = 'high' | 'medium' | 'low';
export type PipelineStage = 'idea' | 'research' | 'draft' | 'review' | 'scheduled' | 'published';

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

export interface AppSettings {
  claudeApiKey: string;
  xApiKey: string;
  niche: string;
  brandVoice: string;
  targetAudience: string;
}

export interface AppState {
  cards: ContentCard[];
  competitors: Competitor[];
  research: ResearchResult[];
  settings: AppSettings;
}

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
  xApiKey: '',
  niche: '',
  brandVoice: '',
  targetAudience: '',
};
