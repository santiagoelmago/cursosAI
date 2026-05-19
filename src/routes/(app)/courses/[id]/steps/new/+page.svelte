<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import MessageEditor from '$lib/components/ui/MessageEditor.svelte';
  import { Loader2, ArrowRight } from 'lucide-svelte';
  import { untrack } from 'svelte';
  import { t } from '$lib/stores/locale';

  let { data } = $props();
  const course = $derived(data.course);
  const nextOrder = $derived(data.nextOrder);

  let submitting = $state(false);
  let delayHours = $state(untrack(() => data.nextOrder * 24));
  let messageBody = $state('');
</script>

<svelte:head>
  <title>Add Message — {course.title} | CursosAI</title>
</svelte:head>

<div class="max-w-xl">
  <div class="mb-8">
    <a href="/courses/{course.id}/steps" class="text-sm text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 mb-4 inline-block">
      {$t('newStep.back')}
    </a>
    <h1 class="text-2xl font-bold mb-1">{$t('newStep.heading')}</h1>
    <p class="text-surface-500 dark:text-surface-400 text-sm">{$t('newStep.subheading')}</p>
  </div>

  <form method="POST" use:enhance={() => {
    submitting = true;
    return ({ update }) => { submitting = false; update(); };
  }} class="space-y-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6">
    <input type="hidden" name="order" value={nextOrder} />

    <div class="space-y-2">
      <Label for="title">
        {$t('newStep.label')}
        <span class="text-surface-400 font-normal text-xs"> {$t('newStep.labelHint')}</span>
      </Label>
      <Input id="title" name="title" placeholder="Day {nextOrder + 1} — Welcome" />
    </div>

    <div class="space-y-2">
      <Label for="delay_hours">{$t('newStep.sendAt')}</Label>
      <Input id="delay_hours" name="delay_hours" type="number" min="0" step="1" bind:value={delayHours} />
      <p class="text-xs text-surface-500">
        {delayHours === 0
          ? $t('newStep.immediately')
          : $t('newStep.sentHours', { hours: delayHours, day: Math.floor(delayHours / 24) + 1 })}
      </p>
    </div>

    <div class="space-y-2">
      <Label for="message_body">{$t('newStep.message')} <span class="text-red-500">*</span></Label>
      <MessageEditor
        bind:value={messageBody}
        courseName={course.title}
        placeholder="Hey {'{name}'}! Welcome to the challenge. Today's task is..."
      />
      <p class="text-xs text-surface-500">{$t('newStep.messageHint')}</p>
    </div>

    <div class="space-y-2">
      <Label for="media_url">
        {$t('newStep.mediaUrl')}
        <span class="text-surface-400 font-normal text-xs"> {$t('newStep.mediaHint')}</span>
      </Label>
      <Input id="media_url" name="media_url" type="url" placeholder={$t('newStep.mediaPlaceholder')} />
      <p class="text-xs text-surface-500">{$t('newStep.mediaNote')}</p>
    </div>

    <Button type="submit" class="w-full" disabled={submitting}>
      {#if submitting}
        <Loader2 size={16} class="mr-2 animate-spin" />
        {$t('newStep.saving')}
      {:else}
        {$t('newStep.save')}
        <ArrowRight size={16} class="ml-2" />
      {/if}
    </Button>
  </form>
</div>
