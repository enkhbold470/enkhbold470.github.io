import { siteConfig } from '$lib/siteConfig';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ setHeaders }) => {
  setHeaders({ 'content-type': 'text/plain', 'cache-control': 'public, max-age=86400' });
  const base = siteConfig.url.replace(/\/$/, '');
  const body = `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\nHost: ${base}\n`;
  return new Response(body);
};
