<script lang="ts">
  import { BookOpen, Plus, ArrowRight, MessageSquare } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { t } from '$lib/stores/locale';

  let { data } = $props();
  const courses = $derived(data.courses);
</script>

<svelte:head>
  <title>My Courses | CursosAI</title>
</svelte:head>

<div class="mb-8 flex items-center justify-between">
  <div>
    <h1 class="text-3xl font-bold mb-1">{$t('courses.heading')}</h1>
    <p class="text-surface-500 dark:text-surface-400">{$t('courses.subheading')}</p>
  </div>
  <a href="/courses/new">
    <Button>
      <Plus size={16} class="mr-2" />
      {$t('courses.newCourse')}
    </Button>
  </a>
</div>

{#if courses.length === 0}
  <div class="bg-white dark:bg-surface-900 border border-dashed border-surface-300 dark:border-surface-700 rounded-2xl p-16 text-center">
    <div class="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
      <MessageSquare size={28} class="text-surface-400" />
    </div>
    <h3 class="font-semibold text-xl mb-2">{$t('courses.createFirst')}</h3>
    <p class="text-surface-500 dark:text-surface-400 text-sm mb-6 max-w-md mx-auto">
      {$t('courses.createFirstDesc')}
    </p>
    <a href="/courses/new">
      <Button size="lg">
        <Plus size={18} class="mr-2" />
        {$t('courses.createCourse')}
      </Button>
    </a>
  </div>
{:else}
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each courses as course}
      <a href="/courses/{course.id}" class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5 hover:border-brand-500 dark:hover:border-brand-500 transition-colors group block">
        <div class="flex items-start justify-between mb-3">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {course.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'}">
            {course.status === 'published' ? $t('courses.published') : $t('courses.draft')}
          </span>
          <ArrowRight size={16} class="text-surface-400 group-hover:text-brand-500 transition-colors" />
        </div>
        <div class="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-3">
          <BookOpen size={20} />
        </div>
        <h3 class="font-semibold mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{course.title}</h3>
        <p class="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 mb-3">{course.description || $t('courses.noDescription')}</p>
        {#if course.price_cents}
          <p class="text-sm font-semibold text-brand-600 dark:text-brand-400">${(course.price_cents / 100).toFixed(2)}</p>
        {/if}
      </a>
    {/each}

    <a href="/courses/new" class="bg-white dark:bg-surface-900 border border-dashed border-surface-300 dark:border-surface-700 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:border-brand-400 dark:hover:border-brand-500 transition-colors group min-h-[160px]">
      <div class="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-3 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 transition-colors">
        <Plus size={20} class="text-surface-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
      </div>
      <p class="text-sm font-medium text-surface-500 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{$t('courses.newCourse')}</p>
    </a>
  </div>
{/if}
