// Marcas y modelos más vendidos en España (1994-2024)
export const CAR_BRANDS = {
  'SEAT': ['Ibiza', 'León', 'Arosa', 'Córdoba', 'Toledo', 'Alhambra', 'Exeo', 'Mii', 'Altea', 'Ateca', 'Tarraco', 'Arona'],
  'Volkswagen': ['Polo', 'Golf', 'Passat', 'Tiguan', 'Touareg', 'Bora', 'Touran', 'Sharan', 'Caddy', 'T-Roc', 'T-Cross', 'ID.3', 'ID.4'],
  'Renault': ['Clio', 'Mégane', 'Laguna', 'Kangoo', 'Scénic', 'Twingo', 'Espace', 'Modus', 'Captur', 'Kadjar', 'Koleos', 'Zoe', 'Austral'],
  'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Ka', 'Galaxy', 'C-Max', 'S-Max', 'Kuga', 'EcoSport', 'Puma', 'Edge', 'Mustang', 'Ranger'],
  'Peugeot': ['106', '107', '108', '206', '207', '208', '306', '307', '308', '406', '407', '508', '2008', '3008', '5008', 'Partner'],
  'Opel': ['Agila', 'Corsa', 'Astra', 'Vectra', 'Omega', 'Zafira', 'Meriva', 'Antara', 'Insignia', 'Mokka', 'Crossland', 'Grandland', 'Combo'],
  'Citroën': ['AX', 'Saxo', 'C1', 'C2', 'C3', 'C4', 'C5', 'C3 Aircross', 'C4 Cactus', 'C5 Aircross', 'Berlingo', 'Xsara', 'Xsara Picasso'],
  'Nissan': ['Micra', 'Almera', 'Primera', 'X-Trail', 'Qashqai', 'Juke', 'Leaf', 'Navara', 'Pulsar', 'Note'],
  'Toyota': ['Yaris', 'Corolla', 'Avensis', 'RAV4', 'Land Cruiser', 'Prius', 'Aygo', 'Auris', 'C-HR', 'Verso', 'GR Yaris'],
  'Hyundai': ['i10', 'i20', 'i30', 'i40', 'Accent', 'Elantra', 'Tucson', 'Santa Fe', 'Getz', 'Ioniq', 'Kona'],
  'Kia': ['Picanto', 'Rio', 'Ceed', 'Pro Ceed', 'Sportage', 'Sorento', 'Stonic', 'Niro', 'EV6', 'Soul'],
  'Dacia': ['Logan', 'Sandero', 'Duster', 'Lodgy', 'Dokker', 'Spring', 'Jogger'],
  'Fiat': ['Punto', 'Grande Punto', 'Seicento', 'Panda', 'Bravo', 'Brava', 'Stilo', '500', '500X', '500L', 'Tipo', 'Doblo'],
  'BMW': ['Serie 1', 'Serie 2', 'Serie 3', 'Serie 4', 'Serie 5', 'Serie 6', 'Serie 7', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'Z4', 'M3', 'M5'],
  'Mercedes-Benz': ['Clase A', 'Clase B', 'Clase C', 'Clase E', 'Clase S', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLK', 'Vito', 'Sprinter'],
  'Audi': ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8'],
  'Honda': ['Civic', 'Accord', 'Jazz', 'CR-V', 'HR-V', 'Insight', 'e'],
  'Mazda': ['2', '3', '5', '6', '323', '626', 'MX-5', 'CX-3', 'CX-5', 'CX-30', 'CX-60', 'RX-8'],
  'Skoda': ['Fabia', 'Octavia', 'Superb', 'Yeti', 'Karoq', 'Kodiaq', 'Scala', 'Kamiq', 'Enyaq'],
  'Suzuki': ['Alto', 'Ignis', 'Swift', 'Baleno', 'Vitara', 'Grand Vitara', 'SX4', 'S-Cross', 'Jimny'],
  'Mitsubishi': ['Colt', 'Carisma', 'Galant', 'Space Star', 'Outlander', 'Eclipse Cross', 'ASX', 'Pajero', 'L200'],
  'Volvo': ['S40', 'S60', 'S80', 'S90', 'V40', 'V50', 'V60', 'V70', 'V90', 'XC40', 'XC60', 'XC90', 'C30'],
  'Alfa Romeo': ['145', '146', '147', '155', '156', '159', '164', '166', 'Brera', 'MiTo', 'Giulia', 'Giulietta', 'Stelvio', 'Tonale'],
  'Mini': ['One', 'Cooper', 'Cooper S', 'Clubman', 'Countryman', 'Paceman', 'Cabrio'],
  'Lancia': ['Y', 'Delta', 'Musa', 'Ypsilon'],
  'Subaru': ['Impreza', 'Legacy', 'Outback', 'Forester', 'XV', 'Levorg'],
  'Jeep': ['Cherokee', 'Grand Cherokee', 'Wrangler', 'Renegade', 'Compass', 'Avenger'],
  'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Freelander'],
  'Porsche': ['911', 'Boxster', 'Cayenne', 'Cayman', 'Panamera', 'Macan', 'Taycan'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y'],
  'Cupra': ['Ateca', 'Born', 'Formentor', 'Leon', 'Terramar'],
  'MG': ['ZS', 'HS', 'Marvel R', '4', '5'],
  'DS': ['3', '3 Crossback', '4', '4 Crossback', '7 Crossback'],
  'Smart': ['Fortwo', 'Forfour', '#1', '#3'],
  'Lexus': ['CT', 'IS', 'GS', 'LS', 'RX', 'NX', 'UX'],
  'Daewoo': ['Nexia', 'Lanos', 'Nubira', 'Matiz', 'Kalos'],
  'Chevrolet': ['Spark', 'Aveo', 'Cruze', 'Captiva', 'Orlando'],
  'Saab': ['9-3', '9-5'],
  'BYD': ['Atto 3', 'Han', 'Seal', 'Dolphin', 'Tang'],
  'Desconocido': ['Desconocido'],
};

