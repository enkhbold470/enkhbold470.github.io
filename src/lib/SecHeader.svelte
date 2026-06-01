<script lang="ts">
  // Section header for the dossier — silkscreen index + title + sub-label and a
  // copper hairline running right. A plain component (not a snippet) to keep
  // SSR/hydration alignment rock-solid in production builds.
  let { idx, title, sub }: { idx: string; title: string; sub: string } = $props();
</script>

<header class="sec" data-reveal>
  <span class="idx font-silk">{idx}</span>
  <div class="sec-titles">
    <h2 class="font-silk">{title}</h2>
    <span class="sub font-instr">{sub}</span>
  </div>
  <span class="rule"></span>
</header>

<style>
  .sec {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    min-width: 0;
    max-width: 100%;
  }
  .idx {
    flex-shrink: 0;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--accent-ink);
  }
  .sec-titles {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    flex: 1 1 auto;
    min-width: 0;
  }
  h2 {
    margin: 0;
    font-size: clamp(0.95rem, 2.2vw, 1.15rem);
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--fg);
    overflow-wrap: anywhere;
  }
  .sub {
    font-size: 0.66rem;
    letter-spacing: 0.04em;
    color: var(--muted);
    text-transform: lowercase;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
  .rule {
    flex: 1 1 2rem;
    min-width: 1.5rem;
    height: 1px;
    align-self: center;
    background: linear-gradient(90deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 12%, transparent) 100%);
    margin-bottom: 0.35rem;
  }

  @media (max-width: 760px) {
    .sec {
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 0.35rem 0.65rem;
    }
    .sec-titles {
      flex: 1 1 0;
    }
    h2 {
      font-size: 0.88rem;
      letter-spacing: 0.1em;
    }
    .rule {
      flex: 1 1 100%;
      order: 3;
      margin-top: 0.1rem;
      margin-bottom: 0;
    }
  }

  [data-reveal] { opacity: 0; transform: translateY(14px); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
  :global([data-reveal].in) { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) {
    [data-reveal] { opacity: 1; transform: none; transition: none; }
  }
</style>
