<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import { Loader2, BookOpen, Users, ArrowRight, Trash2, MessageSquare } from 'lucide-svelte';
  import { t } from '$lib/stores/locale';

  let { data, form } = $props();
  const course = $derived(data.course);

  let submitting = $state(false);
  let deleting = $state(false);
  let confirmDelete = $state(false);
</script>

<svelte:head>
  <title>{course.title} | CursosAI</title>
</svelte:head>

<div class="mb-6">
  <a href="/courses" class="text-sm text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 mb-4 inline-block">
    {$t('courseDetail.back')}
  </a>
  <div class="flex items-center justify-between">
    <div>
      <div class="flex items-center gap-3 mb-1">
        <h1 class="text-3xl font-bold">{course.title}</h1>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {course.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'}">
          {course.status === 'published' ? $t('courseDetail.published') : $t('courseDetail.draft')}
        </span>
      </div>
      <p class="text-surface-500 dark:text-surface-400 text-sm">{$t('courseDetail.subheading')}</p>
    </div>
  </div>
</div>

<div class="flex gap-3 mb-8">
  <a href="/courses/{course.id}/steps">
    <Button variant="secondary">
      <BookOpen size={16} class="mr-2" />
      {$t('courseDetail.tabMessages')}
    </Button>
  </a>
  <a href="/courses/{course.id}/enrollments">
    <Button variant="secondary">
      <Users size={16} class="mr-2" />
      {$t('courseDetail.tabEnrollments')}
    </Button>
  </a>
  {#if course.community_enabled}
    <a href="/community/{course.slug}" target="_blank">
      <Button variant="secondary">
        <MessageSquare size={16} class="mr-2" />
        {$t('courseDetail.tabCommunity')}
      </Button>
    </a>
  {/if}
  {#if course.status === 'draft'}
    <a href="/courses/{course.id}/publish">
      <Button>
        {$t('courseDetail.publish')}
        <ArrowRight size={16} class="ml-2" />
      </Button>
    </a>
  {:else}
    <a href="/enroll/{course.slug}" target="_blank">
      <Button variant="outline">{$t('courseDetail.viewEnrollment')}</Button>
    </a>
  {/if}
</div>

{#if form?.success}
  <div class="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm">
    {$t('courseDetail.updateSuccess')}
  </div>
{/if}
{#if form?.error}
  <div class="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
    {form.error}
  </div>
{/if}

<div class="max-w-xl">
  <form method="POST" action="?/update" use:enhance={() => {
    submitting = true;
    return ({ update }) => { submitting = false; update(); };
  }} class="space-y-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 mb-6">
    <h2 class="font-semibold text-lg">{$t('courseDetail.detailsHeading')}</h2>

    <div class="space-y-2">
      <Label for="title">{$t('courseDetail.titleLabel')}</Label>
      <Input id="title" name="title" value={course.title} required />
    </div>

    <div class="space-y-2">
      <Label for="slug">{$t('courseDetail.slugLabel')}</Label>
      <Input id="slug" name="slug" value={course.slug} />
    </div>

    <div class="space-y-2">
      <Label for="description">{$t('courseDetail.descLabel')}</Label>
      <textarea
        id="description"
        name="description"
        rows="3"
        class="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
      >{course.description || ''}</textarea>
    </div>

    <div class="space-y-2">
      <Label for="price">{$t('courseDetail.priceLabel')}</Label>
      <div class="relative">
        <span class="absolute inset-y-0 left-3 flex items-center text-surface-400 text-sm">$</span>
        <Input id="price" name="price" type="number" min="0" step="0.01" value={course.price_cents ? (course.price_cents / 100).toFixed(2) : ''} placeholder="0.00" class="pl-7" />
      </div>
    </div>

    <div class="flex items-start gap-3 p-4 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <input
        type="checkbox"
        id="community_enabled"
        name="community_enabled"
        value="true"
        checked={course.community_enabled}
        class="mt-0.5 h-4 w-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
      />
      <div>
        <label for="community_enabled" class="text-sm font-medium cursor-pointer">{$t('courseDetail.communityLabel')}</label>
        <p class="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{$t('courseDetail.communityDesc')} <span class="font-mono">/community/{course.slug}</span></p>
      </div>
    </div>

    <Button type="submit" disabled={submitting}>
      {#if submitting}
        <Loader2 size={16} class="mr-2 animate-spin" />
        {$t('courseDetail.saving')}
      {:else}
        {$t('courseDetail.save')}
      {/if}
    </Button>
  </form>

  <div class="border border-red-200 dark:border-red-900/50 rounded-2xl p-6">
    <h2 class="font-semibold text-red-700 dark:text-red-400 mb-2">{$t('courseDetail.dangerZone')}</h2>
    {#if !confirmDelete}
      <p class="text-sm text-surface-500 mb-3">{$t('courseDetail.dangerDesc')}</p>
      <Button variant="outline" class="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20" onclick={() => confirmDelete = true}>
        <Trash2 size={16} class="mr-2" />
        {$t('courseDetail.deleteBtn')}
      </Button>
    {:else}
      <p class="text-sm text-red-600 dark:text-red-400 mb-3 font-medium">{$t('courseDetail.deleteConfirm')}</p>
      <form method="POST" action="?/delete" use:enhance={() => {
        deleting = true;
        return ({ update }) => { deleting = false; update(); };
      }}>
        <div class="flex gap-2">
          <Button type="submit" class="bg-red-600 hover:bg-red-700 text-white" disabled={deleting}>
            {#if deleting}<Loader2 size={16} class="mr-2 animate-spin" />{/if}
            {$t('courseDetail.deleteYes')}
          </Button>
          <Button variant="ghost" onclick={() => confirmDelete = false}>{$t('courseDetail.cancel')}</Button>
        </div>
      </form>
    {/if}
  </div>
</div>
