<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const PLACEHOLDER_IMAGE = 'https://placekeanu.com/400/300';
  const SNIPPET_LENGTH = 96;

  function truncate(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length <= maxLength ? text : `${text.slice(0, maxLength)}…`;
  }
  function slugFor(link: string): string {
    return link.split('/').filter(Boolean).pop() ?? '';
  }
  function refFor(i: number): string {
    return `D${String(i + 1).padStart(2, '0')}`;
  }
  function isoDate(d?: string): string {
    if (!d) return '—';
    const t = new Date(d);
    return Number.isNaN(t.getTime()) ? '—' : t.toISOString().slice(0, 10);
  }
</script>

<svelte:head>
  <title>Blog · Inky Ganbold</title>
</svelte:head>

<main class="bom">
  <nav class="crumb font-instr" aria-label="Breadcrumb">
    <a href="/">HOME</a><span class="sep">▸</span><span class="here">/blog</span>
  </nav>

  <header class="head">
    <h1>Blog</h1>
    <p class="silk font-silk" aria-hidden="true">
      // BILL OF MATERIALS · {data.feed.length} ITEM{data.feed.length === 1 ? '' : 'S'} · SRC /dev/medium
    </p>
  </header>

  {#if data.feed.length === 0}
    <p class="empty font-instr">// unable to load Medium posts right now — retry later.</p>
  {:else}
    <ol class="rows" aria-label="Posts">
      <li class="row colhead font-silk" aria-hidden="true">
        <span>REF</span><span>PKG</span><span>DESCRIPTION</span><span class="r">DATE</span>
      </li>
      {#each data.feed as item, i (item.link)}
        {@const slug = slugFor(item.link)}
        <li class="row">
          <span class="ref font-silk"><span class="pad" aria-hidden="true"></span>{refFor(i)}</span>
          <a class="pkg" href="/blog/{slug}" tabindex="-1" aria-hidden="true">
            <img src={item.image || PLACEHOLDER_IMAGE} alt="" width="120" height="84" loading="lazy" />
          </a>
          <span class="desc">
            <a class="title" href="/blog/{slug}">{item.title || 'Untitled'}</a>
            <span class="snip">{truncate(item.contentSnippet, SNIPPET_LENGTH)}</span>
          </span>
          <span class="date font-instr r">{isoDate(item.pubDate)}</span>
        </li>
      {/each}
    </ol>
  {/if}

  <footer class="foot">
    <a
      class="medium"
      href="https://medium.com/@enkhy"
      target="_blank"
      rel="noopener noreferrer">Read more on Medium ↗</a
    >
    <a class="back font-instr" href="/">← cd /</a>
  </footer>
</main>

<style>
  .bom {
    width: min(820px, 100%);
    margin-inline: auto;
    padding: clamp(2rem, 7vw, 5rem) clamp(1rem, 4vw, 2rem) 4rem;
  }
  .crumb { font-size: 0.74rem; letter-spacing: 0.06em; color: var(--muted); margin-bottom: 1.6rem; }
  .crumb a { color: var(--accent-ink); }
  .crumb .sep { margin: 0 0.5em; color: var(--border); }
  .crumb .here { color: var(--fg); }

  .head { border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 0.5rem; }
  h1 {
    font-family: var(--display);
    font-size: clamp(2.6rem, 8vw, 4.5rem);
    font-variation-settings: 'opsz' 144, 'wght' 540;
    line-height: 1;
    letter-spacing: -0.02em;
    margin: 0;
  }
  .silk { margin: 0.7rem 0 0; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
  .empty { color: var(--muted); margin-top: 2rem; }

  .rows { list-style: none; margin: 0; padding: 0; }
  .row {
    display: grid;
    grid-template-columns: 4.2rem 120px 1fr auto;
    gap: 1rem;
    align-items: center;
    padding: 1rem 0.4rem;
    border-bottom: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
  }
  .colhead {
    padding: 0.6rem 0.4rem;
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
  }
  .row.colhead .r, .row .r { text-align: right; }

  .ref { display: inline-flex; align-items: center; gap: 0.45rem; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.06em; color: var(--accent-ink); }
  .ref .pad { width: 9px; height: 9px; border-radius: 50%; background: var(--pad); border: 2px solid var(--accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 18%, transparent); }

  .pkg { display: block; border: 1px solid var(--border); border-radius: 3px; overflow: hidden; line-height: 0; background: var(--surface); }
  .pkg img { display: block; width: 120px; height: 84px; object-fit: cover; filter: saturate(0.85); transition: filter 0.25s ease; }
  .row:hover .pkg img { filter: saturate(1.05); }

  .desc { display: flex; flex-direction: column; gap: 0.3rem; min-width: 0; }
  .title { font-family: var(--display); font-size: clamp(1.05rem, 2.4vw, 1.4rem); font-variation-settings: 'opsz' 40, 'wght' 520; color: var(--fg); line-height: 1.2; }
  .title:hover { color: var(--accent-ink); text-decoration: none; }
  .snip { font-family: var(--instr); font-size: 0.76rem; color: var(--muted); line-height: 1.4; }
  .date { font-size: 0.78rem; color: var(--accent2); white-space: nowrap; }

  .foot { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-top: 2.5rem; }
  .medium {
    display: inline-flex; align-items: center;
    border: 1px solid var(--accent);
    border-radius: 5px;
    padding: 0.6rem 1.1rem;
    font-family: var(--silk);
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    color: var(--accent-ink);
    text-transform: uppercase;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .medium:hover { background: var(--accent); color: var(--bg); text-decoration: none; }
  .back { color: var(--muted); margin-left: auto; }
  .back:hover { color: var(--accent-ink); }

  @media (max-width: 640px) {
    /* clean media-object row: thumbnail left, title/snippet/date stacked right */
    .row { grid-template-columns: 76px 1fr; grid-template-areas: 'pkg desc' 'pkg date'; gap: 0.3rem 0.9rem; align-items: start; padding: 1.1rem 0; }
    .ref { display: none; }
    .pkg { grid-area: pkg; align-self: start; }
    .pkg img { width: 76px; height: 76px; }
    .desc { grid-area: desc; }
    .date { grid-area: date; text-align: left; }
    .colhead { display: none; }
  }
</style>
