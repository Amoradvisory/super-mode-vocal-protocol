import { describe, expect, it } from 'vitest';
import { decreaseLevel, increaseLevel } from './readingScale';

describe('readingScale', () => {
  it('respecte les bornes', () => {
    expect(decreaseLevel('small')).toBe('small');
    expect(increaseLevel('maximum')).toBe('maximum');
  });

  it('avance au niveau suivant', () => {
    expect(increaseLevel('normal')).toBe('large');
  });
});
