import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

function getInitial(): Theme {
  if (!browser) return 'dark';
  const stored = localStorage.getItem('theme') as Theme | null;
  return stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function apply(value: Theme) {
  document.documentElement.classList.toggle('dark', value === 'dark');
  localStorage.setItem('theme', value);
}

const store = writable<Theme>(getInitial());

export const theme = {
  subscribe: store.subscribe,
  toggle() {
    store.update((v) => {
      const next: Theme = v === 'dark' ? 'light' : 'dark';
      if (browser) apply(next);
      return next;
    });
  },
  init() {
    if (browser) {
      const value = getInitial();
      apply(value);
      store.set(value);
    }
  },
};
