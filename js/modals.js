import { el, todayISO, escapeHTML as esc } from './utils.js';
import { CAR_BRANDS, BRAND_NAMES, MOTO_BRANDS, MOTO_BRAND_NAMES, VEHICLE_TYPES, FUEL_TYPES, FACTURA_ESTADOS, PAYMENT_METHODS } from './config.js';

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
    if (!filtered.length) return;

    const dd = document.createElement('div');
    dd.className = 'ac-dropdown';
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
    wrap.appendChild(dd);
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
      <label class="full">Notas<textarea id="m-notas" rows="2" placeholder="Observaciones...">${esc(c.notas)}</textarea></label>
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
      <label>Año<input id="m-año" type="number" value="${c.año || ''}" min="1990" max="${new Date().getFullYear() + 1}" placeholder="Ej: 2018" /></label>
      <label>Color<input id="m-color" type="text" value="${esc(c.color)}" placeholder="Ej: Blanco" /></label>
      <label>Combustible
        <select id="m-combustible">
          <option value="">—</option>
          ${FUEL_TYPES.map(f => `<option value="${f}" ${f === c.combustible ? 'selected' : ''}>${f}</option>`).join('')}
        </select>
      </label>
      ${!isEdit ? `<label>Kilometraje inicial<input id="m-kms" type="number" value="${c.kms || ''}" min="0" placeholder="Ej: 85000" /></label>` : ''}
      <label>Bastidor (VIN)<input id="m-vin" type="text" value="${esc(c.vin)}" placeholder="17 caracteres" style="text-transform:uppercase" /></label>
      <label class="full">Notas<textarea id="m-notas" rows="2">${esc(c.notas)}</textarea></label>
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
  openModal(
    isEdit ? 'Editar factura' : 'Nueva factura',
    `<div class="form-grid">
      <label>Número de factura
        <input id="m-numero" type="text" value="${f.numero || ''}" placeholder="Ej: 2026-001" readonly class="input-readonly" />
      </label>
      <label>Fecha<input id="m-fecha" type="date" value="${f.fecha || todayISO()}" /></label>
      <label class="full">Concepto *<input id="m-concepto" type="text" value="${esc(f.concepto)}" placeholder="Descripción del trabajo realizado" /></label>
      <label>Total (€)<input id="m-total" type="number" step="0.01" value="${f.total || ''}" placeholder="0.00" /></label>
      <label>Kilometraje<input id="m-kms" type="number" value="${f.kms || ''}" min="0" placeholder="Ej: 85000" /></label>
      <label>Estado
        <select id="m-estado">
          ${FACTURA_ESTADOS.map(e => `<option value="${e}" ${e === (f.estado || 'Pendiente') ? 'selected' : ''}>${e}</option>`).join('')}
        </select>
      </label>
      <label id="m-metodo-grupo" class="full">Método de pago
        <div class="radio-group">
          ${PAYMENT_METHODS.map(m => `
            <label class="radio-pill">
              <input type="radio" name="metodoPago" value="${m}" ${(f.metodoPago || 'Efectivo') === m ? 'checked' : ''} />
              ${m === 'Efectivo' ? '💵' : m === 'Tarjeta' ? '💳' : '📱'} ${m}
            </label>`).join('')}
        </div>
      </label>
      <label class="full">Descripción detallada<textarea id="m-descripcion" rows="3" placeholder="Piezas, mano de obra, etc.">${esc(f.descripcion)}</textarea></label>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" data-modal-cancel>Cancelar</button>
      <button class="btn btn-primary" data-modal-confirm>Guardar</button>
    </div>`,
    () => {
      const concepto = el('m-concepto').value.trim();
      if (!concepto) { alert('El concepto es obligatorio'); return Promise.resolve(); }
      const total = parseFloat(el('m-total').value);
      const kms = parseInt(el('m-kms').value, 10);
      const metodoPago = el('modal-body').querySelector('input[name="metodoPago"]:checked')?.value || 'Efectivo';
      return onSave({
        numero: el('m-numero').value.trim(),
        fecha: el('m-fecha').value,
        concepto,
        total: isNaN(total) ? null : total,
        kms: isNaN(kms) ? null : kms,
        estado: el('m-estado').value,
        metodoPago,
        descripcion: el('m-descripcion').value.trim(),
      });
    }
  );

  const estadoSel = el('m-estado');
  const metodoGrupo = el('m-metodo-grupo');
  const toggleMetodo = () => {
    metodoGrupo.style.display = estadoSel.value === 'Pagada' ? '' : 'none';
  };
  estadoSel.addEventListener('change', toggleMetodo);
  toggleMetodo();
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
