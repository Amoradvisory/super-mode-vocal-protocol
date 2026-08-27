import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('affiche le nom de la liseuse', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Ma Lecture' })).toBeInTheDocument();
  });
});
