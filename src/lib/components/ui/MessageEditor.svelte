<script lang="ts">
  import { Eye, EyeOff } from 'lucide-svelte';

  let {
    value = $bindable(''),
    name = 'message_body',
    courseName = '',
    placeholder = '',
    rows = 6,
  }: {
    value?: string;
    name?: string;
    courseName?: string;
    placeholder?: string;
    rows?: number;
  } = $props();

  const variables = [
    { label: 'First name', token: '{name}',        sample: 'Maria' },
    { label: 'Full name',  token: '{full_name}',   sample: 'Maria Ramos' },
    { label: 'Email',      token: '{email}',        sample: 'maria@example.com' },
    { label: 'Course',     token: '{course_name}',  sample: courseName || 'Your Course' },
  ];

  let textarea: HTMLTextAreaElement;
  let showPreview = $state(false);

  function insert(token: string) {
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    value = value.slice(0, start) + token + value.slice(end);
    // Restore cursor after the inserted token
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + token.length;
      textarea.focus();
    });
  }

  const preview = $derived(
    value
      .replace(/\{name\}/gi, 'Maria')
      .replace(/\{full_name\}/gi, 'Maria Ramos')
      .replace(/\{email\}/gi, 'maria@example.com')
      .replace(/\{course_name\}/gi, courseName || 'Your Course')
  );
</script>

<div class="space-y-2">
  <!-- Variable bar -->
  <div class="flex items-center gap-1.5 flex-wrap">
    <span class="text-xs text-surface-400 mr-1">Insert:</span>
    {#each variables as v}
      <button
        type="button"
        onclick={() => insert(v.token)}
        class="inline-flex items-center px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-mono hover:bg-brand-100 dark:hover:bg-brand-900/50 border border-brand-200 dark:border-brand-800 transition-colors"
      >
        {v.token}
        <span class="ml-1.5 text-brand-400 dark:text-brand-500 font-sans not-italic">→ {v.sample}</span>
      </button>
    {/each}
  </div>

  <!-- Textarea -->
  <textarea
    bind:this={textarea}
    bind:value
    {name}
    {placeholder}
    {rows}
    required
    class="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y font-mono"
  ></textarea>

  <!-- Preview toggle -->
  <button
    type="button"
    onclick={() => showPreview = !showPreview}
    class="flex items-center gap-1.5 text-xs text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
  >
    {#if showPreview}
      <EyeOff size={13} />Hide preview
    {:else}
      <Eye size={13} />Preview with sample data
    {/if}
  </button>

  {#if showPreview}
    <div class="rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 p-3">
      <p class="text-xs font-medium text-surface-400 mb-2">Preview</p>
      <p class="text-sm text-surface-700 dark:text-surface-200 whitespace-pre-line">{preview || '—'}</p>
    </div>
  {/if}
</div>
