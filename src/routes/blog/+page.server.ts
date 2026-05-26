import { fetchMediumFeed } from '$lib/mediumFeed';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
  setHeaders({ 'cache-control': 'public, max-age=60' });
  const feed = await fetchMediumFeed();
  return { feed };
};
