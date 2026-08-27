#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(ROOT, 'public', 'data', 'quran-fr.json');

function fail(message) {
  throw new Error(`Corpus invalide: ${message}`);
}

const corpus = JSON.parse(await readFile(path, 'utf8'));
if (corpus.translationKey !== 'french_hameedullah') fail('mauvaise traduction');
if (!Array.isArray(corpus.surahs) || corpus.surahs.length !== 114) fail('114 sourates attendues');
let verseCount = 0;
for (let index = 0; index < corpus.surahs.length; index += 1) {
  const surah = corpus.surahs[index];
  if (surah.surahNumber !== index + 1) fail(`numérotation sourate ${index + 1}`);
  if (!surah.surahName || !Array.isArray(surah.verses)) fail(`sourate ${index + 1} mal formée`);
  for (let verseIndex = 0; verseIndex < surah.verses.length; verseIndex += 1) {
    const verse = surah.verses[verseIndex];
    if (verse.verseNumber !== verseIndex + 1) fail(`trou dans ${surah.surahNumber}:${verseIndex + 1}`);
    if (typeof verse.frenchText !== 'string' || verse.frenchText.length === 0) fail(`texte vide ${surah.surahNumber}:${verse.verseNumber}`);
    verseCount += 1;
  }
}
if (verseCount !== 6236) fail(`${verseCount} versets au lieu de 6236`);
console.log('Corpus valide: 114 sourates, 6236 versets.');
