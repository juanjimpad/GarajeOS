import { state } from './state.js';
import { formatDate, formatCurrency, normalizeText, el, escapeHTML as esc } from './utils.js';
import { ESTADO_BADGE_CLASS, ESTADO_AVATAR_CLASS, METODO_PAGO_ICON } from './config.js';

// ── Sidebar lists ─────────────────────────────────────────

export function renderClientesList() {
  const ul = el('list-clientes');
  const q = normalizeText(state.searchClientes);
  const entries = Object.entries(state.clientes)
    .filter(([, c]) => !q || normalizeText(c.nombre).includes(q) || normalizeText(c.telefono).includes(q))
    .sort(([, a], [, b]) => (a.nombre || '').localeCompare(b.nombre || '', 'es'));

  ul.innerHTML = entries.length
    ? entries.map(([key, c]) => `
      <li class="item-row ${state.selectedClienteKey === key ? 'active' : ''}" data-action="select-cliente" data-key="${key}">
        <div class="item-avatar">${(c.nombre || '?')[0].toUpperCase()}</div>
        <div class="item-info">
          <span class="item-name">${esc(c.nombre) || 'Sin nombre'}</span>
          <span class="item-sub">${esc(c.telefono) || esc(c.email) || ''}</span>
          ${c.notas ? `<span class="item-note">${esc(c.notas)}</span>` : ''}
        </div>
        <span class="item-badge">${countCoches(key)}</span>
      </li>`).join('')
    : '<li class="list-empty">Sin resultados</li>';
}

export function renderCochesList() {
  const ul = el('list-coches');
  const q = normalizeText(state.searchCoches);

  const allCoches = [];
  for (const [clienteKey, cliente] of Object.entries(state.clientes)) {
    for (const [cocheKey, coche] of Object.entries(cliente.coches || {})) {
      if (!q || normalizeText(coche.matricula).includes(q) || normalizeText(coche.marca).includes(q) || normalizeText(coche.modelo).includes(q)) {
        allCoches.push({ clienteKey, cocheKey, coche, clienteNombre: cliente.nombre });
      }
    }
  }
  allCoches.sort((a, b) => (a.coche.matricula || '').localeCompare(b.coche.matricula || '', 'es'));

  ul.innerHTML = allCoches.length
    ? allCoches.map(({ clienteKey, cocheKey, coche, clienteNombre }) => `
      <li class="item-row ${state.selectedCocheKey === cocheKey ? 'active' : ''}" data-action="select-coche" data-cliente-key="${clienteKey}" data-key="${cocheKey}">
        <div class="item-avatar car-avatar">${coche.tipo === 'Moto' ? '🏍️' : '🚗'}</div>
        <div class="item-info">
          <span class="item-name">${esc(coche.marca) || ''} ${esc(coche.modelo) || ''}</span>
          <span class="item-sub">${esc(coche.matricula) || ''} · ${esc(clienteNombre) || ''}</span>
        </div>
      </li>`).join('')
    : '<li class="list-empty">Sin resultados</li>';
}

function countCoches(clienteKey) {
  const c = state.clientes[clienteKey];
  return Object.keys(c?.coches || {}).length;
}

// ── Detail: Cliente ───────────────────────────────────────

