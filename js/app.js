// Imports sin dependencia de Firebase — siempre seguros
import { initTheme, setTheme } from './theme.js';
import { state } from './state.js';
import { renderClientesList, renderCochesList, renderClienteDetail, renderCocheDetail, renderFacturasList, clearDetail } from './render.js';
import { openClienteModal, openCocheModal, openFacturaModal, openCitaModal, openConfirm, closeModal } from './modals.js';
import { renderAgenda } from './agenda.js';
import { el, generateFacturaNumber, escapeHTML as esc } from './utils.js';
import { t } from './i18n.js';
import { APP_VERSION, COMMIT_HASH } from './config.js';
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
  el('detail-content').scrollTop = 0;
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
  const [{ auth }, fbDb, fbAuth, { Capacitor }] = await Promise.all([
    import('./firebase.js'),
    import('./db.js'),
    import('firebase/auth'),
    import('@capacitor/core'),
  ]);

  const {
    subscribeClientes, addCliente, updateCliente, deleteCliente,
    addCoche, updateCoche, deleteCoche,
    addFactura, updateFactura, deleteFactura,
    subscribeCitas, addCita, updateCita, deleteCita,
    getOrCreateCalendarSecret, resetCalendarSecret, updateCalendarExport,
    deleteAllUserData,
  } = fbDb;

  const {
    signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged,
    EmailAuthProvider, reauthenticateWithCredential, signInWithCredential, deleteUser,
  } = fbAuth;

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

  // Agrupa ráfagas de cambios (carga inicial, ediciones rápidas) en una sola escritura
  let syncCalendarTimer = null;
  function scheduleSyncCalendar(uid) {
    if (syncCalendarTimer) clearTimeout(syncCalendarTimer);
    syncCalendarTimer = setTimeout(() => {
      syncCalendarTimer = null;
      syncCalendar(uid).catch(() => {});
    }, 1500);
  }

  // ── Auth state ────────────────────────────────────────────

  const loadingMessages = [
    'Alineando las ruedas…',
    'Cambiando el aceite…',
    'Ajustando el mapeo del motor…',
    'Calentando bujías…',
    'Comprobando los frenos…',
    'Hinchando los neumáticos…',
    'Revisando los líquidos…',
    'Cargando la batería…',
    'Engrasando los ejes…',
    'Apretando las tuercas…',
    'Calibrando sensores…',
    'Equilibrando las ruedas…',
    'Sustituyendo filtros…',
    'Reglando válvulas…',
    'Purgando los frenos…',
    'Sincronizando carburadores…',
    'Limpiando inyectores…',
    'Revisando la correa de distribución…',
    'Templando el embrague…',
    'Encerando la carrocería…',
  ];

  let loadingTimer = null;
  let firstDataLoaded = false;

  function startLoadingMessages() {
    if (loadingTimer) clearInterval(loadingTimer);
    const msgEl = el('loading-message');
    if (!msgEl) return;
    const used = new Set();
    function pickMessage() {
      if (used.size >= loadingMessages.length) used.clear();
      let i;
      do { i = Math.floor(Math.random() * loadingMessages.length); } while (used.has(i));
      used.add(i);
      return loadingMessages[i];
    }
    msgEl.textContent = pickMessage();
    loadingTimer = setInterval(() => {
      msgEl.classList.add('fading');
      setTimeout(() => {
        msgEl.textContent = pickMessage();
        msgEl.classList.remove('fading');
      }, 200);
    }, 1800);
  }

  function stopLoadingMessages() {
    if (loadingTimer) { clearInterval(loadingTimer); loadingTimer = null; }
  }

  function showLoading() {
    el('auth-screen').classList.add('hidden');
    el('main-app').classList.add('hidden');
    el('loading-screen').classList.remove('hidden');
    startLoadingMessages();
  }

  function showMainApp() {
    stopLoadingMessages();
    el('loading-screen').classList.add('hidden');
    el('auth-screen').classList.add('hidden');
    el('main-app').classList.remove('hidden');
  }

  function showAuth() {
    stopLoadingMessages();
    el('loading-screen').classList.add('hidden');
    el('main-app').classList.add('hidden');
    el('auth-screen').classList.remove('hidden');
  }

  onAuthStateChanged(auth, user => {
    if (user) {
      state.currentUser = user;
      firstDataLoaded = false;
      showLoading();
      renderUserChip(user);
      startListeners(user.uid);
    } else {
      state.currentUser = null;
      firstDataLoaded = false;
      showAuth();
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
      scheduleSyncCalendar(uid);
      if (!firstDataLoaded) {
        firstDataLoaded = true;
        showMainApp();
      }
    });

    if (unsubCitas) unsubCitas();
    unsubCitas = subscribeCitas(uid, citas => {
      state.citas = citas;
      if (state.activeTab === 'calendario') renderAgenda();
      scheduleSyncCalendar(uid);
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
      showLoading();
    } catch (e) {
      showAuth();
      errEl.textContent = friendlyAuthError(e.code);
      errEl.classList.remove('hidden');
    }
  });

  el('btn-google').addEventListener('click', async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication');
        const result = await FirebaseAuthentication.signInWithGoogle();
        const { GoogleAuthProvider, signInWithCredential } = fbAuth;
        const credential = GoogleAuthProvider.credential(result.credential?.idToken);
        // Mostrar la pantalla de carga en cuanto se cierra el login, sin esperar a onAuthStateChanged
        showLoading();
        await signInWithCredential(auth, credential);
      } else {
        await signInWithPopup(auth, new GoogleAuthProvider());
        showLoading();
      }
    } catch (e) {
      showAuth();
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
        if (state.calendarView === 'week') {
          const d = new Date(state.calendarDate + 'T00:00:00');
          d.setDate(d.getDate() - 7);
          state.calendarDate = d.toISOString().split('T')[0];
        } else if (state.calendarView === 'day') {
          const d = new Date(state.calendarDate + 'T00:00:00');
          d.setDate(d.getDate() - 1);
          state.calendarDate = d.toISOString().split('T')[0];
        } else {
          state.calendarMonth--;
          if (state.calendarMonth < 0) { state.calendarMonth = 11; state.calendarYear--; }
        }
        renderAgenda();
        break;
      }

      case 'cal-next': {
        if (state.calendarView === 'week') {
          const d = new Date(state.calendarDate + 'T00:00:00');
          d.setDate(d.getDate() + 7);
          state.calendarDate = d.toISOString().split('T')[0];
        } else if (state.calendarView === 'day') {
          const d = new Date(state.calendarDate + 'T00:00:00');
          d.setDate(d.getDate() + 1);
          state.calendarDate = d.toISOString().split('T')[0];
        } else {
          state.calendarMonth++;
          if (state.calendarMonth > 11) { state.calendarMonth = 0; state.calendarYear++; }
        }
        renderAgenda();
        break;
      }

      case 'cal-today': {
        const now = new Date();
        state.calendarDate  = now.toISOString().split('T')[0];
        state.calendarYear  = now.getFullYear();
        state.calendarMonth = now.getMonth();
        renderAgenda();
        break;
      }

      case 'cal-view-month': state.calendarView = 'month'; renderAgenda(); break;
      case 'cal-view-week':  state.calendarView = 'week';  renderAgenda(); break;
      case 'cal-view-day':   state.calendarView = 'day';   renderAgenda(); break;
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
    if (window.Capacitor?.isNativePlatform()) return;
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
        <p class="info-version">Versión 1.0.3 · 2026</p>
        ${COMMIT_HASH ? `<p class="info-commit">build <a href="https://github.com/juanjimpad/GarajeOS/commit/${esc(COMMIT_HASH)}" target="_blank" rel="noopener">${esc(COMMIT_HASH)}</a></p>` : ''}
        <p>Gestión integral de taller mecánico.<br>Clientes, vehículos y facturas en un solo lugar, sincronizados en la nube.</p>
        <p class="info-contact">Contacto: <a href="mailto:contacto@garajeos.com">contacto@garajeos.com</a></p>
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
        <div class="danger-zone">
          <h3 class="danger-zone-title">Zona de peligro</h3>
          <p class="danger-zone-desc">Elimina tu cuenta y todos tus datos de forma permanente.</p>
          <button id="btn-delete-account" class="btn btn-danger btn-full">Eliminar mi cuenta</button>
        </div>
      </div>
    `;
    el('modal-overlay').classList.remove('hidden');
    el('btn-delete-account').addEventListener('click', openDeleteAccountModal);
  });

  function openDeleteAccountModal() {
    const user = state.currentUser;
    if (!user) return;
    const email = user.email || '';
    const isGoogle = user.providerData?.some(p => p.providerId === 'google.com');
    el('modal-title').textContent = 'Eliminar cuenta';
    el('modal-body').innerHTML = `
      <div class="delete-account-body">
        <p class="delete-warning"><strong>Esta acción es irreversible.</strong></p>
        <p>Se eliminarán de forma permanente:</p>
        <ul>
          <li>Tu cuenta de usuario</li>
          <li>Todos los clientes y vehículos registrados</li>
          <li>Todas las facturas y citas</li>
          <li>El enlace de suscripción al calendario</li>
        </ul>
        <p>Para confirmar, escribe tu correo:</p>
        <p class="delete-email-target"><strong>${esc(email)}</strong></p>
        <input id="delete-confirm-email" type="email" placeholder="Escribe tu correo aquí" autocomplete="off" />
        ${!isGoogle ? `
          <p style="margin-top:12px">Confirma tu contraseña:</p>
          <input id="delete-confirm-password" type="password" placeholder="Contraseña" autocomplete="current-password" />
        ` : ''}
        <div id="delete-account-error" class="auth-error hidden" style="margin-top:12px"></div>
        <div class="delete-actions">
          <button id="btn-delete-cancel" class="btn btn-secondary">Cancelar</button>
          <button id="btn-delete-confirm" class="btn btn-danger" disabled>Eliminar definitivamente</button>
        </div>
      </div>
    `;
    const confirmBtn = el('btn-delete-confirm');
    const emailInput = el('delete-confirm-email');
    const pwdInput = el('delete-confirm-password');
    function update() {
      const emailOk = emailInput.value.trim().toLowerCase() === email.toLowerCase();
      const pwdOk = isGoogle || (pwdInput && pwdInput.value.length > 0);
      confirmBtn.disabled = !(emailOk && pwdOk);
    }
    emailInput.addEventListener('input', update);
    if (pwdInput) pwdInput.addEventListener('input', update);
    el('btn-delete-cancel').addEventListener('click', closeModal);
    confirmBtn.addEventListener('click', () => runDeleteAccount({ isGoogle, password: pwdInput?.value || '' }));
  }

  async function runDeleteAccount({ isGoogle, password }) {
    const user = state.currentUser;
    if (!user) return;
    const errEl = el('delete-account-error');
    const confirmBtn = el('btn-delete-confirm');
    errEl.classList.add('hidden');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Eliminando…';
    try {
      if (isGoogle) {
        if (Capacitor.isNativePlatform()) {
          const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication');
          const result = await FirebaseAuthentication.signInWithGoogle();
          const credential = GoogleAuthProvider.credential(result.credential?.idToken);
          await reauthenticateWithCredential(user, credential);
        } else {
          await signInWithPopup(auth, new GoogleAuthProvider());
        }
      } else {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      }
      await deleteAllUserData(user.uid);
      await deleteUser(user);
      closeModal();
    } catch (e) {
      errEl.textContent = friendlyAuthError(e.code) + ` (${e.code || 'sin código'})`;
      errEl.classList.remove('hidden');
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Eliminar definitivamente';
    }
  }

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
      const panel = el(`panel-${btn.dataset.tab}`);
      panel.classList.add('active');
      panel.scrollTop = 0;
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
  if ('serviceWorker' in navigator && !window.Capacitor?.isNativePlatform()) {
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
