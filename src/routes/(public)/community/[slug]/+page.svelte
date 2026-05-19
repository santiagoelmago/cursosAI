<script lang="ts">
  import { enhance } from '$app/forms';
  import { t, locale } from '$lib/stores/locale';
  import { get } from 'svelte/store';

  let { data, form } = $props();
  const course = $derived(data.course);

  let submitting = $state(false);

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    const loc = get(locale);
    const tr = (key: string, n: number) =>
      get(t)(key, { n }).replace('{n}', String(n));
    if (days > 0) return tr('community.timeDays', days);
    if (hours > 0) return tr('community.timeHours', hours);
    if (mins > 0) return tr('community.timeMinutes', mins);
    return get(t)('community.timeJustNow');
  }

  function initials(name: string) {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  }

  const colors = [
    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  ];

  function avatarColor(name: string) {
    let hash = 0;
    for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
    return colors[Math.abs(hash) % colors.length];
  }
</script>

<svelte:head>
  <title>{course.title} — {$t('community.label')}</title>
</svelte:head>

<div class="min-h-screen bg-surface-50 dark:bg-surface-950">
  <header class="border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
    <div class="max-w-2xl mx-auto px-4 py-5">
      <p class="text-xs font-medium text-brand-600 dark:text-brand-400 uppercase tracking-wide mb-1">{$t('community.label')}</p>
      <h1 class="text-xl font-bold">{course.title}</h1>
    </div>
  </header>

  <main class="max-w-2xl mx-auto px-4 py-8">

    {#if data.gated}
      <div class="max-w-sm mx-auto mt-8">
        <div class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-8 text-center">
          <div class="w-14 h-14 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-4 text-2xl">
            💬
          </div>
          <h2 class="font-semibold text-lg mb-1">{$t('community.studentsOnly')}</h2>
          <p class="text-sm text-surface-500 dark:text-surface-400 mb-6">{$t('community.enterPrompt')}</p>

          <form method="POST" action="?/verify" use:enhance={() => {
            submitting = true;
            return ({ update }) => { submitting = false; update(); };
          }} class="space-y-4 text-left">
            <div>
              <label for="whatsapp_number" class="block text-sm font-medium mb-1.5">{$t('community.whatsappLabel')}</label>
              <input
                id="whatsapp_number"
                name="whatsapp_number"
                type="tel"
                placeholder={$t('community.whatsappPlaceholder')}
                required
                class="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            {#if form?.error}
              <p class="text-sm text-red-600 dark:text-red-400">{form.error}</p>
            {/if}

            <button
              type="submit"
              disabled={submitting}
              class="w-full rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-2 text-sm transition-colors"
            >
              {submitting ? $t('community.checking') : $t('community.enter')}
            </button>
          </form>
        </div>
      </div>

    {:else}
      <div class="flex items-center justify-between mb-6">
        <p class="text-sm text-surface-500 dark:text-surface-400">
          {$t('community.welcomeBack')} <span class="font-medium text-surface-700 dark:text-surface-200">{data.student_name}</span>
        </p>
        <p class="text-xs text-surface-400">{data.posts.length} {$t('community.label').toLowerCase()}</p>
      </div>

      {#if data.posts.length === 0}
        <div class="text-center py-20">
          <div class="w-14 h-14 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4 text-2xl">
            💬
          </div>
          <h2 class="font-semibold mb-1">{$t('community.noReplies')}</h2>
          <p class="text-sm text-surface-500">{$t('community.noRepliesDesc')}</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each data.posts as post (post.id)}
            <article class="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5">
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 {avatarColor(post.student_name)}">
                  {initials(post.student_name)}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-medium text-sm">{post.student_name}</span>
                    {#if post.step_title}
                      <span class="text-xs px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400">
                        {post.step_title}
                      </span>
                    {/if}
                    <span class="text-xs text-surface-400 ml-auto">{timeAgo(post.received_at)}</span>
                  </div>
                  {#if post.message}
                    <p class="mt-2 text-sm text-surface-700 dark:text-surface-300 whitespace-pre-wrap leading-relaxed">{post.message}</p>
                  {/if}
                  {#if post.media}
                    <div class="mt-3">
                      <img
                        src={post.media}
                        alt="Student response"
                        class="rounded-xl max-w-sm w-full object-cover border border-surface-200 dark:border-surface-700"
                        loading="lazy"
                      />
                    </div>
                  {/if}
                </div>
              </div>
            </article>
          {/each}
        </div>
      {/if}
    {/if}

  </main>
</div>
