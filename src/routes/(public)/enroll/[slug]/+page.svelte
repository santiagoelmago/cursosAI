<script lang="ts">
  import { enhance } from '$app/forms';
  import { Loader2, MessageSquare, CheckCircle } from 'lucide-svelte';

  let { data, form } = $props();
  const course = $derived(data.course);
  let submitting = $state(false);
</script>

<svelte:head>
  <title>{course.title}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-surface-50 to-brand-50 dark:from-surface-950 dark:to-brand-950 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
        <MessageSquare size={32} class="text-white" />
      </div>
      <h1 class="text-3xl font-bold mb-2">{course.title}</h1>
      {#if course.description}
        <p class="text-surface-500 dark:text-surface-400">{course.description}</p>
      {/if}
      {#if course.price_cents}
        <div class="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-bold text-xl">
          ${(course.price_cents / 100).toFixed(2)}
        </div>
      {:else}
        <div class="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold">
          Free
        </div>
      {/if}
    </div>

    <!-- Features -->
    <div class="flex justify-center gap-6 mb-8 text-sm text-surface-500 dark:text-surface-400">
      <div class="flex items-center gap-1.5">
        <CheckCircle size={16} class="text-green-500" />
        Delivered via WhatsApp
      </div>
      <div class="flex items-center gap-1.5">
        <CheckCircle size={16} class="text-green-500" />
        Automatic daily messages
      </div>
    </div>

    <!-- Enrollment form -->
    <div class="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm p-6">
      <h2 class="font-semibold text-lg mb-4">
        {course.price_cents ? 'Enroll & Pay' : 'Enroll for Free'}
      </h2>

      {#if form?.error}
        <div class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {form.error}
        </div>
      {/if}

      <form method="POST" use:enhance={() => {
        submitting = true;
        return ({ update }) => { submitting = false; update(); };
      }} class="space-y-4">
        <div>
          <label for="student_name" class="block text-sm font-medium mb-1">Full Name</label>
          <input
            id="student_name"
            name="student_name"
            type="text"
            required
            placeholder="John Doe"
            class="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <div>
          <label for="student_email" class="block text-sm font-medium mb-1">Email</label>
          <input
            id="student_email"
            name="student_email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <div>
          <label for="whatsapp_number" class="block text-sm font-medium mb-1">WhatsApp Number</label>
          <input
            id="whatsapp_number"
            name="whatsapp_number"
            type="tel"
            required
            placeholder="+1 555 123 4567"
            class="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          <p class="text-xs text-surface-500 mt-1">Include your country code (e.g. +1 for US).</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          class="w-full py-3 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {#if submitting}
            <Loader2 size={18} class="animate-spin" />
            Processing...
          {:else if course.price_cents}
            Pay ${(course.price_cents / 100).toFixed(2)} → Enroll
          {:else}
            Enroll for Free
          {/if}
        </button>
      </form>

      <p class="text-xs text-center text-surface-400 mt-4">
        {#if course.price_cents}
          You'll be redirected to Stripe to complete payment.
        {:else}
          You'll receive your first WhatsApp message shortly.
        {/if}
      </p>
    </div>
  </div>
</div>
