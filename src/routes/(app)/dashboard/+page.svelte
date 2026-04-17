<script lang="ts">
  import { Sparkles, ArrowRight, PlayCircle, BookOpen } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';
</script>

<svelte:head>
  <title>Dashboard | CursosAI</title>
</svelte:head>

<div class="mb-8">
  <h1 class="text-3xl font-bold mb-2">Welcome, John</h1>
  <p class="text-surface-500 dark:text-surface-400">Your AI sandbox is perfectly tailored for your Sales & Marketing workflows.</p>
</div>

<div class="grid lg:grid-cols-3 gap-6 mb-8">
  <div class="lg:col-span-2 space-y-6">
    <!-- Main Call to Action -->
    <div class="bg-gradient-to-br from-brand-600 to-indigo-800 rounded-2xl p-8 text-white relative overflow-hidden">
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      
      <div class="relative z-10 max-w-md">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-4 backdrop-blur-sm">
          <Sparkles size={14} />
          <span>New Sandbox Available</span>
        </div>
        
        <h2 class="text-3xl font-bold mb-4">Start your Interactive Training</h2>
        <p class="text-indigo-100 mb-8 whitespace-pre-line">Learn how to automate lead scoring and generate highly personalized outreach emails in minutes.</p>
        
        <Button class="bg-white text-indigo-900 hover:bg-slate-50 font-semibold" size="lg">
          Launch Sandbox
          <ArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>

    <!-- Quick Workflows -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold">Your Saved Workflows</h3>
        <a href="/workflows" class="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">View all</a>
      </div>
      
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl hover:border-brand-500 dark:hover:border-brand-500 transition-colors cursor-pointer group">
          <div class="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-110 transition-transform">
            <BookOpen size={20} />
          </div>
          <h4 class="font-semibold mb-1">Cold Email Generator</h4>
          <p class="text-sm text-surface-500 dark:text-surface-400">Uses LinkedIn profile data to write personalized intros.</p>
        </div>
        
        <div class="p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl hover:border-brand-500 dark:hover:border-brand-500 transition-colors cursor-pointer group flex flex-col justify-center items-center text-center border-dashed">
          <div class="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-500 mb-4">
            <Sparkles size={20} />
          </div>
          <h4 class="font-semibold mb-1">Create New Workflow</h4>
          <p class="text-sm text-surface-500 dark:text-surface-400">Build from scratch</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Sidebar Widget -->
  <div class="space-y-6">
    <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-6">
      <h3 class="font-bold mb-4">Training Progress</h3>
      
      <div class="space-y-4">
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="font-medium">Prompt Engineering Basics</span>
            <span class="text-surface-500">100%</span>
          </div>
          <div class="w-full h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
            <div class="w-full h-full bg-green-500 rounded-full"></div>
          </div>
        </div>
        
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="font-medium">Advanced Data Analysis</span>
            <span class="text-surface-500">45%</span>
          </div>
          <div class="w-full h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
            <div class="w-[45%] h-full bg-brand-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-surface-900 dark:bg-surface-950 border border-surface-800 rounded-xl p-6 text-white relative overflow-hidden">
      <div class="absolute -right-4 -bottom-4 pt-10 text-surface-800">
        <PlayCircle size={120} class="opacity-20" />
      </div>
      <div class="relative z-10">
        <div class="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2">Upcoming</div>
        <h3 class="font-bold text-lg mb-2">Live Session: Writing System Prompts</h3>
        <p class="text-sm text-surface-400 mb-4">Tomorrow, 10:00 AM PST</p>
        <Button variant="secondary" size="sm" class="bg-surface-800 hover:bg-surface-700 text-white border-none">
          Add to Calendar
        </Button>
      </div>
    </div>
  </div>
</div>
