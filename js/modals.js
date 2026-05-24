import { el, todayISO, escapeHTML as esc } from './utils.js';
import { CAR_BRANDS, BRAND_NAMES, MOTO_BRANDS, MOTO_BRAND_NAMES, VEHICLE_TYPES, FUEL_TYPES, FACTURA_ESTADOS, PAYMENT_METHODS, PIEZAS_COMUNES, IVA } from './config.js';
import { state } from './state.js';

function openModal(title, bodyHTML, onConfirm) {
  el('modal-title').textContent = title;
  el('modal-body').innerHTML = bodyHTML;
  el('modal-overlay').classList.remove('hidden');

  const confirmBtn = el('modal-body').querySelector('[data-modal-confirm]');
  if (confirmBtn && onConfirm) {
    confirmBtn.addEventListener('click', async () => {
      await onConfirm();
      closeModal();
    }, { once: true });
  }

  el('modal-body').querySelectorAll('[data-modal-cancel]').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  const brandInput = el('modal-body').querySelector('#m-marca');
  if (brandInput) {
    brandInput.addEventListener('input', () => {
      const modelInput = el('modal-body').querySelector('#m-modelo');
      if (modelInput) {
        modelInput.value = '';
        modelInput.dataset.options = JSON.stringify(getModelos(brandInput.value));
      }
    });
  }
}

export function closeModal() {
  el('modal-overlay').classList.add('hidden');
  el('modal-body').innerHTML = '';
}

function getModelos(brand) {
  const tipo = el('m-tipo')?.value || 'Coche';
  const brands = tipo === 'Moto' ? MOTO_BRANDS : CAR_BRANDS;
  const models = (brands[brand] || []).filter(m => m !== 'Desconocido');
  return [...models, 'Desconocido'];
}


function setupCombobox(inputId, options) {
  const input = el(inputId);
  if (!input) return;
  input.dataset.options = JSON.stringify(options);

  const wrap = input.parentElement;
  wrap.style.position = 'relative';

  function showDropdown(filter) {
    closeDropdown();
    const opts = JSON.parse(input.dataset.options || '[]');
    const filtered = filter
      ? opts.filter(o => o.toLowerCase().includes(filter.toLowerCase()))
      : opts;

    const dd = document.createElement('div');
    dd.className = 'ac-dropdown';

    if (!filtered.length && filter) {
      const hint = document.createElement('div');
      hint.className = 'ac-item ac-hint';
      hint.textContent = `"${filter}" — valor personalizado`;
      dd.appendChild(hint);
    } else {
      filtered.slice(0, 50).forEach(o => {
        const item = document.createElement('div');
        item.className = 'ac-item';
        item.textContent = o;
        item.addEventListener('mousedown', e => {
          e.preventDefault();
          input.value = o;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          closeDropdown();
        });
        dd.appendChild(item);
      });
    }

    if (dd.childElementCount) wrap.appendChild(dd);
  }

  function closeDropdown() {
    wrap.querySelector('.ac-dropdown')?.remove();
  }

  input.addEventListener('focus', () => showDropdown(input.value));
  input.addEventListener('input', () => showDropdown(input.value));
  input.addEventListener('blur', () => setTimeout(closeDropdown, 150));
}

// ── Cliente modal ─────────────────────────────────────────

export function openClienteModal(existing, onSave) {
  const isEdit = !!existing;
  const c = existing || {};
  openModal(
    isEdit ? 'Editar cliente' : 'Nuevo cliente',
    `<div class="form-grid">
      <label>Nombre *<input id="m-nombre" type="text" value="${esc(c.nombre)}" placeholder="Nombre completo" /></label>
      <label>Teléfono<input id="m-telefono" type="tel" value="${esc(c.telefono)}" placeholder="Ej: 612 345 678" /></label>
      <label>Email<input id="m-email" type="email" value="${esc(c.email)}" placeholder="correo@ejemplo.com" /></label>
      <label>NIF / DNI<input id="m-nif" type="text" value="${esc(c.nif)}" placeholder="12345678A" /></label>
      <label class="full">Dirección<input id="m-direccion" type="text" value="${esc(c.direccion)}" placeholder="Calle, número, ciudad" /></label>
      <label class="full">Notas<textarea id="m-notas" rows="2" placeholder="Observaciones..." style="resize:none;overflow:hidden">${esc(c.notas)}</textarea></label>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" data-modal-cancel>Cancelar</button>
      <button class="btn btn-primary" data-modal-confirm>Guardar</button>
    </div>`,
    () => {
      const nombre = el('m-nombre').value.trim();
      if (!nombre) { alert('El nombre es obligatorio'); return Promise.resolve(); }
      return onSave({
        nombre,
        telefono: el('m-telefono').value.trim(),
        email: el('m-email').value.trim(),
        nif: el('m-nif').value.trim(),
        direccion: el('m-direccion').value.trim(),
        notas: el('m-notas').value.trim(),
      });
    }
  );
  const notasCliente = el('m-notas');
  const autoResizeCliente = () => { notasCliente.style.height = 'auto'; notasCliente.style.height = notasCliente.scrollHeight + 'px'; };
  notasCliente.addEventListener('input', autoResizeCliente);
  autoResizeCliente();
}

