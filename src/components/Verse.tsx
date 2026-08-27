interface VerseProps {
  verseNumber: number;
  frenchText: string;
}

export function Verse({ verseNumber, frenchText }: VerseProps) {
  return (
    <article className="verse" data-verse-number={verseNumber}>
      <span className="verse-number" aria-label={`Verset ${verseNumber}`}>{verseNumber}</span>
      <p className="verse-text">{frenchText}</p>
    </article>
  );
}
