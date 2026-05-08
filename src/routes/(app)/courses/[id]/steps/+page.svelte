<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/ui/Button.svelte';
  import { Plus, ArrowUp, ArrowDown, Pencil, Trash2, Clock, MessageSquare } from 'lucide-svelte';

  let { data } = $props();
  const course = $derived(data.course);
  const steps = $derived(data.steps);
</script>

<svelte:head>
  <title>Messages — {course.title} | CursosAI</title>
</svelte:head>

<div class="mb-8">
  <a href="/courses/{course.id}" class="text-sm text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 mb-4 inline-block">
    ← {course.title}
  </a>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold mb-1">Course Messages</h1>
      <p class="text-surface-500 dark:text-surface-400 text-sm">
        Build your sequence — each message is sent automatically at its scheduled time.
      </p>
    </div>
    <a href="/courses/{course.id}/steps/new">
      <Button>
        <Plus size={16} class="mr-2" />
        Add Message
      </Button>
    </a>
  </div>
</div>

{#if steps.length === 0}
  <div class="bg-white dark:bg-surface-900 border border-dashed border-surface-300 dark:border-surface-700 rounded-2xl p-12 text-center">
    <div class="w-14 h-14 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
      <MessageSquare size={24} class="text-surface-400" />
    </div>
    <h3 class="font-semibold text-lg mb-2">No messages yet</h3>
    <p class="text-surface-500 dark:text-surface-400 text-sm mb-6 max-w-sm mx-auto">
      Add your first message — this is what students will receive on Day 1 (or whenever you schedule it).
    </p>
    <a href="/courses/{course.id}/steps/new">
      <Button>
        <Plus size={16} class="mr-2" />
        Add First Message
      </Button>
    </a>
  </div>
{:else}
  <div class="space-y-3 max-w-2xl">
    {#each steps as step, i}
      <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5 flex gap-4">
        <!-- Step number -->
        <div class="shrink-0 flex flex-col items-center gap-1">
          <div class="w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 text-sm font-bold">
            {i + 1}
          </div>
          {#if i < steps.length - 1}
            <div class="w-0.5 flex-1 bg-surface-200 dark:bg-surface-700 min-h-4"></div>
          {/if}
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 class="font-semibold text-sm">{step.title || `Message ${i + 1}`}</h3>
              <div class="flex items-center gap-1 text-xs text-surface-400 mt-0.5">
                <Clock size={12} />
                {step.delay_hours === 0 ? 'Immediately on enrollment' : `${step.delay_hours}h after enrollment (Day ${Math.floor(step.delay_hours / 24) + 1})`}
              </div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <!-- Reorder -->
              {#if i > 0}
                <form method="POST" action="?/reorder" use:enhance>
                  <input type="hidden" name="stepId" value={step.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button type="submit" class="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-600" title="Move up">
                    <ArrowUp size={14} />
                  </button>
                </form>
              {/if}
              {#if i < steps.length - 1}
                <form method="POST" action="?/reorder" use:enhance>
                  <input type="hidden" name="stepId" value={step.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button type="submit" class="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-600" title="Move down">
                    <ArrowDown size={14} />
                  </button>
                </form>
              {/if}
              <a href="/courses/{course.id}/steps/{step.id}" class="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-brand-600 dark:hover:text-brand-400">
                <Pencil size={14} />
              </a>
              <form method="POST" action="?/delete" use:enhance>
                <input type="hidden" name="stepId" value={step.id} />
                <button type="submit" class="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-600" title="Delete"
                  onclick={(e) => { if (!confirm('Delete this message?')) e.preventDefault(); }}>
                  <Trash2 size={14} />
                </button>
              </form>
            </div>
          </div>

          <p class="text-sm text-surface-600 dark:text-surface-300 line-clamp-3 whitespace-pre-line">{step.message_body}</p>
          {#if step.media_url}
            <p class="text-xs text-surface-400 mt-1">📎 Media attached</p>
          {/if}
        </div>
      </div>
    {/each}

    <!-- Add more -->
    <a href="/courses/{course.id}/steps/new" class="flex items-center gap-3 px-5 py-4 border border-dashed border-surface-300 dark:border-surface-700 rounded-xl hover:border-brand-400 dark:hover:border-brand-500 text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors max-w-2xl">
      <Plus size={18} />
      <span class="text-sm font-medium">Add another message</span>
    </a>
  </div>

  <!-- Publish CTA -->
  {#if course.status === 'draft'}
    <div class="mt-8 max-w-2xl p-5 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-200 dark:border-brand-800 flex items-center justify-between gap-4">
      <div>
        <p class="font-medium text-brand-900 dark:text-brand-100">{steps.length} message{steps.length !== 1 ? 's' : ''} ready</p>
        <p class="text-sm text-brand-700 dark:text-brand-300">Publish your course to start accepting enrollments.</p>
      </div>
      <a href="/courses/{course.id}/publish" class="shrink-0">
        <Button>Publish Course</Button>
      </a>
    </div>
  {/if}
{/if}
