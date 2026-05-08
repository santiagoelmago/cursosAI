<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import { Loader2, ArrowRight } from 'lucide-svelte';
  import { untrack } from 'svelte';

  let { data } = $props();
  const course = $derived(data.course);
  const nextOrder = $derived(data.nextOrder);

  let submitting = $state(false);
  let delayHours = $state(untrack(() => data.nextOrder * 24));
</script>

<svelte:head>
  <title>Add Message — {course.title} | CursosAI</title>
</svelte:head>

<div class="max-w-xl">
  <div class="mb-8">
    <a href="/courses/{course.id}/steps" class="text-sm text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 mb-4 inline-block">
      ← Back to messages
    </a>
    <h1 class="text-2xl font-bold mb-1">Add a Message</h1>
    <p class="text-surface-500 dark:text-surface-400 text-sm">Write the WhatsApp message that students will receive at this step.</p>
  </div>

  <form method="POST" use:enhance={() => {
    submitting = true;
    return ({ update }) => { submitting = false; update(); };
  }} class="space-y-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6">
    <input type="hidden" name="order" value={nextOrder} />

    <div class="space-y-2">
      <Label for="title">Internal Label <span class="text-surface-400 font-normal text-xs">(not sent to students)</span></Label>
      <Input id="title" name="title" placeholder="Day {nextOrder + 1} — Welcome" />
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
        placeholder="Hey {'{name}'}! Welcome to the challenge. Today's task is..."
        rows="6"
        required
        class="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y"
      ></textarea>
      <p class="text-xs text-surface-500">This is the exact text sent via WhatsApp. Emojis work great here.</p>
    </div>

    <div class="space-y-2">
      <Label for="media_url">Media URL <span class="text-surface-400 font-normal text-xs">(optional — image or video)</span></Label>
      <Input id="media_url" name="media_url" type="url" placeholder="https://example.com/image.jpg" />
      <p class="text-xs text-surface-500">Must be a publicly accessible URL. Supported: JPG, PNG, MP4, PDF.</p>
    </div>

    <Button type="submit" class="w-full" disabled={submitting}>
      {#if submitting}
        <Loader2 size={16} class="mr-2 animate-spin" />
        Saving...
      {:else}
        Save Message
        <ArrowRight size={16} class="ml-2" />
      {/if}
    </Button>
  </form>
</div>
