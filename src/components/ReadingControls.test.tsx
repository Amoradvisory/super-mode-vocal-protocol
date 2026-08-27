import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ReadingControls } from './ReadingControls';

describe('ReadingControls', () => {
  it('agrandit au niveau suivant', () => {
    const onLevelChange = vi.fn();
    render(<ReadingControls surahName="La Vache" level="normal" onLevelChange={onLevelChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Agrandir le texte' }));
    expect(onLevelChange).toHaveBeenCalledWith('large');
  });
});
