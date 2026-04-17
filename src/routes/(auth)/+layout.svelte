<script lang="ts">
  let { children } = $props();
</script>

<div class="min-h-screen grid lg:grid-cols-2 bg-surface-50 dark:bg-surface-950 font-sans">
  <div class="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-24 xl:px-32 relative">
    <div class="absolute top-8 left-8 sm:top-12 sm:left-12">
      <a href="/" class="flex items-center gap-2 font-bold text-xl text-brand-600 dark:text-brand-400">
        <div class="w-8 h-8 rounded bg-brand-600 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        CursosAI
      </a>
    </div>
    
    <div class="w-full max-w-sm mx-auto animate-fade-in-up">
      {@render children()}
    </div>
  </div>

  <div class="hidden lg:flex flex-col justify-center bg-surface-900 dark:bg-surface-900 text-white relative overflow-hidden p-24">
    <!-- Decorator blobs -->
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/30 rounded-full blur-3xl animate-pulse-glow"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl"></div>
    
    <div class="relative z-10 max-w-md animate-fade-in-up" style="animation-delay: 0.2s;">
      <h2 class="text-4xl font-bold mb-6 text-white">Master AI Workflows for Your Business.</h2>
      <p class="text-surface-300 text-lg mb-12">
        Generate high-quality AI prompts tailored specifically to your industry and job tasks. Stop watching generic videos and start building real automation.
      </p>

      <div class="space-y-6">
        <div class="flex gap-4 items-start">
          <div class="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <div>
            <h3 class="font-medium text-white">Interactive Sandbox</h3>
            <p class="text-surface-400 text-sm mt-1">Learn by doing. Create prompts that actually solve your day-to-day work problems.</p>
          </div>
        </div>
        
        <div class="flex gap-4 items-start">
          <div class="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <div>
            <h3 class="font-medium text-white">Industry Specific</h3>
            <p class="text-surface-400 text-sm mt-1">Whether you are in HR, Sales, or Finance, we have tailored workflows for you.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
