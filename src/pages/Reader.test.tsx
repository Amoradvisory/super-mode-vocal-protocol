import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Reader } from './Reader';

describe('Reader', () => {
  it('rend les versets dans leur ordre naturel', () => {
    const { container } = render(
      <Reader
        surah={{ surahNumber: 1, surahName: 'Le Prologue', verses: [1, 2, 3].map((verseNumber) => ({ verseNumber, frenchText: `Texte ${verseNumber}`, footnotes: '' })) }}
        level="normal"
        onLevelChange={vi.fn()}
      />,
    );
    expect(Array.from(container.querySelectorAll('[data-verse-number]')).map((node) => Number((node as HTMLElement).dataset.verseNumber))).toEqual([1, 2, 3]);
    expect(screen.getByRole('heading', { name: 'Le Prologue' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sourate suivante/ })).toHaveAttribute('href', '#/sourate/2');
  });
});
