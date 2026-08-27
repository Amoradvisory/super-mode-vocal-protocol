import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('l’interface expose le slogan et une sélection React des deux prix', async () => {
  const source = await readFile(new URL('./App.jsx', import.meta.url), 'utf8');
  assert.match(source, /Ne jetez pas votre argent par les fenêtres/);
  assert.match(source, /useState/);
  assert.match(source, /125/);
  assert.match(source, /109/);
});

test('les styles contiennent une adaptation mobile', async () => {
  const css = await readFile(new URL('./styles.css', import.meta.url), 'utf8');
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
});
