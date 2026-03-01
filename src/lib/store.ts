import { AppState, DEFAULT_SETTINGS } from './types';
import { SEED_STATE } from './seed-data';

const STORAGE_KEY = 'content-pipeline-state';
const SEEDED_KEY = 'content-pipeline-seeded';

export function loadState(): AppState {
  if (typeof window === 'undefined') return SEED_STATE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...SEED_STATE,
        ...parsed,
        settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      };
    }
    // First visit — seed with research data
    if (!localStorage.getItem(SEEDED_KEY)) {
      localStorage.setItem(SEEDED_KEY, '1');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_STATE));
      return SEED_STATE;
    }
  } catch {
    // ignore parse errors
  }
  return SEED_STATE;
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
