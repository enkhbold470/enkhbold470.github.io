<script lang="ts">
  import { onMount } from 'svelte';
  import Readout from '$lib/Readout.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let proseEl: HTMLElement;
  let minutes = $state(1);
  let ready = $state(false);
  let progress = $state(0);

  function isoDate(d?: string): string {
    if (!d) return '';
    const t = new Date(d);
    return Number.isNaN(t.getTime()) ? '' : t.toISOString().slice(0, 10);
  }

  onMount(() => {
    const words = (proseEl?.innerText ?? '').trim().split(/\s+/).filter(Boolean).length;
    minutes = Math.max(1, Math.round(words / 220));
    ready = true;

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress = h > 0 ? Math.min(1, window.scrollY / h) : 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  });
</script>

<svelte:head>
  <title>{data.post.title} · Blog</title>
  {#if data.post.contentSnippet}
    <meta name="description" content={data.post.contentSnippet.slice(0, 200)} />
  {/if}
</svelte:head>

<div class="rail" aria-hidden="true"><span class="fill" style="height:{progress * 100}%"></span></div>

<main class="post">
  <nav class="crumb font-instr" aria-label="Breadcrumb">
    <a href="/">HOME</a><span class="sep">▸</span><a href="/blog">/blog</a><span class="sep">▸</span><span
      class="here">{data.post.title}</span
    >
  </nav>

  <header class="head">
    <p class="tag font-silk" aria-hidden="true">ASSEMBLY DRAWING · REV A</p>
    <h1 class="name">{data.post.title}</h1>
    <div class="rule" aria-hidden="true"></div>
    <p class="meta font-instr">
      {#if isoDate(data.post.pubDate)}<span class="date">{isoDate(data.post.pubDate)}</span><span class="sep">·</span>{/if}
      <span class="read">EST. READ <Readout value={minutes} animate={ready} class="rt" /> MIN</span>
    </p>
  </header>

  <article class="prose" bind:this={proseEl}>
    {@html data.renderedContent}
  </article>

  <footer class="foot">
    <a class="back font-instr" href="/blog">← cd /blog</a>
    <a
      class="medium font-silk"
      href={data.post.link}
      target="_blank"
      rel="noopener noreferrer">View on Medium ↗</a
    >
  </footer>
</main>

<style>
  .rail {
    position: fixed;
    top: 0;
    left: 0;
    width: 3px;
    height: 100vh;
    background: color-mix(in srgb, var(--border) 60%, transparent);
    z-index: 40;
  }
  .rail .fill {
    display: block;
    width: 100%;
    background: var(--accent);
    box-shadow: 0 0 6px var(--glow);
  }

  .post {
    width: min(680px, 100%);
    margin-inline: auto;
    padding: clamp(2rem, 7vw, 5rem) clamp(1rem, 4vw, 2rem) 5rem;
  }
  .crumb { font-size: 0.72rem; letter-spacing: 0.05em; color: var(--muted); margin-bottom: 2rem; }
  .crumb a { color: var(--accent-ink); }
  .crumb .sep { margin: 0 0.45em; color: var(--border); }
  .crumb .here {
    color: var(--fg);
    display: inline-block;
    max-width: 22ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
  }

  .tag { font-size: 0.66rem; letter-spacing: 0.16em; color: var(--accent2); text-transform: uppercase; margin: 0 0 0.8rem; }
  .name {
    font-family: var(--display);
    font-size: clamp(2rem, 5.6vw, 3.4rem);
    font-variation-settings: 'opsz' 144, 'wght' 560;
    line-height: 1.05;
    letter-spacing: -0.015em;
    margin: 0;
    color: var(--fg);
  }
  .rule { height: 2px; width: 64px; background: var(--accent); margin: 1.1rem 0; }
  .meta { font-size: 0.76rem; letter-spacing: 0.04em; color: var(--muted); margin: 0 0 2.2rem; }
  .meta .date { color: var(--accent2); }
  .meta .sep { margin: 0 0.5em; color: var(--border); }
  .meta :global(.rt) { color: var(--accent-ink); font-size: inherit; }

  /* assembly body — a per-block cat -n line-number gutter */
  .prose {
    counter-reset: ln;
    position: relative;
    padding-left: 3.4rem;
    font-family: var(--display);
    font-size: 1.12rem;
    line-height: 1.72;
    color: var(--fg);
    font-variation-settings: 'opsz' 24, 'wght' 400;
    word-break: break-word;
  }
  .prose :global(> *) { position: relative; }
  .prose :global(> *)::before {
    counter-increment: ln;
    content: counter(ln, decimal-leading-zero);
    position: absolute;
    left: -3.4rem;
    width: 2.6rem;
    text-align: right;
    font-family: var(--instr);
    font-size: 0.7rem;
    line-height: inherit;
    color: var(--muted);
    opacity: 0.55;
    user-select: none;
  }
  .prose :global(h1),
  .prose :global(h2),
  .prose :global(h3) {
    font-family: var(--display);
    font-variation-settings: 'opsz' 80, 'wght' 600;
    line-height: 1.2;
    margin: 2rem 0 0.8rem;
  }
  .prose :global(h2)::after,
  .prose :global(h3)::after { content: ''; }
  .prose :global(p) { margin: 0 0 1.3rem; }
  .prose :global(a) { color: var(--accent-ink); text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--accent) 45%, transparent); }
  .prose :global(img),
  .prose :global(iframe) { max-width: 100%; height: auto; border-radius: 4px; border: 1px solid var(--border); margin: 1.4rem 0; }
  .prose :global(iframe) { aspect-ratio: 16 / 9; width: 100%; }
  .prose :global(pre),
  .prose :global(code) { font-family: var(--instr); font-size: 0.86em; background: color-mix(in srgb, var(--surface) 60%, transparent); border-radius: 3px; }
  .prose :global(pre) { padding: 1rem; overflow-x: auto; border: 1px solid var(--border); }
  .prose :global(code) { padding: 0.1em 0.35em; }
  .prose :global(blockquote) {
    border-left: 2px solid var(--accent);
    margin: 1.3rem 0;
    padding-left: 1rem;
    color: var(--muted);
    font-style: italic;
  }

  .foot { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px dashed var(--border); }
  .back { color: var(--muted); }
  .back:hover { color: var(--accent-ink); }
  .medium {
    margin-left: auto;
    border: 1px solid var(--accent);
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--accent-ink);
    transition: background 0.2s ease, color 0.2s ease;
  }
  .medium:hover { background: var(--accent); color: var(--bg); text-decoration: none; }

  @media (max-width: 560px) {
    .prose { padding-left: 2.6rem; }
    .prose :global(> *)::before { left: -2.6rem; width: 2rem; }
  }
</style>
