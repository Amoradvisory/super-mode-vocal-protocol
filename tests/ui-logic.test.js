import test from 'node:test';
import assert from 'node:assert/strict';
import { actionForKey } from '../projects/neon-isles/js/controls.js';
import { boardPixelSize } from '../projects/neon-isles/js/renderer.js';
test('maps desktop keys to the same semantic actions as touch controls', () => { assert.equal(actionForKey('ArrowLeft'), 'left'); assert.equal(actionForKey('ArrowRight'), 'right'); assert.equal(actionForKey('ArrowDown'), 'down'); assert.equal(actionForKey('ArrowUp'), 'rotate'); assert.equal(actionForKey(' '), 'drop'); assert.equal(actionForKey('c'), 'hold'); assert.equal(actionForKey('Escape'), 'pause'); assert.equal(actionForKey('x'), null); });
test('keeps the 10x20 board ratio when computing a responsive canvas size', () => { assert.deepEqual(boardPixelSize(320), { width: 320, height: 640, cell: 32 }); assert.deepEqual(boardPixelSize(375), { width: 370, height: 740, cell: 37 }); });
