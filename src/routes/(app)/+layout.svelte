<script lang="ts">
  import { Briefcase, LayoutDashboard, Settings, LogOut, Menu, Sparkles } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';

  let { children } = $props();
  
  let isMobileMenuOpen = $state(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Sandbox', href: '/sandbox', icon: Sparkles },
    { name: 'Workflows', href: '/workflows', icon: Briefcase },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];
</script>

<div class="min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col md:flex-row font-sans">
  <!-- Sidebar for desktop -->
  <aside class="hidden md:flex flex-col w-64 bg-surface-900 border-r border-surface-800 text-white shrink-0 sticky top-0 h-screen">
    <div class="p-6 flex items-center gap-2 font-bold text-xl text-brand-400">
      <div class="w-8 h-8 rounded bg-brand-600 flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      CursosAI
    </div>

    <nav class="flex-1 px-4 space-y-1 mt-6">
      {#each navigation as item}
        {@const Icon = item.icon}
        <a href={item.href} class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-surface-400 hover:text-white hover:bg-surface-800">
          <Icon size={18} />
          {item.name}
        </a>
      {/each}
    </nav>

    <div class="p-4 border-t border-surface-800">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-full bg-brand-700 font-bold flex items-center justify-center shrink-0">
          JD
        </div>
        <div class="overflow-hidden">
          <p class="text-sm font-medium text-white truncate">John Doe</p>
          <p class="text-xs text-surface-400 truncate">Acme Corp</p>
        </div>
      </div>
      <a href="/login">
        <Button variant="ghost" class="w-full justify-start text-surface-400 hover:text-white hover:bg-surface-800">
          <LogOut size={18} class="mr-2" />
          Log out
        </Button>
      </a>
    </div>
  </aside>

  <!-- Mobile header -->
  <header class="md:hidden flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 sticky top-0 z-20">
    <div class="flex items-center gap-2 font-bold text-lg text-brand-600 dark:text-brand-400">
      <div class="w-8 h-8 rounded bg-brand-600 flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      CursosAI
    </div>
    <button class="p-2 -mr-2 text-surface-600 dark:text-surface-300" onclick={() => isMobileMenuOpen = !isMobileMenuOpen}>
      <Menu size={24} />
    </button>
  </header>

  <!-- Main content area -->
  <main class="flex-1 overflow-auto bg-surface-50 dark:bg-surface-950 p-6 md:p-8 relative">
    <div class="max-w-6xl mx-auto w-full animate-fade-in-up">
      {@render children()}
    </div>
  </main>
</div>