// ── Coche modal ───────────────────────────────────────────

export function openCocheModal(existing, onSave) {
  const isEdit = !!existing;
  const c = existing || {};
  const tipo = c.tipo || 'Coche';
  const brandNames = tipo === 'Moto' ? MOTO_BRAND_NAMES : BRAND_NAMES;

  openModal(
    isEdit ? 'Editar vehículo' : 'Nuevo vehículo',
    `<div class="form-grid">
      <label>Tipo
        <select id="m-tipo">
          ${VEHICLE_TYPES.map(t => `<option value="${t}" ${t === tipo ? 'selected' : ''}>${t === 'Moto' ? '🏍️' : '🚗'} ${t}</option>`).join('')}
        </select>
      </label>
      <label>Matrícula<input id="m-matricula" type="text" value="${esc(c.matricula)}" placeholder="Ej: 1234 ABC" style="text-transform:uppercase" /></label>
      <label>Marca *<div class="ac-wrap"><input id="m-marca" type="text" value="${esc(c.marca)}" placeholder="Buscar marca..." autocomplete="off" /></div></label>
      <label>Modelo<div class="ac-wrap"><input id="m-modelo" type="text" value="${esc(c.modelo)}" placeholder="Buscar modelo..." autocomplete="off" /></div></label>
      <label>Año<input id="m-año" type="number" value="${c.año || ''}" min="1940" max="${new Date().getFullYear() + 1}" placeholder="Ej: 2018" /></label>
      <label>Color<input id="m-color" type="text" value="${esc(c.color)}" placeholder="Ej: Blanco" /></label>
      <label>Combustible
        <select id="m-combustible">
          <option value="">—</option>
          ${FUEL_TYPES.map(f => `<option value="${f}" ${f === c.combustible ? 'selected' : ''}>${f}</option>`).join('')}
        </select>
      </label>
      ${!isEdit ? `<label>Kilometraje inicial<input id="m-kms" type="number" value="${c.kms || ''}" min="0" placeholder="Ej: 85000" /></label>` : ''}
      <label>Bastidor (VIN)<input id="m-vin" type="text" value="${esc(c.vin)}" placeholder="17 caracteres" style="text-transform:uppercase" /></label>
      <label class="full">Notas<textarea id="m-notas" rows="2" style="resize:none;overflow:hidden">${esc(c.notas)}</textarea></label>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" data-modal-cancel>Cancelar</button>
      <button class="btn btn-primary" data-modal-confirm>Guardar</button>
    </div>`,
    () => {
      const matricula = el('m-matricula').value.trim().toUpperCase();
      const marca = el('m-marca').value;
      if (!marca) { alert('La marca es obligatoria'); return Promise.resolve(); }
      const kmsEl = el('m-kms');
      const kms = kmsEl ? parseInt(kmsEl.value, 10) : NaN;
      return onSave({
        tipo: el('m-tipo').value,
        matricula,
        marca,
        modelo: el('m-modelo').value.trim() || 'Desconocido',
        año: parseInt(el('m-año').value, 10) || null,
        color: el('m-color').value.trim(),
        combustible: el('m-combustible').value,
        kms: isNaN(kms) ? null : kms,
        vin: el('m-vin').value.trim().toUpperCase(),
        notas: el('m-notas').value.trim(),
      });
    }
  );

  setupCombobox('m-marca', brandNames);
  setupCombobox('m-modelo', getModelos(c.marca));

  el('m-marca').addEventListener('input', () => {
    const modelos = getModelos(el('m-marca').value);
    el('m-modelo').dataset.options = JSON.stringify(modelos);
  });

  const notasCoche = el('m-notas');
  const autoResizeCoche = () => { notasCoche.style.height = 'auto'; notasCoche.style.height = notasCoche.scrollHeight + 'px'; };
  notasCoche.addEventListener('input', autoResizeCoche);
  autoResizeCoche();

  const tipoSel = el('m-tipo');
  tipoSel.addEventListener('change', () => {
    const names = tipoSel.value === 'Moto' ? MOTO_BRAND_NAMES : BRAND_NAMES;
    const marcaInput = el('m-marca');
    marcaInput.value = '';
    marcaInput.dataset.options = JSON.stringify(names);
    el('m-modelo').value = '';
    el('m-modelo').dataset.options = JSON.stringify([]);
  });
}

// ── Factura modal ─────────────────────────────────────────

