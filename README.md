# 🔧 GarajeOS

[![License: Commercial](https://img.shields.io/badge/License-Commercial-blue.svg)](./LICENSE)
[![Built with Claude](https://img.shields.io/badge/Built%20with-Claude%20AI-blueviolet?logo=anthropic)](https://claude.ai)
[![Ko-fi](https://img.shields.io/badge/Support-Ko--fi-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/juanjimpad)

Aplicación web para la gestión integral de un taller mecánico. Diseñada para talleres pequeños que quieren llevar el control de clientes, vehículos y facturas desde cualquier dispositivo, sin instalaciones ni servidores propios.

---

## Características

- **Árbol de gestión** — Estructura jerarquizada Clientes → Coches → Facturas. Cada cliente agrupa sus vehículos, y cada vehículo su historial completo de facturas.
- **Buscador instantáneo** — Filtrado en tiempo real por nombre/teléfono en clientes y por matrícula/marca en vehículos.
- **Gestión de clientes** — Nombre, teléfono, email, NIF/DNI, dirección y notas. Alta, edición y baja completa incluyendo todos sus datos asociados.
- **Gestión de vehículos** — Marca, modelo, matrícula, año, color, combustible, kilometraje, bastidor (VIN) y notas. Selector de 35+ marcas con sus modelos más vendidos en España (1994–2024).
- **Gestión de facturas** — Número, fecha, concepto, descripción detallada, importe y estado (Pendiente / Pagada / Cancelada).
- **Sincronización en la nube** — Datos guardados en Firebase Realtime Database. Los cambios se reflejan instantáneamente en todos los dispositivos.
- **Dark mode** — Selector 🌙☀️ para elegir tema claro, oscuro o automático (sigue la preferencia del sistema). La elección se guarda entre sesiones.
- **Acceso seguro** — Login con correo/contraseña o con cuenta de Google mediante Firebase Authentication. Cada usuario tiene sus datos completamente aislados.
- **PWA con soporte offline** — Service Worker que cachea los recursos estáticos. La app funciona sin conexión una vez cargada.

---

## Próximamente

- **Calendario / Agenda** — Visualización y gestión de citas con vista mensual y diaria. Asociación de citas a clientes y vehículos.
- **Generación de facturas PDF** — Exportar facturas con logotipo y datos del taller en un solo clic.
- **Panel de estadísticas** — Facturación mensual, clientes más activos, vehículos más frecuentes.
- **Multiusuario** — Soporte para varios mecánicos con distintos niveles de acceso.

---

## Tecnologías

- HTML · CSS · JavaScript (ES Modules, sin frameworks ni bundler)
- [Firebase Realtime Database](https://firebase.google.com/products/realtime-database) — persistencia y sincronización en tiempo real
- [Firebase Authentication](https://firebase.google.com/products/auth) — acceso seguro con email/contraseña y Google Sign-In
- Alojado en [GitHub Pages](https://pages.github.com/) vía GitHub Actions

---

## Estructura del proyecto

```
GarajeOS/
├── index.html
├── sw.js                   # Service Worker — caché offline y versionado de assets
├── manifest.json           # PWA manifest
├── firebase.json           # Configuración Firebase Hosting
├── database.rules.json     # Reglas de seguridad Realtime Database
├── css/
│   └── style.css           # Estilos con variables CSS para tema claro/oscuro
└── js/
    ├── app.js              # Punto de entrada, auth, event delegation
    ├── config.js           # Marcas/modelos de coches, tipos de combustible, estados
    ├── firebase.js         # Credenciales Firebase (gitignoreado)
    ├── firebase.example.js # Plantilla de credenciales para nuevos despliegues
    ├── state.js            # Estado global mutable
    ├── theme.js            # Lógica de tema (claro/oscuro/auto) y persistencia
    ├── utils.js            # Funciones puras: fechas, divisas, normalización
    ├── db.js               # Operaciones CRUD sobre Firebase
    ├── render.js           # Vistas: listas sidebar y paneles de detalle
    └── modals.js           # Formularios modales: cliente, coche, factura
```

---

## Diseño de la base de datos

### clientes

| Campo | Tipo | Descripción |
|---|---|---|
| `nombre` | string | Nombre completo del cliente |
| `telefono` | string · null | Teléfono de contacto |
| `email` | string · null | Correo electrónico |
| `nif` | string · null | NIF o DNI |
| `direccion` | string · null | Dirección postal |
| `notas` | string · null | Observaciones libres |

**clientes → coches** *(uno por vehículo)*

| Campo | Tipo | Descripción |
|---|---|---|
| `matricula` | string | Matrícula del vehículo |
| `marca` | string | Marca (SEAT, Volkswagen, Renault…) |
| `modelo` | string · null | Modelo dentro de la marca |
| `año` | number · null | Año de fabricación |
| `color` | string · null | Color del vehículo |
| `combustible` | string · null | Gasolina · Diésel · Híbrido · Eléctrico… |
| `kms` | number · null | Kilometraje actual |
| `vin` | string · null | Número de bastidor (VIN) |
| `notas` | string · null | Observaciones libres |

**clientes → coches → facturas** *(una por intervención)*

| Campo | Tipo | Descripción |
|---|---|---|
| `numero` | string · null | Número de factura (ej: 2024-001) |
| `fecha` | string `YYYY-MM-DD` | Fecha de emisión |
| `concepto` | string | Descripción del trabajo realizado |
| `descripcion` | string · null | Desglose detallado: piezas, mano de obra… |
| `total` | number · null | Importe total en euros |
| `estado` | `"Pendiente"` · `"Pagada"` · `"Cancelada"` | Estado de cobro |

---

## Reglas de Firebase Realtime Database

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read":  "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

Cada usuario solo puede leer y escribir sus propios datos.

---

## Despliegue

### 1. Clona el repositorio

```bash
git clone https://github.com/juanjimpad/garajeos.git
cd garajeos
```

### 2. Configura Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Activa **Realtime Database** (región `europe-west1`) y **Authentication → Correo/contraseña** y/o **Google**
3. Copia `js/firebase.example.js` → `js/firebase.js` y rellena tus credenciales
4. Aplica las reglas de seguridad del apartado anterior
5. En **Authentication → Settings → Dominios autorizados**, añade tu dominio de GitHub Pages

### 3. Publica en GitHub Pages

1. En los ajustes del repositorio → **Pages** → Source: **GitHub Actions**
2. Añade los secretos de Firebase en **Settings → Secrets and variables → Actions**:

| Secreto | Valor |
|---|---|
| `FIREBASE_API_KEY` | Tu `apiKey` |
| `FIREBASE_AUTH_DOMAIN` | Tu `authDomain` |
| `FIREBASE_DATABASE_URL` | Tu `databaseURL` |
| `FIREBASE_PROJECT_ID` | Tu `projectId` |
| `FIREBASE_STORAGE_BUCKET` | Tu `storageBucket` |
| `FIREBASE_MESSAGING_SENDER_ID` | Tu `messagingSenderId` |
| `FIREBASE_APP_ID` | Tu `appId` |

3. Haz push a `main` — el workflow despliega automáticamente.

> **Desarrollo local:** Los módulos ES no funcionan con `file://`. Usa un servidor local:
> ```bash
> npx serve .
> ```

---

## Apoya el proyecto

Si esta aplicación te resulta útil, considera invitarme a un café ☕

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/juanjimpad)

---

## Licencia

Software de uso **comercial**. Todos los derechos reservados. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

---

> Desarrollado con la asistencia de [Claude](https://claude.ai) (Anthropic) · 2026
