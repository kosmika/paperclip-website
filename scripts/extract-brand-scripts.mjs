#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SECTIONS_DIR = join(__dirname, '..', 'src', 'components', 'brand', 'sections');
const OUT_FILE = join(__dirname, '..', 'public', 'brand', 'sections.js');

const files = readdirSync(SECTIONS_DIR)
  .filter((f) => f.endsWith('.html'))
  .sort();

const extracted = [];

for (const file of files) {
  const path = join(SECTIONS_DIR, file);
  let html = readFileSync(path, 'utf8');

  const inlineScriptRe = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  const scripts = [];
  while ((match = inlineScriptRe.exec(html)) !== null) {
    scripts.push(match[1].trim());
  }

  const externalScriptRe = /<script\b[^>]*\bsrc=[^>]*><\/script>/gi;

  html = html.replace(inlineScriptRe, '');
  html = html.replace(externalScriptRe, '');

  writeFileSync(path, html);

  if (scripts.length > 0) {
    extracted.push(`/* ── ${file} ── */\n${scripts.join('\n\n')}`);
  }
}

const banner = `/* Auto-generated from src/components/brand/sections/*.html
 * Concatenated inline section scripts extracted during the Astro port.
 * Each block was already wrapped in an IIFE in the source HTML.
 * Regenerate via: node scripts/extract-brand-scripts.mjs
 */\n\n`;

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, banner + extracted.join('\n\n') + '\n');

console.log(`Extracted ${extracted.length} script block(s) → ${OUT_FILE}`);
console.log(`Stripped script tags from ${files.length} section HTML file(s).`);
