// Imports sin dependencia de Firebase — siempre seguros
import { initTheme, setTheme } from './theme.js';
import { state } from './state.js';
import { renderClientesList, renderCochesList, renderClienteDetail, renderCocheDetail, renderFacturasList, clearDetail } from './render.js';
import { openClienteModal, openCocheModal, openFacturaModal, openCitaModal, openConfirm, closeModal } from './modals.js';
import { renderAgenda } from './agenda.js';
import { el, generateFacturaNumber } from './utils.js';

initTheme();
setupStaticUI();

initApp().catch(err => console.error('[GarajeOS] Error de inicialización:', err));

// ── Navegación ────────────────────────────────────────────

function navigate(view) {
  state.viewHistory.push(view);
  renderCurrentView();
  updateViewNav();
  el('view-detail').classList.add('active');
}

function goBack() {
  state.viewHistory.pop();
  const current = state.viewHistory[state.viewHistory.length - 1];
  if (current === 'list') {
    el('view-detail').classList.remove('active');
    clearDetail();
    state.selectedClienteKey = null;
    state.selectedCocheKey = null;
    renderClientesList();
    renderCochesList();
  } else {
    state.selectedCocheKey = null;
    renderCurrentView();
    updateViewNav();
  }
}

function renderCurrentView() {
  const current = state.viewHistory[state.viewHistory.length - 1];
  if (current === 'cliente') renderClienteDetail(state.selectedClienteKey);
  else if (current === 'coche') renderCocheDetail(state.selectedClienteKey, state.selectedCocheKey);
}

