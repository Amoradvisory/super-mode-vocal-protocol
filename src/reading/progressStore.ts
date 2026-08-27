import { isReadingLevel, type ReadingLevel } from './readingScale';

export interface ReadingProgress {
  surahNumber: number;
  verseNumber: number;
  level: ReadingLevel;
  updatedAt: string;
}

export const PROGRESS_STORAGE_KEY = 'ma-lecture:progress:v1';

function isProgress(value: unknown): value is ReadingProgress {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<ReadingProgress>;
  return (
    Number.isInteger(item.surahNumber) &&
    Number(item.surahNumber) >= 1 &&
    Number(item.surahNumber) <= 114 &&
    Number.isInteger(item.verseNumber) &&
    Number(item.verseNumber) >= 1 &&
    isReadingLevel(item.level) &&
    typeof item.updatedAt === 'string'
  );
}

export function loadProgress(): ReadingProgress | null {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isProgress(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveProgress(progress: ReadingProgress): boolean {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
