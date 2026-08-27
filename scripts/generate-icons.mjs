#!/usr/bin/env node
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(ROOT, 'public', 'icons', 'icon.svg');
const out = join(ROOT, 'public', 'icons');
await mkdir(out, { recursive: true });
await sharp(source).resize(192, 192).png().toFile(join(out, 'icon-192.png'));
await sharp(source).resize(512, 512).png().toFile(join(out, 'icon-512.png'));
await sharp(source).resize(512, 512, { fit: 'contain', background: '#05080d' }).extend({ top: 48, bottom: 48, left: 48, right: 48, background: '#05080d' }).resize(512, 512).png().toFile(join(out, 'icon-maskable-512.png'));
console.log('Icônes PWA générées.');
