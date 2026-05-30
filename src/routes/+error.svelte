<script lang="ts">
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>{page.status === 404 ? '404 - Page Not Found' : 'Error'}</title>
</svelte:head>

<main class="err">
  <p class="tag font-silk" aria-hidden="true">// FAULT</p>
  {#if page.status === 404}
    <h1 class="code">404</h1>
    <p class="msg font-instr">no component at this reference designator — the trace dead-ends.</p>
  {:else}
    <h1 class="code">Error {page.status}</h1>
    <p class="msg font-instr">{page.error?.message ?? 'something shorted out.'}</p>
  {/if}
  <a href="/" aria-label="Return to home page" class="home font-silk">← Back to Home</a>
</main>

<style>
  .err {
    min-height: 80svh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    gap: 0.4rem;
  }
  .tag { font-size: 0.7rem; letter-spacing: 0.18em; color: var(--accent2); text-transform: uppercase; }
  .code {
    font-family: var(--display);
    font-size: clamp(4rem, 18vw, 10rem);
    font-variation-settings: 'opsz' 144, 'wght' 620;
    line-height: 0.9;
    letter-spacing: -0.03em;
    color: var(--accent);
    margin: 0.4rem 0;
  }
  .msg { color: var(--muted); font-size: 0.92rem; max-width: 36ch; }
  .home {
    margin-top: 1.4rem;
    border: 1px solid var(--accent);
    border-radius: 5px;
    padding: 0.55rem 1.2rem;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--accent-ink);
    transition: background 0.2s ease, color 0.2s ease;
  }
  .home:hover { background: var(--accent); color: var(--bg); text-decoration: none; }
</style>