export function renderClienteDetail(clienteKey) {
  const cliente = state.clientes[clienteKey];
  if (!cliente) return;
  const coches = Object.entries(cliente.coches || {});

  el('detail-content').innerHTML = `
    <div class="detail-header">
      <div class="detail-avatar">${(cliente.nombre || '?')[0].toUpperCase()}</div>
      <div class="detail-title-group">
        <h2>${esc(cliente.nombre) || 'Sin nombre'}</h2>
      </div>
      <div class="detail-actions">
        <button class="btn btn-sm btn-secondary" data-action="edit-cliente" data-key="${clienteKey}">Editar</button>
        <button class="btn btn-sm btn-danger" data-action="delete-cliente" data-key="${clienteKey}">Eliminar</button>
      </div>
    </div>

    <div class="info-grid">
      ${infoItem('Teléfono', cliente.telefono, telHref(cliente.telefono))}
      ${infoItem('Email', cliente.email, cliente.email ? 'mailto:' + cliente.email : null)}
      ${infoItem('Dirección', cliente.direccion)}
      ${infoItem('NIF/DNI', cliente.nif)}
      ${infoItemFull('Notas', cliente.notas)}
    </div>

    <div class="section-header">
      <h3>Vehículos (${coches.length})</h3>
      <button class="btn btn-sm btn-primary" data-action="add-coche" data-cliente-key="${clienteKey}">+ Añadir vehículo</button>
    </div>

    <div class="coches-grid">
      ${coches.length
        ? coches.map(([key, c]) => cocheCard(clienteKey, key, c)).join('')
        : '<p class="list-empty">Este cliente no tiene vehículos registrados.</p>'}
    </div>

    ${clienteFacturasSection(clienteKey, coches)}
  `;

}

function clienteFacturasSection(clienteKey, coches) {
  const all = [];
  coches.forEach(([cocheKey, c]) => {
    Object.entries(c.facturas || {}).forEach(([facturaKey, f]) => {
      all.push({ cocheKey, facturaKey, f, coche: c });
    });
  });

  if (!all.length) return '';

  all.sort((a, b) => (b.f.fecha || '').localeCompare(a.f.fecha || ''));

  const rows = all.map(({ cocheKey, facturaKey, f, coche }) =>
    facturaRow(clienteKey, cocheKey, facturaKey, f, coche)
  ).join('');

  return `
    <div class="section-header">
      <h3>Facturas (${all.length})</h3>
    </div>
    <div class="facturas-list">${rows}</div>`;
}

function cocheCard(clienteKey, cocheKey, c) {
  const numFacturas = Object.keys(c.facturas || {}).length;
  return `
    <div class="coche-card" data-action="select-coche" data-cliente-key="${clienteKey}" data-key="${cocheKey}">
      <div class="coche-card-header">
        <span class="coche-icon">${c.tipo === 'Moto' ? '🏍️' : '🚗'}</span>
        <div>
          <strong>${esc(c.marca) || ''} ${esc(c.modelo) || ''}</strong>
          <span class="coche-matricula">${esc(c.matricula) || 'Sin matrícula'}</span>
        </div>
      </div>
      <div class="coche-meta">
        <span>${esc(c.año) || ''}</span>
        <span>${esc(c.combustible) || ''}</span>
        <span>${typeof c.kms === 'number' ? c.kms.toLocaleString('es-ES') + ' km' : ''}</span>
      </div>
      <div class="coche-facturas-count">${numFacturas} factura${numFacturas !== 1 ? 's' : ''}</div>
    </div>`;
}

// ── Detail: Coche ─────────────────────────────────────────