export function openFacturaModal(existing, onSave, defaults = {}) {
  const isEdit = !!existing;
  const f = existing || defaults;
  const piezas = f.piezas || [];

  const clienteKey = defaults.clienteKey || null;
  const cocheKey   = defaults.cocheKey   || null;
  const cliente    = clienteKey ? state.clientes[clienteKey] : null;
  const coche      = (cliente && cocheKey) ? cliente.coches?.[cocheKey] : null;

  const vehiculoInfo = coche
    ? [coche.matricula, coche.marca, coche.modelo, coche.color].filter(Boolean).join(' · ')
    : null;

  const infoBlock = (cliente || vehiculoInfo) ? `
    <div class="factura-info-meta">
      ${cliente ? `<span class="factura-info-titular">${esc(cliente.nombre)}</span>` : ''}
      ${vehiculoInfo ? `<span class="factura-info-vehiculo">${esc(vehiculoInfo)}</span>` : ''}
    </div>` : '';

  openModal(
    isEdit ? 'Editar factura' : 'Nueva factura',
    `${infoBlock}
    <div class="form-grid">
      <label>Número de factura
        <input id="m-numero" type="text" value="${esc(f.numero || '')}" readonly class="input-readonly" />
      </label>
      <label>Fecha entrada<input id="m-fecha" type="date" value="${f.fecha || todayISO()}" /></label>
      <label>Fecha cierre<input id="m-fecha-cierre" type="date" value="${f.fechaCierre || ''}" /></label>
      <label class="full">Concepto *<input id="m-concepto" type="text" value="${esc(f.concepto)}" placeholder="Descripción del trabajo realizado" /></label>
      <label>Kilometraje<input id="m-kms" type="number" value="${f.kms || ''}" min="0" placeholder="Ej: 85000" /></label>
      <label>Estado
        <select id="m-estado">
          ${FACTURA_ESTADOS.map(e => `<option value="${e}" ${e === (f.estado || 'Pendiente') ? 'selected' : ''}>${e}</option>`).join('')}
        </select>
      </label>
    </div>

    <div class="factura-desglose">
      <div class="desglose-header">
        <span>Mano de obra</span>
        <div class="desglose-mdo">
          <input id="m-mano-obra" type="number" step="0.01" min="0" value="${f.manoDeObra || ''}" placeholder="0.00" />
          <span class="desglose-eur">€</span>
        </div>
      </div>

      <div class="desglose-piezas-header">
        <span>Piezas</span>
        <button type="button" class="btn btn-sm btn-secondary" id="btn-add-pieza">+ Añadir pieza</button>
      </div>
      <div id="m-piezas-list">
        ${piezas.map((p, i) => piezaRow(p, i)).join('')}
      </div>

      <div class="desglose-totales">
        <label class="desglose-iva-toggle">
          <input type="checkbox" id="m-iva" ${f.iva ? 'checked' : ''} />
          Aplicar IVA (21%)
        </label>
        <div class="desglose-total-row">
          <span>Subtotal</span>
          <span id="m-subtotal">—</span>
        </div>
        <div class="desglose-total-row desglose-total-final">
          <span>Total</span>
          <span id="m-total-display">—</span>
        </div>
      </div>
    </div>

    <div class="form-grid" style="margin-top:16px">
      <label id="m-metodo-grupo" class="full">Método de pago
        <div class="radio-group">
          ${PAYMENT_METHODS.map(m => `
            <label class="radio-pill">
              <input type="radio" name="metodoPago" value="${m}" ${(f.metodoPago || 'Efectivo') === m ? 'checked' : ''} />
              ${m === 'Efectivo' ? '💵' : m === 'Tarjeta' ? '💳' : '📱'} ${m}
            </label>`).join('')}
        </div>
      </label>
      <label class="full">Notas<textarea id="m-descripcion" rows="2" placeholder="Observaciones..." style="resize:none;overflow:hidden">${esc(f.descripcion)}</textarea></label>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" data-modal-cancel>Cancelar</button>
      <button class="btn btn-primary" data-modal-confirm>Guardar</button>
    </div>`,
    () => {
      const concepto = el('m-concepto').value.trim();
      if (!concepto) { alert('El concepto es obligatorio'); return Promise.resolve(); }
      const kms = parseInt(el('m-kms').value, 10);
      const manoDeObra = parseFloat(el('m-mano-obra').value) || 0;
      const iva = el('m-iva').checked;
      const piezasData = recogerPiezas();
      const subtotal = manoDeObra + piezasData.reduce((s, p) => s + p.cantidad * p.precioUnitario, 0);
      const total = iva ? subtotal * (1 + IVA) : subtotal;
      const metodoPago = el('modal-body').querySelector('input[name="metodoPago"]:checked')?.value || 'Efectivo';
      return onSave({
        numero: el('m-numero').value.trim(),
        fecha: el('m-fecha').value,
        fechaCierre: el('m-fecha-cierre').value || null,
        concepto,
        manoDeObra,
        piezas: piezasData,
        iva,
        subtotal: Math.round(subtotal * 100) / 100,
        total: Math.round(total * 100) / 100,
        kms: isNaN(kms) ? null : kms,
        estado: el('m-estado').value,
        metodoPago,
        descripcion: el('m-descripcion').value.trim(),
        citaId: f.citaId || null,
      });
    }
  );

  // Listeners
  const estadoSel = el('m-estado');
  const metodoGrupo = el('m-metodo-grupo');
  const toggleMetodo = () => { metodoGrupo.style.display = estadoSel.value === 'Pagada' ? '' : 'none'; };
  estadoSel.addEventListener('change', toggleMetodo);
  toggleMetodo();

  const textarea = el('m-descripcion');
  const autoResize = () => { textarea.style.height = 'auto'; textarea.style.height = textarea.scrollHeight + 'px'; };
  textarea.addEventListener('input', autoResize);
  autoResize();

  el('btn-add-pieza').addEventListener('click', () => {
    const list = el('m-piezas-list');
    const i = list.children.length;
    list.insertAdjacentHTML('beforeend', piezaRow({}, i));
    setupCombobox(`m-pieza-nombre-${i}`, PIEZAS_COMUNES);
    actualizarTotal();
  });

  // Setup autocomplete en piezas existentes
  piezas.forEach((_, i) => setupCombobox(`m-pieza-nombre-${i}`, PIEZAS_COMUNES));

  el('modal-body').addEventListener('click', e => {
    if (e.target.closest('.btn-remove-pieza')) {
      e.target.closest('.pieza-row').remove();
      actualizarTotal();
    }
  });

  el('modal-body').addEventListener('input', e => {
    if (e.target.matches('#m-mano-obra, .pieza-cantidad, .pieza-precio, #m-iva')) actualizarTotal();
  });
  el('m-iva').addEventListener('change', actualizarTotal);

  actualizarTotal();
}

