<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import { Loader2 } from 'lucide-svelte';
  import { untrack } from 'svelte';

  let { data } = $props();
  const course = $derived(data.course);
  const step = $derived(data.step);

  let submitting = $state(false);
  let delayHours = $state(untrack(() => data.step?.delay_hours ?? 0));
</script>

<svelte:head>
  <title>Edit Message — {course.title} | CursosAI</title>
</svelte:head>

<div class="max-w-xl">
  <div class="mb-8">
    <a href="/courses/{course.id}/steps" class="text-sm text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 mb-4 inline-block">
      ← Back to messages
    </a>
    <h1 class="text-2xl font-bold mb-1">Edit Message</h1>
    <p class="text-surface-500 dark:text-surface-400 text-sm">{course.title}</p>
  </div>

  <form method="POST" use:enhance={() => {
    submitting = true;
    return ({ update }) => { submitting = false; update(); };
  }} class="space-y-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6">
    <div class="space-y-2">
      <Label for="title">Internal Label <span class="text-surface-400 font-normal text-xs">(not sent to students)</span></Label>
      <Input id="title" name="title" value={step.title || ''} placeholder="Day 1 — Welcome" />
    </div>

    <div class="space-y-2">
      <Label for="delay_hours">Send at (hours after enrollment)</Label>
      <Input
        id="delay_hours"
        name="delay_hours"
        type="number"
        min="0"
        step="1"
        bind:value={delayHours}
      />
      <p class="text-xs text-surface-500">
        {delayHours === 0 ? 'Sent immediately when the student enrolls.' : `Sent ${delayHours} hours after enrollment (Day ${Math.floor(delayHours / 24) + 1}).`}
      </p>
    </div>

    <div class="space-y-2">
      <Label for="message_body">Message <span class="text-red-500">*</span></Label>
      <textarea
        id="message_body"
        name="message_body"
        rows="6"
        required
        class="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y"
      >{step.message_body || ''}</textarea>
    </div>

    <div class="space-y-2">
      <Label for="media_url">Media URL <span class="text-surface-400 font-normal text-xs">(optional)</span></Label>
      <Input id="media_url" name="media_url" type="url" value={step.media_url || ''} placeholder="https://example.com/image.jpg" />
    </div>

    <Button type="submit" class="w-full" disabled={submitting}>
      {#if submitting}
        <Loader2 size={16} class="mr-2 animate-spin" />
        Saving...
      {:else}
        Save Changes
      {/if}
    </Button>
  </form>
</div>
