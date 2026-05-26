<script lang="ts">
  import { siteConfig, recentUpdates } from '$lib/siteConfig';
  import { tokenizeBio } from '$lib/bioLinks';

  const bioTokens = tokenizeBio(siteConfig.bio.text, siteConfig.bio.links);
</script>

<svelte:head>
  <title>{siteConfig.title}</title>
  <meta property="og:type" content="profile" />
  <meta property="profile:first_name" content="Inky" />
  <meta property="profile:last_name" content="Ganbold" />
  <meta property="profile:username" content="1nkfy" />
</svelte:head>

<div class="min-h-screen overflow-hidden flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
  <main class="flex flex-col items-center justify-center max-w-[400px] gap-4">
    <header class="flex flex-col gap-4">
      <h1 class="name">Hi, I'm {siteConfig.name}</h1>
      <div class="flex gap-6">
        {#each siteConfig.contactDisplay as contact, i (contact.type + i)}
          <p>
            <a
              href={contact.url}
              aria-label="{siteConfig.name} {contact.label}"
              target={contact.external ? '_blank' : undefined}
              rel={contact.external ? 'noopener noreferrer' : undefined}
            >
              {contact.value}
            </a>
          </p>
        {/each}
      </div>
      <p class="text-left text-spacing-4">
        {#each bioTokens as token, i (i)}
          {#if token.kind === 'text'}{token.value}{:else}<a
              href={token.url}
              target={token.external ? '_blank' : undefined}
              rel={token.external ? 'noopener noreferrer' : undefined}>{token.text}</a
            >{/if}
        {/each}
      </p>
    </header>

    <section class="text-center w-full">
      <h2 class="title">Updates</h2>
      <ul class="list-disc list-inside space-y-2 text-left mx-2 my-2">
        {#each recentUpdates as update (update.date)}
          <li class="pl-1">
            <span class="font-semibold">{update.date}</span>{': '}
            <a
              href={update.url}
              target="_blank"
              rel="noopener noreferrer"
              class="transition-colors hover:text-blue-600 underline"
            >
              {update.title}
            </a>
          </li>
        {/each}
      </ul>
    </section>
  </main>

  <footer class="text-center p-4 sm:p-6 bottom-0">
    <p class="text-left">
      <a href="/blog">Blog</a>
    </p>
  </footer>
</div>
