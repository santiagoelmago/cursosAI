<script lang="ts">
  import { BookOpen, Plus, Users, ArrowRight, MessageSquare } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';

  let { data } = $props();
  const courses = $derived(data.courses);
  const user = $derived(data.user);
  const totalCourses = $derived(courses.length);
  const publishedCourses = $derived(courses.filter((c: any) => c.status === 'published').length);
</script>

<svelte:head>
  <title>Dashboard | CursosAI</title>
</svelte:head>

<div class="mb-8 flex items-center justify-between">
  <div>
    <h1 class="text-3xl font-bold mb-1">Welcome, {user?.name?.split(' ')[0] || 'Creator'}</h1>
    <p class="text-surface-500 dark:text-surface-400">Manage your WhatsApp courses and track your students.</p>
  </div>
  <a href="/courses/new">
    <Button>
      <Plus size={16} class="mr-2" />
      New Course
    </Button>
  </a>
</div>

<!-- Stats -->
<div class="grid sm:grid-cols-3 gap-4 mb-8">
  <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
    <div class="flex items-center gap-3 mb-2">
      <div class="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
        <BookOpen size={18} />
      </div>
      <span class="text-sm text-surface-500">Total Courses</span>
    </div>
    <p class="text-3xl font-bold">{totalCourses}</p>
  </div>

  <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
    <div class="flex items-center gap-3 mb-2">
      <div class="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
        <MessageSquare size={18} />
      </div>
      <span class="text-sm text-surface-500">Published</span>
    </div>
    <p class="text-3xl font-bold">{publishedCourses}</p>
  </div>

  <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
    <div class="flex items-center gap-3 mb-2">
      <div class="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
        <Users size={18} />
      </div>
      <span class="text-sm text-surface-500">Students</span>
    </div>
    <p class="text-3xl font-bold">—</p>
  </div>
</div>

<!-- Courses -->
<div>
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-xl font-bold">Your Courses</h2>
    <a href="/courses" class="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">View all</a>
  </div>

  {#if courses.length === 0}
    <div class="bg-white dark:bg-surface-900 border border-dashed border-surface-300 dark:border-surface-700 rounded-2xl p-12 text-center">
      <div class="w-14 h-14 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
        <MessageSquare size={24} class="text-surface-400" />
      </div>
      <h3 class="font-semibold text-lg mb-2">No courses yet</h3>
      <p class="text-surface-500 dark:text-surface-400 text-sm mb-6 max-w-sm mx-auto">
        Create your first WhatsApp course — a 21-day challenge, a coaching program, anything you'd deliver day by day.
      </p>
      <a href="/courses/new">
        <Button>
          <Plus size={16} class="mr-2" />
          Create First Course
        </Button>
      </a>
    </div>
  {:else}
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each courses as course}
        <a href="/courses/{course.id}" class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5 hover:border-brand-500 dark:hover:border-brand-500 transition-colors group block">
          <div class="flex items-start justify-between mb-3">
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {course.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'}">
              {course.status === 'published' ? 'Published' : 'Draft'}
            </span>
            <ArrowRight size={16} class="text-surface-400 group-hover:text-brand-500 transition-colors" />
          </div>
          <h3 class="font-semibold mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{course.title}</h3>
          <p class="text-sm text-surface-500 dark:text-surface-400 line-clamp-2">{course.description || 'No description'}</p>
          {#if course.price_cents}
            <p class="text-sm font-semibold mt-3 text-brand-600 dark:text-brand-400">
              ${(course.price_cents / 100).toFixed(2)}
            </p>
          {/if}
        </a>
      {/each}

      <!-- Create new card -->
      <a href="/courses/new" class="bg-white dark:bg-surface-900 border border-dashed border-surface-300 dark:border-surface-700 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:border-brand-400 dark:hover:border-brand-500 transition-colors group">
        <div class="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-3 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 transition-colors">
          <Plus size={20} class="text-surface-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
        </div>
        <p class="text-sm font-medium text-surface-500 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">New Course</p>
      </a>
    </div>
  {/if}
</div>
