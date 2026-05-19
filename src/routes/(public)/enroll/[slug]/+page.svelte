<script lang="ts">
  import { enhance } from '$app/forms';
  import { Loader2, MessageSquare, CheckCircle } from 'lucide-svelte';
  import { t } from '$lib/stores/locale';

  let { data, form } = $props();
  const course = $derived(data.course);
  let submitting = $state(false);

  const countries = [
    { code: '+1',   flag: '🇺🇸', name: 'US/Canada' },
    { code: '+52',  flag: '🇲🇽', name: 'Mexico' },
    { code: '+54',  flag: '🇦🇷', name: 'Argentina' },
    { code: '+55',  flag: '🇧🇷', name: 'Brazil' },
    { code: '+56',  flag: '🇨🇱', name: 'Chile' },
    { code: '+57',  flag: '🇨🇴', name: 'Colombia' },
    { code: '+51',  flag: '🇵🇪', name: 'Peru' },
    { code: '+58',  flag: '🇻🇪', name: 'Venezuela' },
    { code: '+502', flag: '🇬🇹', name: 'Guatemala' },
    { code: '+503', flag: '🇸🇻', name: 'El Salvador' },
    { code: '+504', flag: '🇭🇳', name: 'Honduras' },
    { code: '+505', flag: '🇳🇮', name: 'Nicaragua' },
    { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
    { code: '+507', flag: '🇵🇦', name: 'Panama' },
    { code: '+34',  flag: '🇪🇸', name: 'Spain' },
    { code: '+44',  flag: '🇬🇧', name: 'UK' },
    { code: '+49',  flag: '🇩🇪', name: 'Germany' },
    { code: '+33',  flag: '🇫🇷', name: 'France' },
  ];

  let dialCode = $state('+52');
  let localNumber = $state('');

  let localDigits = $derived.by(() => {
    const digits = localNumber.replace(/\D/g, '');
    const codeDigits = dialCode.replace(/\D/g, '');
    return digits.startsWith(codeDigits) ? digits.slice(codeDigits.length) : digits;
  });

  let fullNumber = $derived(dialCode + localDigits);
</script>

<svelte:head>
  <title>{course.title}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-surface-50 to-brand-50 dark:from-surface-950 dark:to-brand-950 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
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
          {$t('enroll.free')}
        </div>
      {/if}
    </div>

    <div class="flex justify-center gap-6 mb-8 text-sm text-surface-500 dark:text-surface-400">
      <div class="flex items-center gap-1.5">
        <CheckCircle size={16} class="text-green-500" />
        {$t('enroll.deliveredVia')}
      </div>
      <div class="flex items-center gap-1.5">
        <CheckCircle size={16} class="text-green-500" />
        {$t('enroll.automaticMessages')}
      </div>
    </div>

    <div class="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm p-6">
      <h2 class="font-semibold text-lg mb-4">
        {course.price_cents ? $t('enroll.enrollPay') : $t('enroll.enrollFree')}
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
          <label for="student_name" class="block text-sm font-medium mb-1">{$t('enroll.fullName')}</label>
          <input
            id="student_name"
            name="student_name"
            type="text"
            required
            placeholder={$t('enroll.namePlaceholder')}
            class="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <div>
          <label for="student_email" class="block text-sm font-medium mb-1">{$t('enroll.email')}</label>
          <input
            id="student_email"
            name="student_email"
            type="email"
            required
            placeholder={$t('enroll.emailPlaceholder')}
            class="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">{$t('enroll.whatsapp')}</label>
          <input type="hidden" name="whatsapp_number" value={fullNumber} />
          <div class="flex gap-2">
            <select
              bind:value={dialCode}
              class="rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shrink-0"
            >
              {#each countries as c}
                <option value={c.code}>{c.flag} {c.code}</option>
              {/each}
            </select>
            <input
              id="whatsapp_number"
              type="tel"
              required
              placeholder={$t('enroll.whatsappPlaceholder')}
              bind:value={localNumber}
              pattern="[\d\s\-\(\)]+"
              minlength="7"
              title={$t('enroll.whatsappHint')}
              class="flex-1 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <p class="text-xs mt-1 {localDigits.length > 0 && localDigits.length < 7 ? 'text-red-500' : 'text-surface-500'}">
            {#if localDigits.length > 0 && localDigits.length < 7}
              {$t('enroll.numberShort')}
            {:else}
              {$t('enroll.willBeSent')} <span class="font-mono">{fullNumber || dialCode + '…'}</span>
            {/if}
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          class="w-full py-3 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {#if submitting}
            <Loader2 size={18} class="animate-spin" />
            {$t('enroll.processing')}
          {:else if course.price_cents}
            Pay ${(course.price_cents / 100).toFixed(2)} → {$t('enroll.enrollFree').replace('gratis', '').replace('free', '').trim() || 'Enroll'}
          {:else}
            {$t('enroll.enrollFree')}
          {/if}
        </button>
      </form>

      <p class="text-xs text-center text-surface-400 mt-4">
        {#if course.price_cents}
          {$t('enroll.stripeRedirect')}
        {:else}
          {$t('enroll.firstMessage')}
        {/if}
      </p>
    </div>
  </div>
</div>
