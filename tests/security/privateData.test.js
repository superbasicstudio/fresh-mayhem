import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..', '..');

describe('private data protection', () => {
  test('no .env files are tracked by git', () => {
    const tracked = execSync('git ls-files', { cwd: PROJECT_ROOT, encoding: 'utf-8' });
    const envFiles = tracked.split('\n').filter(f => /^\.env|\/\.env/.test(f));
    expect(envFiles, `.env files tracked by git: ${envFiles.join(', ')}`).toHaveLength(0);
  });

  test('no underscore-prefixed markdown files are tracked by git', () => {
    const tracked = execSync('git ls-files', { cwd: PROJECT_ROOT, encoding: 'utf-8' });
    const privateFiles = tracked.split('\n').filter(f => /\/_[^/]+\.md$|^_[^/]+\.md$/.test(f));
    expect(privateFiles, `Private _*.md files tracked: ${privateFiles.join(', ')}`).toHaveLength(0);
  });

  test('CLAUDE.md is not tracked by git', () => {
    const tracked = execSync('git ls-files', { cwd: PROJECT_ROOT, encoding: 'utf-8' });
    const claudeFiles = tracked.split('\n').filter(f => /CLAUDE\.md$/i.test(f));
    expect(claudeFiles, 'CLAUDE.md is tracked by git').toHaveLength(0);
  });

  test('no credential files tracked (.key, .pem, .p12, .pfx, .jks)', () => {
    const tracked = execSync('git ls-files', { cwd: PROJECT_ROOT, encoding: 'utf-8' });
    const credFiles = tracked.split('\n').filter(f => /\.(key|pem|p12|pfx|jks|keystore)$/.test(f));
    expect(credFiles, `Credential files tracked: ${credFiles.join(', ')}`).toHaveLength(0);
  });

  test('no .env.local or .env.production files exist in repo', () => {
    const envFiles = ['.env.local', '.env.production', '.env.development', '.env.staging'];
    const existing = envFiles.filter(f => fs.existsSync(path.join(PROJECT_ROOT, f)));
    // They can exist locally, but should not be in git
    if (existing.length > 0) {
      const tracked = execSync('git ls-files', { cwd: PROJECT_ROOT, encoding: 'utf-8' });
      for (const env of existing) {
        expect(tracked, `${env} is tracked by git`).not.toContain(env);
      }
    }
  });

  test('no private project management files are tracked', () => {
    const privatePatterns = [
      '_TODOS.md', '_SYSTEM_ARCHITECTURE.md', '_RAM.md',
      '_SHORT-TERM-MEMORY.md', '_LONG-TERM-MEMORY.md',
      '_LESSONS-LEARNED.md', '_VOICE-AND-TONE.md',
      '_GOLDEN-RULES.md', '_CONVERSATION-PREFERENCES.md',
      '_DESIGN-PREFERENCES.md', '_PROJECT-PROMOTION-IDEAS.md',
    ];
    const tracked = execSync('git ls-files', { cwd: PROJECT_ROOT, encoding: 'utf-8' });
    for (const pattern of privatePatterns) {
      expect(tracked, `${pattern} is tracked by git`).not.toContain(pattern);
    }
  });

  test('.gitignore blocks private markdown files', () => {
    const gitignore = fs.readFileSync(path.join(PROJECT_ROOT, '.gitignore'), 'utf-8');
    expect(gitignore).toContain('_*.md');
  });

  test('.gitignore blocks environment files', () => {
    const gitignore = fs.readFileSync(path.join(PROJECT_ROOT, '.gitignore'), 'utf-8');
    expect(gitignore).toContain('.env');
  });

  test('no database files tracked (.db, .sqlite, .sqlite3)', () => {
    const tracked = execSync('git ls-files', { cwd: PROJECT_ROOT, encoding: 'utf-8' });
    const dbFiles = tracked.split('\n').filter(f => /\.(db|sqlite|sqlite3)$/.test(f));
    expect(dbFiles, `Database files tracked: ${dbFiles.join(', ')}`).toHaveLength(0);
  });
});

describe('source code does not expose private information', () => {
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

  const srcFiles = getSourceFiles(PROJECT_ROOT);

  test('no private hostnames or internal URLs in source', () => {
    const internalPatterns = [
      /192\.168\.\d+\.\d+/,
      /10\.\d+\.\d+\.\d+/,
      /\.local\b/,
      /\.internal\b/,
      /localhost:\d{4,}/,
    ];
    const violations = [];
    for (const file of srcFiles) {
      if (file.includes('/tests/')) continue;
      if (file.endsWith('package-lock.json')) continue;
      const content = fs.readFileSync(file, 'utf-8');
      for (const pattern of internalPatterns) {
        if (pattern.test(content)) {
          // Allow localhost in dev config and vite config
          if (file.includes('vite.config') || file.includes('package.json')) continue;
          // Allow 192.168.x.x only in comments
          const lines = content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            if (pattern.test(lines[i]) && !lines[i].trim().startsWith('//') && !lines[i].trim().startsWith('*')) {
              violations.push(`${path.relative(PROJECT_ROOT, file)}:${i + 1}`);
            }
          }
        }
      }
    }
    expect(violations, `Internal URLs/IPs in source:\n${violations.join('\n')}`).toHaveLength(0);
  });

  test('no SSH key references in source', () => {
    const violations = [];
    for (const file of srcFiles) {
      if (file.includes('/tests/')) continue;
      const content = fs.readFileSync(file, 'utf-8');
      if (/ssh-rsa|ssh-ed25519|BEGIN.*PRIVATE KEY/.test(content)) {
        violations.push(path.relative(PROJECT_ROOT, file));
      }
    }
    expect(violations, `SSH key content in: ${violations.join(', ')}`).toHaveLength(0);
  });
});
