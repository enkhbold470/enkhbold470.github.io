import { error } from '@sveltejs/kit';
import { fetchMediumFeed } from '$lib/mediumFeed';
import { replaceYoutubeLinksWithEmbed } from '$lib/youtubeEmbed';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
  setHeaders({ 'cache-control': 'public, max-age=60' });
  const feed = await fetchMediumFeed();
  const post = feed.find((item) => {
    if (!item.link || item.link.startsWith('#')) return false;
    try {
      const url = new URL(item.link);
      const last = url.pathname.split('/').filter(Boolean).pop() ?? '';
      return last === params.slug;
    } catch {
      return false;
    }
  });

  if (!post) {
    throw error(404, 'Post not found');
  }

  const renderedContent = post.contentEncoded
    ? replaceYoutubeLinksWithEmbed(post.contentEncoded)
    : post.contentSnippet ?? '';

  return { post, renderedContent };
};
