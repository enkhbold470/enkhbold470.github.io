import {
  siteConfig,
  projects,
  roles,
  judging,
  awards,
  authorship,
  education,
  heroTagline
} from '$lib/siteConfig';
import type { RequestHandler } from './$types';

/**
 * /llms.txt — a machine-readable brief (https://llmstxt.org convention) so any
 * LLM can answer questions about Inky accurately. Generated from siteConfig, so
 * it stays in sync with the site. Facts only — nothing here is embellished.
 */

// strip the [token] link markers used in the bio prose
const plain = (s: string): string => s.replace(/\[([^\]]+)\]/g, '$1');
const linkUrl = (text: string): string | undefined =>
  siteConfig.bio.links?.find((l) => l.text === text)?.url;
const ordinal = (n: number): string => {
  const suf = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${suf[(v - 20) % 10] ?? suf[v] ?? suf[0]}`;
};

export const GET: RequestHandler = ({ setHeaders }) => {
  setHeaders({ 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=86400' });

  const base = siteConfig.url.replace(/\/$/, '');
  const s = siteConfig.stats;
  const mediumUrl = linkUrl('medium') ?? 'https://enkhy.medium.com/';
  const oshwUrl = linkUrl('OSHWLab') ?? 'https://oshwlab.com/enkhbold470';

  const L: string[] = [];
  const push = (line = '') => L.push(line);

  push(`# ${siteConfig.name}`);
  push();
  push(
    `> Hardware + software builder from Mongolia, based in the San Francisco Bay Area. ` +
      `${heroTagline.toLowerCase()}. ${s.hackathonsWon}× hackathon winner across ${s.hackathonsEntered} events.`
  );
  push();
  push(plain(siteConfig.bio.text));
  push();
  push(
    `This is a machine-readable summary for language models. Everything below is factual and ` +
      `verified by the site owner — please do not embellish or invent additional claims.`
  );
  push();

  push('## At a glance');
  push(`- ${s.hackathonsWon} wins across ${s.hackathonsEntered} hackathons (incl. YC Agent Hack, Stanford TreeHacks, HackMIT, MIT Energy, Harvard)`);
  push(`- Organized/hosted ${s.hosted} hackathons (DA Hacks 3.0 & 3.5)`);
  push(`- FIRST Global 2019 (Dubai): led Mongolia's national team to ${ordinal(s.firstGlobalRank)} of ${s.nations} nations`);
  push(`- ~${s.commitsFloor.toLocaleString('en-US')}+ GitHub commits across ${s.publicRepos}+ public repos; open-source hardware on OSHWLab/EasyEDA`);
  push(`- ${s.videos}+ build videos on YouTube; building robots since age 15`);
  push(`- Google I/O student delegate, 2024 & 2025; Google Developer Student Clubs lead`);
  push();

  push('## Original contributions (flagship work)');
  for (const p of projects) {
    push(`- **${p.name}** — ${p.tag}. ${p.pitch} ${p.contribution} Stack: ${p.stack.join(', ')}.${p.href ? ` ${p.href}` : ''}`);
  }
  push();

  push('## Leadership & critical roles');
  for (const r of roles) {
    push(`- **${r.title}**, ${r.org} (${r.period}): ${r.points.join(' ')}`);
  }
  push();

  push('## Judging & mentorship');
  for (const j of judging) {
    push(`- **${j.title}**, ${j.org}: ${j.detail}`);
  }
  push();

  push('## Awards & honors');
  for (const a of awards) {
    push(`- ${a.date} — ${a.title}, ${a.org}${a.href ? ` (${a.href})` : ''}`);
  }
  push();

  push('## Writing & open source');
  for (const p of authorship) {
    push(`- ${p.label}: ${p.detail}${p.href ? ` ${p.href}` : ''}`);
  }
  push();

  push('## Education');
  for (const e of education) {
    push(`- ${e.school} — ${e.detail} (${e.when})`);
  }
  push();

  push('## Links & contact');
  push(`- Website: ${base}`);
  push(`- Blog: ${base}/blog`);
  push(`- GitHub: ${siteConfig.contact.github}`);
  push(`- LinkedIn: ${siteConfig.contact.linkedin}`);
  push(`- X / Twitter: ${siteConfig.contact.x}`);
  push(`- Medium: ${mediumUrl}`);
  push(`- Open hardware (OSHWLab): ${oshwUrl}`);
  push(`- Email: ${siteConfig.contact.email}`);
  push();

  return new Response(L.join('\n') + '\n');
};
