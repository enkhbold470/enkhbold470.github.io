<script lang="ts">
  import '../app.css';
  import { inject } from '@vercel/analytics';
  import { onMount } from 'svelte';
  import Header from '$lib/Header.svelte';
  import StructuredData from '$lib/StructuredData.svelte';
  import { siteConfig } from '$lib/siteConfig';

  let { children } = $props();

  onMount(() => {
    inject();
  });
</script>

<svelte:head>
  <title>{siteConfig.title}</title>
  <meta name="description" content={siteConfig.description} />
  <meta name="keywords" content={siteConfig.keywords.join(', ')} />
  <meta name="author" content={siteConfig.author} />
  <link rel="canonical" href={siteConfig.url} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content={siteConfig.locale} />
  <meta property="og:url" content={siteConfig.url} />
  <meta property="og:title" content={siteConfig.title} />
  <meta property="og:description" content={siteConfig.description} />
  <meta property="og:site_name" content={siteConfig.name} />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={siteConfig.title} />
  <meta name="twitter:description" content={siteConfig.description} />
  <meta name="twitter:creator" content="@1nkfy" />
  <meta name="robots" content="index, follow" />
</svelte:head>

<StructuredData type="ProfilePage" />

<div class="board-substrate">
  <Header />
  {@render children()}
</div>
