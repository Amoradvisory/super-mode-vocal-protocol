import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
async function read(path) { return readFile(new URL(`../${path}`, import.meta.url), 'utf8'); }
test('game page exposes a canvas, mobile controls, settings and install affordance', async () => { const html = await read('projects/neon-isles/index.html'); for (const token of ['id="gameCanvas"', 'data-action="left"', 'data-action="drop"', 'id="themeSelect"', 'id="difficultySelect"', 'id="installButton"']) assert.ok(html.includes(token), `missing ${token}`); });
test('manifest is scoped to the game folder and requests standalone display', async () => { const manifest = JSON.parse(await read('projects/neon-isles/manifest.webmanifest')); assert.equal(manifest.start_url, './'); assert.equal(manifest.scope, './'); assert.equal(manifest.display, 'standalone'); assert.equal(manifest.name, 'Neon Isles'); });
test('service worker pre-caches the critical offline shell', async () => { const sw = await read('projects/neon-isles/service-worker.js'); for (const asset of ['./index.html', './styles.css', './js/app.js', './js/engine.js', './manifest.webmanifest']) assert.ok(sw.includes(`'${asset}'`), `service worker missing ${asset}`); });
test('laboratory root links to Neon Isles', async () => { const html = await read('index.html'); assert.ok(html.includes('./projects/neon-isles/')); assert.ok(html.includes('Neon Isles')); });
