import { error } from '@sveltejs/kit';
import sanitizeHtml from 'sanitize-html';
import { fetchMediumFeed } from '$lib/mediumFeed';
import { replaceYoutubeLinksWithEmbed } from '$lib/youtubeEmbed';
import type { PageServerLoad } from './$types';

// The Medium feed is remote HTML rendered via {@html}. Sanitize it server-side
// with a strict allowlist (no scripts/styles/handlers; iframes restricted to
// YouTube) so a compromised/MITM'd feed cannot inject executable markup.
const SANITIZE_OPTS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'a', 'img', 'strong', 'b', 'em', 'i', 'u', 's', 'br', 'hr',
    'blockquote', 'pre', 'code', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'figure', 'figcaption', 'div', 'span', 'iframe'
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'title']
  },
  allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com'],
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' })
  }
};

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

  const rawHtml = post.contentEncoded
    ? replaceYoutubeLinksWithEmbed(post.contentEncoded)
    : post.contentSnippet ?? '';
  const renderedContent = sanitizeHtml(rawHtml, SANITIZE_OPTS);

  return { post, renderedContent };
};