function piezaRow(p = {}, i) {
  return `
    <div class="pieza-row">
      <div class="ac-wrap pieza-nombre-wrap">
        <input id="m-pieza-nombre-${i}" class="pieza-nombre" type="text" value="${esc(p.nombre || '')}" placeholder="Nombre de la pieza" autocomplete="off" />
      </div>
      <input class="pieza-cantidad" type="number" min="1" value="${p.cantidad || 1}" placeholder="Ud." />
      <input class="pieza-precio" type="number" step="0.01" min="0" value="${p.precioUnitario || ''}" placeholder="€/ud." />
      <button type="button" class="btn-remove-pieza icon-btn danger-hover" title="Eliminar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
      </button>
    </div>`;
}

function recogerPiezas() {
  return Array.from(el('m-piezas-list').querySelectorAll('.pieza-row')).map(row => ({
    nombre: row.querySelector('.pieza-nombre').value.trim(),
    cantidad: parseInt(row.querySelector('.pieza-cantidad').value, 10) || 1,
    precioUnitario: parseFloat(row.querySelector('.pieza-precio').value) || 0,
  })).filter(p => p.nombre);
}

function actualizarTotal() {
  const manoDeObra = parseFloat(el('m-mano-obra')?.value) || 0;
  const piezasTotal = recogerPiezas().reduce((s, p) => s + p.cantidad * p.precioUnitario, 0);
  const subtotal = manoDeObra + piezasTotal;
  const iva = el('m-iva')?.checked;
  const total = iva ? subtotal * (1 + IVA) : subtotal;
  const fmt = v => v.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  if (el('m-subtotal')) el('m-subtotal').textContent = fmt(subtotal);
  if (el('m-total-display')) el('m-total-display').textContent = fmt(total);
}

// ── Cita modal ────────────────────────────────────────────

function getVehicleLabel(clienteKey, cocheKey) {
  if (!clienteKey || !cocheKey) return '';
  const cliente = state.clientes[clienteKey];
  const coche = cliente?.coches?.[cocheKey];
  if (!coche || !cliente) return '';
  return [coche.matricula, coche.marca, coche.modelo, '·', cliente.nombre].filter(Boolean).join(' ');
}

function findFacturaByCitaId(citaId) {
  if (!citaId) return null;
  for (const [clienteKey, cliente] of Object.entries(state.clientes || {})) {
    for (const [cocheKey, coche] of Object.entries(cliente.coches || {})) {
      for (const [facturaKey, factura] of Object.entries(coche.facturas || {})) {
        if (factura.citaId === citaId) return { clienteKey, cocheKey, facturaKey, factura };
      }
    }
  }
  return null;
}

