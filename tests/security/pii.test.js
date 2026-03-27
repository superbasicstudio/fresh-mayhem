import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..', '..');

function getSourceFiles(dir, extensions = ['.js', '.jsx', '.json', '.html', '.css']) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'coverage') continue;
    if (entry.isDirectory()) {
      results.push(...getSourceFiles(fullPath, extensions));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('PII security scan', () => {
  const sourceFiles = getSourceFiles(PROJECT_ROOT);

  test('no personal email addresses in source files', () => {
    const personalEmailPattern = /[a-z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|protonmail|icloud|aol)\.[a-z]{2,}/i;
    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const match = content.match(personalEmailPattern);
      expect(match, `Found personal email in ${path.relative(PROJECT_ROOT, file)}: ${match?.[0]}`).toBeNull();
    }
  });

  test('no personal home directory paths in source files', () => {
    const homePathPattern = /\/(home|Users)\/[a-z][a-z0-9_-]+\//i;
    for (const file of sourceFiles) {
      if (file.endsWith('package-lock.json') || file.endsWith('package.json')) continue;
      const content = fs.readFileSync(file, 'utf-8');
      const match = content.match(homePathPattern);
      expect(match, `Found personal path in ${path.relative(PROJECT_ROOT, file)}: ${match?.[0]}`).toBeNull();
    }
  });

  test('no IP addresses in source files', () => {
    // Matches IPv4 addresses but excludes common non-sensitive patterns like 0.0.0.0, 127.0.0.1, version numbers
    const ipPattern = /\b(?!0\.0\.0\.0|127\.0\.0\.1|255\.255\.255\.\d|10\.0\.0\.\d|192\.168\.\d)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/;
    for (const file of sourceFiles) {
      if (file.endsWith('package-lock.json')) continue;
      // Skip test files themselves
      if (file.includes('/tests/')) continue;
      const content = fs.readFileSync(file, 'utf-8');
      // Only flag if it looks like a real IP, not a version number
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Skip version strings, npm registry URLs, and frequency/spec numbers
        if (line.includes('version') || line.includes('registry') || line.includes('MHz') || line.includes('GHz') || line.includes('dBm')) continue;
        const match = line.match(ipPattern);
        if (match) {
          const ip = match[1];
          const parts = ip.split('.').map(Number);
          // Only flag if it looks like a real routable IP
          if (parts[0] > 0 && parts[0] < 224 && parts.every(p => p <= 255)) {
            // Additional check: not a version number pattern (e.g., 2.3.2)
            if (parts.some(p => p > 99)) {
              expect(null, `Possible IP address in ${path.relative(PROJECT_ROOT, file)}:${i + 1}: ${ip}`).toBeNull();
            }
          }
        }
      }
    }
  });

  test('no API keys or tokens in source files', () => {
    const secretPatterns = [
      /AKIA[0-9A-Z]{16}/,                          // AWS access key
      /sk-[a-zA-Z0-9]{20,}/,                       // OpenAI/Stripe secret key
      /ghp_[a-zA-Z0-9]{36}/,                       // GitHub personal access token
      /glpat-[a-zA-Z0-9-]{20,}/,                   // GitLab personal access token
      /xox[bpors]-[a-zA-Z0-9-]+/,                  // Slack token
    ];
    for (const file of sourceFiles) {
      if (file.endsWith('package-lock.json')) continue;
      const content = fs.readFileSync(file, 'utf-8');
      for (const pattern of secretPatterns) {
        const match = content.match(pattern);
        expect(match, `Found potential secret in ${path.relative(PROJECT_ROOT, file)}: ${match?.[0]?.slice(0, 10)}...`).toBeNull();
      }
    }
  });

  test('no hardcoded passwords in source files', () => {
    const passwordPattern = /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]{3,}['"]/i;
    for (const file of sourceFiles) {
      if (file.endsWith('package-lock.json')) continue;
      // Skip local config and test files
      if (file.includes('/tests/')) continue;
      const content = fs.readFileSync(file, 'utf-8');
      const match = content.match(passwordPattern);
      expect(match, `Found hardcoded password in ${path.relative(PROJECT_ROOT, file)}: ${match?.[0]}`).toBeNull();
    }
  });
});

describe('.gitignore coverage', () => {
  test('.gitignore exists', () => {
    const gitignorePath = path.join(PROJECT_ROOT, '.gitignore');
    expect(fs.existsSync(gitignorePath)).toBe(true);
  });

  test('.gitignore covers .env files', () => {
    const content = fs.readFileSync(path.join(PROJECT_ROOT, '.gitignore'), 'utf-8');
    expect(content).toContain('.env');
  });

  test('.gitignore covers node_modules', () => {
    const content = fs.readFileSync(path.join(PROJECT_ROOT, '.gitignore'), 'utf-8');
    expect(content).toContain('node_modules');
  });

  test('.gitignore covers key/cert files', () => {
    const content = fs.readFileSync(path.join(PROJECT_ROOT, '.gitignore'), 'utf-8');
    expect(content).toContain('*.key');
    expect(content).toContain('*.pem');
  });

  test('.gitignore covers local markdown config files', () => {
    const content = fs.readFileSync(path.join(PROJECT_ROOT, '.gitignore'), 'utf-8');
    expect(content).toContain('_*.md');
  });

  test('.gitignore covers coverage output', () => {
    const content = fs.readFileSync(path.join(PROJECT_ROOT, '.gitignore'), 'utf-8');
    expect(content).toContain('coverage');
  });
});
