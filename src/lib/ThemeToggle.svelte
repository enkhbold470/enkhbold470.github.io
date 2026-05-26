<script lang="ts">
  import { onMount } from 'svelte';
  import { Sun, Moon } from 'lucide-svelte';

  let theme = $state<'light' | 'dark'>('light');
  let mounted = $state(false);

  onMount(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = (stored as 'light' | 'dark' | null) ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    mounted = true;
  });

  function toggle() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }
</script>

{#if mounted}
  <button
    onclick={toggle}
    aria-label="Toggle theme"
    class="fixed top-4 right-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
    type="button"
  >
    {#if theme === 'dark'}
      <Sun class="w-5 h-5" />
    {:else}
      <Moon class="w-5 h-5" />
    {/if}
  </button>
{/if}
