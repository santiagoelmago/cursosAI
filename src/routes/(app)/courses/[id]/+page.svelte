<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import { Loader2, BookOpen, Users, ArrowRight, Trash2 } from 'lucide-svelte';

  let { data, form } = $props();
  const course = $derived(data.course);

  let submitting = $state(false);
  let deleting = $state(false);
  let confirmDelete = $state(false);
</script>

<svelte:head>
  <title>{course.title} | CursosAI</title>
</svelte:head>

<div class="mb-6">
  <a href="/courses" class="text-sm text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 mb-4 inline-block">
    ← Back to courses
  </a>
  <div class="flex items-center justify-between">
    <div>
      <div class="flex items-center gap-3 mb-1">
        <h1 class="text-3xl font-bold">{course.title}</h1>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {course.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'}">
          {course.status === 'published' ? 'Published' : 'Draft'}
        </span>
      </div>
      <p class="text-surface-500 dark:text-surface-400 text-sm">Manage your course settings and messages.</p>
    </div>
  </div>
</div>

<!-- Quick nav -->
<div class="flex gap-3 mb-8">
  <a href="/courses/{course.id}/steps">
    <Button variant="secondary">
      <BookOpen size={16} class="mr-2" />
      Messages / Steps
    </Button>
  </a>
  <a href="/courses/{course.id}/enrollments">
    <Button variant="secondary">
      <Users size={16} class="mr-2" />
      Enrollments
    </Button>
  </a>
  {#if course.status === 'draft'}
    <a href="/courses/{course.id}/publish">
      <Button>
        Publish Course
        <ArrowRight size={16} class="ml-2" />
      </Button>
    </a>
  {:else}
    <a href="/enroll/{course.slug}" target="_blank">
      <Button variant="outline">
        View Enrollment Page ↗
      </Button>
    </a>
  {/if}
</div>

{#if form?.success}
  <div class="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm">
    Course updated successfully.
  </div>
{/if}
{#if form?.error}
  <div class="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
    {form.error}
  </div>
{/if}

<div class="max-w-xl">
  <form method="POST" action="?/update" use:enhance={() => {
    submitting = true;
    return ({ update }) => { submitting = false; update(); };
  }} class="space-y-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 mb-6">
    <h2 class="font-semibold text-lg">Course Details</h2>

    <div class="space-y-2">
      <Label for="title">Title</Label>
      <Input id="title" name="title" value={course.title} required />
    </div>

    <div class="space-y-2">
      <Label for="slug">URL Slug</Label>
      <Input id="slug" name="slug" value={course.slug} />
    </div>

    <div class="space-y-2">
      <Label for="description">Description</Label>
      <textarea
        id="description"
        name="description"
        rows="3"
        class="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
      >{course.description || ''}</textarea>
    </div>

    <div class="space-y-2">
      <Label for="price">Price (USD)</Label>
      <div class="relative">
        <span class="absolute inset-y-0 left-3 flex items-center text-surface-400 text-sm">$</span>
        <Input id="price" name="price" type="number" min="0" step="0.01" value={course.price_cents ? (course.price_cents / 100).toFixed(2) : ''} placeholder="0.00" class="pl-7" />
      </div>
    </div>

    <Button type="submit" disabled={submitting}>
      {#if submitting}
        <Loader2 size={16} class="mr-2 animate-spin" />
        Saving...
      {:else}
        Save Changes
      {/if}
    </Button>
  </form>

  <!-- Danger zone -->
  <div class="border border-red-200 dark:border-red-900/50 rounded-2xl p-6">
    <h2 class="font-semibold text-red-700 dark:text-red-400 mb-2">Danger Zone</h2>
    {#if !confirmDelete}
      <p class="text-sm text-surface-500 mb-3">Deleting a course cannot be undone.</p>
      <Button variant="outline" class="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20" onclick={() => confirmDelete = true}>
        <Trash2 size={16} class="mr-2" />
        Delete Course
      </Button>
    {:else}
      <p class="text-sm text-red-600 dark:text-red-400 mb-3 font-medium">Are you sure? This will permanently delete the course and all its steps.</p>
      <form method="POST" action="?/delete" use:enhance={() => {
        deleting = true;
        return ({ update }) => { deleting = false; update(); };
      }}>
        <div class="flex gap-2">
          <Button type="submit" class="bg-red-600 hover:bg-red-700 text-white" disabled={deleting}>
            {#if deleting}
              <Loader2 size={16} class="mr-2 animate-spin" />
            {/if}
            Yes, delete it
          </Button>
          <Button variant="ghost" onclick={() => confirmDelete = false}>Cancel</Button>
        </div>
      </form>
    {/if}
  </div>
</div>
