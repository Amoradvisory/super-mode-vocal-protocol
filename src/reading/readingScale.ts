export type ReadingLevel = 'small' | 'normal' | 'large' | 'xlarge' | 'maximum';

export interface ReadingProfile {
  fontSizeRem: number;
  lineHeight: number;
  sidePaddingRem: number;
  verseGapRem: number;
}

export const READING_LEVELS: Record<ReadingLevel, ReadingProfile> = {
  small: { fontSizeRem: 1.08, lineHeight: 1.68, sidePaddingRem: 1.35, verseGapRem: 1.55 },
  normal: { fontSizeRem: 1.25, lineHeight: 1.72, sidePaddingRem: 1.25, verseGapRem: 1.8 },
  large: { fontSizeRem: 1.42, lineHeight: 1.76, sidePaddingRem: 1.15, verseGapRem: 2 },
  xlarge: { fontSizeRem: 1.62, lineHeight: 1.8, sidePaddingRem: 1, verseGapRem: 2.2 },
  maximum: { fontSizeRem: 1.9, lineHeight: 1.84, sidePaddingRem: 0.85, verseGapRem: 2.4 },
};

const ORDER: ReadingLevel[] = ['small', 'normal', 'large', 'xlarge', 'maximum'];

export function getReadingProfile(level: ReadingLevel): ReadingProfile {
  return READING_LEVELS[level];
}

export function decreaseLevel(level: ReadingLevel): ReadingLevel {
  const index = ORDER.indexOf(level);
  return ORDER[Math.max(0, index - 1)] ?? 'small';
}

export function increaseLevel(level: ReadingLevel): ReadingLevel {
  const index = ORDER.indexOf(level);
  return ORDER[Math.min(ORDER.length - 1, index + 1)] ?? 'maximum';
}

export function isReadingLevel(value: unknown): value is ReadingLevel {
  return typeof value === 'string' && ORDER.includes(value as ReadingLevel);
}
