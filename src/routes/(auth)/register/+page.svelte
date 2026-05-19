<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import { pb } from '$lib/pb';
  import { goto } from '$app/navigation';
  import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-svelte';
  import { t } from '$lib/stores/locale';

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';
    try {
      await pb.collection('users').create({ name, email, password, passwordConfirm: password });
      await pb.collection('users').authWithPassword(email, password);
      goto('/dashboard');
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.email?.message) error = `Email: ${data.email.message}`;
      else if (data?.password?.message) error = `Password: ${data.password.message}`;
      else error = err?.response?.message || err?.message || $t('register.errorFallback');
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Create Account | CursosAI</title>
</svelte:head>

<div class="mb-8">
  <h1 class="text-3xl font-bold mb-2">{$t('register.heading')}</h1>
  <p class="text-surface-500 dark:text-surface-400">{$t('register.subheading')}</p>
</div>

{#if error}
  <div class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
    {error}
  </div>
{/if}

<form onsubmit={handleSubmit} class="space-y-4">
  <div class="space-y-2">
    <Label for="name">{$t('register.name')}</Label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400">
        <User size={18} />
      </div>
      <Input id="name" placeholder={$t('register.namePlaceholder')} bind:value={name} required class="pl-10" />
    </div>
  </div>

  <div class="space-y-2">
    <Label for="email">{$t('register.email')}</Label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400">
        <Mail size={18} />
      </div>
      <Input id="email" type="email" placeholder={$t('register.emailPlaceholder')} bind:value={email} required class="pl-10" />
    </div>
  </div>

  <div class="space-y-2">
    <Label for="password">{$t('register.password')}</Label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400">
        <Lock size={18} />
      </div>
      <Input id="password" type="password" placeholder={$t('register.passwordPlaceholder')} bind:value={password} required class="pl-10" />
    </div>
    <p class="text-xs text-surface-500">{$t('register.passwordHint')}</p>
  </div>

  <Button type="submit" class="w-full mt-4" disabled={loading}>
    {#if loading}
      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
      {$t('register.creating')}
    {:else}
      {$t('register.submit')}
      <ArrowRight class="ml-2 h-4 w-4" />
    {/if}
  </Button>
</form>

<div class="mt-8 text-center text-sm text-surface-500 dark:text-surface-400">
  {$t('register.hasAccount')}
  <a href="/login" class="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
    {$t('register.signin')}
  </a>
</div>
