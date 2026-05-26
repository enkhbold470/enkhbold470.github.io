import { describe, it, expect } from 'vitest';
import { replaceYoutubeLinksWithEmbed } from '../src/lib/youtubeEmbed';

describe('replaceYoutubeLinksWithEmbed', () => {
  it('rewrites an anchor pointing at youtube.com/watch?v=ID into an iframe embed', () => {
    const input = '<p><a href="https://www.youtube.com/watch?v=abc123">Watch</a></p>';
    const output = replaceYoutubeLinksWithEmbed(input);
    expect(output).toContain('https://www.youtube.com/embed/abc123');
    expect(output).toContain('<iframe');
  });

  it('rewrites an anchor pointing at youtu.be/ID into an iframe embed', () => {
    const input = '<p><a href="https://youtu.be/xyz789">link</a></p>';
    const output = replaceYoutubeLinksWithEmbed(input);
    expect(output).toContain('https://www.youtube.com/embed/xyz789');
  });

  it('rewrites a bare youtube URL appearing between tags', () => {
    const input = '<p>https://www.youtube.com/watch?v=bare01</p>';
    const output = replaceYoutubeLinksWithEmbed(input);
    expect(output).toContain('https://www.youtube.com/embed/bare01');
  });

  it('leaves non-youtube anchors alone', () => {
    const input = '<a href="https://example.com">Example</a>';
    const output = replaceYoutubeLinksWithEmbed(input);
    expect(output).toBe(input);
  });
});
