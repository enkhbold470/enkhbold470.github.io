<script lang="ts">
  import { onMount } from 'svelte';
  import { siteConfig, recentUpdates, heroTagline } from '$lib/siteConfig';
  import { tokenizeBio } from '$lib/bioLinks';
  import Wordmark from '$lib/Wordmark.svelte';
  import Readout from '$lib/Readout.svelte';
  import ScopeTrace from '$lib/ScopeTrace.svelte';

  let { commits = siteConfig.stats.commitsFloor }: { commits?: number } = $props();

  const s = siteConfig.stats;
  const bioTokens = tokenizeBio(siteConfig.bio.text, siteConfig.bio.links);

  // ── boot phase machine: SSR/default = 'live' (fully built) ─────────
  type Phase = 'live' | 'cold' | 'routing';
  let phase = $state<Phase>('live');
  let animateCounters = $state(false);
  let flash = $state(false);
  const phaseClass = $derived('phase-' + phase);

  // ── net highlight ──────────────────────────────────────────────
  let hoveredNet = $state<string | null>(null);
  function netState(net: string): '' | 'hot' | 'dim' {
    if (phase !== 'live' || !hoveredNet) return '';
    if (hoveredNet === 'MCU' || hoveredNet === net) return 'hot';
    return 'dim';
  }
  // non-visual equivalent for the color-based net highlight (WCAG 1.4.1 / 4.1.3)
  const NET_LABEL: Record<string, string> = {
    PWR: 'power', HACK: 'hackathon wins', CLK: 'commit clock', HOST: 'hosted events',
    IO: 'Google I/O', FGC: 'FIRST Global', ERRATA: 'errata', BUS: 'profiles', MCU: 'system bus'
  };
  const netAnnounce = $derived(
    phase === 'live' && hoveredNet ? `Highlighting ${NET_LABEL[hoveredNet] ?? hoveredNet} net` : ''
  );

  // ── measured copper router (MCU = hub) ─────────────────────────
  let boardEl: HTMLElement;
  let dims = $state({ w: 0, h: 0 });
  type Trace = { net: string; d: string; i: number };
  type Via = { x: number; y: number; i: number; net: string; pad?: boolean };
  let traces = $state<Trace[]>([]);
  let vias = $state<Via[]>([]);

  type Side = 'top' | 'right' | 'bottom' | 'left';
  const TOPO: { net: string; to: string; from: [Side, number]; toAt: [Side, number] }[] = [
    { net: 'PWR',    to: 'title',  from: ['top', 0.22],    toAt: ['bottom', 0.18] },
    { net: 'HACK',   to: 'u1',     from: ['right', 0.16],  toAt: ['left', 0.5] },
    { net: 'CLK',    to: 'y1',     from: ['right', 0.36],  toAt: ['left', 0.5] },
    { net: 'HOST',   to: 'c1',     from: ['right', 0.56],  toAt: ['left', 0.5] },
    { net: 'IO',     to: 'j1',     from: ['right', 0.76],  toAt: ['left', 0.5] },
    { net: 'FGC',    to: 'edge',   from: ['bottom', 0.72], toAt: ['top', 0.5] },
    { net: 'ERRATA', to: 'errata', from: ['bottom', 0.32], toAt: ['top', 0.4] },
    { net: 'BUS',    to: 'footer', from: ['bottom', 0.5],  toAt: ['top', 0.16] }
  ];
  const MOBILE_ORDER = ['title', 'mcu', 'u1', 'y1', 'c1', 'j1', 'edge', 'errata', 'footer'];

  // element refs cached once at mount — measure() avoids 9 querySelectors per resize
  const fpCache = new Map<string, HTMLElement>();
  function rectOf(fp: string): DOMRect | null {
    const el = fpCache.get(fp) ?? boardEl?.querySelector<HTMLElement>(`[data-fp="${fp}"]`) ?? null;
    return el ? el.getBoundingClientRect() : null;
  }
  function edge(r: DOMRect, base: DOMRect, side: Side, t: number) {
    const x = r.left - base.left;
    const y = r.top - base.top;
    if (side === 'top') return { x: x + r.width * t, y };
    if (side === 'bottom') return { x: x + r.width * t, y: y + r.height };
    if (side === 'left') return { x, y: y + r.height * t };
    return { x: x + r.width, y: y + r.height * t };
  }
  function route(a: { x: number; y: number }, b: { x: number; y: number }) {
    const dx = b.x - a.x, dy = b.y - a.y;
    const adx = Math.abs(dx), ady = Math.abs(dy);
    const diag = Math.min(adx, ady);
    const sx = Math.sign(dx), sy = Math.sign(dy);
    if (adx >= ady) {
      const mx = a.x + sx * (adx - diag);
      return { d: `M ${a.x} ${a.y} L ${mx} ${a.y} L ${b.x} ${b.y}`, bend: { x: mx, y: a.y } };
    }
    const my = a.y + sy * (ady - diag);
    return { d: `M ${a.x} ${a.y} L ${a.x} ${my} L ${b.x} ${b.y}`, bend: { x: a.x, y: my } };
  }

  function measure() {
    if (!boardEl) return;
    const base = boardEl.getBoundingClientRect();
    if (base.width === 0 || base.height === 0) {
      traces = [];
      vias = [];
      return;
    }
    dims = { w: base.width, h: base.height };

    if (base.width < 760) {
      // mobile: a single vertical bus the components dock off
      const cx = Math.round(base.width / 2);
      const centers = MOBILE_ORDER.map((id) => rectOf(id))
        .filter((r): r is DOMRect => !!r)
        .map((r) => r.top - base.top + r.height / 2);
      if (centers.length < 2) { traces = []; vias = []; return; }
      const top = centers[0], bot = centers[centers.length - 1];
      traces = [{ net: 'BUS', d: `M ${cx} ${top} L ${cx} ${bot}`, i: 0 }];
      vias = centers.map((y, i) => ({ x: cx, y, i, net: 'BUS', pad: true }));
      return;
    }

    const mcu = rectOf('mcu');
    if (!mcu) return;
    const tr: Trace[] = [];
    const vs: Via[] = [];
    TOPO.forEach((tp, i) => {
      const target = rectOf(tp.to);
      if (!target) return;
      const a = edge(mcu, base, tp.from[0], tp.from[1]);
      const b = edge(target, base, tp.toAt[0], tp.toAt[1]);
      const { d, bend } = route(a, b);
      tr.push({ net: tp.net, d, i });
      vs.push({ x: bend.x, y: bend.y, i, net: tp.net });
      vs.push({ x: b.x, y: b.y, i, net: tp.net, pad: true });
    });
    traces = tr;
    vias = vs;
  }

  // ── live clock + uptime (information, not motion) ──────────────
  let clock = $state('--:--:--');
  let uptime = $state('00:00');

  onMount(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    boardEl.querySelectorAll<HTMLElement>('[data-fp]').forEach((el) => {
      if (el.dataset.fp) fpCache.set(el.dataset.fp, el);
    });
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(boardEl);

    const t0 = performance.now();
    const pad = (n: number) => String(n).padStart(2, '0');
    const tickClock = () => {
      const d = new Date();
      clock = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      const up = Math.floor((performance.now() - t0) / 1000);
      uptime = `${pad(Math.floor(up / 60))}:${pad(up % 60)}`;
    };
    tickClock();
    const clockId = setInterval(tickClock, 1000);

    let doneId: ReturnType<typeof setTimeout> | undefined;
    let flashId: ReturnType<typeof setTimeout> | undefined;
    const skipEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    let finish = () => {};

    const booted = sessionStorage.getItem('rev_a_booted');
    if (!reduce && !booted) {
      phase = 'cold';
      animateCounters = true;
      requestAnimationFrame(() => requestAnimationFrame(() => (phase = 'routing')));
      const total = TOPO.length * 80 + 760;
      finish = () => {
        phase = 'live';
        flash = true;
        flashId = setTimeout(() => (flash = false), 260);
        sessionStorage.setItem('rev_a_booted', '1');
        skipEvents.forEach((e) => window.removeEventListener(e, onSkip));
      };
      const onSkip = () => {
        if (doneId) clearTimeout(doneId);
        finish();
      };
      doneId = setTimeout(finish, total);
      skipEvents.forEach((e) => window.addEventListener(e, onSkip, { passive: true }));
      return () => {
        ro.disconnect();
        clearInterval(clockId);
        if (doneId) clearTimeout(doneId);
        if (flashId) clearTimeout(flashId);
        skipEvents.forEach((e) => window.removeEventListener(e, onSkip));
      };
    }

    return () => {
      ro.disconnect();
      clearInterval(clockId);
    };
  });

  // Delegated net-highlight: one action on the board reads data-net from the
  // hovered/focused descendant (works for both copper traces and components).
  function netHover(node: HTMLElement) {
    let cur: string | null = null;
    const upd = (n: string | null) => {
      if (n !== cur) {
        cur = n;
        hoveredNet = n;
      }
    };
    const from = (e: Event) =>
      ((e.target as HTMLElement)?.closest?.('[data-net]') as HTMLElement | null)?.dataset.net ?? null;
    const move = (e: PointerEvent) => upd(from(e));
    const out = () => upd(null);
    const fin = (e: FocusEvent) => upd(from(e));
    const fout = (e: FocusEvent) => {
      if (!node.contains(e.relatedTarget as Node)) upd(null);
    };
    node.addEventListener('pointermove', move, { passive: true });
    node.addEventListener('pointerleave', out);
    node.addEventListener('focusin', fin);
    node.addEventListener('focusout', fout);
    return {
      destroy() {
        node.removeEventListener('pointermove', move);
        node.removeEventListener('pointerleave', out);
        node.removeEventListener('focusin', fin);
        node.removeEventListener('focusout', fout);
      }
    };
  }
