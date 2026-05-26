import { describe, it, expect } from 'vitest';
import { tokenizeBio } from '../src/lib/bioLinks';
import type { BioLink } from '../src/lib/siteConfig';

const links: BioLink[] = [
  { text: 'Github', url: 'https://github.com/x', external: true },
  { text: 'blogs', url: '/blog', external: false }
];

describe('tokenizeBio', () => {
  it('returns a single text token when no links are provided', () => {
    expect(tokenizeBio('hello world', undefined)).toEqual([
      { kind: 'text', value: 'hello world' }
    ]);
  });

  it('splits "[Github] and [blogs]" into 4 tokens (text, link, text, link)', () => {
    const tokens = tokenizeBio('see [Github] and [blogs]', links);
    expect(tokens).toEqual([
      { kind: 'text', value: 'see ' },
      { kind: 'link', text: 'Github', url: 'https://github.com/x', external: true },
      { kind: 'text', value: ' and ' },
      { kind: 'link', text: 'blogs', url: '/blog', external: false }
    ]);
  });

  it('leaves unknown bracket text untouched', () => {
    const tokens = tokenizeBio('[Github] and [unknown]', links);
    expect(tokens).toEqual([
      { kind: 'link', text: 'Github', url: 'https://github.com/x', external: true },
      { kind: 'text', value: ' and [unknown]' }
    ]);
  });
});
