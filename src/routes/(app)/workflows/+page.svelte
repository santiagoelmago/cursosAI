<script lang="ts">
  import { Search, Filter, Megaphone, Briefcase, Code, FileText, ChevronRight } from 'lucide-svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  const categories = ['All', 'Sales', 'HR', 'Marketing', 'Operations', 'Engineering'];
  let activeCategory = $state('All');

  const workflows = [
    { id: 1, title: 'Cold Email Generator', category: 'Sales', icon: Megaphone, description: 'Generate highly personalized outreach emails using LinkedIn profile data.' },
    { id: 2, title: 'Job Description Writer', category: 'HR', icon: Briefcase, description: 'Create engaging and inclusive job postings from a list of basic requirements.' },
    { id: 3, title: 'Code Review Assistant', category: 'Engineering', icon: Code, description: 'Analyze pull requests for security flaws and performance improvements.' },
    { id: 4, title: 'Blog Post Outliner', category: 'Marketing', icon: FileText, description: 'Draft SEO-optimized heading structures for targeted keywords.' },
    { id: 5, title: 'Interview Question Prep', category: 'HR', icon: Briefcase, description: 'Generate technical and behavioral questions based on a candidate\'s resume.' },
    { id: 6, title: 'Objection Handling Script', category: 'Sales', icon: Megaphone, description: 'Create dynamic scripts for overcoming specific prospect objections.' }
  ];

  let searchQuery = $state('');

  let filteredWorkflows = $derived(
    workflows.filter(w => {
      const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) || w.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || w.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
  );
</script>

<svelte:head>
  <title>Workflow Library | CursosAI</title>
</svelte:head>

<div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
  <div>
    <h1 class="text-3xl font-bold mb-2">Workflow Library</h1>
    <p class="text-surface-500 dark:text-surface-400 max-w-2xl">Discover and customize AI templates designed specifically for your organizational needs.</p>
  </div>
  
  <div class="flex gap-3">
    <div class="relative w-full md:w-64">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400">
        <Search size={16} />
      </div>
      <Input placeholder="Search workflows..." bind:value={searchQuery} class="pl-9 bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800" />
    </div>
    <Button variant="outline" class="shrink-0 bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800">
      <Filter size={16} />
    </Button>
  </div>
</div>

<!-- Categories -->
<div class="flex overflow-x-auto pb-4 mb-4 gap-2 scrollbar-none">
  {#each categories as category}
    <button
      class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap {activeCategory === category ? 'bg-brand-600 text-white shadow-sm' : 'bg-surface-200 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-700'}"
      onclick={() => activeCategory = category}
    >
      {category}
    </button>
  {/each}
</div>

<!-- Grid -->
<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
  {#each filteredWorkflows as workflow}
    {@const Icon = workflow.icon}
    <a href="/sandbox?id={workflow.id}" class="group block bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-500/50 transition-all duration-300">
      <div class="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xs font-semibold px-2 py-0.5 rounded text-brand-700 bg-brand-50 dark:text-brand-300 dark:bg-brand-500/20 uppercase tracking-wide">
          {workflow.category}
        </span>
      </div>
      
      <h3 class="font-bold text-lg mb-2 text-surface-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{workflow.title}</h3>
      <p class="text-sm text-surface-500 dark:text-surface-400 mb-6 line-clamp-2">{workflow.description}</p>
      
      <div class="flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:underline">
        Launch Sandbox
        <ChevronRight size={16} class="ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  {:else}
    <div class="col-span-full py-12 text-center bg-surface-100 dark:bg-surface-800/50 rounded-2xl border border-dashed border-surface-300 dark:border-surface-700">
      <div class="w-12 h-12 mx-auto text-surface-400 mb-3 flex items-center justify-center">
        <Search size={32} />
      </div>
      <h3 class="text-lg font-medium text-surface-900 dark:text-white mb-1">No templates found</h3>
      <p class="text-surface-500 dark:text-surface-400 text-sm">We couldn't find any workflows matching your search criteria.</p>
    </div>
  {/each}
</div>
