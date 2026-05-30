const PRODID = '-//GarajeOS//GarajeOS//ES';
const CALNAME = 'GarajeOS - Taller';

function pad(n) { return String(n).padStart(2, '0'); }

function toICSDate(dateStr) {
  // dateStr: 'YYYY-MM-DD' → '20260526'
  return dateStr.replace(/-/g, '');
}

function nowStamp() {
  const d = new Date();
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function nextDay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
}

function icsEscape(str) {
  return (str || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function foldLine(line) {
  // ICS spec: lines > 75 octets must be folded
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const parts = [];
  let pos = 0;
  let first = true;
  while (pos < line.length) {
    const chunk = first ? line.slice(pos, pos + 75) : line.slice(pos, pos + 74);
    parts.push((first ? '' : ' ') + chunk);
    pos += first ? 75 : 74;
    first = false;
  }
  return parts.join('\r\n');
}

function getVehicleLabel(cita, clientes) {
  // Try vehiculoTemp first
  if (cita.vehiculoTemp) {
    const v = cita.vehiculoTemp;
    const parts = [v.matricula, v.marca, v.modelo, v.color].filter(Boolean);
    return parts.join(' · ') || 'Vehículo';
  }
  if (cita.clienteKey && cita.cocheKey) {
    const coche = clientes?.[cita.clienteKey]?.coches?.[cita.cocheKey];
    if (coche) {
      const parts = [coche.matricula, coche.marca, coche.modelo, coche.color].filter(Boolean);
      return parts.join(' · ') || 'Vehículo';
    }
  }
  return '';
}

function citaToVEVENT(cita, citaKey, clientes) {
  const uid = (cita.uuid || citaKey) + '@garajeos';
  const dtstamp = nowStamp();
  const dtstart = toICSDate(cita.fechaInicio);
  const dtend = cita.fechaFin ? nextDay(cita.fechaFin) : nextDay(cita.fechaInicio);

  const titular = clientes?.[cita.clienteKey]?.nombre || cita.vehiculoTemp?.titular || null;
  const vehicleLabel = getVehicleLabel(cita, clientes);
  const summary = [cita.descripcion || 'Cita', vehicleLabel].filter(Boolean).join(' · ');

  const descParts = [];
  if (titular) descParts.push('Titular: ' + titular);
  if (vehicleLabel) descParts.push('Vehículo: ' + vehicleLabel);
  if (cita.estado) descParts.push('Estado: ' + cita.estado);
  if (cita.notas) descParts.push(cita.notas);
  const description = descParts.join('\\n');

  const statusMap = {
    'Pendiente': 'TENTATIVE',
    'En curso': 'IN-PROCESS',
    'Completada': 'COMPLETED',
    'Cancelada': 'CANCELLED',
  };
  const status = statusMap[cita.estado] || 'TENTATIVE';

  const lines = [
    'BEGIN:VEVENT',
    foldLine('UID:' + uid),
    'DTSTAMP:' + dtstamp,
    'DTSTART;VALUE=DATE:' + dtstart,
    'DTEND;VALUE=DATE:' + dtend,
    foldLine('SUMMARY:' + icsEscape(summary)),
  ];
  if (description) lines.push(foldLine('DESCRIPTION:' + description));
  lines.push('STATUS:' + status);
  lines.push('END:VEVENT');
  return lines.join('\r\n');
}

export function generateICS(citas, clientes) {
  const vevents = Object.entries(citas || {})
    .map(([key, cita]) => citaToVEVENT(cita, key, clientes))
    .join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:' + PRODID,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    foldLine('X-WR-CALNAME:' + CALNAME),
    'X-WR-TIMEZONE:Europe/Madrid',
    vevents,
    'END:VCALENDAR',
  ].join('\r\n');
}
