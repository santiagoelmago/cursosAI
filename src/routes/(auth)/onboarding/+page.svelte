<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import { Briefcase, Activity, Code, Megaphone, ArrowRight, CheckCircle2 } from 'lucide-svelte';
  import { t } from '$lib/stores/locale';

  let step = $state(1);
  let selectedRole = $state('');

  const roles = $derived([
    { id: 'hr',          title: $t('onboarding.hrTitle'),    description: $t('onboarding.hrDesc'),    icon: Briefcase },
    { id: 'sales',       title: $t('onboarding.salesTitle'), description: $t('onboarding.salesDesc'), icon: Megaphone },
    { id: 'ops',         title: $t('onboarding.opsTitle'),   description: $t('onboarding.opsDesc'),   icon: Activity  },
    { id: 'engineering', title: $t('onboarding.engTitle'),   description: $t('onboarding.engDesc'),   icon: Code      },
  ]);

  function nextStep() {
    if (step < 2) step++;
    else window.location.href = '/dashboard';
  }
</script>

<svelte:head>
  <title>Welcome | CursosAI Onboarding</title>
</svelte:head>

<div class="mb-8 text-center animate-fade-in-up">
  <div class="flex items-center justify-center gap-2 text-surface-400 mb-6 font-medium text-sm">
    <span class={step >= 1 ? 'text-brand-500' : ''}>{$t('onboarding.step1')}</span>
    <div class="w-8 h-[2px] bg-surface-200 dark:bg-surface-800">
      <div class="h-full bg-brand-500 transition-all" style="width: {step === 2 ? '100%' : '0%'}"></div>
    </div>
    <span class={step >= 2 ? 'text-brand-500' : ''}>{$t('onboarding.step2')}</span>
  </div>

  <h1 class="text-3xl font-bold mb-2">
    {step === 1 ? $t('onboarding.h1a') : $t('onboarding.h1b')}
  </h1>
  <p class="text-surface-500 dark:text-surface-400 max-w-sm mx-auto">
    {step === 1 ? $t('onboarding.desc1') : $t('onboarding.desc2')}
  </p>
</div>

{#if step === 1}
  <div class="space-y-4 animate-fade-in-up" style="animation-delay: 0.1s">
    <div class="grid grid-cols-1 gap-3">
      {#each roles as role}
        {@const Icon = role.icon}
        <button
          class="flex items-start text-left p-4 rounded-xl border-2 transition-all {selectedRole === role.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700 bg-surface-50 dark:bg-surface-900/50'}"
          onclick={() => selectedRole = role.id}
        >
          <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 {selectedRole === role.id ? 'bg-brand-500 text-white' : 'bg-surface-200 dark:bg-surface-800 text-surface-500'}">
            <Icon size={20} />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-surface-900 dark:text-surface-50">{role.title}</h3>
            <p class="text-sm text-surface-500 dark:text-surface-400 mt-1">{role.description}</p>
          </div>
          <div class="py-2">
            {#if selectedRole === role.id}
              <CheckCircle2 size={20} class="text-brand-500" />
            {/if}
          </div>
        </button>
      {/each}
    </div>

    <Button size="lg" class="w-full mt-6" disabled={!selectedRole} onclick={nextStep}>
      {$t('onboarding.continue')}
      <ArrowRight class="ml-2 h-4 w-4" />
    </Button>
  </div>
{:else}
  <div class="animate-fade-in-up text-center space-y-6" style="animation-delay: 0.1s">
    <div class="w-24 h-24 mx-auto bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center relative">
      <div class="absolute inset-0 border-4 border-t-brand-500 border-brand-500/30 rounded-full animate-spin"></div>
      <Briefcase size={32} class="text-brand-500" />
    </div>

    <div>
      <h3 class="text-xl font-medium mb-2">{$t('onboarding.analyzingH')}</h3>
      <p class="text-surface-500 dark:text-surface-400 text-sm max-w-xs mx-auto">
        {$t('onboarding.analyzingP')}
      </p>
    </div>

    <div class="pt-4">
      <Button onclick={nextStep} class="w-full" size="lg">
        {$t('onboarding.goDashboard')}
      </Button>
    </div>
  </div>
{/if}
