<script lang="ts">
  import { page } from '$app/state';
  import { Megaphone, Play, Copy, RefreshCw, CheckCircle2, ChevronLeft } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';

  // In a real app, this would be fetched based on page.url.searchParams.get('id')
  const workflow = {
    title: 'Cold Email Generator',
    icon: Megaphone,
    description: 'Generates a highly personalized cold outreach email using proven B2B sales frameworks like AIDA or PAS.',
    fields: [
      { id: 'prospectName', label: 'Prospect Name', type: 'text', placeholder: 'e.g. John Smith' },
      { id: 'prospectTitle', label: 'Job Title', type: 'text', placeholder: 'e.g. VP of Sales' },
      { id: 'targetCompany', label: 'Target Company', type: 'text', placeholder: 'e.g. Acme Corp' },
      { id: 'painPoint', label: 'Assumed Pain Point', type: 'textarea', placeholder: 'e.g. High cost of customer acquisition and manual lead scoring.' },
      { id: 'ourProduct', label: 'Our Product / Value Prop', type: 'textarea', placeholder: 'e.g. CursosAI reduces manual prep by 80% with automated workflow sandboxes.' },
    ]
  };

  let formData = $state<Record<string, string>>({});
  let generating = $state(false);
  let generatedPrompt = $state('');
  let copied = $state(false);

  function handleGenerate() {
    generating = true;
    
    // Simulate generation delay
    setTimeout(() => {
      generatedPrompt = `You are a world-class B2B SaaS Sales Executive. 
Your goal is to write a highly converting cold email to ${formData.prospectName || '[Name]'}, who is the ${formData.prospectTitle || '[Title]'} at ${formData.targetCompany || '[Company]'}.

## Context about the Prospect:
They are currently struggling with: ${formData.painPoint || '[Pain Point]'}

## Context about Our Solution:
Our value proposition is: ${formData.ourProduct || '[Product Value]'}

## Requirements for the Email:
1. Do NOT use generic openings like "I hope this email finds you well".
2. Hook the reader immediately by demonstrating deep knowledge of their role.
3. Use the PAS (Problem-Agitation-Solution) framework.
4. Keep it under 150 words.
5. End with a low-friction, soft Call To Action.

Please draft the email below.`;
      
      generating = false;
    }, 1200);
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedPrompt);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

<svelte:head>
  <title>{workflow.title} | Sandbox</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
  <div>
    <a href="/workflows" class="inline-flex items-center text-sm font-medium text-surface-500 hover:text-brand-600 mb-2 transition-colors">
      <ChevronLeft size={16} class="mr-1" /> Back to Library
    </a>
    <h1 class="text-3xl font-bold flex items-center gap-3 text-surface-900 dark:text-white">
      <div class="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
        <workflow.icon size={20} />
      </div>
      {workflow.title}
    </h1>
    <p class="text-surface-500 dark:text-surface-400 mt-2 max-w-2xl">{workflow.description}</p>
  </div>
</div>

<div class="grid lg:grid-cols-2 gap-6 h-[calc(100vh-250px)] min-h-[600px] animate-fade-in-up">
  <!-- Left Pane: Builder -->
  <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
    <div class="p-4 border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950/50">
      <h3 class="font-bold">Input Parameters</h3>
    </div>
    
    <div class="flex-1 overflow-y-auto p-6 space-y-5">
      {#each workflow.fields as field}
        <div class="space-y-2">
          <Label for={field.id}>{field.label}</Label>
          {#if field.type === 'textarea'}
            <textarea
              id={field.id}
              placeholder={field.placeholder}
              bind:value={formData[field.id]}
              class="flex min-h-[80px] w-full rounded-md border border-surface-300 bg-transparent px-3 py-2 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:border-surface-700 dark:text-surface-50 resize-y"
            ></textarea>
          {:else}
            <Input
              id={field.id}
              placeholder={field.placeholder}
              bind:value={formData[field.id]}
            />
          {/if}
        </div>
      {/each}
    </div>

    <div class="p-4 border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950/50">
      <Button onclick={handleGenerate} class="w-full shadow-sm" size="lg" disabled={generating}>
        {#if generating}
          <RefreshCw class="mr-2 h-5 w-5 animate-spin" />
          Engineering Prompt...
        {:else}
          <Play class="mr-2 h-5 w-5 fill-current" />
          Generate System Prompt
        {/if}
      </Button>
    </div>
  </div>

  <!-- Right Pane: Output -->
  <div class="bg-surface-900 dark:bg-black rounded-2xl flex flex-col overflow-hidden border border-surface-800 shadow-xl relative">
    <div class="p-4 border-b border-surface-800 bg-surface-800/50 flex justify-between items-center text-white">
      <h3 class="font-bold flex items-center gap-2">
        <Sparkles size={16} class="text-brand-400" />
        Optimized Output
      </h3>
      
      {#if generatedPrompt}
        <Button variant="ghost" size="sm" class="h-8 text-surface-300 hover:text-white" onclick={handleCopy}>
          {#if copied}
            <CheckCircle2 size={16} class="mr-1.5 text-green-400" /> Copied!
          {:else}
            <Copy size={16} class="mr-1.5" /> Copy Prompt
          {/if}
        </Button>
      {/if}
    </div>

    <div class="flex-1 p-6 overflow-y-auto text-surface-100 font-mono text-sm leading-relaxed whitespace-pre-wrap relative">
      {#if generating}
        <div class="absolute inset-0 flex flex-col items-center justify-center text-surface-500 backdrop-blur-sm bg-surface-900/50 z-10">
          <RefreshCw size={32} class="animate-spin text-brand-500 mb-4" />
          <p class="font-sans">Synthesizing optimal parameters...</p>
        </div>
      {/if}

      {#if generatedPrompt}
        {generatedPrompt}
      {:else if !generating}
        <div class="h-full flex flex-col items-center justify-center text-surface-600 font-sans text-center px-8">
          <FileText size={48} class="mb-4 opacity-50" />
          <p>Fill out the parameters on the left and hit generate to create an expert-level system prompt.</p>
        </div>
      {/if}
    </div>
    
    {#if generatedPrompt}
      <!-- Decorative execution glow -->
      <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
    {/if}
  </div>
</div>

<script lang="ts" module>
  // Import components needed for output side that aren't natively in scope
  import { Sparkles, FileText } from 'lucide-svelte';
</script>
