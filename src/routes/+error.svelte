<script lang="ts">
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>{page.status === 404 ? '404 - Page Not Found' : 'Error'}</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center">
  <main class="text-center">
    {#if page.status === 404}
      <h1 class="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <p class="mb-6">The page you are looking for does not exist.</p>
    {:else}
      <h1 class="text-3xl font-bold mb-4">Error {page.status}</h1>
      <p class="mb-6">{page.error?.message ?? 'Something went wrong.'}</p>
    {/if}
    <a href="/" aria-label="Return to home page" class="underline">Back to Home</a>
  </main>
</div>
