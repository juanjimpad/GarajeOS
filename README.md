# 🔧 GarajeOS

[![Version](https://img.shields.io/badge/Versión-1.3-informational)](https://github.com/juanjimpad/GarajeOS)
[![License: Commercial](https://img.shields.io/badge/License-Commercial-blue.svg)](./LICENSE)
[![Built with Claude](https://img.shields.io/badge/Built%20with-Claude%20AI-blueviolet?logo=anthropic)](https://claude.ai)
[![Ko-fi](https://img.shields.io/badge/Support-Ko--fi-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/juanjimpad)

Aplicación web para la gestión integral de un taller mecánico. Diseñada para talleres pequeños que quieren llevar el control de clientes, vehículos, facturas y citas desde cualquier dispositivo, sin instalaciones ni servidores propios.

---

## Características

### Gestión de datos

- **Árbol de gestión** — Estructura jerarquizada Clientes → Vehículos → Facturas. Cada cliente agrupa sus vehículos y cada vehículo su historial completo de facturas.
- **Buscador instantáneo** — Filtrado en tiempo real por nombre/teléfono en clientes y por matrícula/marca en vehículos.
- **Gestión de clientes** — Nombre, teléfono, email, NIF/DNI, dirección y notas.
- **Gestión de vehículos** — Marca, modelo, matrícula, tipo (coche/moto), año, color, combustible, kilometraje, bastidor (VIN) y notas. Selector de marcas con sus modelos más vendidos en España con autocompletado personalizado. La matrícula es opcional.
- **Gestión de facturas** — Número autogenerado, fecha de entrada y cierre, concepto, líneas de piezas/materiales, mano de obra, IVA (21%), estado (Pendiente / Pagada / Cancelada) y método de pago. El titular y el vehículo se muestran en el encabezado del formulario para evitar confusiones.
- **Facturas pagadas en solo lectura** — Cuando una factura está en estado Pagada, todos los campos se bloquean mostrando un banner verde de confirmación.

### Agenda y citas

- **Calendario mensual** — Vista de citas con chips de colores por estado (Pendiente, En curso, Completada, Cancelada). La cuadrícula se adapta al tamaño de pantalla.
- **Gestión de citas** — Alta, edición y eliminación de citas con fecha de inicio y fin, descripción, estado y notas. Las citas futuras muestran solo su día de inicio; las abiertas se alargan hasta hoy.
- **Vinculación cita ↔ factura** — Cada cita genera un UUID único. Al crear una factura desde una cita el concepto se precarga y quedan vinculadas. Si ya existe factura, el botón cambia a "Ver factura".
- **Selección de cliente y vehículo en cita** — Buscador de clientes con alta rápida inline. Selección de vehículo del cliente con posibilidad de añadir uno nuevo. Si se guarda sin vehículo se crea uno "Desconocido" editable directamente desde la cita.
- **Navegación desde cita** — Enlace directo al detalle del vehículo y a la factura vinculada desde el popup de la cita.
- **Chip de cita informativo** — Muestra matrícula, marca, modelo y color del vehículo en el chip del calendario.

### Suscripción al calendario

- **Calendario iCal privado** — Genera automáticamente un feed `.ics` con todas las citas, actualizado en tiempo real al cambiar los datos.
- **URL secreta por usuario** — Cada usuario tiene un token UUID único almacenado en Firebase. La URL es privada por oscuridad (imposible de adivinar).
- **Integración directa** — Botón de suscripción en el footer (solo visible en la pestaña Agenda) que abre un modal con accesos directos a Google Calendar, Apple Calendar y Outlook, además de opción de copiar el enlace.
- **Regeneración de enlace** — El usuario puede invalidar el enlace actual y generar uno nuevo en cualquier momento.

### Plataforma

- **Sincronización en la nube** — Datos guardados en Firebase Realtime Database. Los cambios se reflejan instantáneamente en todos los dispositivos.
- **Acceso seguro** — Login con correo/contraseña o con cuenta de Google. Cada usuario tiene sus datos completamente aislados.
- **Dark mode** — Selector ☀️🌙 para tema claro, oscuro o automático. La elección persiste entre sesiones.
- **PWA con soporte offline** — Service Worker con estrategia network-first. La app funciona sin conexión una vez cargada.
- **Banner de entorno** — Se muestra un aviso amarillo en dominios de preview (`*.pages.dev`) indicando la rama activa, invisible en producción.

---

## Próximamente

- **Generación de facturas PDF** — Exportar facturas con logotipo y datos del taller en un solo clic.
- **Panel de estadísticas** — Facturación mensual, clientes más activos, vehículos más frecuentes.
- **Multiidioma** — Sistema i18n implementado con soporte para español e inglés (integración en curso).
- **Multiusuario** — Soporte para varios mecánicos con distintos niveles de acceso.

---

## Tecnologías

- HTML · CSS · JavaScript (ES Modules, sin frameworks ni bundler)
- [Firebase Realtime Database](https://firebase.google.com/products/realtime-database) — persistencia y sincronización en tiempo real
- [Firebase Authentication](https://firebase.google.com/products/auth) — acceso seguro con email/contraseña y Google Sign-In
- [Cloudflare Pages](https://pages.cloudflare.com/) — alojamiento y despliegue continuo desde GitHub
- [Cloudflare Workers](https://workers.cloudflare.com/) (`_worker.js`) — endpoint del feed iCal privado

---

## Estructura del proyecto

```
GarajeOS/
├── index.html
├── _worker.js              # Cloudflare Worker — endpoint /calendar/:secret
├── sw.js                   # Service Worker — caché offline
├── manifest.json           # PWA manifest
├── firebase.json           # Configuración Firebase
├── database.rules.json     # Reglas de seguridad Realtime Database
├── wrangler.json           # Configuración Cloudflare Workers/Pages
├── .assetsignore           # Excluye _worker.js de los assets estáticos
├── css/
│   └── style.css
└── js/
    ├── app.js              # Punto de entrada, auth, event delegation
    ├── agenda.js           # Calendario mensual y chips de citas
    ├── config.js           # Marcas/modelos, tipos, estados
    ├── firebase.js         # Credenciales Firebase (gitignoreado)
    ├── firebase.example.js # Plantilla de credenciales
    ├── ics.js              # Generación de feeds iCal (.ics)
    ├── i18n.js             # Sistema de traducción (es/en)
    ├── state.js            # Estado global mutable
    ├── theme.js            # Lógica de tema claro/oscuro/auto
    ├── utils.js            # Funciones puras: fechas, divisas, normalización
    ├── db.js               # Operaciones CRUD sobre Firebase
    ├── render.js           # Vistas: listas sidebar y paneles de detalle
    └── modals.js           # Formularios modales: cliente, vehículo, factura, cita
```

---

## Diseño de la base de datos

### users → clientes

| Campo | Tipo | Descripción |
|---|---|---|
| `nombre` | string | Nombre completo del cliente |
| `telefono` | string · null | Teléfono de contacto |
| `email` | string · null | Correo electrónico |
| `nif` | string · null | NIF o DNI |
| `direccion` | string · null | Dirección postal |
| `notas` | string · null | Observaciones libres |

**→ coches** *(uno por vehículo)*

| Campo | Tipo | Descripción |
|---|---|---|
| `marca` | string | Marca del vehículo |
| `modelo` | string | Modelo (por defecto: Desconocido) |
| `matricula` | string · null | Matrícula (opcional) |
| `tipo` | `"Coche"` · `"Moto"` | Tipo de vehículo |
| `año` | number · null | Año de fabricación |
| `color` | string · null | Color |
| `combustible` | string · null | Gasolina · Diésel · Híbrido · Eléctrico… |
| `kms` | number · null | Kilometraje actual |
| `vin` | string · null | Número de bastidor |
| `notas` | string · null | Observaciones libres |

**→ coches → facturas** *(una por intervención)*

| Campo | Tipo | Descripción |
|---|---|---|
| `numero` | string | Número autogenerado (ej: 2024-001) |
| `fecha` | string `YYYY-MM-DD` | Fecha de entrada |
| `fechaCierre` | string · null | Fecha de cierre |
| `concepto` | string | Descripción del trabajo |
| `piezas` | array · null | Líneas de piezas con nombre, cantidad y precio |
| `manoDeObra` | number · null | Importe mano de obra |
| `iva` | boolean | Aplica IVA 21% |
| `total` | number · null | Importe total |
| `estado` | `"Pendiente"` · `"Pagada"` · `"Cancelada"` | Estado de cobro |
| `metodoPago` | string · null | Efectivo · Tarjeta · Transferencia… |
| `citaId` | string · null | UUID de la cita vinculada |
| `kms` | number · null | Kilometraje en el momento de la intervención |

### users → citas

| Campo | Tipo | Descripción |
|---|---|---|
| `uuid` | string | Identificador único para vinculación con facturas |
| `fechaInicio` | string `YYYY-MM-DD` | Fecha de inicio |
| `fechaFin` | string · null | Fecha de fin (null = abierta) |
| `descripcion` | string · null | Motivo de la cita |
| `estado` | `"Pendiente"` · `"En curso"` · `"Completada"` · `"Cancelada"` | Estado |
| `notas` | string · null | Observaciones |
| `clienteKey` | string · null | Referencia al cliente |
| `cocheKey` | string · null | Referencia al vehículo |
| `vehiculoTemp` | object · null | Datos de vehículo sin cliente registrado |

### users → calendarSecret

Token UUID privado del usuario. Identifica su feed iCal en `/calendarExports/{secret}`.

### calendarExports → {secret}

Contenido del feed `.ics` generado y actualizado automáticamente por el cliente. Lectura pública (URL secreta), escritura solo autenticada.

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
    },
    "calendarExports": {
      "$secret": {
        ".read": true,
        ".write": "auth != null"
      }
    }
  }
}
```

---

## Despliegue

### 1. Clona el repositorio

```bash
git clone https://github.com/juanjimpad/GarajeOS.git
cd GarajeOS
```

### 2. Configura Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Activa **Realtime Database** (región `europe-west1`) y **Authentication** (email/contraseña y Google)
3. Copia `js/firebase.example.js` → `js/firebase.js` y rellena tus credenciales
4. Aplica las reglas de seguridad: `firebase deploy --only database`
5. En **Authentication → Settings → Dominios autorizados**, añade tu dominio

### 3. Despliega en Cloudflare Pages

1. Conecta el repositorio en [Cloudflare Pages](https://pages.cloudflare.com/)
2. Configura los secretos de Firebase como variables de entorno en el build
3. Rama de producción: `main` · Rama de preview: `dev`
4. El `_worker.js` se despliega automáticamente junto con los assets estáticos

---

## Apoya el proyecto

Si esta aplicación te resulta útil, considera invitarme a un café ☕

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/juanjimpad)

---

## Licencia

Software de uso **comercial**. Todos los derechos reservados. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

---

> Desarrollado con la asistencia de [Claude](https://claude.ai) (Anthropic) · 2026
