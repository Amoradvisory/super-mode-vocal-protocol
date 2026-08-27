import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS, getSaving, getProductById } from './product.js';

test('contient les deux offres originales', () => {
  assert.deepEqual(PRODUCTS.map((p) => p.price), [125, 109]);
  assert.deepEqual(PRODUCTS.map((p) => p.image), [
    '/assets/fenetre-125.jpg',
    '/assets/fenetre-109.jpg',
  ]);
});

test('calcule 16 euros d’économie pour la fenêtre à 109 euros', () => {
  assert.equal(getSaving(109), 16);
});

test('retrouve le produit sélectionné par son identifiant', () => {
  assert.equal(getProductById('109').price, 109);
});
