<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import { ArrowRight, Loader2 } from 'lucide-svelte';

  let { form } = $props();

  let title = $state('');
  let slug = $state('');
  let slugEdited = $state(false);
  let submitting = $state(false);

  function onTitleInput() {
    if (!slugEdited) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
  }
</script>

<svelte:head>
  <title>New Course | CursosAI</title>
</svelte:head>

<div class="max-w-xl">
  <div class="mb-8">
    <a href="/courses" class="text-sm text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 mb-4 inline-block">
      ← Back to courses
    </a>
    <h1 class="text-3xl font-bold mb-1">Create a Course</h1>
    <p class="text-surface-500 dark:text-surface-400">Give your course a name and set a price. You'll add messages next.</p>
  </div>

  {#if form?.error}
    <div class="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
      {form.error}
    </div>
  {/if}

  <form method="POST" use:enhance={() => {
    submitting = true;
    return ({ update }) => { submitting = false; update(); };
  }} class="space-y-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6">
    <div class="space-y-2">
      <Label for="title">Course Title</Label>
      <Input
        id="title"
        name="title"
        placeholder="21-Day Fitness Challenge"
        bind:value={title}
        oninput={onTitleInput}
        required
      />
    </div>

    <div class="space-y-2">
      <Label for="slug">
        URL Slug
        <span class="text-surface-400 font-normal ml-1 text-xs">— used in your enrollment link</span>
      </Label>
      <div class="flex items-center gap-2">
        <span class="text-sm text-surface-400 shrink-0">yoursite.com/enroll/</span>
        <Input
          id="slug"
          name="slug"
          placeholder="21-day-fitness-challenge"
          bind:value={slug}
          oninput={() => slugEdited = true}
          required
          class="flex-1"
        />
      </div>
    </div>

    <div class="space-y-2">
      <Label for="description">Description <span class="text-surface-400 font-normal text-xs">(shown on enrollment page)</span></Label>
      <textarea
        id="description"
        name="description"
        placeholder="A short description of what students will get..."
        rows="3"
        class="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
      ></textarea>
    </div>

    <div class="space-y-2">
      <Label for="price">Price (USD)</Label>
      <div class="relative">
        <span class="absolute inset-y-0 left-3 flex items-center text-surface-400 text-sm">$</span>
        <Input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          placeholder="29.99"
          class="pl-7"
        />
      </div>
      <p class="text-xs text-surface-500">Set to 0 for a free course.</p>
    </div>

    <Button type="submit" class="w-full" disabled={submitting}>
      {#if submitting}
        <Loader2 size={16} class="mr-2 animate-spin" />
        Creating...
      {:else}
        Create Course & Add Messages
        <ArrowRight size={16} class="ml-2" />
      {/if}
    </Button>
  </form>
</div>
