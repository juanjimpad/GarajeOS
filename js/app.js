// Imports sin dependencia de Firebase — siempre seguros
import { initTheme, setTheme } from './theme.js';
import { state } from './state.js';
import { renderClientesList, renderCochesList, renderClienteDetail, renderCocheDetail, showEmptyState } from './render.js';
import { openClienteModal, openCocheModal, openFacturaModal, openConfirm, closeModal } from './modals.js';
import { el } from './utils.js';

initTheme();
setupStaticUI();

initApp().catch(err => console.error('[GarajeOS] Error de inicialización:', err));

async function initApp() {
  // Import dinámico: si firebase.js no existe o las credenciales son inválidas, lanza aquí
  const [{ auth }, fbDb, fbAuth] = await Promise.all([
    import('./firebase.js'),
    import('./db.js'),
    import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js'),
  ]);

  const {
    subscribeClientes, addCliente, updateCliente, deleteCliente,
    addCoche, updateCoche, deleteCoche,
    addFactura, updateFactura, deleteFactura,
  } = fbDb;

  const { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } = fbAuth;

  let unsubClientes = null;

  // ── Auth state ────────────────────────────────────────────

  onAuthStateChanged(auth, user => {
    if (user) {
      state.currentUser = user;
      el('auth-screen').classList.add('hidden');
      el('main-app').classList.remove('hidden');
      renderUserChip(user);
      startListeners(user.uid);
    } else {
      state.currentUser = null;
      el('auth-screen').classList.remove('hidden');
      el('main-app').classList.add('hidden');
      if (unsubClientes) { unsubClientes(); unsubClientes = null; }
    }
  });

  function startListeners(uid) {
    if (unsubClientes) unsubClientes();
    unsubClientes = subscribeClientes(uid, clientes => {
      state.clientes = clientes;
      renderClientesList();
      renderCochesList();
      if (state.selectedClienteKey) renderClienteDetail(state.selectedClienteKey);
      if (state.selectedCocheKey) renderCocheDetail(state.selectedClienteKey, state.selectedCocheKey);
    });
  }

  // ── Auth buttons ──────────────────────────────────────────

  el('btn-login').addEventListener('click', async () => {
    const email = el('login-email').value.trim();
    const pwd = el('login-password').value;
    const errEl = el('auth-error');
    try {
      errEl.classList.add('hidden');
      await signInWithEmailAndPassword(auth, email, pwd);
    } catch (e) {
      errEl.textContent = friendlyAuthError(e.code);
      errEl.classList.remove('hidden');
    }
  });

  el('btn-google').addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      const errEl = el('auth-error');
      errEl.textContent = friendlyAuthError(e.code);
      errEl.classList.remove('hidden');
    }
  });

  el('btn-logout').addEventListener('click', () => signOut(auth));

  el('login-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') el('btn-login').click();
  });

  // ── Event delegation ──────────────────────────────────────

  document.addEventListener('click', async e => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    const uid = state.currentUser?.uid;

    switch (action) {

      case 'select-cliente': {
        const key = target.dataset.key;
        state.selectedClienteKey = key;
        state.selectedCocheKey = null;
        renderClientesList();
        renderClienteDetail(key);
        break;
      }

      case 'select-coche': {
        const clienteKey = target.dataset.clienteKey;
        const cocheKey = target.dataset.key;
        state.selectedClienteKey = clienteKey;
        state.selectedCocheKey = cocheKey;
        renderClientesList();
        renderCochesList();
        renderCocheDetail(clienteKey, cocheKey);
        break;
      }

      case 'back-to-cliente': {
        const key = target.dataset.key;
        state.selectedCocheKey = null;
        renderClienteDetail(key);
        break;
      }

      case 'add-cliente':
        openClienteModal(null, data => addCliente(uid, data));
        break;

      case 'edit-cliente': {
        const key = target.dataset.key;
        openClienteModal(state.clientes[key], data => updateCliente(uid, key, data));
        break;
      }

      case 'delete-cliente': {
        const key = target.dataset.key;
        openConfirm('¿Eliminar este cliente y todos sus vehículos y facturas?', () => {
          state.selectedClienteKey = null;
          showEmptyState();
          return deleteCliente(uid, key);
        });
        break;
      }

      case 'add-coche': {
        const clienteKey = target.dataset.clienteKey;
        openCocheModal(null, data => addCoche(uid, clienteKey, data));
        break;
      }

      case 'edit-coche': {
        const clienteKey = target.dataset.clienteKey;
        const cocheKey = target.dataset.key;
        const coche = state.clientes[clienteKey]?.coches?.[cocheKey];
        openCocheModal(coche, data => updateCoche(uid, clienteKey, cocheKey, data));
        break;
      }

      case 'delete-coche': {
        const clienteKey = target.dataset.clienteKey;
        const cocheKey = target.dataset.key;
        openConfirm('¿Eliminar este vehículo y todas sus facturas?', () => {
          state.selectedCocheKey = null;
          renderClienteDetail(clienteKey);
          return deleteCoche(uid, clienteKey, cocheKey);
        });
        break;
      }

      case 'add-factura': {
        const clienteKey = target.dataset.clienteKey;
        const cocheKey = target.dataset.cocheKey;
        openFacturaModal(null, data => addFactura(uid, clienteKey, cocheKey, data));
        break;
      }

      case 'edit-factura': {
        const clienteKey = target.dataset.clienteKey;
        const cocheKey = target.dataset.cocheKey;
        const facturaKey = target.dataset.key;
        const factura = state.clientes[clienteKey]?.coches?.[cocheKey]?.facturas?.[facturaKey];
        openFacturaModal(factura, data => updateFactura(uid, clienteKey, cocheKey, facturaKey, data));
        break;
      }

      case 'delete-factura': {
        e.stopPropagation();
        const clienteKey = target.dataset.clienteKey;
        const cocheKey = target.dataset.cocheKey;
        const facturaKey = target.dataset.key;
        openConfirm('¿Eliminar esta factura?', () =>
          deleteFactura(uid, clienteKey, cocheKey, facturaKey)
        );
        break;
      }
    }
  });

  // ── Sidebar add buttons ───────────────────────────────────

  el('btn-add-cliente').addEventListener('click', () => {
    openClienteModal(null, data => addCliente(state.currentUser.uid, data));
  });

  el('btn-add-coche').addEventListener('click', () => {
    if (!state.selectedClienteKey) {
      alert('Primero selecciona un cliente para añadir un vehículo.');
      return;
    }
    openCocheModal(null, data => addCoche(state.currentUser.uid, state.selectedClienteKey, data));
  });
}

