<script lang="ts">
  import { siteConfig } from '$lib/siteConfig';
  import Board from '$lib/Board.svelte';
  import Dossier from '$lib/Dossier.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{siteConfig.title}</title>
  <meta property="og:type" content="profile" />
  <meta property="profile:first_name" content="Inky" />
  <meta property="profile:last_name" content="Ganbold" />
  <meta property="profile:username" content="1nkfy" />
</svelte:head>

<style>
  .bridge {
    width: min(1180px, 100%);
    margin: 0.5rem auto 2.5rem;
    padding: 0 clamp(1rem, 3vw, 2rem);
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  .bridge-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 45%, transparent), transparent);
  }
  .bridge-label {
    font-family: var(--silk, 'Chivo Mono', monospace);
    font-size: 0.62rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .bridge-chev {
    color: var(--accent-ink);
    font-size: 0.7rem;
    animation: bob 2.4s ease-in-out infinite;
  }
  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(3px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .bridge-chev { animation: none; }
  }
</style>

<!-- single <main> root: gives the page one root element so SvelteKit's
     production hydration can't misalign bare component-to-component siblings
     (which was silently discarding the dossier). Also a proper main landmark. -->
<main class="home">
  <Board commits={data.commits} />

  <div class="bridge" aria-hidden="true">
    <span class="bridge-line"></span>
    <span class="bridge-label">FULL DOSSIER</span>
    <span class="bridge-chev">▾</span>
    <span class="bridge-line"></span>
  </div>

  <Dossier posts={data.posts} />
</main>