export const BRAND_NAMES = Object.keys(CAR_BRANDS).sort();

// Marcas y modelos de moto más vendidos en España (1994-2024)
export const MOTO_BRANDS = {
  'Aprilia': ['RS 125', 'RS 660', 'RSV4', 'Tuono 125', 'Tuono 660', 'Tuono V4', 'Dorsoduro 750', 'Dorsoduro 900', 'Shiver 750', 'Shiver 900', 'Caponord 1200', 'SR 50', 'SR 125', 'SR GT 125', 'SR GT 200', 'Scarabeo 125'],
  'Benelli': ['TNT 125', 'TNT 135', 'TNT 300', 'Leoncino 250', 'Leoncino 500', 'TRK 251', 'TRK 502', 'TRK 702', '502C', 'Imperiale 400', '752S'],
  'Beta': ['RR 125', 'RR 200', 'RR 250', 'RR 300', 'RR 350', 'RR 390', 'RR 430', 'RR 480', 'X-Trainer 250', 'X-Trainer 300'],
  'BMW Motorrad': ['G 310 R', 'G 310 GS', 'F 750 GS', 'F 800 GS', 'F 850 GS', 'F 900 R', 'F 900 XR', 'R 1200 GS', 'R 1250 GS', 'R 1250 RT', 'R 1250 RS', 'R 1250 R', 'R nineT', 'R nineT Scrambler', 'R nineT Pure', 'S 1000 RR', 'S 1000 R', 'S 1000 XR', 'C 400 X', 'C 400 GT', 'C 650 GT', 'K 1600 GT', 'M 1000 RR'],
  'CFMOTO': ['150NK', '300NK', '400NK', '650NK', '650MT', '650GT', '700CL-X', '800MT', '800NK', '1000MT'],
  'Derbi': ['GPR 50', 'GPR 125', 'Senda 50', 'Senda 125', 'Rambla 125', 'Rambla 300', 'Mulhacen 125', 'Mulhacen 659'],
  'Ducati': ['Monster 797', 'Monster 821', 'Monster 937', 'Monster 1200', 'Panigale V2', 'Panigale V4', 'Scrambler Icon', 'Scrambler Desert Sled', 'Scrambler 1100', 'Multistrada 950', 'Multistrada V2', 'Multistrada V4', 'Diavel 1260', 'Diavel V4', 'SuperSport 939', 'Hypermotard 939', 'Hypermotard 950', 'DesertX', 'XDiavel'],
  'Gas Gas': ['EC 125', 'EC 250', 'EC 300', 'EC 350F', 'EX 250F', 'EX 350F', 'ES 700', 'SM 700'],
  'Harley-Davidson': ['Iron 883', 'Forty-Eight', 'Sportster S', 'Fat Bob 114', 'Fat Boy 114', 'Softail Standard', 'Street Bob 114', 'Heritage Classic', 'Deluxe', 'Road King', 'Street Glide', 'Road Glide', 'Ultra Limited', 'Pan America 1250', 'Nightster'],
  'Honda': ['CBR125R', 'CBR250R', 'CBR500R', 'CBR600RR', 'CBR650R', 'CBR1000RR Fireblade', 'CB125R', 'CB300R', 'CB500F', 'CB500X', 'CB650R', 'CB1000R', 'NC750X', 'NC750S', 'Africa Twin CRF1000L', 'Africa Twin CRF1100L', 'Transalp XL750', 'Hornet CB750', 'X-ADV 750', 'Forza 125', 'Forza 350', 'Forza 750', 'PCX 125', 'SH 125', 'SH 350', 'Vision 110', 'VFR800F', 'Varadero XL1000V', 'Integra 750'],
  'Husqvarna': ['Vitpilen 125', 'Vitpilen 401', 'Svartpilen 125', 'Svartpilen 401', 'Norden 901', 'TE 150', 'TE 250', 'TE 300', 'FE 250', 'FE 350', 'FE 450', 'FE 501'],
  'Indian': ['Scout', 'Scout Bobber', 'Scout Rogue', 'Chief', 'Chief Bobber', 'Chieftain', 'Springfield', 'Roadmaster', 'FTR 1200', 'Pursuit'],
  'Kawasaki': ['Ninja 125', 'Ninja 400', 'Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Ninja ZX-14R', 'Ninja H2', 'Z125', 'Z400', 'Z650', 'Z750', 'Z800', 'Z900', 'Z1000', 'Versys 300', 'Versys 650', 'Versys 1000', 'Vulcan S', 'Vulcan 900', 'W800', 'ER-6n', 'ER-6f'],
  'Kymco': ['Agility 50', 'Agility 125', 'Agility 150', 'Like 125', 'Like 150', 'People S 125', 'People S 300', 'Xciting 300', 'Xciting 400', 'Xciting S 400', 'Downtown 125', 'Downtown 300', 'AK 550'],
  'Moto Guzzi': ['V7 Stone', 'V7 Special', 'V7 Racer', 'V9 Bobber', 'V9 Roamer', 'V85 TT', 'V100 Mandello', 'Breva 750', 'California 1400', 'Audace 1400', 'Norge 1200'],
  'MV Agusta': ['F3 675', 'F3 800', 'F4', 'Brutale 800', 'Brutale 1000', 'Turismo Veloce 800', 'Dragster 800', 'Superveloce 800', 'Rush 1000'],
  'Piaggio': ['Beverly 125', 'Beverly 300', 'Beverly 350', 'Beverly 400', 'MP3 300', 'MP3 400', 'MP3 530', 'Medley 125', 'Liberty 50', 'Liberty 125', 'Zip 50', 'Zip 125'],
  'KTM': ['Duke 125', 'Duke 200', 'Duke 250', 'Duke 390', 'Duke 790', 'Duke 890', 'Duke 990', '1290 Super Duke R', '1290 Super Duke GT', 'RC 125', 'RC 390', 'Adventure 390', 'Adventure 790', 'Adventure 890', 'Adventure 990', 'Adventure 1290', 'SMC-R 690', '890 SMT'],
  'Peugeot': ['Django 50', 'Django 125', 'Tweet 50', 'Tweet 125', 'Citystar 125', 'Citystar 200', 'Metropolis 400'],
  'Rieju': ['RS3 50', 'RS3 125', 'MRT 50', 'MRT 125', 'Century 125', 'Century 300', 'Century 500', 'Tango 125', 'Nuuk 125'],
  'Royal Enfield': ['Classic 350', 'Classic 500', 'Meteor 350', 'Bullet 350', 'Himalayan 411', 'Interceptor 650', 'Continental GT 650', 'Scram 411', 'Hunter 350', 'Super Meteor 650'],
  'Sherco': ['SE 125', 'SE 250', 'SE 300', 'SE 450', 'SEF 250', 'SEF 300', 'SEF 450', 'SEF 500'],
  'Suzuki': ['GSX-R125', 'GSX-R600', 'GSX-R750', 'GSX-R1000', 'GSX-S125', 'GSX-S750', 'GSX-S950', 'GSX-S1000', 'GSX-8S', 'V-Strom 250', 'V-Strom 650', 'V-Strom 800', 'V-Strom 1000', 'V-Strom 1050', 'SV650', 'SV1000', 'Bandit 600', 'Bandit 1250', 'Burgman 125', 'Burgman 400', 'Burgman 650', 'Hayabusa', 'Intruder 125'],
  'SYM': ['Fiddle 50', 'Fiddle 125', 'Jet 4 50', 'Jet 4 125', 'Symphony 125', 'Joymax 250', 'Joymax Z 300', 'Joymax Z 125', 'Cruisym 300', 'Maxsym 400', 'Maxsym TL 508'],
  'Triumph': ['Street Triple 660', 'Street Triple 765', 'Speed Triple 1050', 'Speed Triple 1200', 'Tiger 660', 'Tiger 800', 'Tiger 900', 'Tiger 1200', 'Trident 660', 'Bonneville T100', 'Bonneville T120', 'Bonneville Bobber', 'Thruxton 1200', 'Scrambler 1200', 'Rocket 3', 'Speed Twin 900', 'Speed Twin 1200', 'Daytona 675'],
  'Vespa': ['Primavera 50', 'Primavera 125', 'Primavera 150', 'Sprint 50', 'Sprint 125', 'Sprint 150', 'GTS 125', 'GTS 150', 'GTS 300', 'GTV 300', 'LX 50', 'LX 125', 'GTS Super 300', 'Elettrica'],
  'Voge': ['300R', '300AC', '525R', '500R', '500DS', '500DSX', '650DS', '650DSX', '300RR'],
  'Yamaha': ['YZF-R1', 'YZF-R6', 'YZF-R3', 'YZF-R125', 'MT-07', 'MT-09', 'MT-10', 'MT-03', 'MT-125', 'Tracer 7', 'Tracer 9', 'Ténéré 700', 'Super Ténéré 1200', 'XSR700', 'XSR900', 'XSR125', 'TMAX 500', 'TMAX 530', 'TMAX 560', 'XMAX 125', 'XMAX 300', 'NMAX 125', 'Aerox 50', 'Aerox 155', 'FZ6', 'FZ1', 'FJR1300', 'TDM 900'],
  'Desconocido': ['Desconocido'],
};

