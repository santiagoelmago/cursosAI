<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import { Mail, Lock, Loader2, ArrowRight } from 'lucide-svelte';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    
    // TODO: Implement actual PocketBase auth
    setTimeout(() => {
      loading = false;
    }, 1500);
  }
</script>

<svelte:head>
  <title>Log In | CursosAI</title>
</svelte:head>

<div class="mb-8">
  <h1 class="text-3xl font-bold mb-2">Welcome back</h1>
  <p class="text-surface-500 dark:text-surface-400">Enter your credentials to access your workspace</p>
</div>

<form onsubmit={handleSubmit} class="space-y-5">
  <div class="space-y-2">
    <Label for="email">Work Email</Label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400">
        <Mail size={18} />
      </div>
      <Input
        id="email"
        type="email"
        placeholder="name@company.com"
        bind:value={email}
        required
        class="pl-10"
      />
    </div>
  </div>

  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <Label for="password">Password</Label>
      <a href="/forgot-password" class="text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300">
        Forgot password?
      </a>
    </div>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400">
        <Lock size={18} />
      </div>
      <Input
        id="password"
        type="password"
        placeholder="••••••••"
        bind:value={password}
        required
        class="pl-10"
      />
    </div>
  </div>

  <Button type="submit" class="w-full mt-2" disabled={loading}>
    {#if loading}
      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
      Signing in...
    {:else}
      Sign In
      <ArrowRight class="ml-2 h-4 w-4" />
    {/if}
  </Button>
</form>

<div class="mt-8 text-center text-sm text-surface-500 dark:text-surface-400">
  Don't have an account? 
  <a href="/register" class="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
    Request access
  </a>
</div>
