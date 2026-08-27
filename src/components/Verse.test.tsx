import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Verse } from './Verse';

describe('Verse', () => {
  it('affiche le numéro et le texte français', () => {
    render(<Verse verseNumber={255} frenchText="Texte français" />);
    expect(screen.getByText('255')).toBeInTheDocument();
    expect(screen.getByText('Texte français')).toBeInTheDocument();
  });
});
