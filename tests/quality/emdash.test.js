import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..', '..');

function getSourceFiles(dir, extensions = ['.js', '.jsx', '.json']) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (['node_modules', '.git', 'dist', 'coverage', 'package-lock.json'].includes(entry.name)) continue;
    if (entry.isDirectory()) {
      results.push(...getSourceFiles(fullPath, extensions));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('no em dashes or en dashes in codebase', () => {
  const sourceFiles = getSourceFiles(PROJECT_ROOT);

  test('no em dashes in JS/JSX source files', () => {
    const jsFiles = sourceFiles.filter(f => f.endsWith('.js') || f.endsWith('.jsx'));
    const violations = [];
    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (line.includes('\u2014')) { // em dash
          violations.push(`${path.relative(PROJECT_ROOT, file)}:${i + 1}: ${line.trim().slice(0, 80)}`);
        }
      });
    }
    expect(violations, `Found em dashes:\n${violations.join('\n')}`).toHaveLength(0);
  });

  test('no en dashes in JS/JSX source files', () => {
    const jsFiles = sourceFiles.filter(f => f.endsWith('.js') || f.endsWith('.jsx'));
    const violations = [];
    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (line.includes('\u2013')) { // en dash
          violations.push(`${path.relative(PROJECT_ROOT, file)}:${i + 1}: ${line.trim().slice(0, 80)}`);
        }
      });
    }
    expect(violations, `Found en dashes:\n${violations.join('\n')}`).toHaveLength(0);
  });

  test('no em dashes in locale JSON files', () => {
    const localeDir = path.join(PROJECT_ROOT, 'locales');
    const localeFiles = fs.readdirSync(localeDir).filter(f => f.endsWith('.json'));
    const violations = [];
    for (const file of localeFiles) {
      const content = fs.readFileSync(path.join(localeDir, file), 'utf-8');
      if (content.includes('\u2014')) {
        violations.push(file);
      }
    }
    expect(violations, `Locale files with em dashes: ${violations.join(', ')}`).toHaveLength(0);
  });
});
