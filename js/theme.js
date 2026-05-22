const STORAGE_KEY = 'garajeos_theme';
const THEMES = ['light', 'dark', 'auto'];

let currentTheme = localStorage.getItem(STORAGE_KEY) || 'auto';

function applyTheme(theme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolved = theme === 'auto' ? (prefersDark ? 'dark' : 'light') : theme;
  document.documentElement.setAttribute('data-theme', resolved);
  updateIcon(resolved);
}

function updateIcon(resolved) {
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = resolved === 'dark' ? '☀️' : '🌙';
}

export function initTheme() {
  applyTheme(currentTheme);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme === 'auto') applyTheme('auto');
  });
}

export function cycleTheme() {
  const idx = THEMES.indexOf(currentTheme);
  currentTheme = THEMES[(idx + 1) % THEMES.length];
  localStorage.setItem(STORAGE_KEY, currentTheme);
  applyTheme(currentTheme);
}
