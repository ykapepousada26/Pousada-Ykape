import { Room, MenuItem, Review, GalleryItem, Coupon, Reservation } from '../types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'quarto-01',
    name: 'Quarto 01 - Suíte Master Premium (A mais bela)',
    type: 'comfort',
    capacity: 4,
    pricePerNight: 450,
    description: 'A mais bela acomodação da pousada. Espaçosa e com decoração diferenciada para momentos especiais.',
    hasAirConditioning: true,
    amenities: [
      '1 Cama de Casal',
      '2 Camas de Solteiro',
      'Ar Condicionado Split',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi de Alta Performance',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/1HEzaDt2ybkqugG9ItAi8p9LshGbv2Mfc',
      'https://lh3.googleusercontent.com/d/1J-TBLZ0akTcYK-qw2jrlaAa3ud96MaOo',
      'https://lh3.googleusercontent.com/d/1JVA1yyj72XBTfKe3Nm_ri9ikZ_HN1GyM'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1UI7CqQF9kR5B2MLWjKVk8lOdssCftH1v'
  },
  {
    id: 'quarto-02',
    name: 'Quarto 02 - Suíte Standard Vista Mar e Piscina',
    type: 'standard',
    capacity: 3,
    pricePerNight: 320,
    description: 'Linda vista para o mar e para a piscina. Acomodação arejada com ventilação natural.',
    hasAirConditioning: false,
    amenities: [
      '1 Cama de Casal',
      '1 Cama de Solteiro',
      'Ventilador (Não é de teto)',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi de Alta Performance',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/1i5Xso-ZfugHOYce28gq7HX-4Imos3Nja',
      'https://lh3.googleusercontent.com/d/10jXKaAJbJzM1MPra9lWNV07b3Eqg0IWA'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '13r6-D6w8MHcCZu-JHiG32QUOmLDuje8O'
  },
  {
    id: 'quarto-03',
    name: 'Quarto 03 - Suíte Standard Frente Mar',
    type: 'standard',
    capacity: 3,
    pricePerNight: 350,
    description: 'Localização privilegiada de frente para o mar, aproveitando a brisa marinha constante.',
    hasAirConditioning: false,
    amenities: [
      '1 Cama de Casal',
      '1 Cama de Solteiro',
      'Ventilador (Não é de teto)',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/15XNxCdXyPzOyBylIwl55IVugpn_G0Guh',
      'https://lh3.googleusercontent.com/d/1kI0VITgmEVOxHr_H4cXcveDrO4mW_bqh'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1HCRXGni7TvSs5JPOZDmlqTaNWSSR5X-B'
  },
  {
    id: 'quarto-04',
    name: 'Quarto 04 - Suíte Standard Vista Mar',
    type: 'standard',
    capacity: 3,
    pricePerNight: 0,
    description: 'Acomodação com vista frontal para o mar, ideal para quem busca tranquilidade e proximidade com a praia.',
    hasAirConditioning: false,
    amenities: [
      '1 Cama de Casal',
      '1 Cama de Solteiro',
      'Ventilador (Não é de teto)',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/1q3awevY9IoJyMvk7WomXrJ0Rpi-8awE5',
      'https://lh3.googleusercontent.com/d/1TGhJX2qjPD9gtyYz9B4fsBGkumHT1n8X'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1nwukiDNDLRQ6uT8QRTwR5pUGFET9zm8W'
  },
  {
    id: 'quarto-05',
    name: 'Quarto 05 - Suíte Standard Conforto',
    type: 'standard',
    capacity: 3,
    pricePerNight: 0,
    description: 'Suíte aconchegante e funcional, ideal para pequenas famílias ou grupos de amigos.',
    hasAirConditioning: false,
    amenities: [
      '1 Cama de Casal',
      '1 Cama de Solteiro',
      'Ventilador (Não é de teto)',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      '/src/assets/images/suite_master_vista_mar_1782829944355.jpg',
      'https://lh3.googleusercontent.com/d/1F-j0srbjt5Zqeuzz5AXsafKQs_0TSxKk'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1lhex1Ee5BR4-9FfK0M5HgMXdxaxRm7Sd'
  },
  {
    id: 'quarto-06',
    name: 'Quarto 06 - Suíte Standard Praticidade',
    type: 'standard',
    capacity: 3,
    pricePerNight: 0,
    description: 'Acomodação prática e bem localizada dentro da pousada.',
    hasAirConditioning: false,
    amenities: [
      '1 Cama de Casal',
      '1 Cama de Solteiro',
      'Ventilador (Não é de teto)',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/1nRY6G9ehEybJOSAZx7MjEoJ9JE49F-iP',
      'https://lh3.googleusercontent.com/d/1ozFcwTYb6FckWpiDyseZ7pCumeWQ7OKC'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '15WsYJ1fn376J0R17TnPU0Wot_Ooz9Gkl'
  },
  {
    id: 'quarto-07',
    name: 'Quarto 07 - Suíte Standard Ampla',
    type: 'standard',
    capacity: 3,
    pricePerNight: 0,
    description: 'Quarto com excelente espaço interno, garantindo maior conforto para os hóspedes.',
    hasAirConditioning: false,
    amenities: [
      '1 Cama de Casal',
      '1 Cama de Solteiro',
      'Ventilador (Não é de teto)',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/1qmKwQBOEj1RDLitoQlTaizqxiDNgrzcs',
      'https://lh3.googleusercontent.com/d/16radEASvoiNWQ-npSui4qUEh56q1SeNz'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1PmxBSuZIAPiDs1yDa0BBNC9leFk-Yrlo'
  },
  {
    id: 'quarto-08',
    name: 'Quarto 08 - Suíte Comfort Vista Jardim',
    type: 'comfort',
    capacity: 5,
    pricePerNight: 0,
    description: 'Suíte climatizada com bela vista para o jardim interno da pousada.',
    hasAirConditioning: true,
    amenities: [
      '1 Cama de Casal',
      '1 Beliche',
      '1 Cama de Solteiro',
      'Ar Condicionado',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/1XcLQp6LIaJANIt2nbPUbI9iFDPOwjIth',
      'https://lh3.googleusercontent.com/d/1sxNSk8W7rfEzM-Lf7WfHonvKyqNjlqLz'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '154OkG0T0v7k_r83pgwJuRvV-RTTeZq0q'
  },
  {
    id: 'quarto-09',
    name: 'Quarto 09 - Suíte Standard Ampla Casal',
    type: 'standard',
    capacity: 2,
    pricePerNight: 0,
    description: 'Acomodação ampla ideal para casais que buscam espaço e conforto.',
    hasAirConditioning: false,
    amenities: [
      'Cama de Casal',
      'Ventilador (Não é de teto)',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/16GnsVT2douRQzoyPXTLUFnpegKAoBAfO',
      'https://lh3.googleusercontent.com/d/1x58SOJjvOW4vLaeZQiEvKmnn4SYxkI4S'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1jXon0aPYi3YrmM5TXgpywJ6oxR_9V7P7'
  },
  {
    id: 'quarto-10',
    name: 'Quarto 10 - Suíte Comfort Família',
    type: 'comfort',
    capacity: 5,
    pricePerNight: 0,
    description: 'Suíte climatizada preparada para acomodar confortavelmente toda a família.',
    hasAirConditioning: true,
    amenities: [
      '1 Cama de Casal',
      '1 Beliche',
      '1 Cama de Solteiro',
      'Ar Condicionado',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/1yseperIJN3JI9XgIzcf0c83MBOQa5gnG',
      'https://lh3.googleusercontent.com/d/1e3atCtLx9A5UubmhnfqHeyMMEmU2PzeL'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1kPPKXUAZ2O39m2EssLcFrIw1aDXLF7eq'
  },
  {
    id: 'quarto-11',
    name: 'Quarto 11 - Suíte Dupla (A Maior)',
    type: 'comfort',
    capacity: 3,
    pricePerNight: 0,
    description: 'Nossa maior acomodação! Suíte dupla com vista para o mar e muito espaço.',
    hasAirConditioning: true,
    amenities: [
      '1 Cama de Casal',
      '1 Cama de Solteiro',
      'Ar Condicionado',
      'Guarda-roupa Amplo',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Vista para o Mar',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/1ZjAW2tpheEbtmynXvosF_6DwA9dpjeTK',
      'https://lh3.googleusercontent.com/d/176OXzP79dlWERjkPH5Mk1t7sZ585jO7N'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1Dnoc2GEYbCdChSvuNSeNYVa4gX8g48_0'
  },
  {
    id: 'quarto-12',
    name: 'Quarto 12 - Suíte Comfort Casal',
    type: 'comfort',
    capacity: 2,
    pricePerNight: 0,
    description: 'Suíte climatizada aconchegante para casais.',
    hasAirConditioning: true,
    amenities: [
      '1 Cama de Casal',
      'Ar Condicionado',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      '/src/assets/images/suite_standard_familia_quarto_12_1782830051643.jpg',
      'https://lh3.googleusercontent.com/d/1eao_E_6H-VjDYH8cTUCP6Qb6kzr-BvQV'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1uF97voMiWyE6I3R2E0iY3sfbqUMyPR8l'
  },
  {
    id: 'quarto-13',
    name: 'Quarto 13 - Suíte Superior Vista Mar',
    type: 'comfort',
    capacity: 2,
    pricePerNight: 0,
    description: 'Suíte no piso superior com uma linda vista panorâmica do mar.',
    hasAirConditioning: true,
    amenities: [
      '1 Cama de Casal',
      'Ar Condicionado',
      'Vista Privilegiada para o Mar',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/1DOibvZ5D5_2TuD3B0ofGytlychvR8yXB',
      'https://lh3.googleusercontent.com/d/1PjAw4vv8-C6RYBw5hc5ur1cPIg_yVNam'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1PmE7FKHFqR1Ty2hdbvsJ9nFvsohCmVaG'
  },
  {
    id: 'quarto-14',
    name: 'Quarto 14 - Suíte Superior Casal',
    type: 'standard',
    capacity: 2,
    pricePerNight: 0,
    description: 'Suíte superior com vista para a nossa quadra de Beach Tennis.',
    hasAirConditioning: false,
    amenities: [
      '1 Cama de Casal',
      'Ventilador (Não é de teto)',
      'Vista para Quadra Beach Tennis',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/1CPVLQj0H1cHwp9VJf4BPQjDmF6WxkzvQ',
      'https://lh3.googleusercontent.com/d/1s7Dho9hIcb4J2q7TfWwJ75_jALonhdtr'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1qIeB2qYZsdCxXgacLMJAT_uGeznR8cuk'
  },
  {
    id: 'quarto-15',
    name: 'Quarto 15 - Suíte Superior Casal',
    type: 'standard',
    capacity: 2,
    pricePerNight: 0,
    description: 'Aconchegante suíte casal localizada no piso superior.',
    hasAirConditioning: false,
    amenities: [
      '1 Cama de Casal',
      'Ventilador (Não é de teto)',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/191GQ5JZJPbmNqrihmkT3ToQIqrtkfKS7',
      'https://lh3.googleusercontent.com/d/1pJsbi4pfPXjJ5GA0DxFSbX85xmD1-dgW'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1nVuVEaWHd4daTvsjA9YE4XaIgFFoyd1Z'
  },
  {
    id: 'quarto-16',
    name: 'Quarto 16 - Suíte Superior Vista Mar',
    type: 'comfort',
    capacity: 2,
    pricePerNight: 0,
    description: 'Linda vista do mar e ar condicionado para o seu total conforto.',
    hasAirConditioning: true,
    amenities: [
      '1 Cama de Casal',
      'Ar Condicionado',
      'Vista para o Mar',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/1NlzdbqZvfCSP5JeGXs8kWa70zn5I0Bwz',
      'https://lh3.googleusercontent.com/d/1rI1nhk1DSeVefCkx1Wkkh2lzMDtCf9oz'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1WIjbQcdZWRoeaDEck4D1_h5efY5cbjly'
  },
  {
    id: 'quarto-17',
    name: 'Quarto 17 - Suíte Térrea Casal',
    type: 'standard',
    capacity: 2,
    pricePerNight: 0,
    description: 'Suíte localizada no térreo com vista direta para a nossa área gourmet.',
    hasAirConditioning: false,
    amenities: [
      '1 Cama de Casal',
      'Ventilador (Não é de teto)',
      'Vista para Área Gourmet',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/10zhmxriaO7z6Wejdv-RzspzKZalXlMgy',
      'https://lh3.googleusercontent.com/d/1H-AfI0cBU5zYymWmfzo7ANRyLVQsBatZ'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1nCfb-zHyQ6i6wG-HrOIOPYq0ysp2Tyyo'
  },
  {
    id: 'quarto-18',
    name: 'Quarto 18 - Suíte Superior Família',
    type: 'standard',
    capacity: 4,
    pricePerNight: 0,
    description: 'Acomodação familiar no piso superior com vista para a piscina dos fundos.',
    hasAirConditioning: false,
    amenities: [
      '1 Cama de Casal',
      '1 Beliche',
      'Ventilador (Não é de teto)',
      'Vista para Piscina (Fundos)',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/1oSbKvQ3aVTLwmmA-SDjpoLiEX3N6W5ed',
      'https://lh3.googleusercontent.com/d/1390mOyy57apHvT73TUV3WSHdy9VMr75e'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1hDdIJK2qKxJb13kHHno8vM2Nf5FPRFX4'
  },
  {
    id: 'quarto-19',
    name: 'Quarto 19 - Suíte Superior Máximo Conforto',
    type: 'comfort',
    capacity: 6,
    pricePerNight: 0,
    description: 'Ampla suíte superior climatizada com vista para a piscina dos fundos. Ideal para grandes famílias.',
    hasAirConditioning: true,
    amenities: [
      '1 Cama de Casal',
      '2 Beliches',
      'Ar Condicionado',
      'Vista para Piscina (Fundos)',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/19HpT47DCuHWQKynhnrw-LGNf4TG965wl',
      'https://lh3.googleusercontent.com/d/1k3blfXy9DNW7qrvmAMUMYRTHDHf6IdFF'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1YIVuF_pe8VuzTkfZGgQusALPufk_jLE4'
  },
  {
    id: 'quarto-20',
    name: 'Quarto 20 - Suíte Superior Espaçosa',
    type: 'comfort',
    capacity: 6,
    pricePerNight: 0,
    description: 'Nossa maior suíte superior climatizada, extremamente ampla e confortável.',
    hasAirConditioning: true,
    amenities: [
      '1 Cama de Casal',
      '2 Beliches',
      'Ar Condicionado',
      'Frigobar (Opcional à parte)',
      'Smart TV',
      'Wi-Fi',
      'Banheiro Privativo',
      'Café da manhã tropical incluso'
    ],
    images: [
      'https://lh3.googleusercontent.com/d/1A3mrYJNVJm6EKKYEHFGkd9108Ccg7sfh',
      'https://lh3.googleusercontent.com/d/1vfx7S5yg8QERZ5dwBdX_goVVa5CjIWXE'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: '1WIjbQcdZWRoeaDEck4D1_h5efY5cbjly'
  }
];

export const INITIAL_MENU: MenuItem[] = [
  // Porções
  { id: 'm-1', category: 'porcoes', name: 'Porção de Camarão Rosa Empanado (500g)', description: 'Camarões frescos do litoral fritos na hora', price: 0, available: true },
  { id: 'm-2', category: 'porcoes', name: 'Isca de Peixe Branco Crocante (600g)', description: 'Filetes de pescada branca empanados na panko', price: 0, available: true },
  { id: 'm-3', category: 'porcoes', name: 'Batata Frita Especial Ykape (500g)', description: 'Porção generosa coberta com queijo parmesão', price: 0, available: true },
  { id: 'm-4', category: 'porcoes', name: 'Tábua de Provolone à Milanesa', description: 'Cubos dourados e derretidos por dentro', price: 0, available: true },

  // Bebidas e Sucos
  { id: 'b-1', category: 'bebidas', name: 'Cervejas (Variadas)', price: 0, available: true },
  { id: 'b-2', category: 'bebidas', name: 'Refrigerantes (Latas)', price: 0, available: true },
  { id: 'b-3', category: 'bebidas', name: 'Sucos Naturais (Laranja, Limão, Maracujá)', price: 0, available: true },
  { id: 'b-4', category: 'bebidas', name: 'Água Mineral Com ou Sem Gás', price: 0, available: true },
  { id: 'b-5', category: 'bebidas', name: 'Água de Coco Natural Gelada', price: 0, available: true },

  // Bebidas Alcoólicas / Drinks
  { id: 'd-1', category: 'drinks', name: 'Caipirinhas (Limão ou Maracujá)', description: 'Feita com cachaça artesanal', price: 0, available: true },
  { id: 'd-2', category: 'drinks', name: 'Drinks Variados (Consulte Opções)', description: 'Preparados na hora', price: 0, available: true }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    guestName: 'Mariana & Carlos Silveira',
    cityState: 'Campinas, SP',
    rating: 5,
    comment: 'A pousada é simplesmente perfeita! Atravessamos a rua e já estávamos com o pé na areia da praia de Yemar. O café da manhã é farto e as duas piscinas são maravilhosas para relaxar à tarde.',
    date: '15 de Janeiro de 2026',
    roomType: 'Comfort Climatizado'
  },
  {
    id: 'rev-2',
    guestName: 'Roberto Nogueira (Família)',
    cityState: 'Curitiba, PR',
    rating: 5,
    comment: 'Excelente custo-benefício! Ficamos no quarto Standard e a ventilação é excelente com o ar do mar. As porções servidas no deck da piscina são de restaurante 5 estrelas. Voltaremos no próximo verão!',
    date: '02 de Fevereiro de 2026',
    roomType: 'Standard Vista Mar'
  },
  {
    id: 'rev-3',
    guestName: 'Fernanda Lemos',
    cityState: 'Sorocaba, SP',
    rating: 5,
    comment: 'O estacionamento gratuito e seguro fez toda a diferença. O Supermercado Monte Carlo fica bem ao lado caso precise comprar qualquer conveniência. Atendimento impecável da recepção ao bar.',
    date: '18 de Fevereiro de 2026',
    roomType: 'Comfort Climatizado'
  },
  {
    id: 'rev-4',
    guestName: 'Amanda Souza',
    cityState: 'São Paulo, SP',
    rating: 5,
    comment: 'Pé na areia de verdade! O barulho das ondas à noite é muito relaxante. O atendimento da recepção é extremamente cordial e prestativo. Recomendo fortemente!',
    date: '25 de Dezembro de 2025',
    roomType: 'Master Frente Mar'
  },
  {
    id: 'rev-5',
    guestName: 'Bruno Mendes',
    cityState: 'Santos, SP',
    rating: 5,
    comment: 'As piscinas são limpas diariamente e o deck de madeira é muito gostoso para tomar um sol. A pousada inteira é muito bem cuidada, arborizada e florida.',
    date: '12 de Janeiro de 2026',
    roomType: 'Comfort Climatizado'
  },
  {
    id: 'rev-6',
    guestName: 'Camila Rocha',
    cityState: 'Ribeirão Preto, SP',
    rating: 5,
    comment: 'Wi-Fi excelente em todas as áreas da pousada, inclusive perto da piscina e no deck. Consegui fazer algumas chamadas de trabalho por vídeo sem oscilação. Nota dez!',
    date: '20 de Janeiro de 2026',
    roomType: 'Standard Vista Mar'
  },
  {
    id: 'rev-7',
    guestName: 'Thiago Oliveira',
    cityState: 'Campinas, SP',
    rating: 5,
    comment: 'Que café da manhã espetacular! Pães artesanais quentinhos, bolos de vários sabores feitos lá mesmo e suco de laranja natural geladinho. Sensacional!',
    date: '28 de Janeiro de 2026',
    roomType: 'Comfort Climatizado'
  },
  {
    id: 'rev-8',
    guestName: 'Sandra Regina',
    cityState: 'Bauru, SP',
    rating: 5,
    comment: 'Ambiente familiar delicioso. Os funcionários nos trataram como se fôssemos da família. As crianças amaram a piscina infantil e o espaço amplo.',
    date: '05 de Fevereiro de 2026',
    roomType: 'Master Frente Mar'
  },
  {
    id: 'rev-9',
    guestName: 'Marcelo Antunes',
    cityState: 'São Bernardo do Campo, SP',
    rating: 5,
    comment: 'Localização imbatível na Beira Mar de Ilha Comprida. Muito fácil para caminhar no calçadão no final da tarde. Quarto extremamente limpo e cheiroso.',
    date: '14 de Fevereiro de 2026',
    roomType: 'Standard Vista Mar'
  },
  {
    id: 'rev-10',
    guestName: 'Patrícia Gomes',
    cityState: 'Joinville, SC',
    rating: 5,
    comment: 'As porções do bar da piscina são deliciosas, principalmente a isca de peixe crocante na panko! Cerveja super gelada e drinks autorais maravilhosos.',
    date: '22 de Fevereiro de 2026',
    roomType: 'Comfort Climatizado'
  },
  {
    id: 'rev-11',
    guestName: 'Lucas Pinheiro',
    cityState: 'Jundiaí, SP',
    rating: 5,
    comment: 'Roupas de cama e banho extremamente limpas e macias. O chuveiro tem ótima pressão e esquenta super bem. Ar condicionado moderno e muito silencioso.',
    date: '02 de Março de 2026',
    roomType: 'Comfort Climatizado'
  },
  {
    id: 'rev-12',
    guestName: 'Juliana & Thiago',
    cityState: 'Piracicaba, SP',
    rating: 5,
    comment: 'Fizemos nossa lua de mel aqui e fomos recebidos com pétalas de rosas e um mimo no quarto. Equipe carinhosa que cuidou de cada detalhe com amor.',
    date: '10 de Março de 2026',
    roomType: 'Master Frente Mar'
  },
  {
    id: 'rev-13',
    guestName: 'Gabriel Ramos',
    cityState: 'São José dos Campos, SP',
    rating: 5,
    comment: 'Visual maravilhoso da praia diretamente da sacada da pousada. Ótimo custo-benefício para quem quer descansar de verdade e esquecer do carro.',
    date: '15 de Março de 2026',
    roomType: 'Standard Vista Mar'
  },
  {
    id: 'rev-14',
    guestName: 'Diego Ferreira',
    cityState: 'Marília, SP',
    rating: 5,
    comment: 'Estacionamento privativo seguro com monitoramento. Pousada muito perto de comércios locais, mas sem o barulho do centro. Excelente para relaxar.',
    date: '22 de Março de 2026',
    roomType: 'Comfort Climatizado'
  },
  {
    id: 'rev-15',
    guestName: 'Aline Custódio',
    cityState: 'Presidente Prudente, SP',
    rating: 5,
    comment: 'A brisa do mar que entra pelas janelas é maravilhosa. Café da manhã farto, com reposição constante. Sem dúvidas, a melhor opção na Ilha.',
    date: '29 de Março de 2026',
    roomType: 'Standard Vista Mar'
  },
  {
    id: 'rev-16',
    guestName: 'Vanessa Lima',
    cityState: 'Londrina, PR',
    rating: 5,
    comment: 'As duas piscinas garantem que nunca fique cheio demais. Área de lazer limpa e funcionários super educados. Voltarei com toda certeza!',
    date: '05 de Abril de 2026',
    roomType: 'Comfort Climatizado'
  },
  {
    id: 'rev-17',
    guestName: 'Rodrigo Santos',
    cityState: 'Santo André, SP',
    rating: 5,
    comment: 'Quarto Standard espaçoso e arejado. A cama de casal é super confortável e grande. Ideal para descansar após um dia inteiro aproveitando a praia.',
    date: '12 de Abril de 2026',
    roomType: 'Standard Vista Mar'
  },
  {
    id: 'rev-18',
    guestName: 'Estela Maris',
    cityState: 'Sorocaba, SP',
    rating: 5,
    comment: 'O jardim da pousada é lindíssimo! Muito verde e sombra fresca para ler um bom livro à tarde. Um ambiente tranquilo e muito revigorante.',
    date: '20 de Abril de 2026',
    roomType: 'Comfort Climatizado'
  },
  {
    id: 'rev-19',
    guestName: 'Fábio & Letícia',
    cityState: 'Mogi das Cruzes, SP',
    rating: 5,
    comment: 'Reservar pelo site com os 50% de entrada foi super simples e seguro. Ao chegar, tudo estava pronto e fomos recebidos com muita presteza.',
    date: '27 de Abril de 2026',
    roomType: 'Comfort Climatizado'
  },
  {
    id: 'rev-20',
    guestName: 'Ricardo Albuquerque',
    cityState: 'São Paulo, SP',
    rating: 5,
    comment: 'Melhor pousada de Ilha Comprida! A infraestrutura é excelente, a limpeza é impecável e o café da manhã é digno de hotel de luxo. Parabéns!',
    date: '04 de Maio de 2026',
    roomType: 'Master Frente Mar'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  { id: 'g-1', album: 'externo', title: 'Vista da Pousada', imageUrl: 'https://lh3.googleusercontent.com/d/1lgeVFIkkt97NfidRZnNmkuGjE54SdJkx' },
  { id: 'g-2', album: 'externo', title: 'Área Externa', imageUrl: 'https://lh3.googleusercontent.com/d/185Fc5Tawc9W_xjVfv4nZc--NlO9-1yTL' },
  { id: 'g-3', album: 'piscinas', title: 'Nossas Piscinas', imageUrl: 'https://lh3.googleusercontent.com/d/1RI3eZAuEF0MX4nB_2tcqHVrG8OpgmQm2' },
  { id: 'g-4', album: 'piscinas', title: 'Lazer e Diversão', imageUrl: 'https://lh3.googleusercontent.com/d/1Kgclj7jIdTDEUwAHTdS4-wmLx_DKz37p' },
  { id: 'g-5', album: 'quartos', title: 'Acomodações Confortáveis', imageUrl: 'https://lh3.googleusercontent.com/d/14sXGBWdK9m79m46mQ8NAPTp1NklRxS6S' },
  { id: 'g-6', album: 'quartos', title: 'Quartos Higienizados', imageUrl: 'https://lh3.googleusercontent.com/d/1K9ch80htYP4ZDoMRTFC6-_PuDgY0WH4f' },
  { id: 'g-7', album: 'cafe', title: 'Café da Manhã Completo', imageUrl: 'https://lh3.googleusercontent.com/d/1-odHDzCNR3ReL8mh_cv52M9QFMSOvKrM' },
  { id: 'g-8', album: 'praia', title: 'Beira Mar Ilha Comprida', imageUrl: 'https://lh3.googleusercontent.com/d/1QtjCqABkd1RP6JYmAvg5pzVygdo7bkNt' },
  { id: 'g-9', album: 'externo', title: 'Ambiente Familiar', imageUrl: 'https://lh3.googleusercontent.com/d/1EgTsARE0Lp_Ho8K7r-IaHY_5_RpsnvSM' },
  { id: 'g-10', album: 'piscinas', title: 'Deck das Piscinas', imageUrl: 'https://lh3.googleusercontent.com/d/1AzwrAhQwu8TTR2T2s2RaHPD3x0fya2mF' },
  { id: 'g-11', album: 'quartos', title: 'Detalhes que Encantam', imageUrl: 'https://lh3.googleusercontent.com/d/18oVwXKcZlVYphCYhJswRCBKmD1Uua5ne' },
  { id: 'g-12', album: 'externo', title: 'Lazer e Bem-estar', imageUrl: 'https://lh3.googleusercontent.com/d/1thTzdqGjVfqNFk7pu3_37jRv7nhsLuc9' },
  { id: 'g-13', album: 'piscinas', title: 'Ambientes Integrados', imageUrl: 'https://lh3.googleusercontent.com/d/1b3bJorRDKt6MpoBN8zyFWC3Q6Zr4RuGE' },
  { id: 'g-14', album: 'quartos', title: 'Conforto Yemar', imageUrl: 'https://lh3.googleusercontent.com/d/1AUdRx2K2wYWxwJZH9H9PB7PTTh2RI9VE' },
  { id: 'g-15', album: 'externo', title: 'Vista Privilegiada', imageUrl: 'https://lh3.googleusercontent.com/d/1-_E0wgUR-AMAZ8kY9lE1j0EgUyG9SeJB' },
  { id: 'g-16', album: 'externo', title: 'Entrada Acolhedora', imageUrl: 'https://lh3.googleusercontent.com/d/1OIRffKbj_qKNE7NHqxDYNtrxiV2SL-z7' },
  { id: 'g-17', album: 'piscinas', title: 'Área de Lazer Completa', imageUrl: 'https://lh3.googleusercontent.com/d/1mlKIJmqw7S6XXZQjLHYAo1UnseapVYMT' },
  { id: 'g-18', album: 'quartos', title: 'Suíte Planejada', imageUrl: 'https://lh3.googleusercontent.com/d/1NP58baTln-bjSUvQcp48sWz7rSMzs1yk' },
  { id: 'g-19', album: 'cafe', title: 'Delícias Regionais', imageUrl: 'https://lh3.googleusercontent.com/d/1C1qoCeVNRQ49nahQJ-1Cnl5KU2yhegEy' },
  { id: 'g-20', album: 'praia', title: 'Cenários de Ilha Comprida', imageUrl: 'https://lh3.googleusercontent.com/d/1rhfc_3CcdUPnozNWZzuCDqXfUs1bTXzM' },
  { id: 'g-21', album: 'externo', title: 'Jardins e Varandas', imageUrl: 'https://lh3.googleusercontent.com/d/1wAJiPgKInE2wvWjEmvVZC35ZICeeVm4Y' },
  { id: 'g-22', album: 'piscinas', title: 'Banho de Sol e Descanso', imageUrl: 'https://lh3.googleusercontent.com/d/1AEhoRVD14EYj79sGCyKHr8KzrVnqlgyE' },
  { id: 'g-23', album: 'quartos', title: 'Acomodação Ampla', imageUrl: 'https://lh3.googleusercontent.com/d/1n64djOB5xtWAMsVdIMrV9PpVbcLsqnu3' },
  { id: 'g-24', album: 'cafe', title: 'Frutas Frescas', imageUrl: 'https://lh3.googleusercontent.com/d/1WcBu-RUbsaGV_dH-w34X2hFqcQ680ZMp' },
  { id: 'g-25', album: 'praia', title: 'Pôr do Sol na Praia', imageUrl: 'https://lh3.googleusercontent.com/d/1OEbbk44PXD39mS9LiF5foJTDU2neU1iz' },
  { id: 'g-26', album: 'externo', title: 'Fachada Noturna', imageUrl: 'https://lh3.googleusercontent.com/d/1AcvKOjGrzomKFMCKy0uNB3XxpCyTyI4J' },
  { id: 'g-27', album: 'piscinas', title: 'Piscina e Deck', imageUrl: 'https://lh3.googleusercontent.com/d/1YIL-zcGXkSLS_r6S-m_LARgIkpkgA7NA' },
  { id: 'g-28', album: 'quartos', title: 'Conforto Garantido', imageUrl: 'https://lh3.googleusercontent.com/d/1oF-ble3YPvu-vYFt-1zT24cwjcacWITQ' },
  { id: 'g-29', album: 'cafe', title: 'Variedade no Café', imageUrl: 'https://lh3.googleusercontent.com/d/1XhqYxeaG2av1TuSSk5tFi58e6p6WODsa' },
  { id: 'g-30', album: 'praia', title: 'Dunas de Ilha Comprida', imageUrl: 'https://lh3.googleusercontent.com/d/189DVjYAVM5JrSloQmfnIGDH5i4_fBoap' },
  { id: 'g-31', album: 'externo', title: 'Cantinho do Sossego', imageUrl: 'https://lh3.googleusercontent.com/d/1aoyu3aN43dFVICvpXFTYNbrW5Jl9A59q' },
  { id: 'g-32', album: 'piscinas', title: 'Momento Relax', imageUrl: 'https://lh3.googleusercontent.com/d/1eol-jyuHpaX3veF4sIYAhuBc5WoIS6W8' },
  { id: 'g-33', album: 'externo', title: 'Beleza Natural', imageUrl: 'https://lh3.googleusercontent.com/d/1Qk0dKXP-5yrAYItlz5loaPNWAkJB-eUv' },
  { id: 'g-34', album: 'piscinas', title: 'Refresco Tropical', imageUrl: 'https://lh3.googleusercontent.com/d/17JqtvUwR9ThXv2GWzm5OiYOaJ_yPJLmL' },
  { id: 'g-35', album: 'quartos', title: 'Hospedagem de Qualidade', imageUrl: 'https://lh3.googleusercontent.com/d/1eRWKdlILqE0nYgCA7e6ls57Fio_HRPgs' },
  { id: 'g-36', album: 'externo', title: 'Pátio Sombreado', imageUrl: 'https://lh3.googleusercontent.com/d/1LLtRGaiRCB71aB83s4Fybzw4DS1WjnDo' },
  { id: 'g-37', album: 'piscinas', title: 'Área de Lazer Integrada', imageUrl: 'https://lh3.googleusercontent.com/d/1UJoGzVWyyksVGV3tW-oz_DV_PwJK7rDx' },
  { id: 'g-38', album: 'quartos', title: 'Ambiente Acolhedor', imageUrl: 'https://lh3.googleusercontent.com/d/1eLl-q3XEzO2UE79z4-1VDLwqdMNFXDVz' },
  { id: 'g-39', album: 'externo', title: 'Arquitetura Local', imageUrl: 'https://lh3.googleusercontent.com/d/1n2TTRYLe5j9_3p8qohjhpGfAXxHsMHT6' },
  { id: 'g-40', album: 'piscinas', title: 'Diversão em Família', imageUrl: 'https://lh3.googleusercontent.com/d/1OuklHeLNzqQgctiueen7PPErwmO4b4R2' },
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'YKAPE10', discountPercent: 10, active: true },
  { code: 'VERAO2026', discountPercent: 15, active: true }
];

export const INITIAL_RESERVATIONS: Reservation[] = [];
