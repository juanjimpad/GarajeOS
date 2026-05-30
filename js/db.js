import { db } from './firebase.js';
import {
  ref, set, push, update, remove, onValue, off, get
} from 'firebase/database';

function userRef(uid, ...paths) {
  return ref(db, ['users', uid, ...paths].join('/'));
}

// ── Clientes ──────────────────────────────────────────────
export function subscribeClientes(uid, callback) {
  const r = userRef(uid, 'clientes');
  onValue(r, snap => callback(snap.val() || {}));
  return () => off(r);
}

export function addCliente(uid, data) {
  return push(userRef(uid, 'clientes'), data);
}

export function updateCliente(uid, key, data) {
  return update(userRef(uid, 'clientes', key), data);
}

export function deleteCliente(uid, key) {
  return remove(userRef(uid, 'clientes', key));
}

// ── Coches ───────────────────────────────────────────────
export function addCoche(uid, clienteKey, data) {
  return push(userRef(uid, 'clientes', clienteKey, 'coches'), data);
}

export function updateCoche(uid, clienteKey, cocheKey, data) {
  return update(userRef(uid, 'clientes', clienteKey, 'coches', cocheKey), data);
}

export function deleteCoche(uid, clienteKey, cocheKey) {
  return remove(userRef(uid, 'clientes', clienteKey, 'coches', cocheKey));
}

// ── Citas ────────────────────────────────────────────────
export function subscribeCitas(uid, callback) {
  const r = userRef(uid, 'citas');
  onValue(r, snap => callback(snap.val() || {}));
  return () => off(r);
}

export function addCita(uid, data) {
  return push(userRef(uid, 'citas'), data);
}

export function updateCita(uid, key, data) {
  return set(userRef(uid, 'citas', key), data);
}

export function deleteCita(uid, key) {
  return remove(userRef(uid, 'citas', key));
}

// ── Calendar export ──────────────────────────────────────
export async function getOrCreateCalendarSecret(uid) {
  const r = userRef(uid, 'calendarSecret');
  const snap = await get(r);
  if (snap.exists()) return snap.val();
  const secret = crypto.randomUUID();
  await set(r, secret);
  return secret;
}

export function resetCalendarSecret(uid) {
  const secret = crypto.randomUUID();
  return set(userRef(uid, 'calendarSecret'), secret).then(() => secret);
}

export function updateCalendarExport(secret, icsContent) {
  return set(ref(db, `calendarExports/${secret}`), icsContent);
}

// ── Facturas ─────────────────────────────────────────────
export function addFactura(uid, clienteKey, cocheKey, data) {
  return push(userRef(uid, 'clientes', clienteKey, 'coches', cocheKey, 'facturas'), data);
}

export function updateFactura(uid, clienteKey, cocheKey, facturaKey, data) {
  return update(userRef(uid, 'clientes', clienteKey, 'coches', cocheKey, 'facturas', facturaKey), data);
}

export function deleteFactura(uid, clienteKey, cocheKey, facturaKey) {
  return remove(userRef(uid, 'clientes', clienteKey, 'coches', cocheKey, 'facturas', facturaKey));
}