</script>

<section
  bind:this={boardEl}
  class="board {phaseClass}"
  class:flash
  aria-label="Inky Ganbold — circuit board"
  use:netHover
>
  <div class="sr-only" aria-live="polite" aria-atomic="true">{netAnnounce}</div>

  <!-- copper overlay (decorative) -->
  <svg
    class="copper"
    width={dims.w}
    height={dims.h}
    viewBox="0 0 {dims.w} {dims.h}"
    aria-hidden="true"
    focusable="false"
  >
    {#each traces as t (t.net)}
      <path class="hit" d={t.d} data-net={t.net} />
      <path
        class="trace {netState(t.net)}"
        style="--i:{t.i}"
        d={t.d}
        pathLength="1"
      />
    {/each}
    {#each vias as v (v.net + '-' + v.x + '-' + v.y)}
      <circle
        class="via {v.pad ? 'pad' : ''} {netState(v.net)}"
        style="--i:{v.i}"
        cx={v.x}
        cy={v.y}
        r={v.pad ? 5 : 4}
      />
      <circle class="via-hole" cx={v.x} cy={v.y} r={v.pad ? 2 : 1.6} />
    {/each}
  </svg>

  <div class="grid">
    <!-- TITLE BLOCK -->
    <header class="fp title {netState('PWR')}" data-fp="title" data-net="PWR" style="--i:0">
      <h1 aria-label="Hi, I'm Inky Ganbold">
        <Wordmark text="INKY GANBOLD" />
      </h1>
      <p class="subtitle font-silk" aria-hidden="true">
        HARDWARE <span class="x">×</span> SOFTWARE
        <span class="dot">·</span> SUNNYVALE <span class="arrow">↔</span> УЛААНБААТАР
      </p>
      <p class="tagline font-silk" aria-hidden="true">{heroTagline}</p>
      <span class="net-badge font-instr" aria-hidden="true">NET: PWR_3V3</span>
    </header>

    <!-- MCU / BIO -->
    <article class="fp mcu {netState('MCU')}" data-fp="mcu" data-net="MCU" style="--i:0">
      <div class="ref font-silk">U0 · MCU</div>
      <svg class="sym qfp" viewBox="0 0 40 40" aria-hidden="true">
        <rect x="9" y="9" width="22" height="22" rx="2" />
        <circle cx="13" cy="13" r="1.5" class="pin1" />
        {#each [14, 20, 26] as p (p)}
          <line x1={p} y1="4" x2={p} y2="9" />
          <line x1={p} y1="31" x2={p} y2="36" />
          <line x1="4" y1={p} x2="9" y2={p} />
          <line x1="31" y1={p} x2="36" y2={p} />
        {/each}
      </svg>
      <p class="bio">
        {#each bioTokens as token, i (i)}{#if token.kind === 'text'}{token.value}{:else}<a
              class="tp"
              href={token.url}
              target={token.external ? '_blank' : undefined}
              rel={token.external ? 'noopener noreferrer' : undefined}>{token.text}</a
            >{/if}{/each}
      </p>
      <span class="net-badge font-instr" aria-hidden="true">NET: SYS_BUS</span>
    </article>

    <!-- COMPONENT BANK -->
    <div class="bank">
      <figure class="fp comp {netState('HACK')}" data-fp="u1" data-net="HACK" style="--i:1">
        <div class="ref font-silk">U1 · DIP-8</div>
        <svg class="sym" viewBox="0 0 54 30" aria-hidden="true">
          <path d="M8 4 h38 v22 h-38 z" />
          <path class="notch" d="M22 4 a5 5 0 0 0 10 0" />
          {#each [9, 16, 23, 30, 37, 44] as p (p)}
            <line x1={p} y1="0" x2={p} y2="4" />
            <line x1={p} y1="26" x2={p} y2="30" />
          {/each}
        </svg>
        <div class="readouts">
          <span class="stat"><Readout value={s.hackathonsWon} animate={animateCounters} /><b class="font-silk">× WON</b></span>
          <span class="stat"><Readout value={s.hackathonsEntered} animate={animateCounters} /><b class="font-silk">× ENTERED</b></span>
        </div>
        <div class="note font-silk">YC AGENT · TREEHACKS · HACKMIT · MIT ENERGY · HARVARD</div>
        <span class="net-badge font-instr" aria-hidden="true">NET: HACK_WINS</span>
      </figure>

      <figure class="fp comp {netState('CLK')}" data-fp="y1" data-net="CLK" style="--i:2">
        <div class="ref font-silk">Y1 · XTAL</div>
        <div class="xtal-row">
          <svg class="sym xtal" viewBox="0 0 40 30" aria-hidden="true">
            <line x1="4" y1="15" x2="13" y2="15" />
            <rect x="13" y="7" width="3.5" height="16" />
            <path d="M18 5 h4 v20 h-4 z" />
            <rect x="23.5" y="7" width="3.5" height="16" />
            <line x1="27" y1="15" x2="36" y2="15" />
          </svg>
          <ScopeTrace />
        </div>
        <div class="readouts">
          <span class="stat big"><Readout value={commits} comma animate={animateCounters} duration={1400} /><b class="font-silk">COMMITS</b></span>
        </div>
        <div class="note font-silk">f<sub>osc</sub> = he ships · live from /dev/github</div>
        <span class="net-badge font-instr" aria-hidden="true">NET: CLK_MAIN</span>
      </figure>

      <figure class="fp comp {netState('HOST')}" data-fp="c1" data-net="HOST" style="--i:3">
        <div class="ref font-silk">C1 · 100µF</div>
        <svg class="sym" viewBox="0 0 40 30" aria-hidden="true">
          <line x1="4" y1="15" x2="17" y2="15" />
          <line x1="17" y1="4" x2="17" y2="26" />
          <path d="M23 4 a9 9 0 0 0 0 22" fill="none" />
          <line x1="26" y1="15" x2="36" y2="15" />
          <text x="9" y="11" class="silk-mini">+</text>
        </svg>
        <div class="readouts">
          <span class="stat"><Readout value={s.hosted} animate={animateCounters} /><b class="font-silk">HOSTED</b></span>
          <span class="stat"><span class="lit font-instr">{s.prizePool}</span><b class="font-silk">POOL</b></span>
        </div>
        <div class="note font-silk">DAHACKS · DAHACKS 3.0</div>
        <span class="net-badge font-instr" aria-hidden="true">NET: HOST_PWR</span>
      </figure>

      <figure class="fp comp {netState('IO')}" data-fp="j1" data-net="IO" style="--i:4">
        <div class="ref font-silk">J1 · HEADER</div>
        <svg class="sym" viewBox="0 0 44 30" aria-hidden="true">
          <rect x="4" y="9" width="36" height="12" rx="1.5" />
          {#each [10, 17, 24, 31, 38] as p (p)}
            <rect x={p - 1.5} y="11.5" width="3" height="7" class="pinpad" />
          {/each}
        </svg>
        <div class="note big font-silk">GOOGLE I/O</div>
        <div class="note font-silk">2024 · 2025</div>
        <span class="net-badge font-instr" aria-hidden="true">NET: GOOGLE_IO</span>
      </figure>

      <figure class="fp comp edge {netState('FGC')}" data-fp="edge" data-net="FGC" style="--i:5">
        <div class="ref font-silk">P1 · EDGE</div>
        <div class="fingers" aria-hidden="true">
          {#each Array(7) as _, i (i)}<span class="finger"></span>{/each}
        </div>
        <div class="note big font-silk">FIRST GLOBAL 2019</div>
        <div class="rankline">
          <Readout value={s.firstGlobalRank} animate={animateCounters} class="rk" /><span class="rk-sub font-silk">/ {s.nations} NATIONS · DUBAI</span>
        </div>
        <div class="note font-silk">
          <a href={siteConfig.bio.links?.find((l) => l.text === 'FIRST Global 2019')?.url} target="_blank" rel="noopener noreferrer">TEAM MONGOLIA ↗</a>
        </div>
        <span class="net-badge font-instr" aria-hidden="true">NET: FIRST_GLOBAL</span>
      </figure>
    </div>

    <!-- ERRATA / UPDATES -->
    <section class="fp errata {netState('ERRATA')}" data-fp="errata" data-net="ERRATA" style="--i:6">
      <h2 aria-label="Updates" class="ref font-silk">ERRATA</h2>
      <ul>
        {#each recentUpdates as u (u.date)}
          {@const iso = new Date(u.date).toISOString().slice(0, 10)}
          {@const hot = u.title.toLowerCase().includes('shock')}
          <li class="font-instr" class:amber={hot}>
            <span class="date">{iso}</span>
            <span class="dash">—</span>
            <a href={u.url} target="_blank" rel="noopener noreferrer">{u.title}</a>
          </li>
        {/each}
      </ul>
      <span class="net-badge font-instr" aria-hidden="true">NET: ERRATA</span>
    </section>

    <!-- BOTTOM SILK / FOOTER -->
    <footer class="fp foot {netState('BUS')}" data-fp="footer" data-net="BUS" style="--i:7">
      <div class="silk-line font-silk">
        <span>REV&nbsp;A</span><span class="sep">·</span><span>enk.icu</span><span class="sep">·</span><span>©&nbsp;2026</span>
      </div>
      <nav class="connectors" aria-label="Profiles">
        {#each siteConfig.contactDisplay as c, i (c.label)}
          <a
            class="conn"
            href={c.url}
            target={c.external ? '_blank' : undefined}
            rel={c.external ? 'noopener noreferrer' : undefined}
          >
            <span class="conn-ref font-silk" aria-hidden="true">J{i + 2}</span>
            <span class="conn-name">{c.value}</span>
          </a>
        {/each}
        <a class="conn debug" href="/blog">
          <span class="conn-ref font-silk" aria-hidden="true">DBG</span>
          <span class="conn-name">DEBUG HEADER ▸ /blog</span>
        </a>
      </nav>
      <div class="telemetry font-instr" aria-hidden="true">
        <span>{clock}</span><span class="sep">·</span><span>UPTIME {uptime}</span>
      </div>
      <span class="net-badge font-instr" aria-hidden="true">NET: GND</span>
    </footer>
  </div>
</section>

<style>
  .board {
    position: relative;
    width: min(1180px, 100%);
    margin-inline: auto;
    padding: clamp(1.2rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem) 2.5rem;
  }

  /* ── copper overlay ──────────────────────────────────────────── */
  .copper {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: visible;
  }
  .trace {
    fill: none;
    stroke: var(--trace);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
    opacity: 0.62;
    transition: opacity 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease;
    filter: drop-shadow(0 0 0 transparent);
  }
  .trace.hot {
    stroke: var(--trace-hot);
    stroke-width: 2.6;
    opacity: 1;
    filter: drop-shadow(0 0 5px var(--glow));
  }
  .trace.dim {
    opacity: 0.18;
  }
  .hit {
    fill: none;
    stroke: transparent;
    stroke-width: 18;
    pointer-events: stroke;
  }
  .via {
    fill: var(--bg);
    stroke: var(--via-ring);
    stroke-width: 2;
    opacity: 0.7;
    transition: opacity 0.3s ease, stroke 0.3s ease;
  }
  .via.pad {
    fill: var(--pad);
    stroke: var(--accent);
  }
  .via.hot {
    opacity: 1;
    stroke: var(--trace-hot);
  }
  .via.dim {
    opacity: 0.16;
  }
  .via-hole {
    fill: var(--surface);
    pointer-events: none;
  }
  .dark .via-hole {
    fill: var(--bg);
  }

  /* ── boot choreography ───────────────────────────────────────── */
  .phase-cold .trace {
    stroke-dashoffset: 1;
    transition: none;
  }
  .phase-routing .trace {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 0.5s ease calc(var(--i) * 80ms);
  }
  .phase-cold .via {
    opacity: 0;
    transform: scale(0.2);
    transform-box: fill-box;
    transform-origin: center;
    transition: none;
  }
  .phase-routing .via {
    opacity: 0.7;
    transform: scale(1);
    transform-box: fill-box;
    transform-origin: center;
    transition: opacity 0.28s ease calc(var(--i) * 80ms + 0.34s),
      transform 0.34s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--i) * 80ms + 0.34s);
  }
  .phase-cold .fp {
    opacity: 0;
    transform: translateY(7px) scale(0.985);
    transition: none;
  }
  .phase-routing .fp {
    opacity: 1;
    transform: none;
    transition: opacity 0.42s ease calc(var(--i) * 80ms + 0.16s),
      transform 0.42s ease calc(var(--i) * 80ms + 0.16s);
  }
  .board.flash {
    animation: poweron 0.26s ease-out;
  }
  @keyframes poweron {
    0% { filter: brightness(1); }
    40% { filter: brightness(1.16); }
    100% { filter: brightness(1); }
  }

  /* ── footprints ──────────────────────────────────────────────── */
  .grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.32fr) minmax(0, 1fr);
    grid-template-areas:
      'title  bank'
      'mcu    bank'
      'errata bank'
      'footer footer';
    gap: clamp(0.9rem, 2.2vw, 1.9rem);
    align-items: start;
  }
  .title { grid-area: title; }
  .mcu { grid-area: mcu; }
  .bank { grid-area: bank; display: flex; flex-direction: column; gap: clamp(0.9rem, 2.2vw, 1.9rem); }
  .errata { grid-area: errata; }
  .foot { grid-area: footer; }

  .fp {
    position: relative;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: color-mix(in srgb, var(--surface) 56%, transparent);
    padding: clamp(0.85rem, 1.6vw, 1.3rem);
    backdrop-filter: blur(0.5px);
  }
  .fp.title,
  .fp.foot {
    border-color: transparent;
    background: transparent;
    backdrop-filter: none;
  }
  .fp.hot {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent);
  }
  .fp.dim {
    opacity: 0.42;
  }

  .ref {
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 0 0 0.5rem;
  }
  .net-badge {
    position: absolute;
    top: 0.55rem;
    right: 0.6rem;
    font-size: 0.6rem;
    letter-spacing: 0.06em;
    color: var(--accent2);
    opacity: 0;
    transform: translateY(-2px);
    transition: opacity 0.18s ease, transform 0.18s ease;
    pointer-events: none;
  }
  .fp.hot .net-badge { opacity: 0.95; transform: none; }

  /* title */
  .title h1 { margin: 0; }
  .subtitle {
    margin: 0.7rem 0 0;
    font-size: clamp(0.62rem, 1.5vw, 0.78rem);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .subtitle .x, .subtitle .arrow { color: var(--accent); }
  .subtitle .dot { color: var(--border); margin: 0 0.2em; }
  .tagline { margin: 0.5rem 0 0; font-size: clamp(0.58rem, 1.35vw, 0.72rem); letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent-ink); font-weight: 600; }

  /* schematic symbols */
  .sym {
    stroke: var(--accent);
    stroke-width: 1.5;
    fill: none;
    overflow: visible;
  }
  .sym rect, .sym path:not(.notch) { fill: color-mix(in srgb, var(--accent) 8%, transparent); }
  .sym .notch { fill: var(--bg); stroke-width: 1.2; }
  .sym .pin1 { fill: var(--accent); stroke: none; }
  .sym .pinpad { fill: var(--pad); stroke: var(--accent); stroke-width: 0.8; }
  .sym .silk-mini { fill: var(--muted); font: 700 7px var(--silk); stroke: none; }
  .qfp { position: absolute; top: 0.7rem; right: 0.7rem; width: 38px; height: 38px; }

  /* mcu / bio */
  .mcu { padding-right: clamp(1rem, 4vw, 3.4rem); }
  .bio {
    font-family: var(--display);
    font-size: clamp(1rem, 1.5vw, 1.16rem);
    line-height: 1.62;
    color: var(--fg);
    max-width: 60ch;
    margin: 0;
    font-variation-settings: 'opsz' 28, 'wght' 400;
  }
  .tp {
    color: var(--fg);
    background: color-mix(in srgb, var(--accent) 22%, transparent);
    border-bottom: 1.5px solid var(--accent);
    border-radius: 2px;
    padding: 0 0.22em;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .tp:hover {
    background: var(--accent);
    color: var(--bg);
  }

  /* component bank */
  .comp .sym { width: clamp(46px, 12vw, 60px); height: auto; margin-bottom: 0.4rem; }
  .xtal-row { display: flex; align-items: center; gap: 0.7rem; flex-wrap: wrap; }
  .readouts { display: flex; gap: 1.4rem; align-items: baseline; flex-wrap: wrap; margin-top: 0.2rem; }
  .stat { display: inline-flex; align-items: baseline; gap: 0.4rem; }
  .stat :global(.readout) { font-size: clamp(1.8rem, 4vw, 2.7rem); line-height: 1; color: var(--accent); }
  .stat.big :global(.readout) { font-size: clamp(2.2rem, 5.2vw, 3.4rem); }
  .stat .lit { font-size: clamp(1.6rem, 3.6vw, 2.4rem); font-weight: 500; color: var(--accent); }
  .stat b { font-size: 0.64rem; font-weight: 600; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; }
  .note { font-size: 0.66rem; letter-spacing: 0.07em; color: var(--muted); text-transform: uppercase; margin-top: 0.5rem; }
  .note.big { font-size: clamp(0.95rem, 2vw, 1.2rem); letter-spacing: 0.04em; color: var(--fg); margin-top: 0.2rem; }
  .rankline { display: flex; align-items: baseline; gap: 0.4rem; margin-top: 0.3rem; }
  .rankline :global(.rk) { font-size: clamp(1.5rem, 3.4vw, 2.2rem); color: var(--accent); line-height: 1; }
  .rankline .rk-sub { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.08em; color: var(--muted); text-transform: uppercase; }
  .note sub { color: var(--accent2); }
  .note a { color: var(--accent-ink); }

  /* edge connector fingers */
  .fingers { display: flex; gap: 3px; margin: 0.2rem 0 0.5rem; }
  .finger { width: 10px; height: 22px; border-radius: 0 0 2px 2px; background: linear-gradient(var(--accent), color-mix(in srgb, var(--accent) 55%, var(--bg))); }

  /* errata */
  .errata ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.55rem; }
  .errata li { font-size: clamp(0.78rem, 1.5vw, 0.9rem); line-height: 1.4; color: var(--fg); display: grid; grid-template-columns: auto auto 1fr; gap: 0.5rem; align-items: start; }
  .errata .date { color: var(--accent2); white-space: nowrap; }
  .errata .dash { color: var(--muted); }
  .errata a { color: var(--fg); text-decoration: none; }
  .errata a:hover { color: var(--accent-ink); }
  /* the "shocks" entry: distinguished by weight + persistent underline (not color alone) */
  .errata li.amber a { color: var(--accent-ink); font-weight: 600; text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--accent) 55%, transparent); }
  .errata li.amber .date { color: var(--accent-ink); font-weight: 600; }
  .errata li.amber .dash { color: var(--accent-ink); }

  /* footer */
  .foot { display: flex; flex-wrap: wrap; align-items: center; gap: 0.8rem 1.4rem; padding-top: 1.4rem; margin-top: 0.5rem; border-top: 1px dashed var(--border); }
  .silk-line { font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
  .silk-line .sep, .telemetry .sep { margin: 0 0.5em; color: var(--border); }
  .connectors { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-left: auto; }
  .conn { display: inline-flex; align-items: center; gap: 0.4rem; border: 1px solid var(--border); border-radius: 4px; padding: 0.28rem 0.6rem; color: var(--fg); text-decoration: none; transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease; }
  .conn:hover { border-color: var(--accent); color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, transparent); }
  .conn-ref { font-size: 0.58rem; letter-spacing: 0.08em; color: var(--accent); background: color-mix(in srgb, var(--accent) 14%, transparent); padding: 0.05rem 0.25rem; border-radius: 2px; }
  .conn-name { font-size: 0.8rem; }
  .conn.debug .conn-name { font-family: var(--instr); font-size: 0.74rem; }
  .telemetry { width: 100%; font-size: 0.68rem; letter-spacing: 0.08em; color: var(--muted); }

  /* ── mobile re-floor-plan: single column, vertical bus ───────── */
  @media (max-width: 760px) {
    .grid {
      grid-template-columns: 1fr;
      grid-template-areas: 'title' 'mcu' 'bank' 'errata' 'footer';
    }
    .qfp { display: none; }
    .connectors { margin-left: 0; }
  }
</style>
