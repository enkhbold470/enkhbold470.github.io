import { siteConfig } from '$lib/siteConfig';
import { fetchMediumFeed } from '$lib/mediumFeed';
import type { PageServerLoad } from './$types';

function slugFor(link: string): string {
  return link.split('/').filter(Boolean).pop() ?? '';
}

/**
 * The Y1 crystal readout shows a genuine, rising GitHub commit count — literal
 * telemetry that he ships, not a claim. Best-effort + server-cached, and clamped
 * to a hardcoded floor so it NEVER renders 0 or a spinner if GitHub is slow/rate-limited.
 */
const FLOOR = siteConfig.stats.commitsFloor;
const GH_USER = 'enkhbold470';

export const load: PageServerLoad = async ({ setHeaders, fetch }) => {
  setHeaders({ 'cache-control': 'public, max-age=3600, stale-while-revalidate=86400' });

  let commits = FLOOR;
  try {
    const res = await fetch(
      `https://api.github.com/search/commits?q=author:${GH_USER}&per_page=1`,
      {
        headers: {
          Accept: 'application/vnd.github.cloak-preview+json',
          'User-Agent': 'enk.icu'
        }
      }
    );
    if (res.ok) {
      const json = (await res.json()) as { total_count?: number };
      if (typeof json.total_count === 'number' && json.total_count > 0) {
        commits = Math.max(FLOOR, json.total_count);
      }
    } else if (res.status === 403 || res.status === 429) {
      console.warn(`[github] commit count rate-limited (${res.status}); using floor ${FLOOR}`);
    }
  } catch {
    /* network/parse failure — fall through to floor */
  }

  // recent writing — featured on the home page so the blog is front-and-center
  const feed = await fetchMediumFeed();
  const posts = feed.slice(0, 4).map((p) => ({
    title: p.title,
    slug: slugFor(p.link),
    pubDate: p.pubDate ?? '',
    image: p.image ?? ''
  }));

  return { commits, posts };
};
