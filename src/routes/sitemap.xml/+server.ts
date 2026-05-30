import Parser from 'rss-parser';
import { siteConfig } from '$lib/siteConfig';
import type { RequestHandler } from './$types';

type MediumItem = { link?: string; pubDate?: string; isoDate?: string };

async function getMediumSlugs(): Promise<{ slug: string; lastMod?: Date }[]> {
  try {
    const parser: Parser<unknown, MediumItem> = new Parser({});
    const feed = await parser.parseURL('https://enkhy.medium.com/feed');
    return (
      feed.items?.map((item) => {
        const link = item.link || '';
        const slug = link.split('/').filter(Boolean).pop() || '';
        const last = item.isoDate || item.pubDate;
        return { slug, lastMod: last ? new Date(last) : undefined };
      }) || []
    ).filter((x) => x.slug);
  } catch {
    return [];
  }
}

function urlEntry(loc: string, lastmod: Date, changefreq: string, priority: string): string {
  return (
    `<url>` +
    `<loc>${loc}</loc>` +
    `<lastmod>${lastmod.toISOString()}</lastmod>` +
    `<changefreq>${changefreq}</changefreq>` +
    `<priority>${priority}</priority>` +
    `</url>`
  );
}

export const GET: RequestHandler = async ({ setHeaders }) => {
  setHeaders({ 'content-type': 'application/xml', 'cache-control': 'public, max-age=3600' });

  const base = siteConfig.url.replace(/\/$/, '');
  const now = new Date();
  const slugs = await getMediumSlugs();

  const entries = [
    urlEntry(`${base}/`, now, 'weekly', '1.0'),
    urlEntry(`${base}/blog`, now, 'daily', '0.8'),
    ...slugs.map(({ slug, lastMod }) =>
      urlEntry(`${base}/blog/${slug}`, lastMod || now, 'weekly', '0.7')
    )
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    entries.join('') +
    `</urlset>`;

  return new Response(xml);
};
