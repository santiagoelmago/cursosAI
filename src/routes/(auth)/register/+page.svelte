<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import { Mail, Lock, User, Building, Loader2, ArrowRight } from 'lucide-svelte';

  let name = $state('');
  let company = $state('');
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
  <title>Create Account | CursosAI</title>
</svelte:head>

<div class="mb-8">
  <h1 class="text-3xl font-bold mb-2">Join CursosAI</h1>
  <p class="text-surface-500 dark:text-surface-400">Set up your workspace and transform your workflows.</p>
</div>

<form onsubmit={handleSubmit} class="space-y-4">
  <div class="grid grid-cols-2 gap-4">
    <div class="space-y-2">
      <Label for="name">Full Name</Label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400">
          <User size={18} />
        </div>
        <Input id="name" placeholder="John Doe" bind:value={name} required class="pl-10" />
      </div>
    </div>
    
    <div class="space-y-2">
      <Label for="company">Company</Label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400">
          <Building size={18} />
        </div>
        <Input id="company" placeholder="Acme Corp" bind:value={company} required class="pl-10" />
      </div>
    </div>
  </div>

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
    <Label for="password">Password</Label>
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
    <p class="text-xs text-surface-500">Must be at least 8 characters long.</p>
  </div>

  <Button type="submit" class="w-full mt-4" disabled={loading}>
    {#if loading}
      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
      Creating account...
    {:else}
      Create Account
      <ArrowRight class="ml-2 h-4 w-4" />
    {/if}
  </Button>
</form>

<div class="mt-8 text-center text-sm text-surface-500 dark:text-surface-400">
  Already have an account? 
  <a href="/login" class="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
    Sign in
  </a>
</div>
