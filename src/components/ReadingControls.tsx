import { decreaseLevel, increaseLevel, type ReadingLevel } from '../reading/readingScale';

interface ReadingControlsProps {
  surahName: string;
  level: ReadingLevel;
  onLevelChange: (level: ReadingLevel) => void;
}

export function ReadingControls({ surahName, level, onLevelChange }: ReadingControlsProps) {
  return (
    <header className="reader-toolbar">
      <a className="toolbar-back" href="#/sourates" aria-label="Retour aux sourates">‹ <span>Sourates</span></a>
      <div className="toolbar-title" aria-hidden="true">{surahName}</div>
      <div className="font-controls" role="group" aria-label="Taille du texte">
        <button type="button" aria-label="Réduire le texte" disabled={level === 'small'} onClick={() => onLevelChange(decreaseLevel(level))}>A−</button>
        <button type="button" aria-label="Agrandir le texte" disabled={level === 'maximum'} onClick={() => onLevelChange(increaseLevel(level))}>A+</button>
      </div>
    </header>
  );
}
