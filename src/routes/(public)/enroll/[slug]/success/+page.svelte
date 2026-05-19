<script lang="ts">
  import { CheckCircle, MessageSquare } from 'lucide-svelte';
  import { t } from '$lib/stores/locale';
</script>

<svelte:head>
  <title>{$t('success.heading')}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-surface-50 to-brand-50 dark:from-surface-950 dark:to-brand-950 flex items-center justify-center p-4">
  <div class="w-full max-w-md text-center">
    <div class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
      <CheckCircle size={40} class="text-green-500" />
    </div>

    <h1 class="text-3xl font-bold mb-3">{$t('success.heading')}</h1>
    <p class="text-surface-500 dark:text-surface-400 mb-8 max-w-sm mx-auto">
      {$t('success.description')}
    </p>

    <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 text-left">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
          <MessageSquare size={20} class="text-white" />
        </div>
        <div>
          <p class="text-xs text-surface-400">{$t('success.whatsappLabel')}</p>
          <p class="text-sm font-medium">{$t('success.firstMessage')}</p>
        </div>
      </div>
      <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
        <p class="text-sm text-green-800 dark:text-green-200">
          {$t('success.welcome')}
        </p>
      </div>
    </div>

    <p class="text-xs text-surface-400 mt-6">
      {$t('success.didntGet')}
    </p>
  </div>
</div>
