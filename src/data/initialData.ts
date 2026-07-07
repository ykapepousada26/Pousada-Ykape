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
      'https://i.postimg.cc/tgkRcbM4/20240119-102749.jpg',
      'https://i.postimg.cc/LX09HTSG/20240522-110617.avif',
      'https://i.postimg.cc/bvpNLrL9/20240522-111035.jpg'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/kXynGq7D/20240127-120804.jpg',
      'https://i.postimg.cc/x1T9bhdt/20240522-112049.avif',
      'https://i.postimg.cc/kXynGq7D/20240127-120804.jpg'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/C5NWhMbf/20240127-121816.jpg',
      'https://i.postimg.cc/J75wcxv2/20240522-112820.avif',
      'https://i.postimg.cc/tRN0tkwK/20240522-113136.avif'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/sDLTpZf1/20240127-121348.jpg',
      'https://i.postimg.cc/6QJzPJvN/20240522-113613.avif',
      'https://i.postimg.cc/N0qbnqHv/20240522-113838.avif'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/8cJ6Dc2F/20240127-121418.jpg',
      'https://i.postimg.cc/4yDh3ZGL/20240522-114538.avif',
      'https://i.postimg.cc/5yhFt1JP/20240522-114618.avif'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/qBzDDdb7/20240127-121449.jpg',
      'https://i.postimg.cc/kMz1khzb/20240522-115530.avif',
      'https://i.postimg.cc/DfHjtYHm/20240522-115803.avif'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/GtyQLdV5/20240127-121529.jpg',
      'https://i.postimg.cc/dQknmj3R/20240522-120422.avif',
      'https://i.postimg.cc/nVjTYGr4/20240522-120842.avif'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/VvQtFMZM/20240127-121645.jpg',
      'https://i.postimg.cc/PJWwVx0R/20240522-122117.avif',
      'https://i.postimg.cc/T1VDNwB9/20240522-122450.avif'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
  },
  {
    id: 'quarto-09',
    name: 'Quarto 09 - Suíte Standard Ampla Casal',
    type: 'standard',
    capacity: 2,
    pricePerNight: 0,
    description: 'Acomodação ampla ideal para casais que buscam espaço and conforto.',
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
      'https://i.postimg.cc/Ss0j046Z/20240127-121645.jpg',
      'https://i.postimg.cc/PxmJT7KJ/20240522-122117.avif',
      'https://i.postimg.cc/tThJpcD9/20240522-122450.avif'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/Wb4NHtRg/20240127-121724.jpg',
      'https://i.postimg.cc/BQwS9ssr/20240522-123024.avif',
      'https://i.postimg.cc/02HkRxP1/20240522-123310.avif'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/BZrr0yDp/20240522-125007.jpg',
      'https://i.postimg.cc/qBPPTYn3/20240522-124646.jpg'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/d0QcLxqR/20240520-132314.avif',
      'https://i.postimg.cc/9fXHrnWZ/20240520-132342.avif',
      'https://i.postimg.cc/1zR1fj96/20240520-132428.avif',
      'https://i.postimg.cc/wBxY7G6X/20240520-132547.avif'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/HWyRsgQQ/20240605-123118.avif',
      'https://i.postimg.cc/MHVFs7WL/20240522-124226.jpg',
      'https://i.postimg.cc/rmvHCnL7/20240522-124412.jpg'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/jSgZ4gHq/20240520-131324.avif',
      'https://i.postimg.cc/pLGqJGfr/20240520-131354.avif',
      'https://i.postimg.cc/6pjYfjrT/20240520-131832.avif'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/zXMywTLf/20240517-100337.jpg',
      'https://i.postimg.cc/wjm7w3J1/20240517-100404.jpg',
      'https://i.postimg.cc/28J1dnqZ/20240517-100417.jpg'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/Tw8jtZpj/20240517-095658.jpg',
      'https://i.postimg.cc/tTh3w2x1/20240517-095615.jpg',
      'https://i.postimg.cc/TwrVFCDp/20240517-095602.jpg',
      'https://i.postimg.cc/50c5sZ6Y/Imagem-da-sacada.jpg'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/tTSqqHWC/20240127-122559.jpg',
      'https://i.postimg.cc/Wzd2tfwm/20240520-122541.avif',
      'https://i.postimg.cc/j2DsCk4v/20240520-122711.avif'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/RhJBvJvD/20240517-101518.jpg',
      'https://i.postimg.cc/Wzqvsqsf/20240517-101551.jpg',
      'https://i.postimg.cc/mk1sT1Tp/20240517-101616.jpg'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/CM8My9dV/20240520-130842.avif',
      'https://i.postimg.cc/jqfqVBCb/20240520-130854.avif',
      'https://i.postimg.cc/DfGfVR0M/20240520-130824.avif'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
      'https://i.postimg.cc/C1HvkFJ3/20240517-101042.jpg',
      'https://i.postimg.cc/bJH6kz3q/20240517-100731.jpg',
      'https://i.postimg.cc/85ByM1tz/20240517-100812.jpg'
    ],
    status: 'available',
    totalUnits: 1,
    driveFolder: ''
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
  { id: 'g-1', album: 'externo', title: 'Vista da Pousada', imageUrl: 'https://i.postimg.cc/Gt5687gS/image.jpg' },
  { id: 'g-2', album: 'piscinas', title: 'Piscina da Frente', imageUrl: 'https://i.postimg.cc/yxb2gQpQ/pscina-frente.jpg' },
  { id: 'g-3', album: 'piscinas', title: 'Piscina dos Fundos', imageUrl: 'https://i.postimg.cc/k5mzbtwS/Piscina-fundos.jpg' },
  { id: 'g-4', album: 'externo', title: 'Área de Estar Externa', imageUrl: 'https://i.postimg.cc/gcxpd87b/20240522-123724.avif' },
  { id: 'g-5', album: 'piscinas', title: 'Deck e Espreguiçadeiras', imageUrl: 'https://i.postimg.cc/sDSRGyyN/20240522-123559-2.jpg' },
  { id: 'g-6', album: 'externo', title: 'Paisagismo e Jardins', imageUrl: 'https://i.postimg.cc/Qx5rKssw/20240522-123813.jpg' },
  { id: 'g-7', album: 'externo', title: 'Caminho para a Praia', imageUrl: 'https://i.postimg.cc/8PLqPHmD/20240522-123944.avif' },
  { id: 'g-8', album: 'quartos', title: 'Suíte Master Premium', imageUrl: 'https://i.postimg.cc/qBPPTYn3/20240522-124646.jpg' },
  { id: 'g-9', album: 'quartos', title: 'Conforto e Decoração', imageUrl: 'https://i.postimg.cc/tRKKjfPV/20240522-124701.jpg' },
  { id: 'g-10', album: 'quartos', title: 'Detalhes da Acomodação', imageUrl: 'https://i.postimg.cc/WpBBvKrF/20240522-124721.jpg' },
  { id: 'g-11', album: 'quartos', title: 'Suíte Ampla Casal', imageUrl: 'https://i.postimg.cc/wxCCpPJk/20240522-124806.jpg' },
  { id: 'g-12', album: 'quartos', title: 'Acomodação Familiar', imageUrl: 'https://i.postimg.cc/BZrr0yDp/20240522-125007.jpg' },
  { id: 'g-13', album: 'quartos', title: 'Ambiente Higienizado', imageUrl: 'https://i.postimg.cc/wMLbMqJB/20240522-125120.jpg' },
  { id: 'g-14', album: 'cafe', title: 'Café da Manhã Completo', imageUrl: 'https://i.postimg.cc/DfXNBgDK/20240522-125234.avif' },
  { id: 'g-15', album: 'cafe', title: 'Variedade de Bolos e Pães', imageUrl: 'https://i.postimg.cc/QC1nC85t/20240522-125452.jpg' },
  { id: 'g-16', album: 'cafe', title: 'Bebidas e Sucos Naturais', imageUrl: 'https://i.postimg.cc/wMLbMqJm/20240522-125822.jpg' },
  { id: 'g-17', album: 'cafe', title: 'Frutas Frescas da Estação', imageUrl: 'https://i.postimg.cc/v8VK3zj8/20240522-130051.jpg' },
  { id: 'g-18', album: 'externo', title: 'Nossa Recepção', imageUrl: 'https://i.postimg.cc/SQMPDr5c/Recepcao.jpg' },
  { id: 'g-19', album: 'praia', title: 'Dunas de Ilha Comprida', imageUrl: 'https://i.postimg.cc/Qxq0ynqs/Dunas-Juruvauva-2.avif' },
  { id: 'g-20', album: 'praia', title: 'Guará Vermelho', imageUrl: 'https://i.postimg.cc/fTs85hm2/Guara-Vermelho-Ilha-2.jpg' },
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'YKAPE10', discountPercent: 10, active: true },
  { code: 'VERAO2026', discountPercent: 15, active: true }
];

export const INITIAL_RESERVATIONS: Reservation[] = [];
