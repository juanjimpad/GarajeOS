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
};

export const BRAND_NAMES = Object.keys(CAR_BRANDS).sort();

export const FUEL_TYPES = ['Gasolina', 'Diésel', 'Híbrido', 'Híbrido enchufable', 'Eléctrico', 'GLP', 'GNC'];

export const FACTURA_ESTADOS = ['Pendiente', 'Pagada', 'Cancelada'];

export const PAYMENT_METHODS = ['Efectivo', 'Tarjeta', 'Bizum'];
