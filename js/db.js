import { db } from './firebase.js';
import {
  ref, set, push, update, remove, onValue, off
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

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
export function subscribeCoche(uid, clienteKey, cocheKey, callback) {
  const r = userRef(uid, 'clientes', clienteKey, 'coches', cocheKey);
  onValue(r, snap => callback(snap.val()));
  return () => off(r);
}

export function addCoche(uid, clienteKey, data) {
  return push(userRef(uid, 'clientes', clienteKey, 'coches'), data);
}

export function updateCoche(uid, clienteKey, cocheKey, data) {
  return update(userRef(uid, 'clientes', clienteKey, 'coches', cocheKey), data);
}

export function deleteCoche(uid, clienteKey, cocheKey) {
  return remove(userRef(uid, 'clientes', clienteKey, 'coches', cocheKey));
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
