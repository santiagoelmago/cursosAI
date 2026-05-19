<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import MessageEditor from '$lib/components/ui/MessageEditor.svelte';
  import { Loader2 } from 'lucide-svelte';
  import { untrack } from 'svelte';
  import { t } from '$lib/stores/locale';

  let { data } = $props();
  const course = $derived(data.course);
  const step = $derived(data.step);

  let submitting = $state(false);
  let delayHours = $state(untrack(() => data.step?.delay_hours ?? 0));
  let messageBody = $state(untrack(() => data.step?.message_body ?? ''));
</script>

<svelte:head>
  <title>Edit Message — {course.title} | CursosAI</title>
</svelte:head>

<div class="max-w-xl">
  <div class="mb-8">
    <a href="/courses/{course.id}/steps" class="text-sm text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 mb-4 inline-block">
      {$t('editStep.back')}
    </a>
    <h1 class="text-2xl font-bold mb-1">{$t('editStep.heading')}</h1>
    <p class="text-surface-500 dark:text-surface-400 text-sm">{course.title}</p>
  </div>

  <form method="POST" use:enhance={() => {
    submitting = true;
    return ({ update }) => { submitting = false; update(); };
  }} class="space-y-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6">
    <div class="space-y-2">
      <Label for="title">
        {$t('editStep.label')}
        <span class="text-surface-400 font-normal text-xs"> {$t('editStep.labelHint')}</span>
      </Label>
      <Input id="title" name="title" value={step.title || ''} placeholder={$t('editStep.labelPlaceholder')} />
    </div>

    <div class="space-y-2">
      <Label for="delay_hours">{$t('editStep.sendAt')}</Label>
      <Input id="delay_hours" name="delay_hours" type="number" min="0" step="1" bind:value={delayHours} />
      <p class="text-xs text-surface-500">
        {delayHours === 0
          ? $t('editStep.immediately')
          : $t('editStep.sentHours', { hours: delayHours, day: Math.floor(delayHours / 24) + 1 })}
      </p>
    </div>

    <div class="space-y-2">
      <Label for="message_body">{$t('editStep.message')} <span class="text-red-500">*</span></Label>
      <MessageEditor bind:value={messageBody} courseName={course.title} />
    </div>

    <div class="space-y-2">
      <Label for="media_url">
        {$t('editStep.mediaUrl')}
        <span class="text-surface-400 font-normal text-xs"> {$t('editStep.mediaHint')}</span>
      </Label>
      <Input id="media_url" name="media_url" type="url" value={step.media_url || ''} placeholder={$t('editStep.mediaPlaceholder')} />
    </div>

    <Button type="submit" class="w-full" disabled={submitting}>
      {#if submitting}
        <Loader2 size={16} class="mr-2 animate-spin" />
        {$t('editStep.saving')}
      {:else}
        {$t('editStep.save')}
      {/if}
    </Button>
  </form>
</div>
