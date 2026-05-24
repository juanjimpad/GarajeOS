const translations = {
  es: {
    // App
    'app.subtitle': 'Gestión de taller mecánico',

    // Nav tabs
    'nav.agenda':   'Agenda',
    'nav.clientes': 'Clientes',
    'nav.coches':   'Coches',
    'nav.facturas': 'Facturas',

    // Auth
    'auth.email':        'Correo electrónico',
    'auth.password':     'Contraseña',
    'auth.login':        'Iniciar sesión',
    'auth.google':       'Continuar con Google',
    'auth.logout':       'Cerrar sesión',
    'auth.err.email':       'El correo no es válido.',
    'auth.err.not_found':   'No existe cuenta con ese correo.',
    'auth.err.password':    'Contraseña incorrecta.',
    'auth.err.too_many':    'Demasiados intentos. Inténtalo más tarde.',
    'auth.err.network':     'Error de red. Comprueba tu conexión.',
    'auth.err.credential':  'Correo o contraseña incorrectos.',
    'auth.err.generic':     'Error al iniciar sesión.',

    // Buttons
    'btn.save':    'Guardar',
    'btn.cancel':  'Cancelar',
    'btn.close':   'Cerrar',
    'btn.delete':  'Eliminar',
    'btn.edit':    'Editar',
    'btn.add':     'Añadir',
    'btn.back':    'Volver',

    // Search
    'search.clients':  'Buscar cliente...',
    'search.vehicles': 'Matrícula, marca...',

    // Calendar
    'cal.months': 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre',
    'cal.days':   'Lun,Mar,Mié,Jue,Vie,Sáb,Dom',
    'cal.add':    '+ Cita',

    // Cita statuses (stored in DB — do not change values)
    'status.pendiente':  'Pendiente',
    'status.en_curso':   'En curso',
    'status.completada': 'Completada',
    'status.cancelada':  'Cancelada',

    // Client modal
    'modal.cliente.new':   'Nuevo cliente',
    'modal.cliente.edit':  'Editar cliente',
    'modal.cliente.nombre':    'Nombre *',
    'modal.cliente.telefono':  'Teléfono',
    'modal.cliente.email':     'Email',
    'modal.cliente.nif':       'NIF / DNI',
    'modal.cliente.direccion': 'Dirección',
    'modal.cliente.notas':     'Notas',
    'modal.cliente.ph.nombre':    'Nombre completo',
    'modal.cliente.ph.telefono':  'Ej: 612 345 678',
    'modal.cliente.ph.email':     'correo@ejemplo.com',
    'modal.cliente.ph.nif':       '12345678A',
    'modal.cliente.ph.direccion': 'Calle, número, ciudad',
    'modal.cliente.ph.notas':     'Observaciones...',
    'modal.cliente.err.nombre':   'El nombre es obligatorio',

    // Vehicle modal
    'modal.coche.new':  'Nuevo vehículo',
    'modal.coche.edit': 'Editar vehículo',
    'modal.coche.tipo':       'Tipo',
    'modal.coche.matricula':  'Matrícula',
    'modal.coche.marca':      'Marca *',
    'modal.coche.modelo':     'Modelo',
    'modal.coche.año':        'Año',
    'modal.coche.color':      'Color',
    'modal.coche.combustible':'Combustible',
    'modal.coche.kms':        'Kilometraje inicial',
    'modal.coche.bastidor':   'Bastidor (VIN)',
    'modal.coche.notas':      'Notas',
    'modal.coche.ph.matricula': 'Ej: 1234 ABC',
    'modal.coche.ph.marca':     'Buscar marca...',
    'modal.coche.ph.modelo':    'Buscar modelo...',
    'modal.coche.ph.año':       'Ej: 2018',
    'modal.coche.ph.color':     'Ej: Blanco',
    'modal.coche.ph.kms':       'Ej: 85000',
    'modal.coche.ph.bastidor':  '17 caracteres',
    'modal.coche.err.marca':    'La marca es obligatoria',

    // Invoice modal
    'modal.factura.new':  'Nueva factura',
    'modal.factura.edit': 'Editar factura',
    'modal.factura.numero':        'Número de factura',
    'modal.factura.fecha':         'Fecha entrada',
    'modal.factura.fecha_cierre':  'Fecha cierre',
    'modal.factura.concepto':      'Concepto *',
    'modal.factura.kms':           'Kilometraje',
    'modal.factura.estado':        'Estado',
    'modal.factura.mano_obra':     'Mano de obra',
    'modal.factura.piezas':        'Piezas',
    'modal.factura.add_pieza':     '+ Añadir pieza',
    'modal.factura.iva':           'Aplicar IVA (21%)',
    'modal.factura.subtotal':      'Subtotal',
    'modal.factura.total':         'Total',
    'modal.factura.pago':          'Método de pago',
    'modal.factura.notas':         'Notas',
    'modal.factura.ph.concepto':   'Descripción del trabajo realizado',
    'modal.factura.ph.kms':        'Ej: 85000',
    'modal.factura.ph.notas':      'Observaciones...',
    'modal.factura.ph.pieza':      'Nombre de la pieza',
    'modal.factura.ph.cantidad':   'Ud.',
    'modal.factura.ph.precio':     '€/ud.',
    'modal.factura.err.concepto':  'El concepto es obligatorio',

    // Cita modal
    'modal.cita.new':  'Nueva cita',
    'modal.cita.edit': 'Editar cita',
    'modal.cita.fecha_inicio':   'Fecha entrada *',
    'modal.cita.fecha_fin':      'Fecha salida',
    'modal.cita.descripcion':    'Descripción',
    'modal.cita.estado':         'Estado',
    'modal.cita.cliente':        'Cliente',
    'modal.cita.vehiculo':       'Vehículo',
    'modal.cita.btn.cliente':    '+ Cliente',
    'modal.cita.btn.vehiculo':   '+ Vehículo',
    'modal.cita.btn.ver_ficha':  'Ver ficha →',
    'modal.cita.btn.ver_factura':'Ver factura →',
    'modal.cita.btn.nueva_factura': '+ Nueva factura',
    'modal.cita.ph.cliente':     'Buscar cliente...',
    'modal.cita.ph.descripcion': 'Revisión, cambio aceite, frenos...',
    'modal.cita.label.nuevo_cliente': 'Nombre *',
    'modal.cita.ph.nuevo_cliente': 'Nombre del cliente',
    'modal.cita.ph.nuevo_cliente_tel': '612 345 678',
    'modal.cita.completar_vehiculo': 'Completa los datos del vehículo',
    'modal.cita.sin_vehiculos':  'Sin vehículos registrados',
    'modal.cita.factura_pagada': 'Factura cerrada y pagada — esta cita es de solo lectura',
    'modal.cita.err.fecha':      'La fecha de entrada es obligatoria',
    'modal.cita.err.cliente':    'Selecciona un cliente primero',

    // Confirm dialogs
    'confirm.delete_cliente':  '¿Eliminar este cliente y todos sus vehículos y facturas?',
    'confirm.delete_coche':    '¿Eliminar este vehículo y todas sus facturas?',
    'confirm.delete_factura':  '¿Eliminar esta factura?',
    'confirm.delete_cita':     '¿Eliminar esta cita?',

    // Detail – client
    'detail.cliente.sin_nombre':   'Sin nombre',
    'detail.cliente.telefono':     'Teléfono',
    'detail.cliente.email':        'Email',
    'detail.cliente.direccion':    'Dirección',
    'detail.cliente.nif':          'NIF/DNI',
    'detail.cliente.notas':        'Notas',
    'detail.cliente.vehiculos':    'Vehículos',
    'detail.cliente.add_vehiculo': '+ Añadir vehículo',
    'detail.cliente.sin_vehiculos':'Este cliente no tiene vehículos registrados.',
    'detail.cliente.facturas':     'Facturas',

    // Detail – vehicle
    'detail.coche.sin_matricula':  'Sin matrícula',
    'detail.coche.año':            'Año',
    'detail.coche.color':          'Color',
    'detail.coche.combustible':    'Combustible',
    'detail.coche.kms':            'Kilometraje',
    'detail.coche.bastidor':       'Bastidor (VIN)',
    'detail.coche.notas':          'Notas',
    'detail.coche.facturas':       'Facturas',
    'detail.coche.add_factura':    '+ Nueva factura',
    'detail.coche.sin_facturas':   'Sin facturas registradas.',
    'detail.coche.historial_kms':  'Historial de kilometraje',
    'detail.coche.kms_iniciales':  'Kilometraje inicial',
    'detail.coche.kms_actuales':   'km actuales',
    'detail.coche.enlaces':        'Enlaces de interés',

    // Detail – invoice
    'detail.factura.mano_obra':    'Mano de obra:',
    'detail.factura.piezas':       'pieza/s',
    'detail.factura.iva':          '+IVA 21%',
    'detail.factura.sin_concepto': 'Sin concepto',

    // Sidebar lists
    'list.sin_resultados':      'Sin resultados',
    'list.facturas.pendientes': 'Pendientes',
    'list.facturas.cerradas':   'Pagadas / Canceladas',
    'list.facturas.sin':        'Sin facturas registradas',

    // Links
    'link.dgt.label': 'Consulta DGT',
    'link.dgt.desc':  'Datos oficiales del vehículo (requiere Cl@ve)',
    'link.carfax.label': 'Historial Carfax',
    'link.carfax.desc':  'Historial de accidentes y propietarios anteriores',
    'link.autodoc.label': 'Piezas en Autodoc',
    'link.autodoc.desc':  'Buscar recambios por marca y modelo',
    'link.youtube.label': 'Tutoriales en YouTube',
    'link.youtube.desc':  'Vídeos de reparación y mantenimiento',
    'link.google.label':  'Buscar en Google',
    'link.google.desc':   'Búsqueda general del vehículo',

    // About
    'about.title':   'Acerca de GarajeOS',
    'about.version': 'Versión 1.0 · 2026',
    'about.desc':    'Gestión integral de taller mecánico.<br>Clientes, vehículos y facturas en un solo lugar, sincronizados en la nube.',

    // Footer
    'footer.light': 'Tema claro',
    'footer.dark':  'Tema oscuro',
    'footer.auto':  'Automático',
    'footer.about': 'Acerca de',
    'footer.copy':  'GarajeOS · 2026',

    // Nav
    'nav.back.clientes': 'Clientes',
  },

  en: {
    // App
    'app.subtitle': 'Mechanic workshop management',

    // Nav tabs
    'nav.agenda':   'Agenda',
    'nav.clientes': 'Clients',
    'nav.coches':   'Vehicles',
    'nav.facturas': 'Invoices',

    // Auth
    'auth.email':    'Email address',
    'auth.password': 'Password',
    'auth.login':    'Sign in',
    'auth.google':   'Continue with Google',
    'auth.logout':   'Sign out',
    'auth.err.email':      'The email address is not valid.',
    'auth.err.not_found':  'No account found with that email.',
    'auth.err.password':   'Incorrect password.',
    'auth.err.too_many':   'Too many attempts. Please try again later.',
    'auth.err.network':    'Network error. Check your connection.',
    'auth.err.credential': 'Incorrect email or password.',
    'auth.err.generic':    'Sign-in error.',

    // Buttons
    'btn.save':    'Save',
    'btn.cancel':  'Cancel',
    'btn.close':   'Close',
    'btn.delete':  'Delete',
    'btn.edit':    'Edit',
    'btn.add':     'Add',
    'btn.back':    'Back',

    // Search
    'search.clients':  'Search client...',
    'search.vehicles': 'Plate, brand...',

    // Calendar
    'cal.months': 'January,February,March,April,May,June,July,August,September,October,November,December',
    'cal.days':   'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
    'cal.add':    '+ Appointment',

    // Cita statuses
    'status.pendiente':  'Pending',
    'status.en_curso':   'In progress',
    'status.completada': 'Completed',
    'status.cancelada':  'Cancelled',

    // Client modal
    'modal.cliente.new':   'New client',
    'modal.cliente.edit':  'Edit client',
    'modal.cliente.nombre':    'Name *',
    'modal.cliente.telefono':  'Phone',
    'modal.cliente.email':     'Email',
    'modal.cliente.nif':       'Tax ID',
    'modal.cliente.direccion': 'Address',
    'modal.cliente.notas':     'Notes',
    'modal.cliente.ph.nombre':    'Full name',
    'modal.cliente.ph.telefono':  'e.g. +44 7700 900000',
    'modal.cliente.ph.email':     'email@example.com',
    'modal.cliente.ph.nif':       'Tax ID number',
    'modal.cliente.ph.direccion': 'Street, number, city',
    'modal.cliente.ph.notas':     'Observations...',
    'modal.cliente.err.nombre':   'Name is required',

    // Vehicle modal
    'modal.coche.new':  'New vehicle',
    'modal.coche.edit': 'Edit vehicle',
    'modal.coche.tipo':       'Type',
    'modal.coche.matricula':  'Plate',
    'modal.coche.marca':      'Brand *',
    'modal.coche.modelo':     'Model',
    'modal.coche.año':        'Year',
    'modal.coche.color':      'Color',
    'modal.coche.combustible':'Fuel',
    'modal.coche.kms':        'Initial mileage',
    'modal.coche.bastidor':   'VIN',
    'modal.coche.notas':      'Notes',
    'modal.coche.ph.matricula': 'e.g. AB12 CDE',
    'modal.coche.ph.marca':     'Search brand...',
    'modal.coche.ph.modelo':    'Search model...',
    'modal.coche.ph.año':       'e.g. 2018',
    'modal.coche.ph.color':     'e.g. White',
    'modal.coche.ph.kms':       'e.g. 85000',
    'modal.coche.ph.bastidor':  '17 characters',
    'modal.coche.err.marca':    'Brand is required',

    // Invoice modal
    'modal.factura.new':  'New invoice',
    'modal.factura.edit': 'Edit invoice',
    'modal.factura.numero':        'Invoice number',
    'modal.factura.fecha':         'Entry date',
    'modal.factura.fecha_cierre':  'Closing date',
    'modal.factura.concepto':      'Concept *',
    'modal.factura.kms':           'Mileage',
    'modal.factura.estado':        'Status',
    'modal.factura.mano_obra':     'Labour',
    'modal.factura.piezas':        'Parts',
    'modal.factura.add_pieza':     '+ Add part',
    'modal.factura.iva':           'Apply VAT (21%)',
    'modal.factura.subtotal':      'Subtotal',
    'modal.factura.total':         'Total',
    'modal.factura.pago':          'Payment method',
    'modal.factura.notas':         'Notes',
    'modal.factura.ph.concepto':   'Description of work carried out',
    'modal.factura.ph.kms':        'e.g. 85000',
    'modal.factura.ph.notas':      'Observations...',
    'modal.factura.ph.pieza':      'Part name',
    'modal.factura.ph.cantidad':   'Qty.',
    'modal.factura.ph.precio':     '€/unit',
    'modal.factura.err.concepto':  'Concept is required',

    // Cita modal
    'modal.cita.new':  'New appointment',
    'modal.cita.edit': 'Edit appointment',
    'modal.cita.fecha_inicio':   'Entry date *',
    'modal.cita.fecha_fin':      'Exit date',
    'modal.cita.descripcion':    'Description',
    'modal.cita.estado':         'Status',
    'modal.cita.cliente':        'Client',
    'modal.cita.vehiculo':       'Vehicle',
    'modal.cita.btn.cliente':    '+ Client',
    'modal.cita.btn.vehiculo':   '+ Vehicle',
    'modal.cita.btn.ver_ficha':  'View vehicle →',
    'modal.cita.btn.ver_factura':'View invoice →',
    'modal.cita.btn.nueva_factura': '+ New invoice',
    'modal.cita.ph.cliente':     'Search client...',
    'modal.cita.ph.descripcion': 'Service, oil change, brakes...',
    'modal.cita.label.nuevo_cliente': 'Name *',
    'modal.cita.ph.nuevo_cliente': 'Client name',
    'modal.cita.ph.nuevo_cliente_tel': '+44 7700 900000',
    'modal.cita.completar_vehiculo': 'Complete vehicle details',
    'modal.cita.sin_vehiculos':  'No vehicles registered',
    'modal.cita.factura_pagada': 'Invoice closed and paid — this appointment is read-only',
    'modal.cita.err.fecha':      'Entry date is required',
    'modal.cita.err.cliente':    'Please select a client first',

    // Confirm dialogs
    'confirm.delete_cliente':  'Delete this client and all their vehicles and invoices?',
    'confirm.delete_coche':    'Delete this vehicle and all its invoices?',
    'confirm.delete_factura':  'Delete this invoice?',
    'confirm.delete_cita':     'Delete this appointment?',

    // Detail – client
    'detail.cliente.sin_nombre':   'No name',
    'detail.cliente.telefono':     'Phone',
    'detail.cliente.email':        'Email',
    'detail.cliente.direccion':    'Address',
    'detail.cliente.nif':          'Tax ID',
    'detail.cliente.notas':        'Notes',
    'detail.cliente.vehiculos':    'Vehicles',
    'detail.cliente.add_vehiculo': '+ Add vehicle',
    'detail.cliente.sin_vehiculos':'This client has no registered vehicles.',
    'detail.cliente.facturas':     'Invoices',

    // Detail – vehicle
    'detail.coche.sin_matricula':  'No plate',
    'detail.coche.año':            'Year',
    'detail.coche.color':          'Color',
    'detail.coche.combustible':    'Fuel',
    'detail.coche.kms':            'Mileage',
    'detail.coche.bastidor':       'VIN',
    'detail.coche.notas':          'Notes',
    'detail.coche.facturas':       'Invoices',
    'detail.coche.add_factura':    '+ New invoice',
    'detail.coche.sin_facturas':   'No invoices registered.',
    'detail.coche.historial_kms':  'Mileage history',
    'detail.coche.kms_iniciales':  'Initial mileage',
    'detail.coche.kms_actuales':   'current km',
    'detail.coche.enlaces':        'Useful links',

    // Detail – invoice
    'detail.factura.mano_obra':    'Labour:',
    'detail.factura.piezas':       'part(s)',
    'detail.factura.iva':          '+VAT 21%',
    'detail.factura.sin_concepto': 'No concept',

    // Sidebar lists
    'list.sin_resultados':      'No results',
    'list.facturas.pendientes': 'Pending',
    'list.facturas.cerradas':   'Paid / Cancelled',
    'list.facturas.sin':        'No invoices registered',

    // Links
    'link.dgt.label': 'DGT Query',
    'link.dgt.desc':  'Official vehicle data (requires Cl@ve)',
    'link.carfax.label': 'Carfax History',
    'link.carfax.desc':  'Accident history and previous owners',
    'link.autodoc.label': 'Parts on Autodoc',
    'link.autodoc.desc':  'Search spare parts by brand and model',
    'link.youtube.label': 'YouTube Tutorials',
    'link.youtube.desc':  'Repair and maintenance videos',
    'link.google.label':  'Search on Google',
    'link.google.desc':   'General vehicle search',

    // About
    'about.title':   'About GarajeOS',
    'about.version': 'Version 1.0 · 2026',
    'about.desc':    'Complete mechanic workshop management.<br>Clients, vehicles and invoices in one place, synced to the cloud.',

    // Footer
    'footer.light': 'Light theme',
    'footer.dark':  'Dark theme',
    'footer.auto':  'Auto',
    'footer.about': 'About',
    'footer.copy':  'GarajeOS · 2026',

    // Nav
    'nav.back.clientes': 'Clients',
  },
};

let currentLang = localStorage.getItem('garajeos_lang') || 'es';

export function t(key) {
  return translations[currentLang]?.[key] ?? translations.es[key] ?? key;
}

export function setLang(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('garajeos_lang', lang);
}

export function getLang() {
  return currentLang;
}

export const LANGS = ['es', 'en'];
