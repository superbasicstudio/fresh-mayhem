import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..', '..');

function getSourceFiles(dir, extensions = ['.js', '.jsx']) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (['node_modules', '.git', 'dist', 'coverage'].includes(entry.name)) continue;
    if (entry.isDirectory()) {
      results.push(...getSourceFiles(fullPath, extensions));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('XSS prevention', () => {
  const srcFiles = [
    ...getSourceFiles(path.join(PROJECT_ROOT, 'src')),
    ...getSourceFiles(path.join(PROJECT_ROOT, 'components')),
  ];

  test('no dangerouslySetInnerHTML in page components', () => {
    // D3 chart components and vendor pages use innerHTML for dynamic content - that's expected
    const allowList = ['BandMap.jsx', 'FrequencySpectrum.jsx', 'WhereToBuyPage.jsx'];
    const violations = [];
    for (const file of srcFiles) {
      const basename = path.basename(file);
      if (allowList.includes(basename)) continue;
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes('dangerouslySetInnerHTML')) {
        violations.push(path.relative(PROJECT_ROOT, file));
      }
    }
    expect(violations, `dangerouslySetInnerHTML found in: ${violations.join(', ')}`).toHaveLength(0);
  });

  test('no eval() usage', () => {
    const violations = [];
    for (const file of srcFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      if (/\beval\s*\(/.test(content)) {
        violations.push(path.relative(PROJECT_ROOT, file));
      }
    }
    expect(violations, `eval() found in: ${violations.join(', ')}`).toHaveLength(0);
  });

  test('no new Function() constructor usage', () => {
    const violations = [];
    for (const file of srcFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      if (/new\s+Function\s*\(/.test(content)) {
        violations.push(path.relative(PROJECT_ROOT, file));
      }
    }
    expect(violations, `new Function() found in: ${violations.join(', ')}`).toHaveLength(0);
  });

  test('no document.write usage', () => {
    const violations = [];
    for (const file of srcFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      if (/document\.write\s*\(/.test(content)) {
        violations.push(path.relative(PROJECT_ROOT, file));
      }
    }
    expect(violations, `document.write found in: ${violations.join(', ')}`).toHaveLength(0);
  });

  test('external links use rel="noopener noreferrer"', () => {
    const violations = [];
    for (const file of srcFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const externalLinks = content.match(/target="_blank"/g) || [];
      const safeLinks = content.match(/target="_blank"[^>]*rel="noopener noreferrer"/g) || [];
      // Also count rel before target
      const safeLinks2 = content.match(/rel="noopener noreferrer"[^>]*target="_blank"/g) || [];
      if (externalLinks.length > safeLinks.length + safeLinks2.length) {
        violations.push(`${path.relative(PROJECT_ROOT, file)}: ${externalLinks.length - safeLinks.length - safeLinks2.length} unsafe external links`);
      }
    }
    expect(violations, violations.join('\n')).toHaveLength(0);
  });
});

describe('content security', () => {
  const allSrcFiles = [
    ...getSourceFiles(path.join(PROJECT_ROOT, 'src')),
    ...getSourceFiles(path.join(PROJECT_ROOT, 'components')),
  ];

  test('no inline event handlers in JSX (onClick is fine, onXxx="" strings are not)', () => {
    const violations = [];
    for (const file of allSrcFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      // Look for HTML-style inline handlers (not React JSX)
      const matches = content.match(/\son\w+="[^"]*"/g) || [];
      const htmlHandlers = matches.filter(m => !m.includes('={'));
      if (htmlHandlers.length > 0) {
        violations.push(`${path.relative(PROJECT_ROOT, file)}: HTML-style event handlers`);
      }
    }
    expect(violations, violations.join('\n')).toHaveLength(0);
  });

  test('external URLs in data files use HTTPS', () => {
    const dataDir = path.join(PROJECT_ROOT, 'data');
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.js'));
    const violations = [];
    for (const file of files) {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
      const httpUrls = content.match(/['"]http:\/\/[^'"]+['"]/g) || [];
      // Filter out localhost
      const insecure = httpUrls.filter(u => !u.includes('localhost') && !u.includes('127.0.0.1'));
      if (insecure.length > 0) {
        violations.push(`${file}: insecure HTTP URLs: ${insecure.join(', ')}`);
      }
    }
    expect(violations, violations.join('\n')).toHaveLength(0);
  });
});
