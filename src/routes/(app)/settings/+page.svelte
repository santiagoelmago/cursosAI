<script lang="ts">
  import { MessageSquare, Wifi, WifiOff, Loader2, RefreshCw } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { t } from '$lib/stores/locale';

  let { data } = $props();

  let status = $state<'disconnected' | 'connecting' | 'connected'>(
    data.session?.status ?? 'disconnected'
  );
  let qr = $state<string | null>(null);
  let loading = $state(false);
  let polling = $state<ReturnType<typeof setInterval> | null>(null);

  function stopPolling() {
    if (polling) { clearInterval(polling); polling = null; }
  }

  async function pollStatus() {
    try {
      const res = await fetch(`/api/whatsapp`);
      const data = await res.json();
      status = data.status;
      qr = data.qr;
      if (data.status === 'connected') { stopPolling(); qr = null; }
    } catch {}
  }

  async function connect() {
    loading = true;
    try {
      const res = await fetch('/api/whatsapp', { method: 'POST' });
      const data = await res.json();
      status = data.status;
      qr = data.qr;
      polling = setInterval(pollStatus, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      loading = false;
    }
  }

  async function disconnect() {
    loading = true;
    try {
      await fetch('/api/whatsapp', { method: 'DELETE' });
      status = 'disconnected';
      qr = null;
      stopPolling();
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    if (data.session?.status === 'connected' || data.session?.status === 'connecting') {
      pollStatus();
    }
    return stopPolling;
  });
</script>

<svelte:head>
  <title>Settings | CursosAI</title>
</svelte:head>

<div class="mb-8">
  <h1 class="text-3xl font-bold mb-1">{$t('settings.heading')}</h1>
  <p class="text-surface-500 dark:text-surface-400">{$t('settings.subheading')}</p>
</div>

<div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 max-w-lg">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
      <MessageSquare size={20} />
    </div>
    <div>
      <h2 class="font-semibold text-lg">{$t('settings.waTitle')}</h2>
      <p class="text-sm text-surface-500 dark:text-surface-400">{$t('settings.waDesc')}</p>
    </div>
  </div>

  <div class="flex items-center gap-2 mb-6">
    {#if status === 'connected'}
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        <Wifi size={14} />
        {$t('settings.connected')}
      </span>
    {:else if status === 'connecting'}
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
        <Loader2 size={14} class="animate-spin" />
        {$t('settings.waitingScan')}
      </span>
    {:else}
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400">
        <WifiOff size={14} />
        {$t('settings.notConnected')}
      </span>
    {/if}
  </div>

  {#if qr && status === 'connecting'}
    <div class="mb-6 flex flex-col items-center gap-3 p-4 bg-surface-50 dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
      <img src={qr} alt="WhatsApp QR Code" class="w-52 h-52 rounded-lg" />
      <p class="text-sm text-surface-500 dark:text-surface-400 text-center">
        {$t('settings.scanInstructions')}
      </p>
    </div>
  {/if}

  {#if status === 'connected'}
    <Button variant="outline" onclick={disconnect} disabled={loading} class="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
      {#if loading}<Loader2 size={16} class="mr-2 animate-spin" />{/if}
      {$t('settings.disconnect')}
    </Button>
  {:else}
    <Button onclick={connect} disabled={loading || status === 'connecting'}>
      {#if loading || status === 'connecting'}
        <Loader2 size={16} class="mr-2 animate-spin" />
        {status === 'connecting' ? $t('settings.scanQR') : $t('settings.connecting')}
      {:else}
        <RefreshCw size={16} class="mr-2" />
        {$t('settings.connect')}
      {/if}
    </Button>
  {/if}
</div>
