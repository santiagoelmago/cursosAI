<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/ui/Button.svelte';
  import { Loader2, CheckCircle, AlertCircle } from 'lucide-svelte';

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
    <h1 class="text-2xl font-bold mb-1">Publish Your Course</h1>
    <p class="text-surface-500 dark:text-surface-400 text-sm">Once published, students can enroll and receive your WhatsApp messages.</p>
  </div>

  {#if form?.error}
    <div class="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
      {form.error}
    </div>
  {/if}

  <!-- Checklist -->
  <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 mb-6 space-y-3">
    <h2 class="font-semibold mb-4">Pre-publish checklist</h2>

    <div class="flex items-center gap-3 text-sm">
      {#if course.title}
        <CheckCircle size={18} class="text-green-500 shrink-0" />
        <span>Course title: <strong>{course.title}</strong></span>
      {:else}
        <AlertCircle size={18} class="text-red-500 shrink-0" />
        <span class="text-red-600">No title set</span>
      {/if}
    </div>

    <div class="flex items-center gap-3 text-sm">
      {#if stepCount > 0}
        <CheckCircle size={18} class="text-green-500 shrink-0" />
        <span>{stepCount} message{stepCount !== 1 ? 's' : ''} in sequence</span>
      {:else}
        <AlertCircle size={18} class="text-red-500 shrink-0" />
        <span class="text-red-600">No messages added yet — <a href="/courses/{course.id}/steps" class="underline">add messages first</a></span>
      {/if}
    </div>

    <div class="flex items-center gap-3 text-sm">
      {#if course.slug}
        <CheckCircle size={18} class="text-green-500 shrink-0" />
        <span>Enrollment URL: <code class="bg-surface-100 dark:bg-surface-800 px-1 rounded">/enroll/{course.slug}</code></span>
      {:else}
        <AlertCircle size={18} class="text-red-500 shrink-0" />
        <span class="text-red-600">No slug set</span>
      {/if}
    </div>

    <div class="flex items-center gap-3 text-sm">
      <CheckCircle size={18} class="text-green-500 shrink-0" />
      <span>Price: <strong>{course.price_cents ? `$${(course.price_cents / 100).toFixed(2)}` : 'Free'}</strong></span>
    </div>
  </div>

  <div class="bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-200 dark:border-brand-800 p-4 text-sm text-brand-800 dark:text-brand-200 mb-6">
    Publishing will create a Stripe product and price for your course, then make your enrollment page live.
  </div>

  <form method="POST" use:enhance={() => {
    submitting = true;
    return ({ update }) => { submitting = false; update(); };
  }}>
    <Button
      type="submit"
      class="w-full"
      disabled={submitting || stepCount === 0}
    >
      {#if submitting}
        <Loader2 size={16} class="mr-2 animate-spin" />
        Publishing...
      {:else}
        Publish Course
      {/if}
    </Button>
  </form>
</div>
