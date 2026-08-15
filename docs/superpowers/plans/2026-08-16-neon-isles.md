# Neon Isles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, mobile-first falling-block PWA called Neon Isles, installable on Android, usable offline, with three visual themes and a robust tested game engine.

**Architecture:** A dependency-light static web application hosted from the laboratory repository. Pure game rules live in an independently testable ES module; rendering, controls, themes, storage and PWA installation are separate modules so the experience can evolve without coupling gameplay to the DOM.

**Tech Stack:** HTML5, CSS, Canvas 2D, vanilla JavaScript ES modules, Node.js built-in test runner, Service Worker, Web App Manifest, GitHub Actions.

## Global Constraints

- Public repository: no secrets, credentials or private data.
- Primary target: Android/Chrome, while remaining keyboard-playable on desktop.
- Default difficulty: relaxed and immediately playable.
- PWA must remain functional after the first successful online load.
- No Tetris branding, logos, music or copied trade dress; use the original name Neon Isles.
- Three built-in themes plus a simple custom accent option.
- Gameplay readability outranks decorative effects.
- No backend and no account system.

## Delivery steps

1. Tested game engine: board, line clearing, scoring, difficulty, movement, rotation, hard drop, hold, pause.
2. Rendering and responsive interface: Canvas 2D pseudo-3D blocks, HUD, next/hold previews, overlays.
3. Controls, themes and persistence: keyboard/touch, three themes + custom accent, local profile.
4. PWA/offline: scoped manifest, service worker and install prompt.
5. Laboratory hub and CI: root landing page, README and GitHub Actions.
6. Release verification: local tests/checks, browser/mobile smoke test, production verification and Notion journal.
