#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = join(ROOT, 'public', 'data');
const TRANSLATION_KEY = 'french_hameedullah';
const LIST_URL = 'https://quranenc.com/api/v1/translations/list/fr?localization=fr';
const SURA_URL = (number) => `https://quranenc.com/api/v1/translation/sura/${TRANSLATION_KEY}/${number}`;

const NAMES = {
  1:'Le Prologue',2:'La Vache',3:"La Famille d'Imran",4:'Les Femmes',5:'La Table servie',6:'Les Bestiaux',7:'Les Redans',8:'Le Butin',9:'Le Repentir',10:'Jonas',11:'Hud',12:'Joseph',13:'Le Tonnerre',14:'Abraham',15:'Al-Hijr',16:'Les Abeilles',17:'Le Voyage nocturne',18:'La Caverne',19:'Marie',20:'Ta-Ha',21:'Les Prophètes',22:'Le Pèlerinage',23:'Les Croyants',24:'La Lumière',25:'Le Discernement',26:'Les Poètes',27:'Les Fourmis',28:'Le Récit',29:"L'Araignée",30:'Les Romains',31:'Luqman',32:'La Prosternation',33:'Les Coalisés',34:'Saba',35:'Le Créateur',36:'Ya-Sin',37:'Les Rangés',38:'Sad',39:'Les Groupes',40:'Le Pardonneur',41:'Les Versets détaillés',42:'La Consultation',43:"L'Ornement",44:'La Fumée',45:"L'Agenouillée",46:'Al-Ahqaf',47:'Muhammad',48:'La Victoire éclatante',49:'Les Appartements',50:'Qaf',51:'Qui éparpillent',52:'At-Tur',53:"L'Étoile",54:'La Lune',55:'Le Tout Miséricordieux',56:"L'Événement",57:'Le Fer',58:'La Discussion',59:"L'Exode",60:"L'Éprouvée",61:'Le Rang',62:'Le Vendredi',63:'Les Hypocrites',64:'La Grande Perte',65:'Le Divorce',66:"L'Interdiction",67:'La Royauté',68:'La Plume',69:'Celle qui montre la vérité',70:"Les Voies d'ascension",71:'Noé',72:'Les Djinns',73:"L'Enveloppé",74:"Le Revêtu d'un manteau",75:'La Résurrection',76:"L'Homme",77:'Les Envoyés',78:'La Nouvelle',79:'Les Anges qui arrachent les âmes',80:"Il s'est renfrogné",81:"L'Obscurcissement",82:'La Rupture',83:'Les Fraudeurs',84:'La Déchirure',85:'Les Constellations',86:"L'Astre nocturne",87:'Le Très-Haut',88:"L'Enveloppante",89:"L'Aube",90:'La Cité',91:'Le Soleil',92:'La Nuit',93:'Le Jour montant',94:"L'Ouverture",95:'Le Figuier',96:"L'Adhérence",97:'La Destinée',98:'La Preuve',99:'La Secousse',100:'Les Coursiers',101:'Le Fracas',102:'La Course aux richesses',103:'Le Temps',104:'Les Calomniateurs',105:"L'Éléphant",106:'Quraych',107:"L'Ustensile",108:"L'Abondance",109:'Les Infidèles',110:'Le Secours',111:'Les Fibres',112:'Le Monothéisme pur',113:"L'Aube naissante",114:'Les Hommes'
};

async function fetchJson(url, attempts = 4) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { accept: 'application/json', 'user-agent': 'Ma-Lecture-corpus-importer/0.1' },
        signal: AbortSignal.timeout(45000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
    }
  }
  throw lastError;
}

function unwrapArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.translations)) return payload.translations;
  return null;
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  const translationList = unwrapArray(await fetchJson(LIST_URL));
  if (!translationList) throw new Error('Liste QuranEnc illisible.');
  const translation = translationList.find((item) => item?.key === TRANSLATION_KEY);
  if (!translation?.version) throw new Error(`Version introuvable pour ${TRANSLATION_KEY}.`);

  const surahs = [];
  for (let number = 1; number <= 114; number += 1) {
    const entries = unwrapArray(await fetchJson(SURA_URL(number)));
    if (!entries?.length) throw new Error(`Sourate ${number} vide.`);
    surahs.push({
      surahNumber: number,
      surahName: NAMES[number],
      verses: entries.map((entry) => ({
        verseNumber: Number(entry.aya),
        frenchText: String(entry.translation ?? '').trim(),
        footnotes: String(entry.footnotes ?? '').trim(),
      })),
    });
    process.stdout.write(`\rImport QuranEnc ${number}/114`);
  }
  process.stdout.write('\n');

  const importedAt = new Date().toISOString();
  const corpus = {
    source: 'QuranEnc',
    translationKey: TRANSLATION_KEY,
    translationName: 'Muhammad Hamidullah',
    version: String(translation.version),
    importedAt,
    surahs,
  };
  await writeFile(join(DATA_DIR, 'quran-fr.json'), `${JSON.stringify(corpus)}\n`, 'utf8');

  const source = `# Source de la traduction\n\n- **Traduction :** Muhammad Hamidullah\n- **Source :** QuranEnc.com — Encyclopédie du noble Coran\n- **Clé :** \`${TRANSLATION_KEY}\`\n- **Version intégrée :** ${corpus.version}\n- **Import :** ${importedAt}\n- **Supervision indiquée par QuranEnc :** Centre Rawwâd\n\nLe contenu de la traduction est importé sans reformulation. Ma Lecture ne corrige, ne résume et ne réécrit aucun verset. Toute redistribution doit conserver l’attribution à la traduction, à l’éditeur/supervision indiqués par QuranEnc, à QuranEnc.com comme source et au numéro de version. Les mises à jour de la source doivent être suivies avant une nouvelle publication.\n`;
  await writeFile(join(DATA_DIR, 'SOURCE.md'), source, 'utf8');
  console.log(`Corpus importé — QuranEnc ${corpus.version}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
