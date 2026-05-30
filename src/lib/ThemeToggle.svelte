<script lang="ts">
  import { onMount } from 'svelte';

  let theme = $state<'light' | 'dark'>('light');
  let mounted = $state(false);

  onMount(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = (stored as 'light' | 'dark' | null) ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    mounted = true;
  });

  function toggle() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    // brown-out, then re-bloom in the new palette
    const root = document.documentElement;
    root.classList.add('theming');
    window.setTimeout(() => root.classList.remove('theming'), 220);
  }
</script>

{#if mounted}
  <button
    onclick={toggle}
    aria-label="Toggle theme"
    aria-pressed={theme === 'dark'}
    title="Power rail — toggle theme"
    class="pwr"
    class:on={theme === 'dark'}
    type="button"
  >
    <span class="silk" aria-hidden="true">PWR</span>
    <svg viewBox="0 0 48 24" width="48" height="24" aria-hidden="true">
      <rect class="track" x="1" y="1" width="46" height="22" rx="5" />
      <line class="rail" x1="13" y1="6" x2="13" y2="18" />
      <line class="rail" x1="35" y1="6" x2="35" y2="18" />
      <g class="wiper">
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <line x1="12" y1="8" x2="12" y2="13" />
        <circle cx="12" cy="14.5" r="1.1" />
      </g>
    </svg>
  </button>
{/if}

<style>
  .pwr {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 50;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.3rem 0.5rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: color-mix(in srgb, var(--surface) 70%, transparent);
    backdrop-filter: blur(3px);
    cursor: pointer;
    transition: border-color 0.2s ease;
  }
  .pwr:hover { border-color: var(--accent); }
  .silk {
    font-family: var(--silk);
    font-size: 0.58rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: var(--muted);
  }
  .track { fill: color-mix(in srgb, var(--bg) 70%, var(--surface)); stroke: var(--border); stroke-width: 1.5; }
  .rail { stroke: var(--muted); stroke-width: 1.4; opacity: 0.5; }
  .wiper {
    fill: var(--accent);
    stroke: color-mix(in srgb, var(--accent) 60%, var(--fg) 20%);
    stroke-width: 1;
    transform: translateX(0);
    transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .wiper line, .wiper circle { stroke: var(--bg); stroke-width: 1.4; fill: var(--bg); }
  .pwr.on .wiper { transform: translateX(24px); }
  .pwr.on .wiper { fill: var(--accent2); }

  /* brown-out → re-bloom on theme flip (board substrate dips, then new palette blooms) */
  :global(.theming) :global(.board-substrate) { animation: brownout 0.2s ease; }
  @keyframes brownout {
    0% { filter: brightness(1); }
    45% { filter: brightness(0.72); }
    100% { filter: brightness(1); }
  }
</style>
