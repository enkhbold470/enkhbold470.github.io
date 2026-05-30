<script lang="ts">
  /**
   * Instrument count-up with a slight needle overshoot, then settle.
   * Reused by U1 (wins/hacks), Y1 (live commits), C1 (hosted), blog read-time.
   * Animates only when `animate` flips true (driven by the board power-up);
   * otherwise — and always under prefers-reduced-motion — shows the final value.
   */
  let {
    value = 0,
    prefix = '',
    suffix = '',
    comma = false,
    animate = false,
    duration = 1100,
    class: klass = ''
  }: {
    value?: number;
    prefix?: string;
    suffix?: string;
    comma?: boolean;
    animate?: boolean;
    duration?: number;
    class?: string;
  } = $props();

  // null → show the (reactive) prop value; a number → mid-animation
  let display = $state<number | null>(null);
  const shown = $derived(display ?? value);
  let hasRun = false;

  function fmt(n: number): string {
    if (!Number.isFinite(n)) return '—';
    const r = Math.round(n);
    return comma ? r.toLocaleString('en-US') : String(r);
  }

  // easeOutBack — overshoots ~7% then settles, reading as an instrument needle
  function ease(t: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  $effect(() => {
    if (!animate || hasRun) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      display = value;
      return;
    }
    hasRun = true;
    let raf = 0;
    let start = 0;
    display = 0;
    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      display = t < 1 ? value * ease(t) : value;
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  });
</script>

<span class="readout tnum font-instr {klass}">{prefix}{fmt(shown)}{suffix}</span>

<style>
  .readout {
    font-weight: 500;
    letter-spacing: -0.01em;
    color: var(--fg);
    font-variant-numeric: tabular-nums;
  }
</style>
