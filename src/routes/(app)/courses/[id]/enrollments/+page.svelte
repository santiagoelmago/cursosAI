<script lang="ts">
  import { Users, CheckCircle, XCircle, Clock } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';

  let { data } = $props();
  const course = $derived(data.course);
  const enrollments = $derived(data.enrollments);
  const progressMap = $derived(data.progressMap);

  function formatDate(iso: string) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>Enrollments — {course.title} | CursosAI</title>
</svelte:head>

<div class="mb-8">
  <a href="/courses/{course.id}" class="text-sm text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 mb-4 inline-block">
    ← {course.title}
  </a>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold mb-1">Enrollments</h1>
      <p class="text-surface-500 dark:text-surface-400 text-sm">{enrollments.length} student{enrollments.length !== 1 ? 's' : ''} enrolled</p>
    </div>
    {#if course.status === 'published'}
      <a href="/enroll/{course.slug}" target="_blank">
        <Button variant="outline" size="sm">View Enrollment Page ↗</Button>
      </a>
    {/if}
  </div>
</div>

{#if enrollments.length === 0}
  <div class="bg-white dark:bg-surface-900 border border-dashed border-surface-300 dark:border-surface-700 rounded-2xl p-12 text-center">
    <div class="w-14 h-14 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
      <Users size={24} class="text-surface-400" />
    </div>
    <h3 class="font-semibold mb-2">No enrollments yet</h3>
    <p class="text-sm text-surface-500 dark:text-surface-400">
      Share your enrollment link to get your first students.
    </p>
    {#if course.status === 'published'}
      <div class="mt-4 p-3 bg-surface-100 dark:bg-surface-800 rounded-lg text-sm font-mono text-surface-600 dark:text-surface-300">
        /enroll/{course.slug}
      </div>
    {/if}
  </div>
{:else}
  <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden">
    <table class="w-full text-sm">
      <thead class="border-b border-surface-200 dark:border-surface-800">
        <tr>
          <th class="text-left px-5 py-3 text-surface-500 font-medium">Student</th>
          <th class="text-left px-5 py-3 text-surface-500 font-medium">WhatsApp</th>
          <th class="text-left px-5 py-3 text-surface-500 font-medium">Enrolled</th>
          <th class="text-left px-5 py-3 text-surface-500 font-medium">Messages</th>
          <th class="text-left px-5 py-3 text-surface-500 font-medium">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-surface-100 dark:divide-surface-800">
        {#each enrollments as enrollment}
          {@const progress = progressMap[enrollment.id] || { total: 0, sent: 0, failed: 0 }}
          <tr class="hover:bg-surface-50 dark:hover:bg-surface-800/50">
            <td class="px-5 py-3">
              <p class="font-medium">{enrollment.student_name}</p>
              <p class="text-xs text-surface-400">{enrollment.student_email}</p>
            </td>
            <td class="px-5 py-3 text-surface-600 dark:text-surface-300 font-mono text-xs">
              {enrollment.whatsapp_number}
            </td>
            <td class="px-5 py-3 text-surface-500">
              {formatDate(enrollment.enrolled_at)}
            </td>
            <td class="px-5 py-3">
              {#if progress.total > 0}
                <div class="flex items-center gap-2">
                  <div class="w-24 h-1.5 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-brand-500 rounded-full"
                      style="width: {Math.round((progress.sent / progress.total) * 100)}%"
                    ></div>
                  </div>
                  <span class="text-xs text-surface-500">{progress.sent}/{progress.total}</span>
                </div>
              {:else}
                <span class="text-xs text-surface-400">—</span>
              {/if}
            </td>
            <td class="px-5 py-3">
              {#if enrollment.status === 'active'}
                <span class="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                  <Clock size={12} />
                  Active
                </span>
              {:else if enrollment.status === 'completed'}
                <span class="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400">
                  <CheckCircle size={12} />
                  Completed
                </span>
              {:else}
                <span class="text-xs text-surface-400">{enrollment.status}</span>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
