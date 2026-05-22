import { initTheme, cycleTheme } from './theme.js';
import { state } from './state.js';
import { subscribeClientes, addCliente, updateCliente, deleteCliente, addCoche, updateCoche, deleteCoche, addFactura, updateFactura, deleteFactura } from './db.js';
import { renderClientesList, renderCochesList, renderClienteDetail, renderCocheDetail, showEmptyState } from './render.js';
import { openClienteModal, openCocheModal, openFacturaModal, openConfirm, closeModal } from './modals.js';
import { el } from './utils.js';
import { auth } from './firebase.js';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

let unsubClientes = null;

initTheme();

// ── Auth ──────────────────────────────────────────────────

onAuthStateChanged(auth, user => {
  if (user) {
    state.currentUser = user;
    el('auth-screen').classList.add('hidden');
    el('main-app').classList.remove('hidden');
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

// ── Topbar ────────────────────────────────────────────────

el('btn-theme').addEventListener('click', cycleTheme);

// ── Tabs ──────────────────────────────────────────────────

document.querySelectorAll('.nav-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sidebar-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    state.activeTab = btn.dataset.tab;
    el(`panel-${btn.dataset.tab}`).classList.add('active');
  });
});

// ── Search ────────────────────────────────────────────────

el('search-clientes').addEventListener('input', e => {
  state.searchClientes = e.target.value;
  renderClientesList();
});

el('search-coches').addEventListener('input', e => {
  state.searchCoches = e.target.value;
  renderCochesList();
});

// ── Modals: close ─────────────────────────────────────────

el('modal-close').addEventListener('click', closeModal);
el('modal-overlay').addEventListener('click', e => {
  if (e.target === el('modal-overlay')) closeModal();
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

    // ── Clientes CRUD ──

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

    // ── Coches CRUD ──

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

    // ── Facturas CRUD ──

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

// ── Add buttons (sidebar) ─────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────

function friendlyAuthError(code) {
  const map = {
    'auth/invalid-email': 'El correo no es válido.',
    'auth/user-not-found': 'No existe cuenta con ese correo.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/too-many-requests': 'Demasiados intentos. Inténtalo más tarde.',
    'auth/network-request-failed': 'Error de red. Comprueba tu conexión.',
  };
  return map[code] || 'Error al iniciar sesión.';
}

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
