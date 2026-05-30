const STORAGE_KEY = 'garajeos_theme';

let currentTheme = localStorage.getItem(STORAGE_KEY) || 'auto';

function resolvedTheme(theme) {
  if (theme !== 'auto') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

async function applyNativeStatusBar(resolved) {
  if (!window.Capacitor?.isNativePlatform()) return;
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setOverlaysWebView({ overlay: false });
    if (resolved === 'dark') {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#1c1c1e' });
    } else {
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
    }
  } catch (_) {}
}

function applyTheme(theme) {
  const resolved = resolvedTheme(theme);
  document.documentElement.setAttribute('data-theme', resolved);
  updateFooterButtons(theme);
  applyNativeStatusBar(resolved);
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
