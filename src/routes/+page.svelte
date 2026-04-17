<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import { ArrowRight, Sparkles } from 'lucide-svelte';
</script>

<svelte:head>
  <title>CursosAI | B2B AI Workflow Adoption</title>
</svelte:head>

<div class="min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col items-center justify-center p-4">
  <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center items-center">
    <div class="w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-3xl absolute opacity-50 dark:opacity-20 animate-pulse-glow"></div>
  </div>

  <div class="max-w-3xl text-center relative z-10 animate-fade-in-up">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 text-sm font-medium mb-6">
      <Sparkles size={16} />
      <span>The new standard for team AI adoption</span>
    </div>
    
    <h1 class="text-5xl md:text-7xl font-bold tracking-tight text-surface-900 dark:text-white mb-8">
      Stop generic training. <br />
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">
        Start building workflows.
      </span>
    </h1>
    
    <p class="text-xl text-surface-600 dark:text-surface-400 mb-10 max-w-2xl mx-auto">
      Empower your team with an interactive sandbox perfectly tuned for their roles. Transform raw AI potential into daily operational efficiency.
    </p>
    
    <div class="flex items-center justify-center gap-4">
      <a href="/login" class="focus:outline-none">
        <Button size="lg" class="group text-base py-6 px-8 rounded-full">
          Access Platform
          <ArrowRight class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </a>
      <a href="https://example.com/demo" target="_blank" rel="noreferrer" class="focus:outline-none">
        <Button variant="outline" size="lg" class="text-base py-6 px-8 rounded-full border-2 bg-transparent text-surface-900 dark:text-white hover:bg-surface-100 dark:hover:bg-surface-800">
          Book Demo
        </Button>
      </a>
    </div>
  </div>
</div>