export function renderCocheDetail(clienteKey, cocheKey) {
  const cliente = state.clientes[clienteKey];
  const coche = cliente?.coches?.[cocheKey];
  if (!coche) return;

  const facturas = Object.entries(coche.facturas || {})
    .sort(([, a], [, b]) => (b.fecha || '').localeCompare(a.fecha || ''));

  el('detail-content').innerHTML = `
    <div class="detail-header">
      <div class="detail-avatar car-avatar-lg">${coche.tipo === 'Moto' ? '🏍️' : '🚗'}</div>
      <div class="detail-title-group">
        <h2>${esc(coche.marca) || ''} ${esc(coche.modelo) || ''}</h2>
        <p class="detail-subtitle">${esc(coche.matricula) || 'Sin matrícula'} · ${esc(cliente.nombre) || ''}</p>
      </div>
      <div class="detail-actions">
        <button class="btn btn-sm btn-secondary" data-action="edit-coche" data-cliente-key="${clienteKey}" data-key="${cocheKey}">Editar</button>
        <button class="btn btn-sm btn-danger" data-action="delete-coche" data-cliente-key="${clienteKey}" data-key="${cocheKey}">Eliminar</button>
      </div>
    </div>

    <div class="info-grid">
      ${infoItem('Año', coche.año)}
      ${infoItem('Color', coche.color)}
      ${infoItem('Combustible', coche.combustible)}
      ${infoItem('Kilometraje', (() => {
        const fromFacturas = facturas.filter(([,f]) => f.kms != null).sort(([,a],[,b]) => (b.fecha||'').localeCompare(a.fecha||''));
        const current = fromFacturas.length ? fromFacturas[0][1].kms : coche.kms;
        return current ? current.toLocaleString('es-ES') + ' km' : null;
      })())}
      ${infoItem('Bastidor (VIN)', coche.vin)}
      ${infoItemFull('Notas', coche.notas)}
    </div>

    ${kmsTimeline(coche, facturas)}

    <div class="section-header">
      <h3>Facturas (${facturas.length})</h3>
      <button class="btn btn-sm btn-primary" data-action="add-factura" data-cliente-key="${clienteKey}" data-coche-key="${cocheKey}">+ Nueva factura</button>
    </div>

    <div class="facturas-list">
      ${facturas.length
        ? facturas.map(([key, f]) => facturaRow(clienteKey, cocheKey, key, f)).join('')
        : '<p class="list-empty">Sin facturas registradas.</p>'}
    </div>

    ${enlacesInteres(coche)}
  `;

}

