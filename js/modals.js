import { el, todayISO, escapeHTML as esc } from './utils.js';
import { CAR_BRANDS, BRAND_NAMES, MOTO_BRANDS, MOTO_BRAND_NAMES, VEHICLE_TYPES, FUEL_TYPES, FACTURA_ESTADOS, PAYMENT_METHODS, PIEZAS_COMUNES, IVA } from './config.js';

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
      <label>Matrícula *<input id="m-matricula" type="text" value="${esc(c.matricula)}" placeholder="Ej: 1234 ABC" style="text-transform:uppercase" /></label>
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
      if (!matricula || !marca) { alert('Matrícula y marca son obligatorias'); return Promise.resolve(); }
      const kmsEl = el('m-kms');
      const kms = kmsEl ? parseInt(kmsEl.value, 10) : NaN;
      return onSave({
        tipo: el('m-tipo').value,
        matricula,
        marca,
        modelo: el('m-modelo').value,
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

  openModal(
    isEdit ? 'Editar factura' : 'Nueva factura',
    `<div class="form-grid">
      <label>Número de factura
        <input id="m-numero" type="text" value="${esc(f.numero || '')}" readonly class="input-readonly" />
      </label>
      <label>Fecha<input id="m-fecha" type="date" value="${f.fecha || todayISO()}" /></label>
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
