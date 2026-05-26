function extractYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1);
    }
    if (
      u.hostname === 'www.youtube.com' ||
      u.hostname === 'youtube.com' ||
      u.hostname === 'm.youtube.com'
    ) {
      if (u.pathname === '/watch' && u.searchParams.has('v')) {
        return u.searchParams.get('v');
      }
      if (u.pathname.startsWith('/embed/')) {
        return u.pathname.split('/')[2];
      }
    }
    return null;
  } catch (e: unknown) {
    console.error(e);
    return null;
  }
}

function buildEmbed(videoId: string): string {
  return (
    `<div style="position:relative;padding-bottom:56.25%;height:0;margin-bottom:1.2em;">` +
    `<iframe src="https://www.youtube.com/embed/${videoId}" ` +
    `allowfullscreen ` +
    `frameborder="0" ` +
    `style="position:absolute;top:0;left:0;width:100%;height:100%;" ` +
    `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>` +
    `</div>`
  );
}

export function replaceYoutubeLinksWithEmbed(htmlContent: string): string {
  let output = htmlContent;

  const anchorTagRegex =
    /<a [^>]*href="([^"]+(youtube\.com|youtu\.be)[^"]+)"[^>]*>.*?<\/a>/gi;
  output = output.replace(anchorTagRegex, (match, href) => {
    const videoId = extractYouTubeVideoId(href);
    return videoId ? buildEmbed(videoId) : match;
  });

  const bareUrlRegex =
    /(?:^|>)(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)[^\s<]+)(?:$|<)/gim;
  output = output.replace(bareUrlRegex, (match, p1) => {
    const videoId = extractYouTubeVideoId(p1);
    if (!videoId) return match;
    const embed = buildEmbed(videoId);
    const leading = match.startsWith('>') ? '>' : '';
    const trailing = match.endsWith('<') ? '<' : '';
    return `${leading}${embed}${trailing}`;
  });

  return output;
}