export function openCitaModal(existing, onSave, onDelete, citaKey = null) {
  const isEdit = !!existing;
  const c = existing || {};
  const ESTADOS_CITA = ['Pendiente', 'En curso', 'Completada', 'Cancelada'];
  const initClienteKey = c.clienteKey || '';
  const initCocheKey   = c.cocheKey   || '';
  const linkedFactura  = isEdit ? findFacturaByCitaId(c.uuid) : null;
  const facturaPagada  = linkedFactura?.factura?.estado === 'Pagada';
  const vehiculoLocked = !!linkedFactura;

  // Botones de acceso rápido (solo en edición con vehículo vinculado)
  const accesoRapidoHtml = isEdit && initClienteKey && initCocheKey ? `
    <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
      <button type="button" class="btn btn-sm btn-secondary"
        data-action="ver-vehiculo"
        data-cliente-key="${initClienteKey}"
        data-coche-key="${initCocheKey}">
        Ver ficha →
      </button>
      ${linkedFactura
        ? `<button type="button" class="btn btn-sm btn-secondary"
            data-action="ver-factura-cita"
            data-cliente-key="${linkedFactura.clienteKey}"
            data-coche-key="${linkedFactura.cocheKey}"
            data-factura-key="${linkedFactura.facturaKey}">
            Ver factura →
          </button>`
        : `<button type="button" class="btn btn-sm btn-primary"
            data-action="nueva-factura-cita"
            data-cliente-key="${initClienteKey}"
            data-coche-key="${initCocheKey}"
            data-cita-key="${citaKey || ''}">
            + Nueva factura
          </button>`
      }
    </div>` : '';

  openModal(
    isEdit ? 'Editar cita' : 'Nueva cita',
    `${facturaPagada ? `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;margin-bottom:14px;
        background:#d1fae5;color:#065f46;border-radius:8px;border:1px solid #6ee7b7;font-size:13px">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      Factura cerrada y pagada — esta cita es de solo lectura
    </div>` : ''}
    <div class="form-grid">
      <label>Fecha entrada *<input id="m-ci-inicio" type="date" value="${c.fechaInicio || todayISO()}" ${facturaPagada ? 'disabled' : ''} /></label>
      <label>Fecha salida<input id="m-ci-fin" type="date" value="${c.fechaFin || ''}" ${facturaPagada ? 'disabled' : ''} /></label>
      <label class="full">Descripción<input id="m-ci-desc" type="text" value="${esc(c.descripcion || '')}" placeholder="Revisión, cambio aceite, frenos..." ${facturaPagada ? 'disabled' : ''} /></label>
      <label>Estado
        <select id="m-ci-estado" ${facturaPagada ? 'disabled' : ''}>
          ${ESTADOS_CITA.map(e => `<option value="${e}" ${(c.estado || 'Pendiente') === e ? 'selected' : ''}>${e}</option>`).join('')}
        </select>
      </label>
    </div>

    <div style="margin-top:14px">
      ${!vehiculoLocked ? `
      <div style="display:flex;gap:8px;align-items:flex-end">
        <label style="flex:1;margin:0">Cliente
          <div class="ac-wrap">
            <input id="m-ci-cliente-search" type="text"
              value="${initClienteKey ? esc(state.clientes[initClienteKey]?.nombre || '') : ''}"
              placeholder="Buscar cliente..." autocomplete="off" />
          </div>
          <input type="hidden" id="m-ci-cliente-key" value="${initClienteKey}" />
        </label>
        <button type="button" class="btn btn-sm btn-secondary" id="m-ci-btn-add-cliente" style="flex-shrink:0;margin-bottom:1px">+ Cliente</button>
      </div>` : `<input type="hidden" id="m-ci-cliente-key" value="${initClienteKey}" />`}
      <div id="m-ci-cliente-card" style="margin-top:6px"></div>

      <div id="m-ci-new-cliente" style="display:none;margin-top:8px;padding:10px;background:var(--bg-secondary);border-radius:8px;border:1px solid var(--border)">
        <div class="form-grid">
          <label>Nombre *<input id="m-ci-cl-nombre" type="text" placeholder="Nombre del cliente" /></label>
          <label>Teléfono<input id="m-ci-cl-tel" type="tel" placeholder="612 345 678" /></label>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button type="button" class="btn btn-sm btn-primary" id="m-ci-confirmar-cliente">Añadir</button>
          <button type="button" class="btn btn-sm btn-secondary" id="m-ci-cancelar-cliente">Cancelar</button>
        </div>
      </div>
    </div>

    <div id="m-ci-vehiculos-section" style="margin-top:12px${!initClienteKey ? ';display:none' : ''}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span style="font-size:12px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.4px">Vehículo</span>
        ${!vehiculoLocked ? `<button type="button" class="btn btn-sm btn-secondary" id="m-ci-btn-add-coche">+ Vehículo</button>` : ''}
      </div>
      <div id="m-ci-vehiculos-list"></div>
      <input type="hidden" id="m-ci-coche-key" value="${initCocheKey}" />
      <input type="hidden" id="m-ci-v-edit-key" />

      <div id="m-ci-v-edit-section" style="display:none;margin-top:8px;padding:10px;background:var(--bg-secondary);border-radius:8px;border:1px solid var(--accent)">
        <p style="font-size:12px;color:var(--text-muted);margin:0 0 8px">Completa los datos del vehículo</p>
        <div class="form-grid">
          <label>Tipo
            <select id="m-ci-v-edit-tipo">
              ${VEHICLE_TYPES.map(t => `<option value="${t}">${t}</option>`).join('')}
            </select>
          </label>
          <label>Matrícula<input id="m-ci-v-edit-mat" type="text" placeholder="1234 ABC" style="text-transform:uppercase" /></label>
          <label>Marca<div class="ac-wrap"><input id="m-ci-v-edit-marca" type="text" placeholder="Marca..." autocomplete="off" /></div></label>
          <label>Modelo<div class="ac-wrap"><input id="m-ci-v-edit-modelo" type="text" placeholder="Modelo..." autocomplete="off" /></div></label>
          <label>Año<input id="m-ci-v-edit-año" type="number" placeholder="${new Date().getFullYear()}" min="1940" max="${new Date().getFullYear() + 1}" /></label>
        </div>
      </div>

      <div id="m-ci-new-coche" style="display:none;margin-top:8px;padding:10px;background:var(--bg-secondary);border-radius:8px;border:1px solid var(--border)">
        <div class="form-grid">
          <label>Tipo
            <select id="m-ci-v-tipo">
              ${VEHICLE_TYPES.map(t => `<option value="${t}">${t}</option>`).join('')}
            </select>
          </label>
          <label>Matrícula<input id="m-ci-v-mat" type="text" placeholder="1234 ABC" style="text-transform:uppercase" /></label>
          <label>Marca<div class="ac-wrap"><input id="m-ci-v-marca" type="text" placeholder="Marca..." autocomplete="off" /></div></label>
          <label>Modelo<div class="ac-wrap"><input id="m-ci-v-modelo" type="text" placeholder="Modelo..." autocomplete="off" /></div></label>
          <label>Año<input id="m-ci-v-año" type="number" placeholder="${new Date().getFullYear()}" min="1940" max="${new Date().getFullYear() + 1}" /></label>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button type="button" class="btn btn-sm btn-primary" id="m-ci-confirmar-coche">Añadir</button>
          <button type="button" class="btn btn-sm btn-secondary" id="m-ci-cancelar-coche">Cancelar</button>
        </div>
      </div>

      ${accesoRapidoHtml}
    </div>

    <div class="modal-footer" style="margin-top:16px">
      ${isEdit && !facturaPagada ? `<button type="button" class="btn btn-danger" id="m-ci-delete">Eliminar</button>` : ''}
      <button class="btn btn-secondary" data-modal-cancel>Cerrar</button>
      ${!facturaPagada ? `<button class="btn btn-primary" data-modal-confirm>Guardar</button>` : ''}
    </div>`,
    async () => {
      if (facturaPagada) return;
      const fechaInicio = el('m-ci-inicio').value;
      if (!fechaInicio) { alert('La fecha de entrada es obligatoria'); return; }
      let clienteKey = el('m-ci-cliente-key').value || null;
      let cocheKey   = el('m-ci-coche-key').value   || null;
      if (clienteKey && !cocheKey && state.addCoche) {
        const ref = await state.addCoche(clienteKey, { tipo: 'Coche', marca: 'Desconocido', modelo: 'Desconocido' });
        cocheKey = ref.key;
      }
      // Guardar datos del vehículo Desconocido si se editaron
      const editKey = el('m-ci-v-edit-key')?.value;
      if (editKey && clienteKey && state.updateCoche && el('m-ci-v-edit-section')?.style.display !== 'none') {
        const marca  = el('m-ci-v-edit-marca').value.trim()  || 'Desconocido';
        const modelo = el('m-ci-v-edit-modelo').value.trim() || 'Desconocido';
        const cocheActual = state.clientes[clienteKey]?.coches?.[editKey] || {};
        await state.updateCoche(clienteKey, editKey, {
          ...cocheActual,
          tipo:      el('m-ci-v-edit-tipo').value,
          matricula: el('m-ci-v-edit-mat').value.trim().toUpperCase() || cocheActual.matricula || null,
          marca,
          modelo,
          año:       parseInt(el('m-ci-v-edit-año').value) || cocheActual.año || null,
        });
      }
      return onSave({
        fechaInicio,
        fechaFin:    el('m-ci-fin').value || null,
        descripcion: el('m-ci-desc').value.trim(),
        estado:      el('m-ci-estado').value,
        clienteKey,
        cocheKey,
      });
    }
  );

  // Tarjeta del cliente seleccionado
  function renderClienteCard(clienteKey) {
    const card = el('m-ci-cliente-card');
    if (!card) return;
    if (!clienteKey) { card.innerHTML = ''; return; }
    const cliente = state.clientes[clienteKey];
    if (!cliente) { card.innerHTML = ''; return; }
    const info = [cliente.telefono, cliente.email].filter(Boolean).join(' · ');
    card.innerHTML = `<div style="padding:8px 10px;border-radius:6px;margin-bottom:2px;
        border:1px solid var(--border);background:var(--bg-secondary);
        border-left:3px solid var(--accent);cursor:default">
      <strong style="font-size:13px">${esc(cliente.nombre || '—')}</strong>
      ${info ? `<span style="font-size:12px;color:var(--text-muted);margin-left:8px">${esc(info)}</span>` : ''}
    </div>`;
  }

  // Renderiza las tarjetas de vehículos del cliente seleccionado
  function renderVehiculos(clienteKey, selectedCocheKey) {
    const section = el('m-ci-vehiculos-section');
    const list    = el('m-ci-vehiculos-list');
    if (!clienteKey) { section.style.display = 'none'; return; }
    section.style.display = '';
    const coches  = state.clientes[clienteKey]?.coches || {};
    const allEntries = Object.entries(coches);
    const entries = vehiculoLocked
      ? allEntries.filter(([key]) => key === selectedCocheKey)
      : allEntries;
    if (!entries.length) {
      list.innerHTML = `<p style="font-size:12px;color:var(--text-muted);margin:4px 0 8px">Sin vehículos registrados</p>`;
      return;
    }
    list.innerHTML = entries.map(([key, coche]) => {
      const sel = key === selectedCocheKey;
      return `<div class="ci-coche-card${sel ? ' selected' : ''}" data-coche-key="${key}"
        style="padding:8px 10px;border-radius:6px;margin-bottom:6px;
          border:1px solid var(--border);
          background:var(--bg-secondary);
          border-left:${sel ? '3px solid var(--accent)' : '1px solid var(--border)'};
          cursor:${sel || vehiculoLocked ? 'default' : 'pointer'}">
        <strong style="font-size:13px">${esc(coche.matricula || '—')}</strong>
        <span style="font-size:12px;color:var(--text-muted);margin-left:8px">${esc([coche.marca, coche.modelo, coche.año].filter(Boolean).join(' '))}</span>
      </div>`;
    }).join('');
    if (!vehiculoLocked) {
      list.querySelectorAll('.ci-coche-card').forEach(card => {
        card.addEventListener('click', () => {
          el('m-ci-coche-key').value = card.dataset.cocheKey;
          renderVehiculos(clienteKey, card.dataset.cocheKey);
        });
      });
    }
    // Mostrar formulario de edición si el vehículo seleccionado es Desconocido
    const editSection = el('m-ci-v-edit-section');
    if (editSection && !facturaPagada && selectedCocheKey) {
      const cocheSeleccionado = state.clientes[clienteKey]?.coches?.[selectedCocheKey];
      if (cocheSeleccionado?.marca === 'Desconocido') {
        editSection.style.display = '';
        el('m-ci-v-edit-key').value       = selectedCocheKey;
        el('m-ci-v-edit-tipo').value      = cocheSeleccionado.tipo     || 'Coche';
        el('m-ci-v-edit-mat').value       = cocheSeleccionado.matricula || '';
        el('m-ci-v-edit-marca').value     = '';
        el('m-ci-v-edit-modelo').value    = '';
        el('m-ci-v-edit-año').value       = cocheSeleccionado.año      || '';
      } else {
        editSection.style.display = 'none';
        el('m-ci-v-edit-key').value = '';
      }
    } else if (editSection) {
      editSection.style.display = 'none';
      el('m-ci-v-edit-key').value = '';
    }
  }

  // Render inicial
  renderClienteCard(initClienteKey);
  renderVehiculos(initClienteKey, initCocheKey);

  if (!vehiculoLocked) {
    // Autocomplete cliente
    const clienteLabels = Object.entries(state.clientes || {}).map(([, cl]) => cl.nombre || '').filter(Boolean);
    setupCombobox('m-ci-cliente-search', clienteLabels);
    el('m-ci-cliente-search')?.addEventListener('input', () => {
      const val   = el('m-ci-cliente-search').value;
      const found = Object.entries(state.clientes || {}).find(([, cl]) => cl.nombre === val);
      const key   = found?.[0] || '';
      el('m-ci-cliente-key').value = key;
      el('m-ci-coche-key').value   = '';
      renderClienteCard(key);
      renderVehiculos(key, '');
    });

    // + Nuevo cliente
    el('m-ci-btn-add-cliente')?.addEventListener('click', () => {
      el('m-ci-new-cliente').style.display = '';
      el('m-ci-cl-nombre').focus();
    });
    el('m-ci-cancelar-cliente')?.addEventListener('click', () => {
      el('m-ci-new-cliente').style.display = 'none';
    });
    el('m-ci-confirmar-cliente')?.addEventListener('click', async () => {
      const nombre = el('m-ci-cl-nombre').value.trim();
      if (!nombre) { el('m-ci-cl-nombre').focus(); return; }
      const ref = await state.addCliente?.({ nombre, telefono: el('m-ci-cl-tel').value.trim() || null });
      if (!ref) return;
      el('m-ci-cliente-key').value    = ref.key;
      el('m-ci-cliente-search').value = nombre;
      el('m-ci-new-cliente').style.display = 'none';
      el('m-ci-coche-key').value = '';
      renderClienteCard(ref.key);
      renderVehiculos(ref.key, '');
    });

    // + Nuevo vehículo
    el('m-ci-btn-add-coche')?.addEventListener('click', () => {
      el('m-ci-new-coche').style.display = '';
      el('m-ci-v-mat').focus();
    });
    el('m-ci-cancelar-coche')?.addEventListener('click', () => {
      el('m-ci-new-coche').style.display = 'none';
    });

    // Comboboxes marca/modelo del formulario inline
    const getVBrands = () => el('m-ci-v-tipo')?.value === 'Moto' ? MOTO_BRANDS : CAR_BRANDS;
    const getVBrandNames = () => el('m-ci-v-tipo')?.value === 'Moto' ? MOTO_BRAND_NAMES : BRAND_NAMES;
    setupCombobox('m-ci-v-marca', BRAND_NAMES);
    setupCombobox('m-ci-v-modelo', []);
    el('m-ci-v-tipo')?.addEventListener('change', () => {
      el('m-ci-v-marca').value = '';
      el('m-ci-v-modelo').value = '';
      el('m-ci-v-marca').dataset.options = JSON.stringify(getVBrandNames());
      el('m-ci-v-modelo').dataset.options = JSON.stringify([]);
    });
    el('m-ci-v-marca')?.addEventListener('input', () => {
      const models = (getVBrands()[el('m-ci-v-marca').value] || []).filter(m => m !== 'Desconocido');
      el('m-ci-v-modelo').dataset.options = JSON.stringify([...models, 'Desconocido']);
      el('m-ci-v-modelo').value = '';
    });

    el('m-ci-confirmar-coche')?.addEventListener('click', async () => {
      const clienteKey = el('m-ci-cliente-key').value;
      if (!clienteKey) { alert('Selecciona un cliente primero'); return; }
      const cocheData = {
        tipo:      el('m-ci-v-tipo').value,
        matricula: el('m-ci-v-mat').value.trim().toUpperCase() || null,
        marca:     el('m-ci-v-marca').value.trim()  || null,
        modelo:    el('m-ci-v-modelo').value.trim() || null,
        año:       parseInt(el('m-ci-v-año').value) || null,
      };
      const ref = await state.addCoche?.(clienteKey, cocheData);
      if (!ref) return;
      // Inyectar en state para que renderVehiculos lo muestre sin esperar a Firebase
      if (state.clientes[clienteKey]) {
        state.clientes[clienteKey].coches = state.clientes[clienteKey].coches || {};
        state.clientes[clienteKey].coches[ref.key] = cocheData;
      }
      el('m-ci-new-coche').style.display = 'none';
      el('m-ci-coche-key').value = ref.key;
      renderVehiculos(clienteKey, ref.key);
    });
  }

  // Comboboxes del formulario de edición de vehículo Desconocido
  if (!facturaPagada) {
    setupCombobox('m-ci-v-edit-marca', BRAND_NAMES);
    setupCombobox('m-ci-v-edit-modelo', []);
    el('m-ci-v-edit-tipo')?.addEventListener('change', () => {
      const brands = el('m-ci-v-edit-tipo').value === 'Moto' ? MOTO_BRAND_NAMES : BRAND_NAMES;
      el('m-ci-v-edit-marca').dataset.options = JSON.stringify(brands);
      el('m-ci-v-edit-marca').value  = '';
      el('m-ci-v-edit-modelo').value = '';
    });
    el('m-ci-v-edit-marca')?.addEventListener('input', () => {
      const brands = el('m-ci-v-edit-tipo').value === 'Moto' ? MOTO_BRANDS : CAR_BRANDS;
      const models = (brands[el('m-ci-v-edit-marca').value] || []).filter(m => m !== 'Desconocido');
      el('m-ci-v-edit-modelo').dataset.options = JSON.stringify([...models, 'Desconocido']);
      el('m-ci-v-edit-modelo').value = '';
    });
  }

  // Estado → fecha fin automática (solo si no está bloqueada)
  if (!facturaPagada) {
    el('m-ci-estado')?.addEventListener('change', () => {
      const estado = el('m-ci-estado').value;
      const fin    = el('m-ci-fin');
      if (estado === 'Completada' && !fin.value) fin.value = todayISO();
      else if (estado === 'En curso') fin.value = '';
    });
  }

  // Botón eliminar
  if (isEdit && !facturaPagada && onDelete) {
    el('m-ci-delete')?.addEventListener('click', () => {
      closeModal();
      onDelete();
    }, { once: true });
  }
}

// ── Confirm dialog ────────────────────────────────────────

export function openConfirm(message, onConfirm) {
  openModal(
    'Confirmar acción',
    `<p class="confirm-msg">${esc(message)}</p>
    <div class="modal-footer">
      <button class="btn btn-secondary" data-modal-cancel>Cancelar</button>
      <button class="btn btn-danger" data-modal-confirm>Eliminar</button>
    </div>`,
    onConfirm
  );
}
