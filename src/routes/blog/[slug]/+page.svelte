<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.post.title} · Blog</title>
  {#if data.post.contentSnippet}
    <meta name="description" content={data.post.contentSnippet.slice(0, 200)} />
  {/if}
</svelte:head>

<div class="min-h-screen overflow-hidden flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
  <main class="flex flex-col items-center justify-center max-w-[600px] w-full">
    <nav aria-label="Breadcrumb" class="mb-2 sm:mb-3 w-full">
      <ol class="flex items-center space-x-2 text-sm">
        <li><a href="/" class="hover:underline text-blue-800 font-semibold">Home</a></li>
        <li>/</li>
        <li><a href="/blog" class="hover:underline text-blue-800 font-semibold">Blog</a></li>
        <li>/</li>
        <li class="truncate max-w-[160px] text-gray-700 opacity-80">{data.post.title}</li>
      </ol>
    </nav>
    <header class="mb-4 sm:mb-6 w-full">
      <h1 class="name">{data.post.title}</h1>
      {#if data.post.pubDate}
        <p class="text-left p-2 sm:p-3 text-sm opacity-70">
          {new Date(data.post.pubDate).toLocaleDateString()}
        </p>
      {/if}
    </header>
    <section class="w-full">
      <div class="prose max-w-none mb-6" style="word-break: break-word;">
        {@html data.renderedContent}
      </div>
    </section>
  </main>
  <footer class="text-center p-4 sm:p-6 border-t-2 border-black mt-8 w-full max-w-[600px]">
    <p class="text-left">
      <a href="/blog" class="hover:text-blue-600 transition-colors">← Back to Blog</a>
    </p>
    <p class="text-left">
      <a
        href={data.post.link}
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-blue-600 transition-colors"
      >
        View on Medium
      </a>
    </p>
  </footer>
</div>
