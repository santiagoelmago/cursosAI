<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    class?: string;
    value?: string | number | null;
  }

  let { class: className = '', value = $bindable(''), ...rest }: Props = $props();
</script>

<input
  bind:value
  class="flex h-10 w-full rounded-md border border-surface-300 bg-transparent px-3 py-2 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:text-surface-50 dark:focus:ring-brand-500 {className}"
  {...rest}
/>
