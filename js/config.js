// Marcas y modelos en Europa (1976-2026)
export const CAR_BRANDS = {
  'SEAT': ['600', '850', '124', '127', '128', '131', '132', '133', '1200 Sport', 'Málaga', 'Marbella', 'Ibiza', 'León', 'Arosa', 'Córdoba', 'Toledo', 'Alhambra', 'Exeo', 'Mii', 'Altea', 'Ateca', 'Tarraco', 'Arona'],
  'Volkswagen': ['Escarabajo', 'Golf I', 'Golf II', 'Golf III', 'Golf IV', 'Golf V', 'Golf VI', 'Golf VII', 'Golf VIII', 'Polo I', 'Polo II', 'Polo III', 'Polo', 'Passat B1', 'Passat B2', 'Passat B3', 'Passat', 'Jetta', 'Scirocco', 'Corrado', 'Vento', 'Bora', 'Touran', 'Tiguan', 'Touareg', 'Sharan', 'Caddy', 'T-Roc', 'T-Cross', 'ID.3', 'ID.4'],
  'Renault': ['4', '5', '6', '7', '9', '11', '12', '14', '18', '19', '20', '21', '25', 'Alpine A110', 'Fuego', 'Express', 'Rapid', 'Clio', 'Mégane', 'Laguna', 'Kangoo', 'Scénic', 'Twingo', 'Espace', 'Modus', 'Captur', 'Kadjar', 'Koleos', 'Zoe', 'Austral'],
  'Ford': ['Escort', 'Taunus', 'Sierra', 'Orion', 'Mondeo', 'Fiesta', 'Focus', 'Ka', 'Galaxy', 'C-Max', 'S-Max', 'Kuga', 'EcoSport', 'Puma', 'Edge', 'Mustang', 'Ranger', 'Probe', 'Cougar', 'Maverick'],
  'Peugeot': ['104', '204', '304', '305', '309', '404', '504', '505', '106', '107', '108', '205', '206', '207', '208', '306', '307', '308', '405', '406', '407', '508', '2008', '3008', '5008', 'Partner', '604'],
  'Opel': ['Kadett', 'Ascona', 'Manta', 'Rekord', 'Senator', 'Agila', 'Corsa', 'Astra', 'Vectra', 'Omega', 'Zafira', 'Meriva', 'Antara', 'Insignia', 'Mokka', 'Crossland', 'Grandland', 'Combo', 'Calibra', 'Frontera', 'Sintra'],
  'Citroën': ['2CV', 'Dyane', 'Méhari', 'GS', 'CX', 'BX', 'ZX', 'Visa', 'AX', 'Saxo', 'Xantia', 'Xsara', 'C1', 'C2', 'C3', 'C4', 'C5', 'C3 Aircross', 'C4 Cactus', 'C5 Aircross', 'Berlingo', 'Xsara Picasso', 'C15', 'SM'],
  'Nissan': ['Sunny', 'Bluebird', 'Cherry', 'Prairie', 'Micra', 'Almera', 'Primera', 'X-Trail', 'Qashqai', 'Juke', 'Leaf', 'Navara', 'Pulsar', 'Note', 'Patrol', 'Terrano'],
  'Toyota': ['Starlet', 'Corolla', 'Celica', 'Carina', 'Camry', 'Yaris', 'Avensis', 'RAV4', 'Land Cruiser', 'Prius', 'Aygo', 'Auris', 'C-HR', 'Verso', 'GR Yaris', 'MR2', 'Supra', 'HiLux'],
  'Hyundai': ['Pony', 'Stellar', 'Sonata', 'Lantra', 'i10', 'i20', 'i30', 'i40', 'Accent', 'Elantra', 'Tucson', 'Santa Fe', 'Getz', 'Ioniq', 'Kona', 'Coupe'],
  'Kia': ['Pride', 'Sephia', 'Shuma', 'Picanto', 'Rio', 'Ceed', 'Pro Ceed', 'Sportage', 'Sorento', 'Stonic', 'Niro', 'EV6', 'Soul', 'Carnival'],
  'Dacia': ['Logan', 'Sandero', 'Duster', 'Lodgy', 'Dokker', 'Spring', 'Jogger'],
  'Fiat': ['127', '128', '131', '132', 'Ritmo', 'Regata', 'Uno', 'Tempra', 'X1/9', 'Barchetta', 'Coupé', 'Punto', 'Grande Punto', 'Seicento', 'Panda', 'Bravo', 'Brava', 'Stilo', '500', '500X', '500L', 'Tipo', 'Doblo', 'Multipla'],
  'BMW': ['Serie 02', '316', '318', '320', '323', '325', '328', '330', '335', 'Serie 1', 'Serie 2', 'Serie 3', 'Serie 4', 'Serie 5', 'Serie 6', 'Serie 7', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'Z3', 'Z4', 'M3', 'M5', 'M6'],
  'Mercedes-Benz': ['W123', 'W124', 'W126', 'W201 190E', 'W202', 'W203', 'W210', 'W211', 'Clase A', 'Clase B', 'Clase C', 'Clase E', 'Clase S', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLK', 'Vito', 'Sprinter', 'SL', 'SLK', 'CLK'],
  'Audi': ['80', '90', '100', 'Quattro', 'Coupé', 'Cabriolet', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'S3', 'S4', 'RS4'],
  'Honda': ['Accord', 'Civic', 'Prelude', 'Legend', 'Jazz', 'CR-V', 'HR-V', 'Insight', 'e', 'CRX', 'Integra', 'NSX'],
  'Mazda': ['323', '626', '929', 'MX-5', 'RX-7', 'RX-8', '2', '3', '5', '6', 'CX-3', 'CX-5', 'CX-30', 'CX-60', 'MPV', 'Tribute'],
  'Skoda': ['Favorit', 'Felicia', 'Fabia', 'Octavia', 'Superb', 'Yeti', 'Karoq', 'Kodiaq', 'Scala', 'Kamiq', 'Enyaq'],
  'Suzuki': ['Alto', 'Swift', 'Samurai', 'Vitara', 'Grand Vitara', 'Baleno', 'Ignis', 'SX4', 'S-Cross', 'Jimny', 'Wagon R', 'Splash'],
  'Mitsubishi': ['Colt', 'Lancer', 'Galant', 'Sigma', 'Eclipse', 'Carisma', 'Space Star', 'Outlander', 'Eclipse Cross', 'ASX', 'Pajero', 'L200', 'Space Runner', 'Space Wagon'],
  'Volvo': ['240', '340', '360', '440', '460', '480', '740', '760', '850', 'S40', 'S60', 'S70', 'S80', 'S90', 'V40', 'V50', 'V60', 'V70', 'V90', 'XC40', 'XC60', 'XC70', 'XC90', 'C30', 'C70'],
  'Alfa Romeo': ['Alfetta', 'Giulia', 'Spider', 'GTV', 'GTV6', '33', '75', '90', '145', '146', '147', '155', '156', '159', '164', '166', 'Brera', 'MiTo', 'Giulia', 'Giulietta', 'Stelvio', 'Tonale'],
  'Mini': ['Mini Clásico', 'One', 'Cooper', 'Cooper S', 'Clubman', 'Countryman', 'Paceman', 'Cabrio'],
  'Lancia': ['Beta', 'Gamma', 'Delta', 'Thema', 'Dedra', 'Kappa', 'Fulvia', 'Stratos', 'Y', 'Musa', 'Ypsilon'],
  'Subaru': ['Leone', 'Justy', 'XT', 'Legacy', 'Impreza', 'Outback', 'Forester', 'XV', 'Levorg', 'BRZ'],
  'Jeep': ['CJ', 'Cherokee', 'Grand Cherokee', 'Wrangler', 'Renegade', 'Compass', 'Avenger', 'Comanche'],
  'Land Rover': ['Series III', 'Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Freelander'],
  'Porsche': ['924', '928', '944', '968', '911', 'Boxster', 'Cayenne', 'Cayman', 'Panamera', 'Macan', 'Taycan'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y'],
  'Cupra': ['Ateca', 'Born', 'Formentor', 'Leon', 'Terramar'],
  'MG': ['MGB', 'Midget', 'ZR', 'ZS', 'ZT', 'HS', 'Marvel R', '4', '5'],
  'DS': ['3', '3 Crossback', '4', '4 Crossback', '7 Crossback'],
  'Smart': ['Fortwo', 'Forfour', '#1', '#3'],
  'Lexus': ['CT', 'IS', 'GS', 'LS', 'RX', 'NX', 'UX', 'SC'],
  'Daewoo': ['Nexia', 'Lanos', 'Nubira', 'Matiz', 'Kalos', 'Espero'],
  'Chevrolet': ['Spark', 'Aveo', 'Cruze', 'Captiva', 'Orlando', 'Corvette', 'Camaro'],
  'Saab': ['900', '9000', '9-3', '9-5'],
  'BYD': ['Atto 3', 'Han', 'Seal', 'Dolphin', 'Tang'],
  // Marcas históricas con vehículos aún en circulación
  'Chrysler': ['Horizon', '150', '2 Litros', 'Sunbeam', 'Avenger'],
  'Talbot': ['Horizon', 'Samba', 'Solara', 'Tagora'],
  'Simca': ['1000', '1100', '1200', '1307', '1308', 'Matra Rancho'],
  'Austin': ['Mini', 'Allegro', 'Maestro', 'Montego', 'Metro', 'Rover 200', 'Rover 400'],
  'Rover': ['200', '214', '216', '220', '400', '414', '416', '420', '600', '800', '25', '45', '75'],
  'Triumph': ['TR7', 'Dolomite', 'Spitfire', 'Stag', 'Acclaim'],
  'Trabant': ['601', '1.1'],
  'Wartburg': ['353', '1.3'],
  'Yugo': ['45', '55', '65', 'Florida'],
  'FSO': ['Polonez', 'Fiat 126p'],
  'Desconocido': ['Desconocido'],
};

export const BRAND_NAMES = Object.keys(CAR_BRANDS).sort();

// Marcas y modelos de moto más vendidos en España (1994-2024)
export const MOTO_BRANDS = {
  'Aprilia': ['RS 125', 'RS 660', 'RSV4', 'Tuono 125', 'Tuono 660', 'Tuono V4', 'Dorsoduro 750', 'Dorsoduro 900', 'Shiver 750', 'Shiver 900', 'Caponord 1200', 'SR 50', 'SR 125', 'SR GT 125', 'SR GT 200', 'Scarabeo 125', 'AF1 125', 'Pegaso 600', 'Pegaso 650', 'Pegaso 655', 'Red Rose 125', 'Climber 280', 'ETX 125', 'ETX 350'],
  'Benelli': ['TNT 125', 'TNT 135', 'TNT 300', 'Leoncino 250', 'Leoncino 500', 'TRK 251', 'TRK 502', 'TRK 702', '502C', 'Imperiale 400', '752S', '354 Sport', '250 2C', 'Sei 750', '900 SEI'],
  'Beta': ['RR 125', 'RR 200', 'RR 250', 'RR 300', 'RR 350', 'RR 390', 'RR 430', 'RR 480', 'X-Trainer 250', 'X-Trainer 300', 'ALP 125', 'ALP 200', 'ALP 350', 'TR 34', 'TR 35'],
  'BMW Motorrad': ['G 310 R', 'G 310 GS', 'F 750 GS', 'F 800 GS', 'F 850 GS', 'F 900 R', 'F 900 XR', 'R 1200 GS', 'R 1250 GS', 'R 1250 RT', 'R 1250 RS', 'R 1250 R', 'R nineT', 'R nineT Scrambler', 'R nineT Pure', 'S 1000 RR', 'S 1000 R', 'S 1000 XR', 'C 400 X', 'C 400 GT', 'C 650 GT', 'K 1600 GT', 'M 1000 RR', 'R 60/6', 'R 60/7', 'R 65', 'R 75/6', 'R 75/7', 'R 80', 'R 80 G/S', 'R 80 GS', 'R 80 RT', 'R 90/6', 'R 90 S', 'R 100', 'R 100 RS', 'R 100 RT', 'R 100 GS', 'R 100 R', 'K 75', 'K 75 S', 'K 75 C', 'K 75 RT', 'K 100', 'K 100 RS', 'K 100 RT', 'K 100 LT', 'K 1100 LT', 'K 1100 RS', 'K 1200 RS', 'K 1200 LT', 'K 1200 GT', 'K 1200 S', 'K 1200 R', 'R 850 R', 'R 850 GS', 'R 1100 GS', 'R 1100 R', 'R 1100 RS', 'R 1100 RT', 'R 1150 GS', 'R 1150 R', 'R 1150 RT', 'R 1200 C', 'R 1200 RT', 'F 650 GS', 'F 800 ST', 'F 800 R'],
  'Bultaco': ['Metralla 125', 'Metralla 200', 'Metralla 250', 'Alpina 250', 'Alpina 350', 'Pursang 125', 'Pursang 250', 'Pursang 360', 'Sherpa T 250', 'Sherpa T 350', 'Lobito 100', 'Lobito 125', 'Matador 250', 'Matador 350', 'Frontera 250', 'Frontera 360', 'Astro 250', 'Streaker 125', 'TSS 50', 'TSS 125'],
  'CFMOTO': ['150NK', '300NK', '400NK', '650NK', '650MT', '650GT', '700CL-X', '800MT', '800NK', '1000MT'],
  'Derbi': ['GPR 50', 'GPR 125', 'Senda 50', 'Senda 125', 'Rambla 125', 'Rambla 300', 'Mulhacen 125', 'Mulhacen 659', 'Variant 50', 'Antorcha 49', 'Fenix 50', 'Laguna 50', 'Cross 50', 'TT 50'],
  'Ducati': ['Monster 797', 'Monster 821', 'Monster 937', 'Monster 1200', 'Panigale V2', 'Panigale V4', 'Scrambler Icon', 'Scrambler Desert Sled', 'Scrambler 1100', 'Multistrada 950', 'Multistrada V2', 'Multistrada V4', 'Diavel 1260', 'Diavel V4', 'SuperSport 939', 'Hypermotard 939', 'Hypermotard 950', 'DesertX', 'XDiavel', '750 GT', '860 GT', '860 GTS', '900 SS', '900 SD Darmah', '900 MHR', '750 F1', 'Paso 750', 'Paso 906', '851', '888', '916', '748', '996', '998', '999', 'Monster 600', 'Monster 750', 'Monster 900', 'ST2', 'ST4', 'Supersport 900', '400 SS', '600 SS'],
  'Gas Gas': ['EC 125', 'EC 250', 'EC 300', 'EC 350F', 'EX 250F', 'EX 350F', 'ES 700', 'SM 700', 'TT 50', 'TT 125', 'TT 250', 'WJ 50', 'MC 125', 'MC 250', 'MC 300'],
  'Harley-Davidson': ['Iron 883', 'Forty-Eight', 'Sportster S', 'Fat Bob 114', 'Fat Boy 114', 'Softail Standard', 'Street Bob 114', 'Heritage Classic', 'Deluxe', 'Road King', 'Street Glide', 'Road Glide', 'Ultra Limited', 'Pan America 1250', 'Nightster', 'Sportster 883', 'Sportster 1200', 'FXST Softail', 'FLST Heritage Softail', 'FXRS Low Glide', 'FXRT Sport Glide', 'FLHTC Electra Glide', 'FLHS Electra Glide Sport', 'FXR Super Glide', 'FXLR Low Rider Custom', 'FLSTF Fat Boy', 'Dyna Wide Glide', 'Dyna Low Rider', 'Dyna Super Glide', 'VRSCA V-Rod', 'VRSCF V-Rod Muscle'],
  'Honda': ['CBR125R', 'CBR250R', 'CBR500R', 'CBR600RR', 'CBR650R', 'CBR1000RR Fireblade', 'CB125R', 'CB300R', 'CB500F', 'CB500X', 'CB650R', 'CB1000R', 'NC750X', 'NC750S', 'Africa Twin CRF1000L', 'Africa Twin CRF1100L', 'Transalp XL750', 'Hornet CB750', 'X-ADV 750', 'Forza 125', 'Forza 350', 'Forza 750', 'PCX 125', 'SH 125', 'SH 350', 'Vision 110', 'VFR800F', 'Varadero XL1000V', 'Integra 750', 'CB 125 S', 'CB 125 T', 'CB 200', 'CB 250', 'CB 400', 'CB 400 Four', 'CB 550', 'CB 650', 'CB 750', 'CB 750 K', 'CB 750 F', 'CB 900 F', 'CB 1000', 'CB 1100', 'CG 125', 'CD 125', 'CX 500', 'CX 650', 'GL 1000 Gold Wing', 'GL 1100 Gold Wing', 'GL 1200 Gold Wing', 'GL 1500 Gold Wing', 'GL 1800 Gold Wing', 'XL 125', 'XL 185', 'XL 250', 'XL 350', 'XL 500', 'XL 600', 'XR 250', 'XR 350', 'XR 500', 'XR 600', 'MB 5', 'MB 50', 'MTX 50', 'MTX 80', 'MTX 125', 'NS 125', 'NS 400', 'NTV 650', 'PC 800 Pacific Coast', 'ST 1100 Pan European', 'ST 1300 Pan European', 'VFR 400', 'VFR 750', 'VF 500', 'VF 750', 'VF 1000', 'VT 600 Shadow', 'VT 750 Shadow', 'VT 1100 Shadow', 'VTR 1000 Firestorm', 'CBR 900 RR Fireblade', 'CBR 400 RR', 'CBR 600 F', 'CBF 600', 'CBF 1000', 'Hornet 600', 'Hornet 900', 'Transalp XL600V', 'Transalp XL650V', 'Transalp XL700V'],
  'Husqvarna': ['Vitpilen 125', 'Vitpilen 401', 'Svartpilen 125', 'Svartpilen 401', 'Norden 901', 'TE 150', 'TE 250', 'TE 300', 'FE 250', 'FE 350', 'FE 450', 'FE 501', 'WR 125', 'WR 250', 'WR 360', 'WR 400', 'TE 350', 'TE 410', 'TE 450', 'SM 125', 'SM 450', 'SM 610', 'TC 250', 'TC 450'],
  'Indian': ['Scout', 'Scout Bobber', 'Scout Rogue', 'Chief', 'Chief Bobber', 'Chieftain', 'Springfield', 'Roadmaster', 'FTR 1200', 'Pursuit'],
  'Kawasaki': ['Ninja 125', 'Ninja 400', 'Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Ninja ZX-14R', 'Ninja H2', 'Z125', 'Z400', 'Z650', 'Z750', 'Z800', 'Z900', 'Z1000', 'Versys 300', 'Versys 650', 'Versys 1000', 'Vulcan S', 'Vulcan 900', 'W800', 'ER-6n', 'ER-6f', 'KH 250', 'KH 400', 'KH 500', 'Z 400', 'Z 500', 'Z 550', 'Z 650', 'Z 750', 'Z 900', 'Z 1000', 'Z 1300', 'GPZ 550', 'GPZ 750', 'GPZ 900 R', 'GPZ 1000 RX', 'GPX 750 R', 'ZXR 400', 'ZXR 750', 'ZZR 600', 'ZZR 1100', 'ZZR 1200', 'ZX-7R', 'ZX-9R', 'ZX-12R', 'KLR 250', 'KLR 600', 'KLR 650', 'KDX 125', 'KDX 200', 'KDX 250', 'KMX 125', 'EN 500', 'VN 800 Vulcan', 'VN 1500 Vulcan', 'VN 2000 Vulcan', 'W 650', 'ZR-7', 'EX 500'],
  'KTM': ['Duke 125', 'Duke 200', 'Duke 250', 'Duke 390', 'Duke 790', 'Duke 890', 'Duke 990', '1290 Super Duke R', '1290 Super Duke GT', 'RC 125', 'RC 390', 'Adventure 390', 'Adventure 790', 'Adventure 890', 'Adventure 990', 'Adventure 1290', 'SMC-R 690', '890 SMT', '50 SX', '65 SX', '85 SX', '125 SX', '200 EXC', '250 EXC', '300 EXC', '350 EXC-F', '400 EXC', '450 EXC', '500 EXC', '520 EXC', '620 Duke', '640 Duke', '640 Adventure', '640 LC4', '690 Duke', '690 SMC', '990 Adventure', '990 Super Duke'],
  'Kymco': ['Agility 50', 'Agility 125', 'Agility 150', 'Like 125', 'Like 150', 'People S 125', 'People S 300', 'Xciting 300', 'Xciting 400', 'Xciting S 400', 'Downtown 125', 'Downtown 300', 'AK 550'],
  'Montesa': ['Cota 247', 'Cota 348', 'Cota 349', 'Cota 350', 'Cota 4RT 260', 'Cota 4RT 301', 'Cappra 125 VA', 'Cappra 250 VA', 'Cappra 360 VA', 'Enduro 250 H7', 'Enduro 360 H7', 'Impala 175', 'Impala 250'],
  'Moto Guzzi': ['V7 Stone', 'V7 Special', 'V7 Racer', 'V9 Bobber', 'V9 Roamer', 'V85 TT', 'V100 Mandello', 'Breva 750', 'California 1400', 'Audace 1400', 'Norge 1200', 'V35', 'V50', 'V65', 'V75', 'V1000', '850 Le Mans', '850 T3', '850 T5', '1000 SP', '1000 Le Mans', 'California II', 'California III', 'California EV', 'Quota 1000', 'Quota 1100', 'Breva 850', 'Breva 1100', 'Norge 850', 'Stelvio 1200', 'Griso 850', 'Griso 1100'],
  'MV Agusta': ['F3 675', 'F3 800', 'F4', 'Brutale 800', 'Brutale 1000', 'Turismo Veloce 800', 'Dragster 800', 'Superveloce 800', 'Rush 1000', '750 GT', '750 S', '750 America', '750 Sport'],
  'OSSA': ['MAR 250', 'MAR 350', 'Desert Wasp 250', 'Enduro 250', 'Enduro 350', 'Copa 125', 'Copa 250', 'TR 80', 'TR 125', 'Phantom 250'],
  'Piaggio': ['Beverly 125', 'Beverly 300', 'Beverly 350', 'Beverly 400', 'MP3 300', 'MP3 400', 'MP3 530', 'Medley 125', 'Liberty 50', 'Liberty 125', 'Zip 50', 'Zip 125', 'Vespa 50 N', 'Vespa 50 Special', 'Ciao 50', 'Bravo 50', 'Si 50', 'Typhoon 50', 'Typhoon 125', 'X8 125', 'X8 200', 'X9 125', 'X9 200', 'X9 250', 'X9 500'],
  'Peugeot': ['Django 50', 'Django 125', 'Tweet 50', 'Tweet 125', 'Citystar 125', 'Citystar 200', 'Metropolis 400', '103 SP', '104 SP', 'Speedfight 50', 'Speedfight 100', 'Speedfight 125', 'Elyseo 50', 'Elyseo 125', 'Elyseo 150', 'Elyseo 250', 'Elystar 50', 'Elystar 125', 'Looxor 50', 'Looxor 125', 'Vivacity 50', 'Vivacity 125', 'Satelis 125', 'Satelis 250', 'Satelis 500'],
  'Puch': ['Maxi 50', 'Monza 50', 'VS 50', 'DS 50', 'Dakota 50', 'Ranger 50', 'MC 50', 'GS 50 F', 'X30 50'],
  'Rieju': ['RS3 50', 'RS3 125', 'MRT 50', 'MRT 125', 'Century 125', 'Century 300', 'Century 500', 'Tango 125', 'Nuuk 125', 'RR 50', 'RR 125', 'SMX 50', 'SMX 125', 'MRX 50', 'MRX 125', 'Marathon 125', 'Marathon 500'],
  'Royal Enfield': ['Classic 350', 'Classic 500', 'Meteor 350', 'Bullet 350', 'Himalayan 411', 'Interceptor 650', 'Continental GT 650', 'Scram 411', 'Hunter 350', 'Super Meteor 650', 'Bullet 500', 'Thunderbird 350', 'Thunderbird 500'],
  'Sanglas': ['400 E', '400 F', '400 Y', '500 S', '500 SII', 'Yamaha-Sanglas 400'],
  'Sherco': ['SE 125', 'SE 250', 'SE 300', 'SE 450', 'SEF 250', 'SEF 300', 'SEF 450', 'SEF 500'],
  'Suzuki': ['GSX-R125', 'GSX-R600', 'GSX-R750', 'GSX-R1000', 'GSX-S125', 'GSX-S750', 'GSX-S950', 'GSX-S1000', 'GSX-8S', 'V-Strom 250', 'V-Strom 650', 'V-Strom 800', 'V-Strom 1000', 'V-Strom 1050', 'SV650', 'SV1000', 'Bandit 600', 'Bandit 1250', 'Burgman 125', 'Burgman 400', 'Burgman 650', 'Hayabusa', 'Intruder 125', 'GT 125', 'GT 185', 'GT 250', 'GT 380', 'GT 500', 'GT 550', 'GT 750', 'GS 400', 'GS 425', 'GS 450', 'GS 500', 'GS 550', 'GS 750', 'GS 850', 'GS 1000', 'GS 1100', 'GSX 750', 'GSX 1100', 'GSX 1100 F Katana', 'RG 125', 'RG 250', 'RG 500', 'GN 125', 'GN 250', 'DR 125', 'DR 200', 'DR 350', 'DR 600', 'DR 650', 'DR 750', 'DR 800 Big', 'TS 100', 'TS 125', 'TS 185', 'TS 250', 'EN 125', 'GSF 600 Bandit', 'GSF 1200 Bandit', 'RF 600', 'RF 900', 'TL 1000 S', 'TL 1000 R', 'XF 650 Freewind', 'DL 650 V-Strom', 'DL 1000 V-Strom', 'VL 125 Intruder', 'VS 600 Intruder', 'VS 750 Intruder', 'VS 800 Intruder', 'VS 1400 Intruder'],
  'SYM': ['Fiddle 50', 'Fiddle 125', 'Jet 4 50', 'Jet 4 125', 'Symphony 125', 'Joymax 250', 'Joymax Z 300', 'Joymax Z 125', 'Cruisym 300', 'Maxsym 400', 'Maxsym TL 508'],
  'Triumph': ['Street Triple 660', 'Street Triple 765', 'Speed Triple 1050', 'Speed Triple 1200', 'Tiger 660', 'Tiger 800', 'Tiger 900', 'Tiger 1200', 'Trident 660', 'Bonneville T100', 'Bonneville T120', 'Bonneville Bobber', 'Thruxton 1200', 'Scrambler 1200', 'Rocket 3', 'Speed Twin 900', 'Speed Twin 1200', 'Daytona 675', 'Bonneville 790', 'Tiger 955i', 'Daytona 955i', 'Speed Triple 955', 'Sprint ST 955', 'Sprint RS 955', 'Trophy 900', 'Trophy 1200', 'Thunderbird 900', 'Thunderbird 1200'],
  'Vespa': ['Primavera 50', 'Primavera 125', 'Primavera 150', 'Sprint 50', 'Sprint 125', 'Sprint 150', 'GTS 125', 'GTS 150', 'GTS 300', 'GTV 300', 'LX 50', 'LX 125', 'GTS Super 300', 'Elettrica', 'PX 80', 'PX 100', 'PX 125', 'PX 150', 'PX 200', 'PK 50', 'PK 80', 'PK 125', 'P 200 E', 'T5 125', 'ET2 50', 'ET4 125', 'ET4 150', 'GT 125', 'GT 200', 'GTL 125', 'GTL 200', 'GTV 125', 'S 50', 'S 125', 'S 150'],
  'Voge': ['300R', '300AC', '525R', '500R', '500DS', '500DSX', '650DS', '650DSX', '300RR'],
  'Yamaha': ['YZF-R1', 'YZF-R6', 'YZF-R3', 'YZF-R125', 'MT-07', 'MT-09', 'MT-10', 'MT-03', 'MT-125', 'Tracer 7', 'Tracer 9', 'Ténéré 700', 'Super Ténéré 1200', 'XSR700', 'XSR900', 'XSR125', 'TMAX 500', 'TMAX 530', 'TMAX 560', 'XMAX 125', 'XMAX 300', 'NMAX 125', 'Aerox 50', 'Aerox 155', 'FZ6', 'FZ1', 'FJR1300', 'TDM 900', 'RD 125', 'RD 200', 'RD 250', 'RD 350', 'RD 400', 'RD 500', 'XS 400', 'XS 500', 'XS 650', 'XS 750', 'XS 850', 'XS 1100', 'SR 125', 'SR 250', 'SR 500', 'DT 50', 'DT 80', 'DT 125', 'DT 175', 'DT 200', 'DT 250', 'IT 175', 'IT 250', 'IT 400', 'TY 50', 'TY 80', 'TY 125', 'TY 175', 'TY 250', 'XT 125', 'XT 250', 'XT 350', 'XT 500', 'XT 550', 'XT 600', 'XT 660', 'XTZ 660 Ténéré', 'XTZ 750 Super Ténéré', 'XTZ 1200 Super Ténéré', 'TZR 50', 'TZR 125', 'TZR 250', 'RZ 350', 'FZ 750', 'FZR 400', 'FZR 600', 'FZR 750', 'FZR 1000', 'FJ 600', 'FJ 1100', 'FJ 1200', 'V-Max 1200', 'V-Max 1700', 'XVS 125 Drag Star', 'XVS 650 Drag Star', 'XVS 1100 Drag Star', 'XV 535 Virago', 'XV 750 Virago', 'XV 1000 Virago', 'XV 1100 Virago', 'TDM 850', 'YZF 600 R Thundercat', 'YZF 750 R', 'YZF 1000 R Thunderace', 'BW\'S 50', 'Aerox 50 (1997)', 'Majesty 125', 'Majesty 250', 'Majesty 400', 'X-City 125', 'X-City 250', 'X-City 500', 'X-Max 125', 'X-Max 250'],
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

export const APP_VERSION = 'BUILD_VERSION';

// Hash del commit, inyectado por Vite en build (define). Vacío si se sirve sin bundler.
export const COMMIT_HASH = typeof __COMMIT_HASH__ !== 'undefined' ? __COMMIT_HASH__ : '';

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
