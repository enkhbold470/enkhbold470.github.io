<script lang="ts">
  import { onMount } from 'svelte';
  import { projects, roles, judging, awards, authorship, education, siteConfig } from '$lib/siteConfig';
  import SecHeader from '$lib/SecHeader.svelte';
  import Readout from '$lib/Readout.svelte';

  // The dossier is the evidence layer beneath the board hero. It reads as a
  // datasheet/spec sheet and is structured (without ever labelling itself "O-1")
  // around the extraordinary-ability criteria via the section sub-labels.
  let {
    posts = []
  }: { posts?: { title: string; slug: string; pubDate: string; image: string }[] } = $props();

  const stats = siteConfig.stats;
  const metrics = [
    { value: stats.hackathonsEntered, suffix: '', label: 'hackathons' },
    { value: stats.hackathonsWon, suffix: '', label: 'wins' },
    { value: stats.publicRepos, suffix: '+', label: 'repos' },
    { value: stats.commitsFloor, comma: true, suffix: '+', label: 'commits' },
    { value: stats.nations, suffix: '', label: 'nations · FGC' },
    { value: stats.videos, suffix: '+', label: 'videos' }
  ];
  const iso = (d: string) => {
    const t = new Date(d);
    return Number.isNaN(t.getTime()) ? '' : t.toISOString().slice(0, 10);
  };

  let root: HTMLElement;

  onMount(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (reduce) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
</script>

<div class="dossier" bind:this={root}>
  <!-- thesis + impact banner -->
  <p class="thesis" data-reveal>
    From silicon to model context — I design the PCB, write the firmware, train the model, and ship the
    protocol. Brain–computer interfaces, autonomous robots, award-winning AR, and the AI tooling other
    builders run on.
  </p>
  <section class="impact" data-reveal aria-label="By the numbers">
    {#each metrics as m (m.label)}
      <div class="metric">
        <span class="im-num"><Readout value={m.value} comma={!!m.comma} suffix={m.suffix} animate class="im" /></span>
        <span class="im-label font-silk">{m.label}</span>
      </div>
    {/each}
  </section>

  <!-- §01 — original contributions of major significance -->
  <section class="block">
    <SecHeader idx="§01" title="ORIGINAL CONTRIBUTIONS" sub="work of major significance" />
    <div class="projects">
      {#each projects as p (p.ref)}
        <article class="card" data-reveal>
          <div class="card-top">
            <span class="ref font-silk">{p.ref}</span>
            <span class="tag font-instr">{p.tag}</span>
          </div>
          <h3 class="name">
            {#if p.href}<a href={p.href} target="_blank" rel="noopener noreferrer">{p.name}</a
              >{:else}{p.name}{/if}
          </h3>
          <p class="pitch">{p.pitch}</p>
          <p class="contrib"><span class="sig font-silk">SIGNIFICANCE</span>{p.contribution}</p>
          <ul class="stack">
            {#each p.stack as s (s)}<li class="font-instr">{s}</li>{/each}
          </ul>
        </article>
      {/each}
    </div>
  </section>

  <!-- §02 — critical role for distinguished organizations -->
  <section class="block">
    <SecHeader idx="§02" title="LEADERSHIP & CRITICAL ROLES" sub="essential roles for distinguished organizations" />
    <ul class="roles">
      {#each roles as r (r.ref)}
        <li class="role" data-reveal>
          <div class="role-head">
            <span class="ref font-silk">{r.ref}</span>
            <span class="period font-instr">{r.period}</span>
          </div>
          <h3 class="role-title">{r.title}<span class="org"> · {r.org}</span></h3>
          <ul class="pts">
            {#each r.points as pt (pt)}<li>{pt}</li>{/each}
          </ul>
        </li>
      {/each}
    </ul>
  </section>

  <!-- §03 — judging the work of others -->
  <section class="block">
    <SecHeader idx="§03" title="JUDGING & MENTORSHIP" sub="judging the work of others" />
    <div class="judging">
      {#each judging as j (j.ref)}
        <article class="jcard" data-reveal>
          <span class="ref font-silk">{j.ref}</span>
          <h3 class="jtitle">{j.title}</h3>
          <span class="jorg font-instr">{j.org}</span>
          <p class="jdetail">{j.detail}</p>
        </article>
      {/each}
    </div>
  </section>

  <!-- §04 — awards & recognized prizes -->
  <section class="block">
    <SecHeader idx="§04" title="AWARDS & HONORS" sub="11 wins · 26 hackathons · nationally & internationally recognized" />
    <ol class="awards">
      {#each awards as a, i (a.title + a.date + i)}
        <li class="award" data-reveal>
          <span class="yr font-instr">{a.date}</span>
          <span class="bullet" aria-hidden="true"></span>
          <span class="abody">
            {#if a.href}<a class="atitle" href={a.href} target="_blank" rel="noopener noreferrer"
                >{a.title}</a
              >{:else}<span class="atitle">{a.title}</span>{/if}
            <span class="aorg font-instr">{a.org}</span>
          </span>
        </li>
      {/each}
    </ol>
  </section>

  <!-- §05 — authorship & published material -->
  <section class="block">
    <SecHeader idx="§05" title="WRITING & OPEN SOURCE" sub="authorship & published material" />
    {#if posts.length}
      <div class="latest" data-reveal>
        <div class="latest-head">
          <span class="font-silk">LATEST DISPATCHES</span>
          <a class="blog-cta font-silk" href="/blog">OPEN THE BLOG →</a>
        </div>
        <ul class="post-list">
          {#each posts as post (post.slug)}
            <li>
              <a href="/blog/{post.slug}">
                <span class="pdate font-instr">{iso(post.pubDate)}</span>
                <span class="ptitle">{post.title}</span>
                <span class="parrow" aria-hidden="true">↗</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    <ul class="pubs">
      {#each authorship as p (p.ref)}
        <li class="pub" data-reveal>
          <span class="ref font-silk">{p.ref}</span>
          <span class="plabel">
            {#if p.href}<a href={p.href} target="_blank" rel="noopener noreferrer">{p.label} ↗</a
              >{:else}{p.label}{/if}
          </span>
          <span class="pdetail font-instr">{p.detail}</span>
        </li>
      {/each}
    </ul>
  </section>

  <!-- §06 — education -->
  <section class="block">
    <SecHeader idx="§06" title="EDUCATION" sub="San José State · De Anza" />
    <ul class="edu">
      {#each education as e (e.school)}
        <li class="edu-row" data-reveal>
          <h3 class="school">{e.school}</h3>
          <span class="edu-detail">{e.detail}</span>
          <span class="edu-when font-instr">{e.when}</span>
        </li>
      {/each}
    </ul>
  </section>
</div>

<style>
  .dossier {
    width: min(1180px, 100%);
    margin-inline: auto;
    padding: 0 clamp(1rem, 3vw, 2rem) 4rem;
    display: flex;
    flex-direction: column;
    gap: clamp(2.5rem, 6vw, 4.5rem);
  }
  .block { display: flex; flex-direction: column; gap: 1.4rem; }

  /* thesis + impact banner */
  .thesis {
    font-family: var(--display);
    font-size: clamp(1.15rem, 2.6vw, 1.65rem);
    line-height: 1.5;
    font-variation-settings: 'opsz' 40, 'wght' 450;
    color: var(--fg);
    max-width: 66ch;
    margin: 0;
  }
  .impact {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
    padding: 1.5rem 0;
    border-block: 1px solid var(--border);
  }
  .metric { display: flex; flex-direction: column; gap: 0.2rem; }
  .metric :global(.im) { font-size: clamp(1.7rem, 3.8vw, 2.9rem); line-height: 1; color: var(--accent); font-weight: 500; }
  .im-label { font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }

  /* §05 latest dispatches (featured blog) */
  .latest { margin-bottom: 0.2rem; }
  .latest-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; font-size: 0.66rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.5rem; }
  .blog-cta { color: var(--accent-ink); }
  .post-list { list-style: none; margin: 0 0 1.6rem; padding: 0; }
  .post-list li { border-bottom: 1px solid color-mix(in srgb, var(--border) 60%, transparent); }
  .post-list a { display: grid; grid-template-columns: 6.5rem 1fr auto; gap: 0.8rem; align-items: baseline; padding: 0.7rem 0; color: var(--fg); text-decoration: none; }
  .post-list a:hover { color: var(--accent-ink); }
  .post-list a:hover .ptitle { text-decoration: underline; }
  .pdate { font-size: 0.74rem; color: var(--accent2); }
  .ptitle { font-family: var(--display); font-size: clamp(1rem, 2.2vw, 1.2rem); font-variation-settings: 'opsz' 30, 'wght' 500; line-height: 1.25; }
  .parrow { color: var(--accent-ink); }

  /* §01 project datasheet cards */
  .projects { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(0.9rem, 2vw, 1.4rem); }
  .card {
    border: 1px solid var(--border);
    border-radius: 7px;
    background: color-mix(in srgb, var(--surface) 55%, transparent);
    padding: clamp(1.1rem, 2.2vw, 1.6rem);
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
  .card-top { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .card .ref { font-size: 0.66rem; font-weight: 700; letter-spacing: 0.1em; color: var(--accent-ink); }
  .card .tag { font-size: 0.66rem; letter-spacing: 0.05em; color: var(--accent2); text-transform: uppercase; }
  .card .name { margin: 0; font-family: var(--display); font-size: clamp(1.3rem, 3vw, 1.7rem); font-variation-settings: 'opsz' 60, 'wght' 560; line-height: 1.1; color: var(--fg); }
  .card .name a { color: var(--fg); }
  .card .name a:hover { color: var(--accent-ink); text-decoration: none; }
  .card .pitch { margin: 0; font-family: var(--display); font-size: 1rem; line-height: 1.55; color: var(--fg); font-variation-settings: 'opsz' 24, 'wght' 400; }
  .card .contrib { margin: 0; font-size: 0.86rem; line-height: 1.5; color: var(--muted); }
  .card .sig { display: inline-block; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.1em; color: var(--accent2); margin-right: 0.5rem; vertical-align: 0.05em; }
  .card .stack { list-style: none; margin: 0.1rem 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .card .stack li { font-size: 0.66rem; letter-spacing: 0.03em; color: var(--muted); border: 1px solid var(--border); border-radius: 3px; padding: 0.12rem 0.45rem; }

  /* §02 roles */
  .roles { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1.3rem; }
  .role { border-left: 2px solid color-mix(in srgb, var(--accent) 55%, transparent); padding-left: 1.1rem; }
  .role-head { display: flex; align-items: baseline; gap: 0.8rem; margin-bottom: 0.25rem; }
  .role .ref { font-size: 0.64rem; font-weight: 700; letter-spacing: 0.08em; color: var(--accent-ink); }
  .role .period { font-size: 0.72rem; color: var(--muted); }
  .role-title { margin: 0 0 0.4rem; font-family: var(--display); font-size: clamp(1.1rem, 2.4vw, 1.35rem); font-variation-settings: 'opsz' 40, 'wght' 540; color: var(--fg); }
  .role-title .org { color: var(--muted); font-variation-settings: 'opsz' 40, 'wght' 400; font-size: 0.92em; }
  .pts { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.35rem; }
  .pts li { position: relative; padding-left: 1rem; font-size: 0.92rem; line-height: 1.5; color: var(--fg); }
  .pts li::before { content: '▸'; position: absolute; left: 0; color: var(--accent-ink); font-size: 0.8em; top: 0.1em; }

  /* §03 judging */
  .judging { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(0.9rem, 2vw, 1.4rem); }
  .jcard { border: 1px solid var(--border); border-radius: 7px; background: color-mix(in srgb, var(--surface) 55%, transparent); padding: 1.2rem; display: flex; flex-direction: column; gap: 0.4rem; }
  .jcard .ref { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em; color: var(--accent2); }
  .jtitle { margin: 0.2rem 0 0; font-family: var(--display); font-size: 1.18rem; font-variation-settings: 'opsz' 40, 'wght' 560; color: var(--fg); line-height: 1.15; }
  .jorg { font-size: 0.74rem; color: var(--accent-ink); }
  .jdetail { margin: 0.3rem 0 0; font-size: 0.9rem; line-height: 1.5; color: var(--muted); }

  /* §04 awards log */
  .awards { list-style: none; margin: 0; padding: 0; columns: 2; column-gap: 2.4rem; }
  .award { display: grid; grid-template-columns: 2.6rem auto 1fr; align-items: start; gap: 0.55rem; padding: 0.55rem 0; break-inside: avoid; border-bottom: 1px solid color-mix(in srgb, var(--border) 60%, transparent); }
  .award .yr { font-size: 0.72rem; color: var(--accent2); padding-top: 0.12rem; }
  .award .bullet { width: 7px; height: 7px; margin-top: 0.45rem; border-radius: 50%; background: var(--pad); border: 1.5px solid var(--accent); }
  .abody { display: flex; flex-direction: column; gap: 0.1rem; min-width: 0; }
  .atitle { font-family: var(--display); font-size: 0.98rem; font-variation-settings: 'opsz' 24, 'wght' 520; color: var(--fg); line-height: 1.25; }
  a.atitle:hover { color: var(--accent-ink); text-decoration: none; }
  .aorg { font-size: 0.72rem; color: var(--muted); }

  /* §05 publications */
  .pubs { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
  .pub { display: grid; grid-template-columns: 3.4rem 9rem 1fr; gap: 0.8rem; align-items: baseline; padding: 0.8rem 0; border-bottom: 1px solid color-mix(in srgb, var(--border) 60%, transparent); }
  .pub .ref { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.08em; color: var(--accent-ink); }
  .plabel { font-family: var(--display); font-size: 1.05rem; font-variation-settings: 'opsz' 40, 'wght' 540; color: var(--fg); }
  .plabel a { color: var(--fg); }
  .plabel a:hover { color: var(--accent-ink); text-decoration: none; }
  .pdetail { font-size: 0.82rem; color: var(--muted); line-height: 1.45; }

  /* §06 education */
  .edu { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.9rem; }
  .edu-row { display: grid; grid-template-columns: 1fr auto; gap: 0.2rem 1rem; align-items: baseline; }
  .school { grid-column: 1; margin: 0; font-family: var(--display); font-size: 1.15rem; font-variation-settings: 'opsz' 40, 'wght' 560; color: var(--fg); }
  .edu-detail { grid-column: 1; font-size: 0.9rem; color: var(--muted); }
  .edu-when { grid-column: 2; grid-row: 1 / span 2; font-size: 0.78rem; color: var(--accent2); white-space: nowrap; }

  /* scroll reveal — `.in` is toggled from JS, so anchor it via :global so the
     Svelte compiler doesn't prune it (which would leave content stuck hidden) */
  [data-reveal] { opacity: 0; transform: translateY(14px); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
  .dossier :global([data-reveal].in) { opacity: 1; transform: none; }

  @media (prefers-reduced-motion: reduce) {
    [data-reveal] { opacity: 1; transform: none; transition: none; }
  }

  @media (max-width: 760px) {
    .dossier { padding-inline: 1.3rem; gap: 3rem; }
    .projects, .judging { grid-template-columns: 1fr; }
    .awards { columns: 1; }
    .pub { grid-template-columns: 1fr; gap: 0.15rem 0.6rem; padding: 0.9rem 0; }
    .pub .ref { display: none; }
    .pub .pdetail { grid-column: 1; }
    .impact { grid-template-columns: repeat(3, 1fr); gap: 1.3rem 0.8rem; }
    .thesis { font-size: 1.2rem; }
    .post-list a { grid-template-columns: 1fr auto; padding: 0.85rem 0; }
    .pdate { grid-column: 1 / -1; }
  }
  @media (max-width: 420px) {
    .impact { grid-template-columns: repeat(2, 1fr); }
  }
</style>
