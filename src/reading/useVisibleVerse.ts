import { useEffect, useRef } from 'react';

export function useVisibleVerse(scopeKey: number, onVisibleVerse: (verseNumber: number) => void): void {
  const callbackRef = useRef(onVisibleVerse);
  callbackRef.current = onVisibleVerse;

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-verse-number]'));
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const verseNumber = Number((best.target as HTMLElement).dataset.verseNumber);
        if (!Number.isInteger(verseNumber)) return;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => callbackRef.current(verseNumber), 300);
      },
      { root: null, rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [scopeKey]);
}
