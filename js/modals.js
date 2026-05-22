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
    });
  }

  el('modal-body').querySelectorAll('[data-modal-cancel]').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  const brandSel = el('modal-body').querySelector('#m-marca');
  const modelSel = el('modal-body').querySelector('#m-modelo');
  if (brandSel && modelSel) {
    brandSel.addEventListener('change', () => updateModelos(brandSel.value, modelSel));
    if (brandSel.value) updateModelos(brandSel.value, modelSel);
  }
}

export function closeModal() {
  el('modal-overlay').classList.add('hidden');
  el('modal-body').innerHTML = '';
}

function updateModelos(brand, select) {
  const tipo = el('m-tipo')?.value || 'Coche';
  const brands = tipo === 'Moto' ? MOTO_BRANDS : CAR_BRANDS;
  const models = brands[brand] || [];
  const current = select.dataset.current || '';
  select.innerHTML = `<option value="">Seleccionar modelo</option>` +
    models.map(m => `<option value="${m}" ${m === current ? 'selected' : ''}>${m}</option>`).join('');
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
  const brandOptions = brandNames.map(b =>
    `<option value="${b}" ${b === c.marca ? 'selected' : ''}>${b}</option>`
  ).join('');

  openModal(
    isEdit ? 'Editar vehículo' : 'Nuevo vehículo',
    `<div class="form-grid">
      <label>Tipo
        <select id="m-tipo">
          ${VEHICLE_TYPES.map(t => `<option value="${t}" ${t === tipo ? 'selected' : ''}>${t === 'Moto' ? '🏍️' : '🚗'} ${t}</option>`).join('')}
        </select>
      </label>
      <label>Matrícula *<input id="m-matricula" type="text" value="${esc(c.matricula)}" placeholder="Ej: 1234 ABC" style="text-transform:uppercase" /></label>
      <label>Marca *
        <select id="m-marca">
          <option value="">Seleccionar marca</option>
          ${brandOptions}
        </select>
      </label>
      <label>Modelo
        <select id="m-modelo" data-current="${esc(c.modelo)}">
          <option value="">Seleccionar modelo</option>
        </select>
      </label>
      <label>Año<input id="m-año" type="number" value="${c.año || ''}" min="1990" max="${new Date().getFullYear() + 1}" placeholder="Ej: 2018" /></label>
      <label>Color<input id="m-color" type="text" value="${esc(c.color)}" placeholder="Ej: Blanco" /></label>
      <label>Combustible
        <select id="m-combustible">
          <option value="">—</option>
          ${FUEL_TYPES.map(f => `<option value="${f}" ${f === c.combustible ? 'selected' : ''}>${f}</option>`).join('')}
        </select>
      </label>
      <label>Kilometraje<input id="m-kms" type="number" value="${c.kms || ''}" min="0" placeholder="Ej: 85000" /></label>
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
      const kms = parseInt(el('m-kms').value, 10);
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

  const tipoSel = el('m-tipo');
  const brandSel = el('m-marca');
  const modelSel = el('m-modelo');

  tipoSel.addEventListener('change', () => {
    const names = tipoSel.value === 'Moto' ? MOTO_BRAND_NAMES : BRAND_NAMES;
    brandSel.innerHTML = `<option value="">Seleccionar marca</option>` +
      names.map(b => `<option value="${b}">${b}</option>`).join('');
    modelSel.innerHTML = `<option value="">Seleccionar modelo</option>`;
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
      const metodoPago = el('modal-body').querySelector('input[name="metodoPago"]:checked')?.value || 'Efectivo';
      return onSave({
        numero: el('m-numero').value.trim(),
        fecha: el('m-fecha').value,
        concepto,
        total: isNaN(total) ? null : total,
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