export const MOTO_BRAND_NAMES = Object.keys(MOTO_BRANDS).sort();

export const VEHICLE_TYPES = ['Coche', 'Moto'];

export const FUEL_TYPES = ['Gasolina', 'Diésel', 'Híbrido', 'Híbrido enchufable', 'Eléctrico', 'GLP', 'GNC'];

export const FACTURA_ESTADOS = ['Pendiente', 'Pagada', 'Cancelada'];

export const PAYMENT_METHODS = ['Efectivo', 'Tarjeta', 'Bizum'];

export const ESTADO_BADGE_CLASS = { Pendiente: 'badge-warning', Pagada: 'badge-success', Cancelada: 'badge-danger' };
export const ESTADO_AVATAR_CLASS = { Pendiente: 'avatar-warning', Pagada: 'avatar-success', Cancelada: 'avatar-danger' };
export const METODO_PAGO_ICON = { Efectivo: '💵', Tarjeta: '💳', Bizum: '📱' };

export const IVA = 0.21;

export const PIEZAS_COMUNES = [
  // Aceites y fluidos
  'Aceite de motor 5W30', 'Aceite de motor 5W40', 'Aceite de motor 10W40', 'Aceite de caja de cambios',
  'Líquido de frenos DOT4', 'Líquido refrigerante', 'Líquido dirección asistida', 'Líquido limpiaparabrisas',
  // Filtros
  'Filtro de aceite', 'Filtro de aire', 'Filtro de habitáculo', 'Filtro de combustible', 'Filtro de partículas (DPF)',
  // Frenos
  'Pastillas de freno delanteras', 'Pastillas de freno traseras', 'Discos de freno delanteros', 'Discos de freno traseros',
  'Zapatas de freno', 'Cilindro de freno', 'Latiguillos de freno', 'Bomba de freno',
  // Suspensión y dirección
  'Amortiguador delantero', 'Amortiguador trasero', 'Muelle de suspensión', 'Rótula de dirección',
  'Barra estabilizadora', 'Silent block', 'Bieleta estabilizadora', 'Cremallera de dirección',
  // Motor
  'Correa de distribución', 'Kit de distribución', 'Tensor de distribución', 'Bomba de agua',
  'Correa auxiliar', 'Bujías', 'Bobina de encendido', 'Inyector', 'Bomba de combustible',
  'Termostato', 'Junta de culata', 'Culata', 'Árbol de levas', 'Cadena de distribución',
  // Embrague y transmisión
  'Kit de embrague', 'Disco de embrague', 'Plato de presión', 'Rodamiento de empuje',
  'Junta homocinética', 'Palier', 'Caja de cambios',
  // Electricidad
  'Batería', 'Alternador', 'Motor de arranque', 'Sensor de oxígeno (lambda)',
  'Sensor de temperatura', 'Sensor ABS', 'Centralita', 'Relé',
  // Escape
  'Catalizador', 'Silenciador', 'Tubo de escape', 'Junta de escape', 'Sonda lambda',
  // Neumáticos y ruedas
  'Neumático', 'Llanta', 'Válvula de rueda', 'Equilibrado', 'Alineación',
  // Carrocería y cristales
  'Parabrisas', 'Luna trasera', 'Retrovisor', 'Bombilla delantera', 'Bombilla trasera',
  'Kit de xenón', 'Faro delantero', 'Piloto trasero',
  // Mantenimiento general
  'Revisión completa', 'Mano de obra adicional', 'Desplazamiento', 'Diagnóstico OBD',
].sort();
