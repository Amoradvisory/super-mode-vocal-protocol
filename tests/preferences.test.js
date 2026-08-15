import test from 'node:test';
import assert from 'node:assert/strict';
import { getTheme, getThemeNames, makeCustomTheme } from '../projects/neon-isles/js/themes.js';
import { DEFAULT_SETTINGS, loadProfile, saveProfile } from '../projects/neon-isles/js/storage.js';
function fakeStorage(initial = {}) { const data = new Map(Object.entries(initial)); return { getItem(key) { return data.has(key) ? data.get(key) : null; }, setItem(key, value) { data.set(key, String(value)); } }; }
test('exposes exactly three built-in island themes', () => { assert.deepEqual(getThemeNames(), ['antilles', 'canaries', 'balearic']); });
test('falls back to Antilles when an unknown theme name is requested', () => { assert.equal(getTheme('missing').id, 'antilles'); });
test('creates a custom theme from a valid hex accent and falls back for invalid input', () => { assert.equal(makeCustomTheme('#123abc').accent, '#123abc'); assert.equal(makeCustomTheme('red').accent, getTheme('antilles').accent); });
test('loads safe defaults when local storage contains invalid JSON', () => { const storage = fakeStorage({ 'neon-isles-profile-v1': '{broken' }); assert.deepEqual(loadProfile(storage), DEFAULT_SETTINGS); });
test('persists theme, difficulty and the highest score without downgrading it', () => { const storage = fakeStorage(); saveProfile({ theme: 'canaries', difficulty: 'standard', bestScore: 800 }, storage); saveProfile({ theme: 'canaries', difficulty: 'standard', bestScore: 300 }, storage); const profile = loadProfile(storage); assert.equal(profile.theme, 'canaries'); assert.equal(profile.difficulty, 'standard'); assert.equal(profile.bestScore, 800); });
