const STORAGE_KEY = 'garajeos_theme';

let currentTheme = localStorage.getItem(STORAGE_KEY) || 'auto';

function resolvedTheme(theme) {
  if (theme !== 'auto') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', resolvedTheme(theme));
  updateFooterButtons(theme);
}

function updateFooterButtons(theme) {
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeVal === theme);
  });
}

export function initTheme() {
  applyTheme(currentTheme);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme === 'auto') applyTheme('auto');
  });
}

export function setTheme(theme) {
  currentTheme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
}
