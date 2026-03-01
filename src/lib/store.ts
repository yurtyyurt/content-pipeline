import { AppState, DEFAULT_SETTINGS } from './types';

const STORAGE_KEY = 'content-pipeline-state';

const defaultState: AppState = {
  cards: [],
  competitors: [],
  research: [],
  settings: DEFAULT_SETTINGS,
};

export function loadState(): AppState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...defaultState,
        ...parsed,
        settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      };
    }
  } catch {
    // ignore parse errors
  }
  return defaultState;
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