function kmsTimeline(coche, facturas) {
  const entries = [];

  if (coche.kms != null) {
    entries.push({ fecha: null, kms: coche.kms, label: 'Kilometraje inicial' });
  }

  facturas
    .filter(([, f]) => f.kms != null)
    .sort(([, a], [, b]) => (a.fecha || '').localeCompare(b.fecha || ''))
    .forEach(([, f]) => entries.push({ fecha: f.fecha, kms: f.kms, label: f.concepto || 'Servicio' }));

  if (!entries.length) return '';

  const current = entries[entries.length - 1].kms;

  const rows = entries.map((e, i) => {
    const diff = i > 0 ? e.kms - entries[i - 1].kms : null;
    const diffStr = diff != null ? `<span class="kms-diff">+${diff.toLocaleString('es-ES')} km</span>` : '';
    return `
      <div class="kms-entry">
        <div class="kms-dot ${i === entries.length - 1 ? 'kms-dot-last' : ''}"></div>
        <div class="kms-info">
          <span class="kms-value">${e.kms.toLocaleString('es-ES')} km</span>
          ${diffStr}
          <span class="kms-label">${esc(e.label)}${e.fecha ? ` · ${formatDate(e.fecha)}` : ''}</span>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="section-header">
      <h3>Historial de kilometraje</h3>
      <span class="kms-current">${current.toLocaleString('es-ES')} km actuales</span>
    </div>
    <div class="kms-timeline">${rows}</div>`;
}

function facturaRow(clienteKey, cocheKey, facturaKey, f, coche = null) {
  const estadoClass = ESTADO_BADGE_CLASS[f.estado] || '';
  const metodoPagoIcon = METODO_PAGO_ICON[f.metodoPago] || '';
  const rightSlot = coche
    ? `<span class="factura-vehiculo-tag">${coche.tipo === 'Moto' ? '🏍️' : '🚗'} ${esc(coche.matricula) || ''}</span>`
    : `<button class="icon-btn danger-hover" data-action="delete-factura" data-cliente-key="${clienteKey}" data-coche-key="${cocheKey}" data-key="${facturaKey}" title="Eliminar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
       </button>`;

  const piezas = f.piezas || [];
  const desglose = (f.manoDeObra != null || piezas.length > 0) ? `
    <div class="factura-desglose-row">
      ${f.manoDeObra ? `<span>Mano de obra: ${formatCurrency(f.manoDeObra)}</span>` : ''}
      ${piezas.length ? `<span>${piezas.length} pieza${piezas.length !== 1 ? 's' : ''}</span>` : ''}
      ${f.iva ? `<span class="factura-iva-tag">+IVA 21%</span>` : ''}
    </div>` : '';

  return `
    <div class="factura-row" data-action="edit-factura" data-cliente-key="${clienteKey}" data-coche-key="${cocheKey}" data-key="${facturaKey}">
      <div class="factura-row-top">
        <div class="factura-meta">
          <span class="factura-num">#${esc(f.numero) || facturaKey.slice(0, 6)}</span>
          <span class="factura-fecha">${formatDate(f.fecha)}</span>
        </div>
        <span class="factura-total">${formatCurrency(f.total)}</span>
      </div>
      <div class="factura-row-bot">
        <div class="factura-bot-left">
          <span class="factura-concepto">${esc(f.concepto) || 'Sin concepto'}</span>
          <span class="badge ${estadoClass}">${esc(f.estado) || 'Pendiente'}</span>
          ${metodoPagoIcon ? `<span class="factura-metodo" title="${esc(f.metodoPago)}">${metodoPagoIcon}</span>` : ''}
        </div>
        ${rightSlot}
      </div>
      ${desglose}
    </div>`;
}

// ── Enlaces de interés ────────────────────────────────────

function enlacesInteres(coche) {
  const marca = (coche.marca || '').toLowerCase().replace(/\s+/g, '-');
  const modelo = (coche.modelo || '').toLowerCase().replace(/\s+/g, '-');
  const busqueda = encodeURIComponent(`${coche.marca || ''} ${coche.modelo || ''} ${coche.año || ''}`.trim());
  const busquedaRep = encodeURIComponent(`${coche.marca || ''} ${coche.modelo || ''} ${coche.año || ''} reparacion mantenimiento`.trim());

  const links = [
    {
      label: 'Consulta DGT',
      desc: 'Datos oficiales del vehículo (requiere Cl@ve)',
      url: 'https://sede.dgt.gob.es',
      icon: '🏛️',
    },
    {
      label: 'Historial Carfax',
      desc: 'Historial de accidentes y propietarios anteriores',
      url: 'https://www.carfax.eu/es',
      icon: '📋',
    },
    {
      label: 'Piezas en Autodoc',
      desc: 'Buscar recambios por marca y modelo',
      url: `https://www.autodoc.es/repuestos-para-coches/${encodeURIComponent(marca)}/${encodeURIComponent(modelo)}`,
      icon: '🛒',
    },
    {
      label: 'Tutoriales en YouTube',
      desc: 'Vídeos de reparación y mantenimiento',
      url: `https://www.youtube.com/results?search_query=${busquedaRep}`,
      icon: '▶️',
    },
    {
      label: 'Buscar en Google',
      desc: 'Búsqueda general del vehículo',
      url: `https://www.google.com/search?q=${busqueda}`,
      icon: '🔍',
    },
  ];

  return `
    <div class="section-header" style="margin-top:24px">
      <h3>Enlaces de interés</h3>
    </div>
    <div class="enlaces-grid">
      ${links.map(l => `
        <a class="enlace-card" href="${l.url}" target="_blank" rel="noopener">
          <span class="enlace-icon">${l.icon}</span>
          <span class="enlace-info">
            <span class="enlace-label">${l.label}</span>
            <span class="enlace-desc">${l.desc}</span>
          </span>
          <svg class="enlace-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>`).join('')}
    </div>`;
}

// ── Helpers ───────────────────────────────────────────────

function infoItem(label, value, href) {
  if (!value) return '';
  const content = href
    ? `<a class="info-value info-link" href="${esc(href)}">${esc(value)}</a>`
    : `<span class="info-value">${esc(value)}</span>`;
  return `<div class="info-item"><span class="info-label">${label}</span>${content}</div>`;
}

function infoItemFull(label, value) {
  if (!value) return '';
  return `<div class="info-item info-item-full"><span class="info-label">${label}</span><span class="info-value">${esc(value)}</span></div>`;
}

function telHref(t) {
  if (!t) return null;
  return 'tel:' + String(t).replace(/[^\d+]/g, '');
}

// ── Sidebar: Facturas ─────────────────────────────────────

export function renderFacturasList() {
  const ul = el('list-facturas');
  if (!ul) return;

  const pendientes = [];
  const resto = [];

  for (const [clienteKey, cliente] of Object.entries(state.clientes)) {
    for (const [cocheKey, coche] of Object.entries(cliente.coches || {})) {
      for (const [facturaKey, factura] of Object.entries(coche.facturas || {})) {
        const item = { clienteKey, cocheKey, facturaKey, factura, cliente, coche };
        if (factura.estado === 'Pendiente') pendientes.push(item);
        else resto.push(item);
      }
    }
  }

  pendientes.sort((a, b) => (a.factura.fecha || '').localeCompare(b.factura.fecha || ''));
  resto.sort((a, b) => (b.factura.fecha || '').localeCompare(a.factura.fecha || ''));

  if (!pendientes.length && !resto.length) {
    ul.innerHTML = '<li class="list-empty">Sin facturas registradas</li>';
    return;
  }

  const html = [];
  if (pendientes.length) {
    html.push(`<li class="list-section-header">Pendientes (${pendientes.length})</li>`);
    html.push(...pendientes.map(i => facturaItem(i)));
  }
  if (resto.length) {
    const byMonth = new Map();
    for (const item of resto) {
      const fecha = item.factura.fecha || '';
      const key = fecha.slice(0, 7); // 'YYYY-MM'
      if (!byMonth.has(key)) byMonth.set(key, []);
      byMonth.get(key).push(item);
    }
    for (const [monthKey, items] of byMonth) {
      const monthTotal = items.reduce((s, i) => s + (i.factura.total || 0), 0);
      const monthManoObra = items.reduce((s, i) => s + (i.factura.manoDeObra || 0), 0);
      const label = monthKey
        ? new Date(monthKey + '-01T00:00:00').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
        : 'Sin fecha';
      const byMethod = {};
      for (const item of items) {
        const m = item.factura.metodoPago || '';
        if (m) byMethod[m] = (byMethod[m] || 0) + (item.factura.total || 0);
      }
      const breakdown = Object.entries(byMethod)
        .map(([m, t]) => `<span>${METODO_PAGO_ICON[m] || m} ${formatCurrency(t)}</span>`)
        .join('');
      const manoObraLine = monthManoObra > 0
        ? `<span class="list-month-mano-obra">🔧 ${formatCurrency(monthManoObra)}</span>`
        : '';
      html.push(`<li class="list-section-header list-month-header">
        <span class="list-month-name">${label.charAt(0).toUpperCase() + label.slice(1)}</span>
        <div class="list-month-totals">
          <span class="list-month-total">${formatCurrency(monthTotal)}</span>
          ${manoObraLine}
          ${breakdown ? `<span class="list-month-breakdown">${breakdown}</span>` : ''}
        </div>
      </li>`);
      html.push(...items.map(i => facturaItem(i)));
    }
  }
  ul.innerHTML = html.join('');
}

function facturaItem({ clienteKey, cocheKey, facturaKey, factura, cliente, coche }) {
  const avatarClass = ESTADO_AVATAR_CLASS[factura.estado] || '';
  const metodoPagoIcon = METODO_PAGO_ICON[factura.metodoPago] || '';
  return `
    <li class="item-row factura-item" data-action="edit-factura" data-cliente-key="${clienteKey}" data-coche-key="${cocheKey}" data-key="${facturaKey}">
      <div class="item-avatar ${avatarClass}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      </div>
      <div class="factura-item-body">
        <span class="item-name">${esc(factura.concepto) || 'Sin concepto'}</span>
        <span class="item-total">${factura.total != null ? formatCurrency(factura.total) : '—'}</span>
        <span class="item-sub">${esc(cliente.nombre) || ''} · ${esc(coche.matricula) || ''}</span>
        <span class="item-date">${metodoPagoIcon} ${formatDate(factura.fecha)}</span>
      </div>
    </li>`;
}

export function clearDetail() {
  el('detail-content').innerHTML = '';
}
