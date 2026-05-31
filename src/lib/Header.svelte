<script lang="ts">
  import { onMount } from 'svelte';
  import { Sun, Moon } from 'lucide-svelte';

  // Minimal sticky header (ported from a 21st.dev "Header 2" pattern): a clean
  // bar that condenses into a translucent, blurred, rounded pill on scroll.
  // Consolidates site nav + the theme toggle so navigation is persistent & obvious.
  let theme = $state<'light' | 'dark'>('light');
  let mounted = $state(false);
  let scrolled = $state(false);

  onMount(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = (stored as 'light' | 'dark' | null) ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    mounted = true;

    const onScroll = () => (scrolled = window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    root.classList.add('theming'); // 180ms brown-out → re-bloom
    window.setTimeout(() => root.classList.remove('theming'), 220);
  }
</script>

<header class="site-header" class:scrolled aria-label="Site">
  <nav class="bar">
    <a class="mark" href="/" aria-label="Home — Inky Ganbold">
      <span>inkyg</span><span class="dot">.</span><span>com</span>
    </a>
    <div class="right">
      <a class="navlink" href="/blog">Blog</a>
      {#if mounted}
        <button
          class="toggle"
          type="button"
          onclick={toggleTheme}
          aria-label="Toggle theme"
          aria-pressed={theme === 'dark'}
          title="Toggle theme"
        >
          {#if theme === 'dark'}<Sun size={17} aria-hidden="true" />{:else}<Moon
              size={17}
              aria-hidden="true"
            />{/if}
        </button>
      {/if}
    </div>
  </nav>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 60;
    width: 100%;
    transition: padding 0.25s ease;
  }
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: min(1180px, 100%);
    margin-inline: auto;
    height: 56px;
    padding: 0 clamp(1rem, 3vw, 2rem);
    border-bottom: 1px solid transparent;
    transition: background 0.25s ease, border-color 0.25s ease, max-width 0.25s ease,
      height 0.25s ease, box-shadow 0.25s ease, border-radius 0.25s ease;
  }
  /* on scroll: translucent blurred bar */
  .site-header.scrolled .bar {
    background: color-mix(in srgb, var(--bg) 82%, transparent);
    backdrop-filter: blur(10px);
    border-bottom-color: var(--border);
  }
  /* on desktop, condense into a centered floating pill */
  @media (min-width: 768px) {
    .site-header.scrolled {
      padding-top: 0.6rem;
    }
    .site-header.scrolled .bar {
      max-width: 940px;
      height: 50px;
      border: 1px solid var(--border);
      border-radius: 11px;
      box-shadow: 0 8px 28px -14px color-mix(in srgb, var(--fg) 34%, transparent);
    }
  }

  .mark {
    font-family: var(--silk);
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    color: var(--fg);
    text-decoration: none;
    padding: 0.5rem 0;
  }
  .mark:hover { text-decoration: none; }
  .mark .dot { color: var(--accent); }

  .right {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .navlink {
    font-family: var(--silk);
    font-size: 0.74rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent-ink);
    text-decoration: none;
    padding: 0.7rem 0.7rem;
    border-radius: 7px;
    transition: background 0.18s ease, color 0.18s ease;
  }
  .navlink:hover {
    color: var(--accent2);
    background: color-mix(in srgb, var(--accent) 9%, transparent);
    text-decoration: none;
  }
  .toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: color-mix(in srgb, var(--surface) 55%, transparent);
    color: var(--fg);
    cursor: pointer;
    transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
  }
  .toggle:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
</style>