// ── UI estática (no requiere Firebase) ────────────────────

function setupStaticUI() {
  // Footer: tema
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.themeVal));
  });

  // Footer: info
  el('btn-info').addEventListener('click', () => {
    el('modal-title').textContent = 'Acerca de GarajeOS';
    el('modal-body').innerHTML = `
      <div class="info-body">
        <span class="info-logo">🔧</span>
        <h2>GarajeOS</h2>
        <p class="info-version">Versión 1.0 · 2026</p>
        <p>Gestión integral de taller mecánico.<br>Clientes, vehículos y facturas en un solo lugar, sincronizados en la nube.</p>
        <div class="info-links">
          <a class="info-link kofi" href="https://ko-fi.com/juanjimpad" target="_blank" rel="noopener">
            ☕ Invítame a un café en Ko-fi
          </a>
          <a class="info-link" href="https://github.com/juanjimpad/GarajeOS" target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>
            Ver en GitHub
          </a>
        </div>
        <p class="info-credit">Desarrollado con la asistencia de <a href="https://claude.ai" target="_blank" rel="noopener">Claude</a> (Anthropic)</p>
      </div>
    `;
    el('modal-overlay').classList.remove('hidden');
  });

  // Modal: cerrar
  el('modal-close').addEventListener('click', closeModal);
  el('modal-overlay').addEventListener('click', e => {
    if (e.target === el('modal-overlay')) closeModal();
  });

  // Tabs
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.sidebar-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      state.activeTab = btn.dataset.tab;
      el(`panel-${btn.dataset.tab}`).classList.add('active');
    });
  });

  // Search
  el('search-clientes').addEventListener('input', e => {
    state.searchClientes = e.target.value;
    renderClientesList();
  });
  el('search-coches').addEventListener('input', e => {
    state.searchCoches = e.target.value;
    renderCochesList();
  });

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

// ── Helpers ───────────────────────────────────────────────

function renderUserChip(user) {
  const avatarEl = el('user-avatar');
  const nameEl = el('user-name');
  if (user.photoURL) {
    avatarEl.innerHTML = `<img src="${user.photoURL}" alt="" referrerpolicy="no-referrer" />`;
  } else {
    avatarEl.textContent = (user.displayName || user.email || '?')[0].toUpperCase();
  }
  nameEl.textContent = user.displayName || user.email || '';
}

function friendlyAuthError(code) {
  const map = {
    'auth/invalid-email': 'El correo no es válido.',
    'auth/user-not-found': 'No existe cuenta con ese correo.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/too-many-requests': 'Demasiados intentos. Inténtalo más tarde.',
    'auth/network-request-failed': 'Error de red. Comprueba tu conexión.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  };
  return map[code] || 'Error al iniciar sesión.';
}
