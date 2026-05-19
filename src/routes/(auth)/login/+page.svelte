<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import { pb } from '$lib/pb';
  import { goto } from '$app/navigation';
  import { Mail, Lock, Loader2, ArrowRight } from 'lucide-svelte';
  import { t } from '$lib/stores/locale';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';
    try {
      await pb.collection('users').authWithPassword(email, password);
      goto('/dashboard');
    } catch (err: any) {
      error = err?.response?.message || err?.message || $t('login.errorFallback');
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Log In | CursosAI</title>
</svelte:head>

<div class="mb-8">
  <h1 class="text-3xl font-bold mb-2">{$t('login.heading')}</h1>
  <p class="text-surface-500 dark:text-surface-400">{$t('login.subheading')}</p>
</div>

{#if error}
  <div class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
    {error}
  </div>
{/if}

<form onsubmit={handleSubmit} class="space-y-5">
  <div class="space-y-2">
    <Label for="email">{$t('login.email')}</Label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400">
        <Mail size={18} />
      </div>
      <Input id="email" type="email" placeholder={$t('login.emailPlaceholder')} bind:value={email} required class="pl-10" />
    </div>
  </div>

  <div class="space-y-2">
    <Label for="password">{$t('login.password')}</Label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400">
        <Lock size={18} />
      </div>
      <Input id="password" type="password" placeholder={$t('login.passwordPlaceholder')} bind:value={password} required class="pl-10" />
    </div>
  </div>

  <Button type="submit" class="w-full mt-2" disabled={loading}>
    {#if loading}
      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
      {$t('login.signing')}
    {:else}
      {$t('login.submit')}
      <ArrowRight class="ml-2 h-4 w-4" />
    {/if}
  </Button>
</form>

<div class="mt-8 text-center text-sm text-surface-500 dark:text-surface-400">
  {$t('login.noAccount')}
  <a href="/register" class="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
    {$t('login.create')}
  </a>
</div>
