<script lang="ts">
  import { Users, CheckCircle, Clock, MessageSquare, AlertCircle, Send } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { t } from '$lib/stores/locale';

  let { data } = $props();
  const course = $derived(data.course);
  const enrollments = $derived(data.enrollments);
  const logsMap = $derived(data.logsMap);
  const responsesMap = $derived(data.responsesMap);

  function formatDate(iso: string) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatTime(iso: string) {
    if (!iso) return '';
    return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  function progress(logs: any[]) {
    const total = logs.length;
    const sent = logs.filter((l) => l.status === 'sent').length;
    const failed = logs.filter((l) => l.status === 'failed').length;
    return { total, sent, failed };
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
      <h1 class="text-2xl font-bold mb-1">{$t('enrollments.heading')}</h1>
      <p class="text-surface-500 dark:text-surface-400 text-sm">
        {$t('enrollments.studentCount', { n: enrollments.length })}
      </p>
    </div>
    {#if course.status === 'published'}
      <a href="/enroll/{course.slug}" target="_blank">
        <Button variant="outline" size="sm">{$t('enrollments.viewPage')}</Button>
      </a>
    {/if}
  </div>
</div>

{#if enrollments.length === 0}
  <div class="bg-white dark:bg-surface-900 border border-dashed border-surface-300 dark:border-surface-700 rounded-2xl p-12 text-center">
    <div class="w-14 h-14 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
      <Users size={24} class="text-surface-400" />
    </div>
    <h3 class="font-semibold mb-2">{$t('enrollments.noEnrollments')}</h3>
    <p class="text-sm text-surface-500 dark:text-surface-400">{$t('enrollments.noEnrollmentsDesc')}</p>
    {#if course.status === 'published'}
      <div class="mt-4 p-3 bg-surface-100 dark:bg-surface-800 rounded-lg text-sm font-mono text-surface-600 dark:text-surface-300">
        /enroll/{course.slug}
      </div>
    {/if}
  </div>
{:else}
  <div class="space-y-4 max-w-3xl">
    {#each enrollments as enrollment}
      {@const logs = logsMap[enrollment.id] || []}
      {@const replies = responsesMap[enrollment.id] || []}
      {@const p = progress(logs)}

      <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden">
        <div class="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p class="font-semibold">{enrollment.student_name}</p>
            <p class="text-xs text-surface-400">{enrollment.student_email} · <span class="font-mono">{enrollment.whatsapp_number}</span></p>
          </div>
          <div class="flex items-center gap-4 shrink-0">
            <div class="text-right">
              <p class="text-xs text-surface-400">{$t('enrollments.enrolledOn')} {formatDate(enrollment.enrolled_at)}</p>
              {#if p.total > 0}
                <p class="text-xs font-medium mt-0.5">
                  <span class="text-green-600 dark:text-green-400">{p.sent} {$t('enrollments.sent')}</span>
                  {#if p.failed > 0}<span class="text-red-500 ml-1">{p.failed} {$t('enrollments.failed')}</span>{/if}
                  <span class="text-surface-400"> / {p.total} {$t('enrollments.total')}</span>
                </p>
              {/if}
            </div>
            {#if enrollment.status === 'active'}
              <span class="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                <Clock size={11} />{$t('enrollments.active')}
              </span>
            {:else if enrollment.status === 'completed'}
              <span class="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded-full">
                <CheckCircle size={11} />{$t('enrollments.done')}
              </span>
            {/if}
          </div>
        </div>

        {#if logs.length > 0}
          <div class="border-t border-surface-100 dark:border-surface-800 divide-y divide-surface-100 dark:divide-surface-800">
            {#each logs as log}
              {@const step = log.expand?.step}
              <div class="px-5 py-3 flex items-start gap-3">
                <div class="mt-0.5 shrink-0">
                  {#if log.status === 'sent'}
                    <Send size={14} class="text-green-500" />
                  {:else if log.status === 'failed'}
                    <AlertCircle size={14} class="text-red-500" />
                  {:else}
                    <Clock size={14} class="text-surface-400" />
                  {/if}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-surface-700 dark:text-surface-200 line-clamp-1">{step?.message_body || '—'}</p>
                  {#if log.status === 'failed' && log.error_message}
                    <p class="text-xs text-red-500 mt-0.5 font-mono">{log.error_message}</p>
                  {/if}
                </div>
                <div class="text-right shrink-0 text-xs text-surface-400">
                  {#if log.status === 'sent'}
                    <span class="text-green-600 dark:text-green-400 font-medium">{$t('enrollments.sent')}</span>
                    <p>{formatTime(log.sent_at)}</p>
                  {:else if log.status === 'failed'}
                    <span class="text-red-500 font-medium">{$t('enrollments.failed')}</span>
                    <p>{formatTime(log.scheduled_at)}</p>
                  {:else}
                    <span class="text-surface-400">{$t('enrollments.pending')}</span>
                    <p>{$t('enrollments.scheduledPrefix')} {formatTime(log.scheduled_at)}</p>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}

        {#if replies.length > 0}
          <div class="border-t border-surface-100 dark:border-surface-800 px-5 py-3 space-y-2 bg-surface-50 dark:bg-surface-800/40">
            <p class="text-xs font-medium text-surface-400 uppercase tracking-wide mb-2">{$t('enrollments.replies')}</p>
            {#each replies as reply}
              <div class="flex items-start gap-3">
                <MessageSquare size={13} class="text-brand-500 mt-0.5 shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-surface-700 dark:text-surface-200">{reply.message}</p>
                  <p class="text-xs text-surface-400 mt-0.5">{formatTime(reply.received_at)}</p>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/if}
