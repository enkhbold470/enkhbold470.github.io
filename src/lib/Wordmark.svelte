<script lang="ts">
  import { onMount } from 'svelte';

  /** The board's title-block wordmark. Each glyph is a Fraunces Variable span;
   *  a gaussian falloff around the pointer's X drives a wave of boldness that
   *  chases the cursor. The single most replayable micro-delight on the board.
   *  Decorative (aria-hidden) — the accessible name lives on the parent <h1>. */
  let { text = 'INKY GANBOLD' }: { text?: string } = $props();

  const REST = 360; // resting weight
  const PEAK = 500; // added at the cursor (→ ~860 max)
  const SIGMA = 86; // px spread of the wave

  let root: HTMLElement;
  const words = $derived(text.split(' '));

  onMount(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // CSS leaves the static weight (600)

    const spans = Array.from(root.querySelectorAll<HTMLElement>('[data-g]'));
    let centers: number[] = [];
    const measure = () => {
      centers = spans.map((s) => {
        const r = s.getBoundingClientRect();
        return r.left + r.width / 2;
      });
    };
    measure();
    // settle from the SSR weight (600) to the resting weight
    spans.forEach((s) => (s.style.fontVariationSettings = `'opsz' 144, 'wght' ${REST}`));

    const ro = new ResizeObserver(measure);
    ro.observe(root);

    let targetX = -1e9;
    let pending = false;
    const apply = () => {
      pending = false;
      for (let i = 0; i < spans.length; i++) {
        const d = centers[i] - targetX;
        const w = Math.round(REST + PEAK * Math.exp(-(d * d) / (2 * SIGMA * SIGMA)));
        spans[i].style.fontVariationSettings = `'opsz' 144, 'wght' ${w}`;
      }
    };
    const schedule = () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(apply);
      }
    };
    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      schedule();
    };
    const onLeave = () => {
      targetX = -1e9;
      schedule();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave);

    return () => {
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
    };
  });
</script>

<span bind:this={root} class="wordmark" aria-hidden="true">
  {#each words as word, wi (wi)}
    <span class="word">
      {#each word.split('') as g, gi (gi)}<span
          data-g
          style="font-variation-settings:'opsz' 144,'wght' 600">{g}</span
        >{/each}
    </span>
  {/each}
</span>

<style>
  .wordmark {
    display: flex;
    flex-wrap: wrap;
    column-gap: 0.26em;
    row-gap: 0;
    font-family: var(--display);
    font-size: clamp(2.7rem, 10.5vw, 7.5rem);
    line-height: 0.9;
    letter-spacing: -0.02em;
    color: var(--fg);
    text-transform: uppercase;
  }
  .wordmark .word {
    display: inline-flex;
    white-space: nowrap;
  }
  .wordmark [data-g] {
    display: inline-block;
    transition: font-variation-settings 0.13s ease-out;
    will-change: font-variation-settings;
  }
</style>
