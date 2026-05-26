<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const PLACEHOLDER_IMAGE = 'https://placekeanu.com/500/300';
  const SNIPPET_LENGTH = 72;

  function truncate(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  }

  function slugFor(link: string): string {
    return link.split('/').filter(Boolean).pop() ?? '';
  }
</script>

<svelte:head>
  <title>Blog · Inky Ganbold</title>
</svelte:head>

<div class="min-h-screen overflow-hidden flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
  <main class="flex flex-col items-center justify-center max-w-[600px] w-full">
    <nav aria-label="Breadcrumb" class="mb-2 sm:mb-3 w-full">
      <ol class="flex items-center space-x-2 text-sm">
        <li><a href="/" class="hover:underline text-blue-800 font-semibold">Home</a></li>
        <li>/</li>
        <li class="truncate max-w-[160px] text-gray-700 opacity-80">Blog</li>
      </ol>
    </nav>

    <header class="text-center mb-4 sm:mb-6 w-full">
      <h1 class="name">Blog</h1>
    </header>

    <section class="text-center w-full">
      {#if data.feed.length === 0}
        <p class="text-left p-2 sm:p-3 text-sm opacity-70">
          Unable to load Medium posts right now. Please try again later.
        </p>
      {:else}
        <ul>
          {#each data.feed as item (item.link)}
            {@const slug = slugFor(item.link)}
            {@const snippet = truncate(item.contentSnippet, SNIPPET_LENGTH)}
            <li class="text-left mb-4 flex items-start gap-2">
              <a href="/blog/{slug}" class="hover:text-blue-600 transition-colors font-semibold">
                <img
                  src={item.image || PLACEHOLDER_IMAGE}
                  alt={item.title || ''}
                  width="200"
                  height="200"
                  class="rounded object-cover flex-shrink-0 mt-1 w-[200px] h-[200px]"
                />
              </a>
              <div class="flex-1">
                <a href="/blog/{slug}" class="hover:text-blue-600 transition-colors font-semibold">
                  {item.title || ''}
                </a>
                <p class="text-left p-2 sm:p-3 mt-1">{snippet}</p>
                {#if item.pubDate}
                  <p class="text-left p-2 sm:p-3 text-sm opacity-70">
                    {new Date(item.pubDate).toLocaleDateString()}
                  </p>
                {/if}
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  </main>

  <footer class="text-center p-4 sm:p-6 border-t-2 border-black mt-8 w-full max-w-[600px]">
    <div class="flex flex-col gap-3 w-full items-center text-center">
      <a
        href="https://medium.com/@enkhy"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center rounded border border-black px-6 py-3 text-base font-semibold hover:bg-black hover:text-white transition-colors"
      >
        Read more on Medium →
      </a>
      <a href="/" class="hover:text-blue-600 transition-colors">← Back to Home</a>
    </div>
  </footer>
</div>