function updateViewNav() {
  const current = state.viewHistory[state.viewHistory.length - 1];
  const prev = state.viewHistory[state.viewHistory.length - 2];
  const label = el('back-label');
  if (current === 'cliente') {
    label.textContent = 'Clientes';
  } else if (current === 'coche') {
    label.textContent = prev === 'cliente'
      ? (state.clientes[state.selectedClienteKey]?.nombre || 'Cliente')
      : 'Volver';
  }
}

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
    subscribeCitas, addCita, updateCita, deleteCita,
  } = fbDb;

  const { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } = fbAuth;

  let unsubClientes = null;
  let unsubCitas = null;

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
      if (unsubCitas)    { unsubCitas();    unsubCitas    = null; }
    }
  });

  function startListeners(uid) {
    state.addCliente = data => addCliente(uid, data);
    state.addCoche   = (clienteKey, data) => addCoche(uid, clienteKey, data);
    if (unsubClientes) unsubClientes();
    unsubClientes = subscribeClientes(uid, clientes => {
      state.clientes = clientes;
      renderClientesList();
      renderCochesList();
      renderFacturasList();
      const current = state.viewHistory[state.viewHistory.length - 1];
      if (current === 'cliente') renderClienteDetail(state.selectedClienteKey);
      else if (current === 'coche') renderCocheDetail(state.selectedClienteKey, state.selectedCocheKey);
    });

    if (unsubCitas) unsubCitas();
    unsubCitas = subscribeCitas(uid, citas => {
      state.citas = citas;
      if (state.activeTab === 'calendario') renderAgenda();
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
        state.viewHistory = ['list'];
        renderClientesList();
        navigate('cliente');
        break;
      }

      case 'select-coche': {
        const clienteKey = target.dataset.clienteKey;
        const cocheKey = target.dataset.key;
        state.selectedClienteKey = clienteKey;
        state.selectedCocheKey = cocheKey;
        const cur = state.viewHistory[state.viewHistory.length - 1];
        if (cur !== 'cliente') state.viewHistory = ['list'];
        renderCochesList();
        navigate('coche');
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
          goBack();
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
          goBack();
          return deleteCoche(uid, clienteKey, cocheKey);
        });
        break;
      }

      case 'add-factura': {
        const clienteKey = target.dataset.clienteKey;
        const cocheKey = target.dataset.cocheKey;
        const numero = generateFacturaNumber(state.clientes);
        openFacturaModal(null, data => addFactura(uid, clienteKey, cocheKey, data), { numero });
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

      case 'add-cita':
      case 'new-cita-day': {
        const defaultDate = target.dataset.date || null;
        openCitaModal(defaultDate ? { fechaInicio: defaultDate } : null, data => {
          data.uuid = crypto.randomUUID();
          return addCita(uid, data);
        });
        break;
      }

      case 'edit-cita': {
        const key = target.dataset.key;
        const cita = state.citas[key];
        if (!cita) break;
        openCitaModal(
          cita,
          data => {
            data.uuid = cita.uuid || crypto.randomUUID();
            return updateCita(uid, key, data);
          },
          () => openConfirm('¿Eliminar esta cita?', () => deleteCita(uid, key)),
          key
        );
        break;
      }

      case 'nueva-factura-cita': {
        const clienteKey = target.dataset.clienteKey;
        const cocheKey   = target.dataset.cocheKey;
        const citaKey    = target.dataset.citaKey;
        const cita       = citaKey ? state.citas[citaKey] : null;
        // Garantizar que la cita tiene uuid antes de vincularla a la factura
        let citaUuid = cita?.uuid;
        if (!citaUuid && citaKey && cita) {
          citaUuid = crypto.randomUUID();
          const citaActualizada = { ...cita, uuid: citaUuid };
          await updateCita(uid, citaKey, citaActualizada);
          state.citas[citaKey] = citaActualizada;
        }
        const numero = generateFacturaNumber(state.clientes);
        openFacturaModal(null, data => addFactura(uid, clienteKey, cocheKey, data), {
          numero,
          citaId: citaUuid || null,
          concepto: cita?.descripcion || '',
        });
        break;
      }

      case 'ver-factura-cita': {
        const clienteKey = target.dataset.clienteKey;
        const cocheKey   = target.dataset.cocheKey;
        const facturaKey = target.dataset.facturaKey;
        const factura    = state.clientes[clienteKey]?.coches?.[cocheKey]?.facturas?.[facturaKey];
        if (!factura) break;
        openFacturaModal(factura, data => updateFactura(uid, clienteKey, cocheKey, facturaKey, data));
        break;
      }

      case 'ver-vehiculo': {
        const clienteKey = target.dataset.clienteKey;
        const cocheKey   = target.dataset.cocheKey;
        closeModal();
        state.selectedClienteKey = clienteKey;
        state.selectedCocheKey   = cocheKey;
        const cur = state.viewHistory[state.viewHistory.length - 1];
        if (cur !== 'cliente') state.viewHistory = ['list'];
        navigate('coche');
        break;
      }

      case 'cal-prev': {
        state.calendarMonth--;
        if (state.calendarMonth < 0) { state.calendarMonth = 11; state.calendarYear--; }
        renderAgenda();
        break;
      }

      case 'cal-next': {
        state.calendarMonth++;
        if (state.calendarMonth > 11) { state.calendarMonth = 0; state.calendarYear++; }
        renderAgenda();
        break;
      }
    }
  });

  // ── Sidebar add buttons ───────────────────────────────────

  el('btn-add-cliente').addEventListener('click', () => {
    openClienteModal(null, data => addCliente(state.currentUser.uid, data));
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
        <div class="info-badges">
          <a href="https://ko-fi.com/juanjimpad" target="_blank" rel="noopener">
            <img src="https://img.shields.io/badge/Support-Ko--fi-FF5E5B?logo=ko-fi&logoColor=white" alt="Ko-fi" />
          </a>
          <a href="https://github.com/juanjimpad/GarajeOS" target="_blank" rel="noopener">
            <img src="https://img.shields.io/badge/GitHub-GarajeOS-181717?logo=github&logoColor=white" alt="GitHub" />
          </a>
          <img src="https://img.shields.io/badge/Built%20with-Claude%20AI-blueviolet?logo=anthropic" alt="Built with Claude AI" />
          <img src="https://img.shields.io/badge/License-Commercial-blue.svg" alt="License: Commercial" />
        </div>
      </div>
    `;
    el('modal-overlay').classList.remove('hidden');
  });

  // Botón volver
  el('btn-back').addEventListener('click', goBack);

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
      if (btn.dataset.tab === 'calendario') renderAgenda();
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
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).catch(() => {});
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
