import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadProgress, PROGRESS_STORAGE_KEY, saveProgress } from './progressStore';

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('progressStore', () => {
  it('retourne null sans progression', () => {
    expect(loadProgress()).toBeNull();
  });

  it('relit une progression valide', () => {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ surahNumber: 18, verseNumber: 10, level: 'large', updatedAt: '2026-08-27T00:00:00Z' }),
    );
    expect(loadProgress()?.verseNumber).toBe(10);
  });

  it('ignore un JSON corrompu', () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, '{');
    expect(loadProgress()).toBeNull();
  });

  it('ne bloque pas si le stockage refuse une écriture', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(saveProgress({ surahNumber: 1, verseNumber: 1, level: 'normal', updatedAt: new Date().toISOString() })).toBe(false);
  });
});
