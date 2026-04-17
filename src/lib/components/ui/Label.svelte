<script lang="ts">
  import type { HTMLLabelAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  interface Props extends HTMLLabelAttributes {
    class?: string;
    children?: Snippet;
  }

  let { class: className = '', children, ...rest }: Props = $props();
</script>

<label
  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-surface-900 dark:text-surface-100 {className}"
  {...rest}
>
  {@render children?.()}
</label>
