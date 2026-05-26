import type { BioLink } from './siteConfig';

export type BioToken =
  | { kind: 'text'; value: string }
  | { kind: 'link'; text: string; url: string; external?: boolean };

export function tokenizeBio(bioText: string, links?: BioLink[]): BioToken[] {
  if (!links || links.length === 0) {
    return [{ kind: 'text', value: bioText }];
  }

  let tokens: BioToken[] = [{ kind: 'text', value: bioText }];

  for (const link of links) {
    const pattern = `[${link.text}]`;
    const next: BioToken[] = [];
    for (const token of tokens) {
      if (token.kind !== 'text' || !token.value.includes(pattern)) {
        next.push(token);
        continue;
      }
      const parts = token.value.split(pattern);
      parts.forEach((part, i) => {
        if (i > 0) {
          next.push({
            kind: 'link',
            text: link.text,
            url: link.url,
            external: link.external
          });
        }
        if (part) {
          next.push({ kind: 'text', value: part });
        }
      });
    }
    tokens = next;
  }

  return tokens;
}
