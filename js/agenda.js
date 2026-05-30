import { state } from './state.js';
import { el, escapeHTML as esc } from './utils.js';

const MONTH_NAMES   = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_NAMES     = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const DAY_NAMES_L   = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

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

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function getMondayOfWeek(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
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
  return start > today ? start : today;
}

function citasForDay(iso, citaEntries) {
  const day = fromISO(iso).getTime();
  return citaEntries.filter(([, cita]) => {
    if (!cita.fechaInicio) return false;
    const start = fromISO(cita.fechaInicio).getTime();
    const end   = getCitaEnd(cita).getTime();
    return day >= start && day <= end;
  });
}

function toolbar(title) {
  const view = state.calendarView;
  return `
    <div class="ag-toolbar">
      <button class="ag-nav" data-action="cal-prev">‹</button>
      <button class="ag-nav ag-today-btn" data-action="cal-today" title="Ir a hoy">Hoy</button>
      <button class="ag-nav" data-action="cal-next">›</button>
      <span class="ag-title">${title}</span>
      <div class="ag-view-toggle">
        <button class="ag-view-btn${view === 'month' ? ' active' : ''}" data-action="cal-view-month">Mes</button>
        <button class="ag-view-btn${view === 'week'  ? ' active' : ''}" data-action="cal-view-week">Sem</button>
        <button class="ag-view-btn${view === 'day'   ? ' active' : ''}" data-action="cal-view-day">Día</button>
      </div>
      <button class="btn btn-sm btn-primary" data-action="add-cita">+ Cita</button>
    </div>
  `;
}

export function renderAgenda() {
  const view = state.calendarView;
  if (view === 'week') renderWeek();
  else if (view === 'day') renderDay();
  else renderMonth();
}

function renderMonth() {
  const { calendarYear: year, calendarMonth: month, citas } = state;
  const panel = el('panel-calendario');
  if (!panel) return;

  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);

  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7));

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
          const cls   = ESTADO_CLS[cita.estado] || 'cita-pendiente';
          const label = getCitaLabel(cita);
          const first = isStart(cita);
          const cont  = first ? '' : ' ag-chip-cont';
          const arrow = !cita.fechaFin ? (first ? ' ▶' : '') : '';
          return `<div class="ag-chip${cont} ${cls}" data-action="edit-cita" data-key="${key}" title="${esc(label)}">
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

  panel.innerHTML = `
    ${toolbar(`${MONTH_NAMES[month]} ${year}`)}
    <div class="ag-day-names">${DAY_NAMES.map(d => `<span>${d}</span>`).join('')}</div>
    <div class="ag-calendar">${weeksHtml}</div>
  `;
}

function renderWeek() {
  const panel = el('panel-calendario');
  if (!panel) return;

  const anchor = fromISO(state.calendarDate);
  const monday = getMondayOfWeek(anchor);
  const days   = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  const today       = toISO(new Date());
  const citaEntries = Object.entries(state.citas || {});

  const s = days[0], e = days[6];
  const ms = (d) => MONTH_NAMES[d.getMonth()].slice(0, 3).toLowerCase();
  const title = s.getMonth() === e.getMonth()
    ? `${s.getDate()}–${e.getDate()} ${ms(e)} ${e.getFullYear()}`
    : `${s.getDate()} ${ms(s)} – ${e.getDate()} ${ms(e)} ${e.getFullYear()}`;

  const colsHtml = days.map(day => {
    const iso     = toISO(day);
    const isToday = iso === today;
    const dayCitas = citasForDay(iso, citaEntries);

    const citasHtml = dayCitas.map(([key, cita]) => {
      const cls    = ESTADO_CLS[cita.estado] || 'cita-pendiente';
      const label  = getCitaLabel(cita);
      const cliente = cita.clienteKey ? state.clientes[cita.clienteKey]?.nombre : null;
      return `<div class="ag-wcell ${cls}" data-action="edit-cita" data-key="${key}" title="${esc(label)}">
        <span class="ag-wcell-label">${esc(label)}</span>
        ${cliente ? `<span class="ag-wcell-sub">${esc(cliente)}</span>` : ''}
      </div>`;
    }).join('');

    return `<div class="ag-wcol${isToday ? ' ag-today' : ''}" data-action="new-cita-day" data-date="${iso}">
      <div class="ag-wcol-head">
        <span class="ag-wcol-dname">${DAY_NAMES[(day.getDay() + 6) % 7]}</span>
        <span class="ag-wcol-num${isToday ? ' ag-today-num' : ''}">${day.getDate()}</span>
      </div>
      <div class="ag-wcol-body">${citasHtml}</div>
    </div>`;
  }).join('');

  panel.innerHTML = `
    ${toolbar(title)}
    <div class="ag-week-grid">${colsHtml}</div>
  `;
}

function renderDay() {
  const panel = el('panel-calendario');
  if (!panel) return;

  const anchor = fromISO(state.calendarDate);
  const iso    = toISO(anchor);
  const today  = toISO(new Date());

  const citaEntries = Object.entries(state.citas || {});
  const dayCitas    = citasForDay(iso, citaEntries);

  const dayIdx = (anchor.getDay() + 6) % 7;
  const title  = `${DAY_NAMES_L[dayIdx]}, ${anchor.getDate()} de ${MONTH_NAMES[anchor.getMonth()].toLowerCase()} de ${anchor.getFullYear()}`;

  const citasHtml = dayCitas.length
    ? dayCitas.map(([key, cita]) => {
        const cls    = ESTADO_CLS[cita.estado] || 'cita-pendiente';
        const label  = getCitaLabel(cita);
        const cliente = cita.clienteKey ? state.clientes[cita.clienteKey]?.nombre : null;
        return `<div class="ag-dcard ${cls}" data-action="edit-cita" data-key="${key}">
          <div class="ag-dcard-bar"></div>
          <div class="ag-dcard-body">
            <span class="ag-dcard-label">${esc(label)}</span>
            ${cliente ? `<span class="ag-dcard-sub">${esc(cliente)}</span>` : ''}
            <span class="ag-dcard-estado">${esc(cita.estado || 'Pendiente')}</span>
          </div>
        </div>`;
      }).join('')
    : `<div class="ag-empty">Sin citas para este día
        <button class="btn btn-sm btn-primary" data-action="new-cita-day" data-date="${iso}" style="margin-top:12px">+ Añadir cita</button>
       </div>`;

  panel.innerHTML = `
    ${toolbar(title)}
    <div class="ag-day-view">${citasHtml}</div>
  `;
}
