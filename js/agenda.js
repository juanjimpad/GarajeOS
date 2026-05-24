import { state } from './state.js';
import { el, escapeHTML as esc } from './utils.js';

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_NAMES = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

const ESTADO_CLS = {
  'Pendiente':  'cita-pendiente',
  'En curso':   'cita-en-curso',
  'Completada': 'cita-completada',
  'Cancelada':  'cita-cancelada',
};

function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function fromISO(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function getCitaLabel(cita) {
  let mat, marca, modelo, color;
  if (cita.vehiculoTemp?.matricula) {
    ({ matricula: mat, marca, modelo, color } = cita.vehiculoTemp);
  } else if (cita.clienteKey && cita.cocheKey) {
    const coche = state.clientes[cita.clienteKey]?.coches?.[cita.cocheKey];
    if (coche) ({ matricula: mat, marca, modelo, color } = coche);
  }
  const parts = [mat, [marca, modelo, color].filter(Boolean).join(' ')].filter(Boolean);
  return parts.join(' · ') || cita.descripcion || 'Cita';
}

function getCitaEnd(cita) {
  if (cita.fechaFin) return fromISO(cita.fechaFin);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = fromISO(cita.fechaInicio);
  // Cita futura sin cerrar: solo su día de inicio
  // Cita pasada/actual sin cerrar: se alarga hasta hoy
  return start > today ? start : today;
}

// Devuelve todas las citas activas en un día ISO dado
function citasForDay(iso, citaEntries) {
  const day = fromISO(iso).getTime();
  return citaEntries.filter(([, cita]) => {
    if (!cita.fechaInicio) return false;
    const start = fromISO(cita.fechaInicio).getTime();
    const end   = getCitaEnd(cita).getTime();
    return day >= start && day <= end;
  });
}

export function renderAgenda() {
  const { calendarYear: year, calendarMonth: month, citas } = state;
  const panel = el('panel-calendario');
  if (!panel) return;

  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);

  // Primera celda: lunes anterior al día 1
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7));

  // Última celda: domingo posterior al último día
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - (endDate.getDay() + 6) % 7));

  const weeks = [];
  const cur = new Date(startDate);
  while (cur <= endDate) {
    const week = [];
    for (let i = 0; i < 7; i++) { week.push(new Date(cur)); cur.setDate(cur.getDate() + 1); }
    weeks.push(week);
  }

  const today = toISO(new Date());
  const citaEntries = Object.entries(citas || {});

  const weeksHtml = weeks.map(week =>
    `<div class="ag-week">
      ${week.map(day => {
        const iso      = toISO(day);
        const other    = day.getMonth() !== month;
        const isToday  = iso === today;
        const dayCitas = citasForDay(iso, citaEntries);
        const isStart  = (c) => c.fechaInicio === iso;

        const citasHtml = dayCitas.map(([key, cita]) => {
          const cls     = ESTADO_CLS[cita.estado] || 'cita-pendiente';
          const label   = getCitaLabel(cita);
          const ongoing = !cita.fechaFin;
          const first   = isStart(cita);
          const cont    = first ? '' : ' ag-chip-cont';
          const arrow   = ongoing ? (first ? ' ▶' : '') : '';
          return `<div class="ag-chip${cont} ${cls}"
            data-action="edit-cita" data-key="${key}" title="${esc(label)}">
            ${esc(label)}${arrow}
          </div>`;
        }).join('');

        return `<div class="ag-day${other ? ' ag-other' : ''}${isToday ? ' ag-today' : ''}"
          data-action="new-cita-day" data-date="${iso}">
          <span class="ag-day-num">${day.getDate()}</span>
          ${citasHtml}
        </div>`;
      }).join('')}
    </div>`
  ).join('');

  const secret = state.calendarSecret;
  const calUrl = secret ? `${location.origin}/calendar/${secret}` : '';

  panel.innerHTML = `
    <div class="ag-toolbar">
      <button class="ag-nav" data-action="cal-prev">‹</button>
      <span class="ag-title">${MONTH_NAMES[month]} ${year}</span>
      <button class="ag-nav" data-action="cal-next">›</button>
      <button class="btn btn-sm btn-primary" data-action="add-cita" style="margin-left:auto">+ Cita</button>
    </div>
    <div class="ag-day-names">
      ${DAY_NAMES.map(d => `<span>${d}</span>`).join('')}
    </div>
    <div class="ag-calendar">${weeksHtml}</div>
    <div class="ag-cal-sub">
      <span class="ag-cal-sub-label">Suscripción calendario</span>
      <div class="ag-cal-sub-row">
        <input id="cal-subscription-url" class="ag-cal-sub-input" type="text" readonly
          value="${calUrl}" placeholder="${secret ? '' : 'Cargando…'}" />
        <button class="btn btn-sm" data-action="copy-cal-url" ${!calUrl ? 'disabled' : ''}>Copiar</button>
        <button class="btn btn-sm btn-danger-outline" data-action="reset-cal-secret" title="Regenerar enlace">↺</button>
      </div>
    </div>
  `;
}
