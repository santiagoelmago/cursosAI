<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import { ArrowRight, Loader2 } from 'lucide-svelte';
  import { t } from '$lib/stores/locale';

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
      {$t('newCourse.back')}
    </a>
    <h1 class="text-3xl font-bold mb-1">{$t('newCourse.heading')}</h1>
    <p class="text-surface-500 dark:text-surface-400">{$t('newCourse.subheading')}</p>
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
      <Label for="title">{$t('newCourse.titleLabel')}</Label>
      <Input id="title" name="title" placeholder={$t('newCourse.titlePlaceholder')} bind:value={title} oninput={onTitleInput} required />
    </div>

    <div class="space-y-2">
      <Label for="slug">
        {$t('newCourse.slugLabel')}
        <span class="text-surface-400 font-normal ml-1 text-xs">{$t('newCourse.slugHint')}</span>
      </Label>
      <div class="flex items-center gap-2">
        <span class="text-sm text-surface-400 shrink-0">{$t('newCourse.slugDomain')}</span>
        <Input id="slug" name="slug" placeholder={$t('newCourse.slugPlaceholder')} bind:value={slug} oninput={() => slugEdited = true} required class="flex-1" />
      </div>
    </div>

    <div class="space-y-2">
      <Label for="description">
        {$t('newCourse.descLabel')}
        <span class="text-surface-400 font-normal text-xs"> {$t('newCourse.descHint')}</span>
      </Label>
      <textarea
        id="description"
        name="description"
        placeholder={$t('newCourse.descPlaceholder')}
        rows="3"
        class="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
      ></textarea>
    </div>

    <div class="space-y-2">
      <Label for="price">{$t('newCourse.priceLabel')}</Label>
      <div class="relative">
        <span class="absolute inset-y-0 left-3 flex items-center text-surface-400 text-sm">$</span>
        <Input id="price" name="price" type="number" min="0" step="0.01" placeholder={$t('newCourse.pricePlaceholder')} class="pl-7" />
      </div>
      <p class="text-xs text-surface-500">{$t('newCourse.priceHint')}</p>
    </div>

    <Button type="submit" class="w-full" disabled={submitting}>
      {#if submitting}
        <Loader2 size={16} class="mr-2 animate-spin" />
        {$t('newCourse.creating')}
      {:else}
        {$t('newCourse.submit')}
        <ArrowRight size={16} class="ml-2" />
      {/if}
    </Button>
  </form>
</div>
