import { describe, test, expect } from 'vitest';
import { links } from '../../data/links';
import { videos } from '../../data/videos';

describe('external links', () => {
  test('has at least 30 links', () => {
    expect(links.length).toBeGreaterThanOrEqual(30);
  });

  test('every link has required fields', () => {
    for (const link of links) {
      expect(link.title, `Link missing title`).toBeDefined();
      expect(link.url, `${link.title} missing url`).toBeDefined();
      expect(link.url).toMatch(/^https?:\/\//);
    }
  });

  test('link titles are unique', () => {
    const titles = links.map(l => l.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  test('all URLs use HTTPS', () => {
    const insecure = links.filter(l => l.url.startsWith('http://'));
    expect(insecure.map(l => l.title), 'Links using HTTP instead of HTTPS').toHaveLength(0);
  });
});

describe('video references', () => {
  test('has at least 10 videos', () => {
    expect(videos.length).toBeGreaterThanOrEqual(10);
  });

  test('every video has required fields', () => {
    for (const v of videos) {
      expect(v.title, 'Video missing title').toBeDefined();
      expect(v.url, `${v.title} missing url`).toBeDefined();
      expect(v.url).toMatch(/^https:\/\/(www\.)?(youtube|youtu)/);
    }
  });

  test('video titles are unique', () => {
    const titles = videos.map(v => v.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
