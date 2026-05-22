export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatCurrency(amount) {
  if (amount == null) return '—';
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function normalizeText(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export function el(id) {
  return document.getElementById(id);
}

export function escapeHTML(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function generateFacturaNumber(clientes) {
  const year = new Date().getFullYear();
  const prefix = `${year}-`;
  let max = 0;
  for (const cliente of Object.values(clientes)) {
    for (const coche of Object.values(cliente.coches || {})) {
      for (const factura of Object.values(coche.facturas || {})) {
        if (factura.numero?.startsWith(prefix)) {
          const n = parseInt(factura.numero.slice(prefix.length), 10);
          if (!isNaN(n) && n > max) max = n;
        }
      }
    }
  }
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
}
