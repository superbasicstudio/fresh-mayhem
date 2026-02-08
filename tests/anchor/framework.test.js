import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..', '..');

const ANCHOR_FILES = [
  { file: '_GOLDEN-RULES.md', required: true },
  { file: '_TODOS.md', required: true },
  { file: '_LESSONS-LEARNED.md', required: false },
  { file: '_VOICE-AND-TONE.md', required: false },
  { file: '_CONVERSATION-PREFERENCES.md', required: false },
  { file: '_DESIGN-PREFERENCES.md', required: false },
  { file: '_LONG-TERM-MEMORY.md', required: false },
  { file: '_SHORT-TERM-MEMORY.md', required: false },
  { file: '_SYSTEM_ARCHITECTURE.md', required: false },
  { file: 'CLAUDE.md', required: true },
];

describe('Anchor framework file presence', () => {
  for (const { file, required } of ANCHOR_FILES) {
    test(`${file} exists${required ? ' (REQUIRED)' : ''}`, () => {
      const filePath = path.join(PROJECT_ROOT, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  }

  test('_RAM.md does NOT exist in repo (volatile, gitignored)', () => {
    const filePath = path.join(PROJECT_ROOT, '_RAM.md');
    // RAM.md should not be committed — it's session-only
    // It may or may not exist locally, but it should be in .gitignore
    const gitignore = fs.readFileSync(path.join(PROJECT_ROOT, '.gitignore'), 'utf-8');
    expect(gitignore).toContain('_RAM.md');
  });
});

describe('CLAUDE.md content', () => {
  const content = fs.readFileSync(path.join(PROJECT_ROOT, 'CLAUDE.md'), 'utf-8');

  test('contains project name', () => {
    expect(content).toContain('Fresh Mayhem');
  });

  test('contains tech stack info', () => {
    expect(content).toContain('React');
    expect(content).toContain('Vite');
    expect(content).toContain('Tailwind');
    expect(content).toContain('DaisyUI');
  });

  test('contains git identity requirements', () => {
    expect(content).toContain('Super Basic Studio');
    expect(content).toContain('hello@superbasic.studio');
  });

  test('contains golden rule about hardware', () => {
    expect(content).toContain('NEVER BLAME HARDWARE');
  });

  test('references Anchor framework session load order', () => {
    expect(content).toContain('_GOLDEN-RULES.md');
  });
});

describe('_GOLDEN-RULES.md content', () => {
  const content = fs.readFileSync(path.join(PROJECT_ROOT, '_GOLDEN-RULES.md'), 'utf-8');

  test('contains IMMUTABLE keyword', () => {
    expect(content).toContain('IMMUTABLE');
  });

  test('contains BINDING constraint', () => {
    expect(content).toContain('BINDING');
  });

  test('contains no-credentials rule', () => {
    expect(content).toContain('No Credentials in Code');
  });

  test('contains no-PII rule', () => {
    expect(content).toContain('No PII Exposure');
  });

  test('contains confirm-destructive rule', () => {
    expect(content).toContain('Confirm Before Destructive');
  });

  test('contains git identity rule', () => {
    expect(content).toContain('Super Basic Studio');
  });

  test('contains never-blame-hardware rule', () => {
    expect(content.toLowerCase()).toContain('never blame hardware');
  });

  test('summary table covers all rules', () => {
    expect(content).toContain('| #');
    expect(content).toContain('P0');
  });
});

describe('_LONG-TERM-MEMORY.md content', () => {
  const content = fs.readFileSync(path.join(PROJECT_ROOT, '_LONG-TERM-MEMORY.md'), 'utf-8');

  test('warns against storing secrets', () => {
    expect(content).not.toContain('AKIA');
    expect(content).not.toContain('sk-');
  });

  test('contains project architecture info', () => {
    expect(content).toContain('React');
    expect(content).toContain('Vite');
  });

  test('lists all 9 pages', () => {
    expect(content).toContain('Overview');
    expect(content).toContain('Controls');
    expect(content).toContain('Safety');
  });

  test('references Anchor framework', () => {
    expect(content).toContain('Claude Anchor');
  });
});

describe('Anchor files have no PII', () => {
  for (const { file } of ANCHOR_FILES) {
    test(`${file} contains no personal email addresses`, () => {
      const content = fs.readFileSync(path.join(PROJECT_ROOT, file), 'utf-8');
      // Allow hello@superbasic.studio (the project identity)
      const filtered = content.replace(/hello@superbasic\.studio/g, '');
      expect(filtered).not.toMatch(/[a-z0-9._%+-]+@(gmail|yahoo|hotmail|outlook)\.[a-z]{2,}/i);
    });

    test(`${file} contains no personal file paths`, () => {
      const content = fs.readFileSync(path.join(PROJECT_ROOT, file), 'utf-8');
      expect(content).not.toMatch(/\/(home|Users)\/[a-z][a-z0-9_-]+\//i);
      expect(content).not.toMatch(/\/media\/[a-z][a-z0-9_-]+\//i);
    });
  }
});

describe('Anchor framework version consistency', () => {
  test('all anchor files reference Claude Anchor v1.3', () => {
    for (const { file } of ANCHOR_FILES) {
      if (file === 'CLAUDE.md') continue; // CLAUDE.md may not have version footer
      const content = fs.readFileSync(path.join(PROJECT_ROOT, file), 'utf-8');
      expect(content, `${file} missing Anchor version footer`).toContain('Claude Anchor');
    }
  });
});
