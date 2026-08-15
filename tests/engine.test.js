import test from 'node:test';
import assert from 'node:assert/strict';

import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  Game,
  clearCompletedLines,
  createEmptyBoard,
  getDropInterval,
  scoreForClear,
} from '../projects/neon-isles/js/engine.js';

test('creates a 10x20 empty board', () => {
  const board = createEmptyBoard();
  assert.equal(board.length, BOARD_HEIGHT);
  assert.ok(board.every((row) => row.length === BOARD_WIDTH));
  assert.ok(board.every((row) => row.every((cell) => cell === null)));
});

test('clears every completed line and inserts empty rows at the top', () => {
  const board = createEmptyBoard();
  board[18] = Array(BOARD_WIDTH).fill('A');
  board[19] = Array(BOARD_WIDTH).fill('B');
  board[17][0] = 'C';
  const result = clearCompletedLines(board);
  assert.equal(result.lines, 2);
  assert.equal(result.board[19][0], 'C');
  assert.ok(result.board[0].every((cell) => cell === null));
  assert.ok(result.board[1].every((cell) => cell === null));
});

test('uses a relaxed default fall speed and never goes below the minimum interval', () => {
  assert.equal(getDropInterval(0, 'relax'), 950);
  assert.ok(getDropInterval(50, 'relax') >= 150);
  assert.ok(getDropInterval(5, 'standard') < getDropInterval(5, 'relax'));
});

test('scores multi-line clears more generously than isolated clears', () => {
  assert.equal(scoreForClear(1, 0), 100);
  assert.equal(scoreForClear(2, 0), 300);
  assert.equal(scoreForClear(4, 0), 800);
  assert.equal(scoreForClear(4, 2), 2400);
});

test('moves the active piece horizontally while respecting board boundaries', () => {
  const game = new Game({ random: () => 0.1 });
  const startX = game.active.x;
  assert.equal(game.move(-1, 0), true);
  assert.equal(game.active.x, startX - 1);
  while (game.move(-1, 0)) {}
  assert.equal(game.move(-1, 0), false);
  assert.ok(game.active.x >= -2);
});

test('rotates with simple wall kicks when a rotation would collide with a side wall', () => {
  const game = new Game({ random: () => 0.3 });
  game.active = { type: 'T', x: 3, y: 0, rotation: 0 };
  while (game.move(-1, 0)) {}
  const before = game.active.rotation;
  const rotated = game.rotate(1);
  assert.equal(rotated, true);
  assert.notEqual(game.active.rotation, before);
});

test('hard drop locks the piece, awards drop points and spawns a new piece', () => {
  const game = new Game({ random: () => 0.2 });
  const firstType = game.active.type;
  const distance = game.hardDrop();
  assert.ok(distance > 0);
  assert.ok(game.score >= distance * 2);
  assert.notEqual(game.active.type, undefined);
  assert.ok(game.board.some((row) => row.some((cell) => cell === firstType)));
});

test('hold can be used once per active piece and becomes available after locking', () => {
  const game = new Game({ random: () => 0.4 });
  const first = game.active.type;
  assert.equal(game.hold(), true);
  assert.equal(game.holdType, first);
  assert.equal(game.hold(), false);
  game.hardDrop();
  assert.equal(game.hold(), true);
});

test('pause prevents game movement until resumed', () => {
  const game = new Game({ random: () => 0.5 });
  const y = game.active.y;
  game.togglePause();
  assert.equal(game.softDrop(), false);
  assert.equal(game.active.y, y);
  game.togglePause();
  assert.equal(game.softDrop(), true);
});
