<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/ui/Button.svelte';
  import { Loader2, CheckCircle, AlertCircle } from 'lucide-svelte';
  import { t } from '$lib/stores/locale';

  let { data, form } = $props();
  const course = $derived(data.course);
  const stepCount = $derived(data.stepCount);
  let submitting = $state(false);
</script>

<svelte:head>
  <title>Publish — {course.title} | CursosAI</title>
</svelte:head>

<div class="max-w-lg">
  <div class="mb-8">
    <a href="/courses/{course.id}" class="text-sm text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 mb-4 inline-block">
      ← {course.title}
    </a>
    <h1 class="text-2xl font-bold mb-1">{$t('publish.heading')}</h1>
    <p class="text-surface-500 dark:text-surface-400 text-sm">{$t('publish.subheading')}</p>
  </div>

  {#if form?.error}
    <div class="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
      {form.error}
    </div>
  {/if}

  <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 mb-6 space-y-3">
    <h2 class="font-semibold mb-4">{$t('publish.checklist')}</h2>

    <div class="flex items-center gap-3 text-sm">
      {#if course.title}
        <CheckCircle size={18} class="text-green-500 shrink-0" />
        <span>{$t('publish.courseTitleLabel')} <strong>{course.title}</strong></span>
      {:else}
        <AlertCircle size={18} class="text-red-500 shrink-0" />
        <span class="text-red-600">{$t('publish.noTitle')}</span>
      {/if}
    </div>

    <div class="flex items-center gap-3 text-sm">
      {#if stepCount > 0}
        <CheckCircle size={18} class="text-green-500 shrink-0" />
        <span>{stepCount} {$t('publish.messagesInSeq')}</span>
      {:else}
        <AlertCircle size={18} class="text-red-500 shrink-0" />
        <span class="text-red-600">
          {$t('publish.noMessages')}
          — <a href="/courses/{course.id}/steps" class="underline">{$t('steps.addFirst')}</a>
        </span>
      {/if}
    </div>

    <div class="flex items-center gap-3 text-sm">
      {#if course.slug}
        <CheckCircle size={18} class="text-green-500 shrink-0" />
        <span>{$t('publish.enrollUrl')} <code class="bg-surface-100 dark:bg-surface-800 px-1 rounded">/enroll/{course.slug}</code></span>
      {:else}
        <AlertCircle size={18} class="text-red-500 shrink-0" />
        <span class="text-red-600">{$t('publish.noSlug')}</span>
      {/if}
    </div>

    <div class="flex items-center gap-3 text-sm">
      <CheckCircle size={18} class="text-green-500 shrink-0" />
      <span>{$t('publish.priceLabel')} <strong>{course.price_cents ? `$${(course.price_cents / 100).toFixed(2)}` : $t('publish.free')}</strong></span>
    </div>
  </div>

  <div class="bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-200 dark:border-brand-800 p-4 text-sm text-brand-800 dark:text-brand-200 mb-6">
    {$t('publish.publishNote')}
  </div>

  <form method="POST" use:enhance={() => {
    submitting = true;
    return ({ update }) => { submitting = false; update(); };
  }}>
    <Button type="submit" class="w-full" disabled={submitting || stepCount === 0}>
      {#if submitting}
        <Loader2 size={16} class="mr-2 animate-spin" />
        {$t('publish.publishing')}
      {:else}
        {$t('publish.submit')}
      {/if}
    </Button>
  </form>
</div>
