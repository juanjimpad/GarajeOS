// Imports sin dependencia de Firebase — siempre seguros
import { initTheme, setTheme } from './theme.js';
import { state } from './state.js';
import { renderClientesList, renderCochesList, renderClienteDetail, renderCocheDetail, renderFacturasList, clearDetail } from './render.js';
import { openClienteModal, openCocheModal, openFacturaModal, openCitaModal, openConfirm, closeModal } from './modals.js';
import { renderAgenda } from './agenda.js';
import { el, generateFacturaNumber } from './utils.js';
import { t } from './i18n.js';
import { APP_VERSION } from './config.js';
import { generateICS } from './ics.js';

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
    getOrCreateCalendarSecret, resetCalendarSecret, updateCalendarExport,
  } = fbDb;

  const { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } = fbAuth;

  let unsubClientes = null;
  let unsubCitas = null;
  let calendarSecret = null;

  async function autoCloseCita(uid, data) {
    if (!data.citaId) return;
    const entry = Object.entries(state.citas || {}).find(([, c]) => c.uuid === data.citaId);
    if (!entry) return;
    const [citaKey, cita] = entry;
    let nuevoCitaEstado, fechaFin;
    if (data.estado === 'Pagada') {
      nuevoCitaEstado = 'Completada';
      fechaFin = data.fechaCierre || data.fecha || null;
    } else if (data.estado === 'Cancelada') {
      nuevoCitaEstado = 'Cancelada';
      fechaFin = cita.fechaFin || null;
    } else {
      nuevoCitaEstado = 'En curso';
      fechaFin = null;
    }
    if (cita.estado === nuevoCitaEstado) return;
    await updateCita(uid, citaKey, { ...cita, estado: nuevoCitaEstado, fechaFin });
  }

  async function syncCalendar(uid) {
    if (!calendarSecret) calendarSecret = await getOrCreateCalendarSecret(uid);
    const ics = generateICS(state.citas, state.clientes);
    await updateCalendarExport(calendarSecret, ics);
    state.calendarSecret = calendarSecret;
  }

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
    state.addCliente    = data => addCliente(uid, data);
    state.addCoche      = (clienteKey, data) => addCoche(uid, clienteKey, data);
    state.updateCoche   = (clienteKey, cocheKey, data) => updateCoche(uid, clienteKey, cocheKey, data);
    if (unsubClientes) unsubClientes();
    unsubClientes = subscribeClientes(uid, clientes => {
      state.clientes = clientes;
      renderClientesList();
      renderCochesList();
      renderFacturasList();
      const current = state.viewHistory[state.viewHistory.length - 1];
      if (current === 'cliente') renderClienteDetail(state.selectedClienteKey);
      else if (current === 'coche') renderCocheDetail(state.selectedClienteKey, state.selectedCocheKey);
      if (state.activeTab === 'calendario') renderAgenda();
      syncCalendar(uid).catch(() => {});
    });

    if (unsubCitas) unsubCitas();
    unsubCitas = subscribeCitas(uid, citas => {
      state.citas = citas;
      if (state.activeTab === 'calendario') renderAgenda();
      syncCalendar(uid).catch(() => {});
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
        openFacturaModal(null, data => addFactura(uid, clienteKey, cocheKey, data), { numero, clienteKey, cocheKey });
        break;
      }

      case 'edit-factura': {
        const clienteKey = target.dataset.clienteKey;
        const cocheKey = target.dataset.cocheKey;
        const facturaKey = target.dataset.key;
        const factura = state.clientes[clienteKey]?.coches?.[cocheKey]?.facturas?.[facturaKey];
        openFacturaModal(factura, async data => {
          await updateFactura(uid, clienteKey, cocheKey, facturaKey, data);
          await autoCloseCita(uid, data);
        }, { clienteKey, cocheKey });
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
        openFacturaModal(null, async data => {
          await addFactura(uid, clienteKey, cocheKey, data);
          await autoCloseCita(uid, data);
        }, {
          numero,
          citaId: citaUuid || null,
          concepto: cita?.descripcion || '',
          clienteKey,
          cocheKey,
        });
        break;
      }

      case 'ver-factura-cita': {
        const clienteKey = target.dataset.clienteKey;
        const cocheKey   = target.dataset.cocheKey;
        const facturaKey = target.dataset.facturaKey;
        const factura    = state.clientes[clienteKey]?.coches?.[cocheKey]?.facturas?.[facturaKey];
        if (!factura) break;
        openFacturaModal(factura, async data => {
          await updateFactura(uid, clienteKey, cocheKey, facturaKey, data);
          await autoCloseCita(uid, data);
        }, { clienteKey, cocheKey });
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

      case 'open-cal-subscription': {
        const secret = calendarSecret;
        const httpsUrl  = secret ? `${location.origin}/calendar/${secret}` : null;
        const webcalUrl = secret ? `webcal://${location.host}/calendar/${secret}` : null;
        const googleUrl = secret ? `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}` : null;
        el('modal-title').textContent = 'Suscribir calendario';
        el('modal-body').innerHTML = `
          <div class="cal-sub-modal">
            <p class="cal-sub-desc">Añade las citas del taller a tu aplicación de calendario favorita. Se actualizará automáticamente.</p>
            <div class="cal-sub-options">
              <a class="cal-sub-option ${!googleUrl ? 'disabled' : ''}" ${googleUrl ? `href="${googleUrl}" target="_blank" rel="noopener"` : ''}>
                <svg width="22" height="22" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.5 12.06c0-.66-.06-1.3-.17-1.91H12v3.61h5.33a4.56 4.56 0 0 1-1.98 3v2.48h3.2c1.87-1.72 2.95-4.26 2.95-7.18z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.89 6.61-2.42l-3.2-2.48c-.9.6-2.04.95-3.41.95-2.62 0-4.84-1.77-5.63-4.15H3.06v2.56A9.99 9.99 0 0 0 12 22z"/><path fill="#FBBC05" d="M6.37 13.9A6.01 6.01 0 0 1 6.06 12c0-.66.11-1.3.31-1.9V7.54H3.06A9.99 9.99 0 0 0 2 12c0 1.61.39 3.13 1.06 4.46l3.31-2.56z"/><path fill="#EA4335" d="M12 5.9c1.48 0 2.8.51 3.84 1.5l2.87-2.87C16.95 2.99 14.7 2 12 2A9.99 9.99 0 0 0 3.06 7.54l3.31 2.56C7.16 7.67 9.38 5.9 12 5.9z"/></svg>
                <span>Google Calendar</span>
              </a>
              <a class="cal-sub-option ${!webcalUrl ? 'disabled' : ''}" ${webcalUrl ? `href="${webcalUrl}"` : ''}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#fff"/><rect x="2" y="2" width="20" height="20" rx="4" fill="#FF3B30"/><rect x="2" y="7" width="20" height="13" rx="0" fill="#fff"/><rect x="2" y="7" width="20" height="3" fill="#FF3B30"/><text x="12" y="19" text-anchor="middle" font-size="7" font-weight="bold" fill="#1C1C1E" font-family="sans-serif">CAL</text></svg>
                <span>Apple Calendar</span>
              </a>
              <a class="cal-sub-option ${!httpsUrl ? 'disabled' : ''}" ${httpsUrl ? `href="https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(httpsUrl)}" target="_blank" rel="noopener"` : ''}>
                <svg width="22" height="22" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#0078D4"/><path fill="#fff" d="M4 6h7v5H4zm9 0h7v5h-7zM4 13h7v5H4zm9 0h7v5h-7z"/></svg>
                <span>Outlook</span>
              </a>
            </div>
            <div class="cal-sub-copy-row">
              <input class="cal-sub-copy-input" type="text" readonly value="${httpsUrl || 'Cargando…'}" />
              <button class="btn btn-sm" id="btn-copy-cal-url">Copiar enlace</button>
            </div>
            <button class="cal-sub-reset" data-action="reset-cal-secret">↺ Regenerar enlace privado</button>
          </div>
        `;
        el('modal-overlay').classList.remove('hidden');
        document.getElementById('btn-copy-cal-url')?.addEventListener('click', function() {
          navigator.clipboard.writeText(httpsUrl).then(() => {
            this.textContent = '✓ Copiado';
            setTimeout(() => this.textContent = 'Copiar enlace', 2000);
          });
        });
        break;
      }

      case 'reset-cal-secret': {
        if (!confirm('¿Regenerar el enlace? El enlace anterior dejará de funcionar.')) break;
        calendarSecret = await resetCalendarSecret(uid);
        state.calendarSecret = calendarSecret;
        await syncCalendar(uid);
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
  // Banner de entorno de desarrollo
  (function() {
    const host = location.hostname;
    if (!host.includes('.pages.dev') && !host.includes('workers.dev') && host !== 'localhost' && host !== '127.0.0.1') return;
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    const branch = host.split('.')[0];
    const label = isLocal ? t('banner.dev.local') : (branch && branch !== 'garajeos') ? `${t('banner.dev.rama')}: ${branch}` : t('banner.dev.preview');
    const ver = APP_VERSION.includes('BUILD_') ? '' : ` · ${APP_VERSION}`;
    const banner = el('dev-banner');
    banner.textContent = `${t('banner.dev')} · ${label}${ver}`;
    banner.classList.remove('hidden');
  })();

  // Versión en footer
  if (!APP_VERSION.includes('BUILD_')) {
    const footerVer = el('footer-version');
    if (footerVer) footerVer.textContent = ` ${APP_VERSION}`;
  }

  // Mostrar icono suscripción si la pestaña inicial es calendario
  if (state.activeTab === 'calendario') el('btn-cal-subscribe').classList.remove('hidden');

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
      el('btn-cal-subscribe').classList.toggle('hidden', btn.dataset.tab !== 'calendario');
      if (btn.dataset.tab === 'calendario') renderAgenda();
    });
  });

  // Search
  function bindSearch(inputId, stateProp, renderFn) {
    const input = el(inputId);
    const clearBtn = input.parentElement.querySelector('.search-clear');
    input.addEventListener('input', e => {
      state[stateProp] = e.target.value;
      clearBtn.classList.toggle('hidden', !e.target.value);
      renderFn();
    });
    clearBtn.addEventListener('click', () => {
      input.value = '';
      state[stateProp] = '';
      clearBtn.classList.add('hidden');
      input.focus();
      renderFn();
    });
  }
  bindSearch('search-clientes', 'searchClientes', renderClientesList);
  bindSearch('search-coches', 'searchCoches', renderCochesList);

  // Service Worker + detección de actualización
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
      .then(reg => {
        function showUpdateBanner(worker) {
          const banner = el('update-banner');
          if (!banner) return;
          banner.classList.remove('hidden');
          banner.querySelector('[data-action="apply-update"]')
            ?.addEventListener('click', () => worker.postMessage('SKIP_WAITING'), { once: true });
        }

        if (reg.waiting) showUpdateBanner(reg.waiting);

        reg.addEventListener('updatefound', () => {
          const sw = reg.installing;
          sw.addEventListener('statechange', () => {
            if (sw.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateBanner(sw);
            }
          });
        });
      })
      .catch(() => {});

    navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
  }
}

// ── Helpers ───────────────────────────────────────────────

function renderUserChip(user) {
  const avatarEl = el('user-avatar');
  const nameEl = el('user-name');
  if (user.photoURL) {
    const img = document.createElement('img');
    img.src = user.photoURL;
    img.alt = '';
    img.referrerPolicy = 'no-referrer';
    avatarEl.innerHTML = '';
    avatarEl.appendChild(img);
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
