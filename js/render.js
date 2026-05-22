import { state } from './state.js';
import { formatDate, formatCurrency, normalizeText, el } from './utils.js';
import { FACTURA_ESTADOS } from './config.js';

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
          <span class="item-name">${c.nombre || 'Sin nombre'}</span>
          <span class="item-sub">${c.telefono || c.email || ''}</span>
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
        <div class="item-avatar car-avatar">🚗</div>
        <div class="item-info">
          <span class="item-name">${coche.marca || ''} ${coche.modelo || ''}</span>
          <span class="item-sub">${coche.matricula || ''} · ${clienteNombre || ''}</span>
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
        <h2>${cliente.nombre || 'Sin nombre'}</h2>
        <p class="detail-subtitle">${cliente.email || ''}</p>
      </div>
      <div class="detail-actions">
        <button class="btn btn-sm btn-secondary" data-action="edit-cliente" data-key="${clienteKey}">Editar</button>
        <button class="btn btn-sm btn-danger" data-action="delete-cliente" data-key="${clienteKey}">Eliminar</button>
      </div>
    </div>

    <div class="info-grid">
      ${infoItem('Teléfono', cliente.telefono)}
      ${infoItem('Email', cliente.email)}
      ${infoItem('Dirección', cliente.direccion)}
      ${infoItem('NIF/DNI', cliente.nif)}
      ${infoItem('Notas', cliente.notas)}
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
  `;

  el('empty-state').classList.add('hidden');
  el('detail-content').classList.remove('hidden');
}

function cocheCard(clienteKey, cocheKey, c) {
  const numFacturas = Object.keys(c.facturas || {}).length;
  return `
    <div class="coche-card" data-action="select-coche" data-cliente-key="${clienteKey}" data-key="${cocheKey}">
      <div class="coche-card-header">
        <span class="coche-icon">🚗</span>
        <div>
          <strong>${c.marca || ''} ${c.modelo || ''}</strong>
          <span class="coche-matricula">${c.matricula || 'Sin matrícula'}</span>
        </div>
      </div>
      <div class="coche-meta">
        <span>${c.año || ''}</span>
        <span>${c.combustible || ''}</span>
        <span>${c.kms ? c.kms.toLocaleString('es-ES') + ' km' : ''}</span>
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
      <div class="detail-avatar car-avatar-lg">🚗</div>
      <div class="detail-title-group">
        <h2>${coche.marca || ''} ${coche.modelo || ''}</h2>
        <p class="detail-subtitle">${coche.matricula || 'Sin matrícula'} · ${cliente.nombre || ''}</p>
      </div>
      <div class="detail-actions">
        <button class="btn btn-sm btn-secondary" data-action="back-to-cliente" data-key="${clienteKey}">← Cliente</button>
        <button class="btn btn-sm btn-secondary" data-action="edit-coche" data-cliente-key="${clienteKey}" data-key="${cocheKey}">Editar</button>
        <button class="btn btn-sm btn-danger" data-action="delete-coche" data-cliente-key="${clienteKey}" data-key="${cocheKey}">Eliminar</button>
      </div>
    </div>

    <div class="info-grid">
      ${infoItem('Año', coche.año)}
      ${infoItem('Color', coche.color)}
      ${infoItem('Combustible', coche.combustible)}
      ${infoItem('Kilometraje', coche.kms ? coche.kms.toLocaleString('es-ES') + ' km' : null)}
      ${infoItem('Bastidor (VIN)', coche.vin)}
      ${infoItem('Notas', coche.notas)}
    </div>

    <div class="section-header">
      <h3>Facturas (${facturas.length})</h3>
      <button class="btn btn-sm btn-primary" data-action="add-factura" data-cliente-key="${clienteKey}" data-coche-key="${cocheKey}">+ Nueva factura</button>
    </div>

    <div class="facturas-list">
      ${facturas.length
        ? facturas.map(([key, f]) => facturaRow(clienteKey, cocheKey, key, f)).join('')
        : '<p class="list-empty">Sin facturas registradas.</p>'}
    </div>
  `;

  el('empty-state').classList.add('hidden');
  el('detail-content').classList.remove('hidden');
}

function facturaRow(clienteKey, cocheKey, facturaKey, f) {
  const estadoClass = { Pendiente: 'badge-warning', Pagada: 'badge-success', Cancelada: 'badge-danger' }[f.estado] || '';
  return `
    <div class="factura-row" data-action="edit-factura" data-cliente-key="${clienteKey}" data-coche-key="${cocheKey}" data-key="${facturaKey}">
      <div class="factura-info">
        <span class="factura-num">#${f.numero || facturaKey.slice(0, 6)}</span>
        <span class="factura-concepto">${f.concepto || 'Sin concepto'}</span>
        <span class="factura-fecha">${formatDate(f.fecha)}</span>
      </div>
      <div class="factura-right">
        <span class="badge ${estadoClass}">${f.estado || 'Pendiente'}</span>
        <span class="factura-total">${formatCurrency(f.total)}</span>
        <button class="icon-btn danger-hover" data-action="delete-factura" data-cliente-key="${clienteKey}" data-coche-key="${cocheKey}" data-key="${facturaKey}" title="Eliminar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
        </button>
      </div>
    </div>`;
}

// ── Helpers ───────────────────────────────────────────────

function infoItem(label, value) {
  if (!value) return '';
  return `<div class="info-item"><span class="info-label">${label}</span><span class="info-value">${value}</span></div>`;
}

export function showEmptyState() {
  el('empty-state').classList.remove('hidden');
  el('detail-content').classList.add('hidden');
  el('detail-content').innerHTML = '';
}
