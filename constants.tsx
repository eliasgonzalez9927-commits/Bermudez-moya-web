
import { Property, PropertyType, OperationType, Lead, User, UserRole } from './types';

export const WHATSAPP_NUMBER = "5492645813030";

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    username: "admin",
    password: "123", // Password simple para testing
    name: "Sebastian Bermudez",
    role: UserRole.ADMIN,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    lastLogin: new Date().toISOString()
  },
  {
    id: "u2",
    username: "valeria",
    password: "123",
    name: "Valeria Moya",
    role: UserRole.ADMIN,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    lastLogin: new Date().toISOString()
  },
  {
    id: "u3",
    username: "pablo",
    password: "123",
    name: "Pablo Denis",
    role: UserRole.STAFF,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
    lastLogin: new Date().toISOString()
  },
  {
    id: "u4",
    username: "prueba@bermudezmoya",
    password: "12345678",
    name: "Usuario de Prueba",
    role: UserRole.ADMIN,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
    lastLogin: new Date().toISOString()
  }
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    externalId: "GVA-101",
    ref: "REF-A12",
    title: "Departamento Moderno en Recoleta",
    description: "Excelente oportunidad de inversión en el corazón de Recoleta. Amplios ventanales y terminaciones de lujo.",
    type: PropertyType.APARTMENT,
    operation: OperationType.SALE,
    price: 250000,
    currency: 'USD',
    neighborhood: "Recoleta",
    location: {
      address: "Av. Alvear 1800",
      city: "CABA",
      province: "Buenos Aires",
      department: "Capital Federal",
      locality: "Recoleta",
      lat: -34.588,
      lng: -58.391,
      googleMapsUrl: "https://maps.google.com/?q=-34.588,-58.391"
    },
    features: {
      rooms: 3,
      bedrooms: 2,
      bathrooms: 2,
      m2Total: 95,
      m2Covered: 88,
      amenities: ["Piscina", "Gimnasio", "Seguridad 24hs", "Sum"]
    },
    images: [
      { id: "img1", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1080&auto=format&fit=crop", fileName: "san-juan-inmobiliaria-0-1700000000.jpg", altText: "Living luminoso en Recoleta", order: 0 },
      { id: "img2", url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1080&auto=format&fit=crop", fileName: "san-juan-inmobiliaria-1-1700000000.jpg", altText: "Vista balcón Recoleta", order: 1 }
    ],
    status: 'active',
    viewsCount: 150,
    leadsCount: 12,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
    lastSyncAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "2",
    externalId: "GVA-102",
    ref: "REF-B45",
    title: "Casa Familiar en Martínez",
    description: "Hermosa propiedad con jardín y quincho. Zona residencial muy tranquila y segura.",
    type: PropertyType.HOUSE,
    operation: OperationType.SALE,
    price: 480000,
    currency: 'USD',
    neighborhood: "Martínez",
    location: {
      address: "General Paunero 1200",
      city: "San Isidro",
      province: "Buenos Aires",
      department: "San Isidro",
      locality: "Martínez",
      lat: -34.492,
      lng: -58.498,
      googleMapsUrl: "https://maps.google.com/?q=-34.492,-58.498"
    },
    features: {
      rooms: 5,
      bedrooms: 3,
      bathrooms: 3,
      m2Total: 350,
      m2Covered: 220,
      amenities: ["Jardín", "Parrilla", "Cochera Doble"]
    },
    images: [
      { id: "img3", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1080&auto=format&fit=crop", fileName: "san-juan-inmobiliaria-0-1700000001.jpg", altText: "Frente casa Martínez", order: 0 }
    ],
    status: 'active',
    viewsCount: 85,
    leadsCount: 4,
    createdAt: "2024-01-05T12:00:00Z",
    updatedAt: "2024-01-05T12:00:00Z",
    lastSyncAt: "2024-01-05T12:00:00Z"
  },
  {
    id: "3",
    externalId: "GVA-103",
    ref: "REF-C78",
    title: "Loft Industrial en Palermo",
    description: "Estilo único con techos altos y ladrillo a la vista. Ideal para profesionales o parejas jóvenes.",
    type: PropertyType.APARTMENT,
    operation: OperationType.RENT,
    price: 1200,
    currency: 'USD',
    neighborhood: "Palermo Soho",
    location: {
      address: "Thames 1500",
      city: "CABA",
      province: "Buenos Aires",
      department: "Capital Federal",
      locality: "Palermo",
      lat: -34.583,
      lng: -58.431,
      googleMapsUrl: "https://maps.google.com/?q=-34.583,-58.431"
    },
    features: {
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      m2Total: 65,
      m2Covered: 60,
      amenities: ["Terraza", "Laundry", "Seguridad"]
    },
    images: [
      { id: "img4", url: "https://images.unsplash.com/photo-1536376074432-bf12177d4f44?q=80&w=1080&auto=format&fit=crop", fileName: "loft-palermo.jpg", altText: "Interior loft Palermo", order: 0 }
    ],
    status: 'active',
    viewsCount: 210,
    leadsCount: 18,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-10T09:00:00Z",
    lastSyncAt: "2024-01-10T09:00:00Z"
  },
  {
    id: "4",
    externalId: "GVA-104",
    ref: "REF-D90",
    title: "Oficina Premium en Puerto Madero",
    description: "Vista panorámica al río y a la ciudad. Planta libre con divisiones de vidrio templado.",
    type: PropertyType.OFFICE,
    operation: OperationType.RENT,
    price: 3500,
    currency: 'USD',
    neighborhood: "Puerto Madero",
    location: {
      address: "Juana Manso 1100",
      city: "CABA",
      province: "Buenos Aires",
      department: "Capital Federal",
      locality: "Puerto Madero",
      lat: -34.611,
      lng: -58.362,
      googleMapsUrl: "https://maps.google.com/?q=-34.611,-58.362"
    },
    features: {
      rooms: 4,
      bedrooms: 0,
      bathrooms: 2,
      m2Total: 120,
      m2Covered: 120,
      amenities: ["Cochera", "Seguridad 24hs", "Sala de reuniones"]
    },
    images: [
      { id: "img5", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1080&auto=format&fit=crop", fileName: "oficina-madero.jpg", altText: "Oficina Puerto Madero", order: 0 }
    ],
    status: 'active',
    viewsCount: 120,
    leadsCount: 5,
    createdAt: "2024-01-15T11:00:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
    lastSyncAt: "2024-01-15T11:00:00Z"
  },
  {
    id: "5",
    externalId: "GVA-105",
    ref: "REF-E11",
    title: "Lote en Barrio Cerrado Nordelta",
    description: "Excelente ubicación frente al lago. El mejor barrio de Nordelta con todos los servicios.",
    type: PropertyType.LOT,
    operation: OperationType.SALE,
    price: 320000,
    currency: 'USD',
    neighborhood: "Nordelta",
    location: {
      address: "Av. de los Lagos 100",
      city: "Tigre",
      province: "Buenos Aires",
      department: "Tigre",
      locality: "Nordelta",
      lat: -34.412,
      lng: -58.648,
      googleMapsUrl: "https://maps.google.com/?q=-34.412,-58.648"
    },
    features: {
      rooms: 0,
      bedrooms: 0,
      bathrooms: 0,
      m2Total: 800,
      m2Covered: 0,
      amenities: ["Club House", "Tenis", "Seguridad"]
    },
    images: [
      { id: "img6", url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1080&auto=format&fit=crop", fileName: "lote-nordelta.jpg", altText: "Lote Nordelta", order: 0 }
    ],
    status: 'active',
    viewsCount: 95,
    leadsCount: 3,
    createdAt: "2024-01-20T14:00:00Z",
    updatedAt: "2024-01-20T14:00:00Z",
    lastSyncAt: "2024-01-20T14:00:00Z"
  },
  {
    id: "6",
    externalId: "GVA-106",
    ref: "REF-F22",
    title: "Local Comercial en Belgrano",
    description: "Gran visibilidad en zona de alto tránsito. Doble vidriera y depósito en subsuelo.",
    type: PropertyType.COMMERCIAL,
    operation: OperationType.RENT,
    price: 2800,
    currency: 'USD',
    neighborhood: "Belgrano",
    location: {
      address: "Av. Cabildo 2200",
      city: "CABA",
      province: "Buenos Aires",
      department: "Capital Federal",
      locality: "Belgrano",
      lat: -34.562,
      lng: -58.456,
      googleMapsUrl: "https://maps.google.com/?q=-34.562,-58.456"
    },
    features: {
      rooms: 2,
      bedrooms: 0,
      bathrooms: 1,
      m2Total: 85,
      m2Covered: 85,
      amenities: ["Aire Acondicionado", "Alarma"]
    },
    images: [
      { id: "img7", url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1080&auto=format&fit=crop", fileName: "local-belgrano.jpg", altText: "Local Belgrano", order: 0 }
    ],
    status: 'active',
    viewsCount: 180,
    leadsCount: 9,
    createdAt: "2024-01-25T16:00:00Z",
    updatedAt: "2024-01-25T16:00:00Z",
    lastSyncAt: "2024-01-25T16:00:00Z"
  },
  {
    id: "7",
    externalId: "GVA-107",
    ref: "REF-G33",
    title: "Chalet Clásico en San Isidro",
    description: "Estilo colonial con techos de teja y aberturas de madera. Gran parque arbolado.",
    type: PropertyType.HOUSE,
    operation: OperationType.SALE,
    price: 550000,
    currency: 'USD',
    neighborhood: "San Isidro",
    location: {
      address: "Libertador 15000",
      city: "San Isidro",
      province: "Buenos Aires",
      department: "San Isidro",
      locality: "San Isidro",
      lat: -34.472,
      lng: -58.512,
      googleMapsUrl: "https://maps.google.com/?q=-34.472,-58.512"
    },
    features: {
      rooms: 6,
      bedrooms: 4,
      bathrooms: 3,
      m2Total: 600,
      m2Covered: 300,
      amenities: ["Piscina", "Quincho", "Dependencia"]
    },
    images: [
      { id: "img8", url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1080&auto=format&fit=crop", fileName: "chalet-san-isidro.jpg", altText: "Chalet San Isidro", order: 0 }
    ],
    status: 'active',
    viewsCount: 140,
    leadsCount: 6,
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
    lastSyncAt: "2024-02-01T10:00:00Z"
  },
  {
    id: "8",
    externalId: "GVA-108",
    ref: "REF-H44",
    title: "Departamento con Terraza en Cañitas",
    description: "Último piso con vista abierta. Gran terraza propia con parrilla. Muy luminoso.",
    type: PropertyType.APARTMENT,
    operation: OperationType.SALE,
    price: 195000,
    currency: 'USD',
    neighborhood: "Las Cañitas",
    location: {
      address: "Ortega y Gasset 1800",
      city: "CABA",
      province: "Buenos Aires",
      department: "Capital Federal",
      locality: "Palermo",
      lat: -34.568,
      lng: -58.435,
      googleMapsUrl: "https://maps.google.com/?q=-34.568,-58.435"
    },
    features: {
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      m2Total: 75,
      m2Covered: 50,
      amenities: ["Terraza", "Parrilla", "Solarium"]
    },
    images: [
      { id: "img9", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1080&auto=format&fit=crop", fileName: "depto-canitas.jpg", altText: "Departamento Cañitas", order: 0 }
    ],
    status: 'active',
    viewsCount: 250,
    leadsCount: 22,
    createdAt: "2024-02-05T12:00:00Z",
    updatedAt: "2024-02-05T12:00:00Z",
    lastSyncAt: "2024-02-05T12:00:00Z"
  },
  {
    id: "9",
    externalId: "GVA-109",
    ref: "REF-I55",
    title: "Casa Quinta en Pilar",
    description: "Ideal para fin de semana o vivienda permanente. Gran terreno con frutales y piscina.",
    type: PropertyType.HOUSE,
    operation: OperationType.SALE,
    price: 220000,
    currency: 'USD',
    neighborhood: "Pilar",
    location: {
      address: "Ruta 8 Km 55",
      city: "Pilar",
      province: "Buenos Aires",
      department: "Pilar",
      locality: "Pilar",
      lat: -34.458,
      lng: -58.914,
      googleMapsUrl: "https://maps.google.com/?q=-34.458,-58.914"
    },
    features: {
      rooms: 4,
      bedrooms: 2,
      bathrooms: 2,
      m2Total: 1500,
      m2Covered: 150,
      amenities: ["Piscina", "Jardín", "Cochera"]
    },
    images: [
      { id: "img10", url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1080&auto=format&fit=crop", fileName: "quinta-pilar.jpg", altText: "Quinta Pilar", order: 0 }
    ],
    status: 'active',
    viewsCount: 110,
    leadsCount: 4,
    createdAt: "2024-02-10T14:00:00Z",
    updatedAt: "2024-02-10T14:00:00Z",
    lastSyncAt: "2024-02-10T14:00:00Z"
  },
  {
    id: "10",
    externalId: "GVA-110",
    ref: "REF-J66",
    title: "Departamento de Pozo en Caballito",
    description: "Excelente financiación. Edificio de categoría con amenities. Entrega en 24 meses.",
    type: PropertyType.APARTMENT,
    operation: OperationType.SALE,
    price: 115000,
    currency: 'USD',
    neighborhood: "Caballito",
    location: {
      address: "Av. Rivadavia 5500",
      city: "CABA",
      province: "Buenos Aires",
      department: "Capital Federal",
      locality: "Caballito",
      lat: -34.618,
      lng: -58.441,
      googleMapsUrl: "https://maps.google.com/?q=-34.618,-58.441"
    },
    features: {
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      m2Total: 45,
      m2Covered: 40,
      amenities: ["Piscina", "Sum", "Seguridad"]
    },
    images: [
      { id: "img11", url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1080&auto=format&fit=crop", fileName: "pozo-caballito.jpg", altText: "Render Caballito", order: 0 }
    ],
    status: 'active',
    viewsCount: 300,
    leadsCount: 35,
    createdAt: "2024-02-15T16:00:00Z",
    updatedAt: "2024-02-15T16:00:00Z",
    lastSyncAt: "2024-02-15T16:00:00Z"
  },
  {
    id: "11",
    externalId: "GVA-111",
    ref: "REF-K77",
    title: "Penthouse en San Juan Capital",
    description: "Vista inmejorable a la cordillera. Gran categoría y diseño moderno.",
    type: PropertyType.APARTMENT,
    operation: OperationType.SALE,
    price: 380000,
    currency: 'USD',
    neighborhood: "Centro",
    location: {
      address: "Av. Ignacio de la Roza 100",
      city: "San Juan",
      province: "San Juan",
      department: "Capital",
      locality: "San Juan",
      lat: -31.537,
      lng: -68.525,
      googleMapsUrl: "https://maps.google.com/?q=-31.537,-68.525"
    },
    features: {
      rooms: 5,
      bedrooms: 3,
      bathrooms: 3,
      m2Total: 220,
      m2Covered: 180,
      amenities: ["Piscina", "Cochera Doble", "Seguridad"]
    },
    images: [
      { id: "img12", url: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1080&auto=format&fit=crop", fileName: "penthouse-sanjuan.jpg", altText: "Penthouse San Juan", order: 0 }
    ],
    status: 'active',
    viewsCount: 160,
    leadsCount: 8,
    createdAt: "2024-02-20T10:00:00Z",
    updatedAt: "2024-02-20T10:00:00Z",
    lastSyncAt: "2024-02-20T10:00:00Z"
  },
  {
    id: "12",
    externalId: "GVA-112",
    ref: "REF-L88",
    title: "Casa en Santa Lucía",
    description: "Barrio privado con seguridad. Amplio jardín y piscina. Muy luminosa.",
    type: PropertyType.HOUSE,
    operation: OperationType.SALE,
    price: 290000,
    currency: 'USD',
    neighborhood: "Santa Lucía",
    location: {
      address: "Calle Pellegrini 2500",
      city: "Santa Lucía",
      province: "San Juan",
      department: "Santa Lucía",
      locality: "Santa Lucía",
      lat: -31.528,
      lng: -68.485,
      googleMapsUrl: "https://maps.google.com/?q=-31.528,-68.485"
    },
    features: {
      rooms: 4,
      bedrooms: 3,
      bathrooms: 2,
      m2Total: 400,
      m2Covered: 180,
      amenities: ["Piscina", "Seguridad", "Jardín"]
    },
    images: [
      { id: "img13", url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1080&auto=format&fit=crop", fileName: "casa-santalucia.jpg", altText: "Casa Santa Lucía", order: 0 }
    ],
    status: 'active',
    viewsCount: 130,
    leadsCount: 5,
    createdAt: "2024-02-25T12:00:00Z",
    updatedAt: "2024-02-25T12:00:00Z",
    lastSyncAt: "2024-02-25T12:00:00Z"
  },
  {
    id: "13",
    externalId: "GVA-113",
    ref: "REF-M99",
    title: "Lote en Rivadavia",
    description: "Zona de gran crecimiento. Todos los servicios subterráneos. Listo para construir.",
    type: PropertyType.LOT,
    operation: OperationType.SALE,
    price: 45000,
    currency: 'USD',
    neighborhood: "Rivadavia",
    location: {
      address: "Av. Libertador 4500",
      city: "Rivadavia",
      province: "San Juan",
      department: "Rivadavia",
      locality: "Rivadavia",
      lat: -31.542,
      lng: -68.585,
      googleMapsUrl: "https://maps.google.com/?q=-31.542,-68.585"
    },
    features: {
      rooms: 0,
      bedrooms: 0,
      bathrooms: 0,
      m2Total: 500,
      m2Covered: 0,
      amenities: ["Seguridad", "Club House"]
    },
    images: [
      { id: "img14", url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1080&auto=format&fit=crop", fileName: "lote-rivadavia.jpg", altText: "Lote Rivadavia", order: 0 }
    ],
    status: 'active',
    viewsCount: 80,
    leadsCount: 2,
    createdAt: "2024-03-01T14:00:00Z",
    updatedAt: "2024-03-01T14:00:00Z",
    lastSyncAt: "2024-03-01T14:00:00Z"
  },
  {
    id: "14",
    externalId: "GVA-114",
    ref: "REF-N10",
    title: "Departamento en Alquiler Centro SJ",
    description: "A estrenar. Muy céntrico, ideal para estudiantes o profesionales.",
    type: PropertyType.APARTMENT,
    operation: OperationType.RENT,
    price: 350000,
    currency: 'ARS',
    neighborhood: "Centro",
    location: {
      address: "Calle Mendoza 300",
      city: "San Juan",
      province: "San Juan",
      department: "Capital",
      locality: "San Juan",
      lat: -31.535,
      lng: -68.522,
      googleMapsUrl: "https://maps.google.com/?q=-31.535,-68.522"
    },
    features: {
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      m2Total: 40,
      m2Covered: 40,
      amenities: ["Ascensor", "Balcón"]
    },
    images: [
      { id: "img15", url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1080&auto=format&fit=crop", fileName: "alquiler-centro.jpg", altText: "Departamento Centro", order: 0 }
    ],
    status: 'active',
    viewsCount: 450,
    leadsCount: 40,
    createdAt: "2024-03-05T16:00:00Z",
    updatedAt: "2024-03-05T16:00:00Z",
    lastSyncAt: "2024-03-05T16:00:00Z"
  },
  {
    id: "15",
    externalId: "GVA-115",
    ref: "REF-O20",
    title: "Casa de Campo en Pocito",
    description: "Rodeada de viñedos. Ideal para descanso. Gran parque y pileta.",
    type: PropertyType.HOUSE,
    operation: OperationType.SALE,
    price: 180000,
    currency: 'USD',
    neighborhood: "Pocito",
    location: {
      address: "Calle 11 y Vidart",
      city: "Pocito",
      province: "San Juan",
      department: "Pocito",
      locality: "Pocito",
      lat: -31.658,
      lng: -68.585,
      googleMapsUrl: "https://maps.google.com/?q=-31.658,-68.585"
    },
    features: {
      rooms: 4,
      bedrooms: 2,
      bathrooms: 2,
      m2Total: 2500,
      m2Covered: 140,
      amenities: ["Piscina", "Parrilla", "Jardín"]
    },
    images: [
      { id: "img16", url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1080&auto=format&fit=crop", fileName: "casa-pocito.jpg", altText: "Casa Pocito", order: 0 }
    ],
    status: 'active',
    viewsCount: 90,
    leadsCount: 3,
    createdAt: "2024-03-10T10:00:00Z",
    updatedAt: "2024-03-10T10:00:00Z",
    lastSyncAt: "2024-03-10T10:00:00Z"
  },
  {
    id: "16",
    externalId: "GVA-116",
    ref: "REF-P30",
    title: "Local en Peatonal San Juan",
    description: "Ubicación estratégica. Gran flujo de personas. Doble planta.",
    type: PropertyType.COMMERCIAL,
    operation: OperationType.RENT,
    price: 1200000,
    currency: 'ARS',
    neighborhood: "Centro",
    location: {
      address: "Peatonal Rivadavia 50",
      city: "San Juan",
      province: "San Juan",
      department: "Capital",
      locality: "San Juan",
      lat: -31.536,
      lng: -68.524,
      googleMapsUrl: "https://maps.google.com/?q=-31.536,-68.524"
    },
    features: {
      rooms: 3,
      bedrooms: 0,
      bathrooms: 2,
      m2Total: 150,
      m2Covered: 150,
      amenities: ["Aire Acondicionado", "Vidriera"]
    },
    images: [
      { id: "img17", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1080&auto=format&fit=crop", fileName: "local-peatonal.jpg", altText: "Local Peatonal", order: 0 }
    ],
    status: 'active',
    viewsCount: 220,
    leadsCount: 12,
    createdAt: "2024-03-15T12:00:00Z",
    updatedAt: "2024-03-15T12:00:00Z",
    lastSyncAt: "2024-03-15T12:00:00Z"
  },
  {
    id: "17",
    externalId: "GVA-117",
    ref: "REF-Q40",
    title: "Departamento en Mendoza Capital",
    description: "Frente al Parque General San Martín. Categoría y confort.",
    type: PropertyType.APARTMENT,
    operation: OperationType.SALE,
    price: 210000,
    currency: 'USD',
    neighborhood: "Quinta Sección",
    location: {
      address: "Av. Emilio Civit 500",
      city: "Mendoza",
      province: "Mendoza",
      department: "Capital",
      locality: "Mendoza",
      lat: -32.892,
      lng: -68.856,
      googleMapsUrl: "https://maps.google.com/?q=-32.892,-68.856"
    },
    features: {
      rooms: 3,
      bedrooms: 2,
      bathrooms: 2,
      m2Total: 100,
      m2Covered: 95,
      amenities: ["Seguridad", "Cochera", "Sum"]
    },
    images: [
      { id: "img18", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1080&auto=format&fit=crop", fileName: "depto-mendoza.jpg", altText: "Depto Mendoza", order: 0 }
    ],
    status: 'active',
    viewsCount: 180,
    leadsCount: 7,
    createdAt: "2024-03-20T14:00:00Z",
    updatedAt: "2024-03-20T14:00:00Z",
    lastSyncAt: "2024-03-20T14:00:00Z"
  },
  {
    id: "18",
    externalId: "GVA-118",
    ref: "REF-R50",
    title: "Casa en Chacras de Coria",
    description: "Estilo rústico con gran jardín. Zona muy tranquila y segura.",
    type: PropertyType.HOUSE,
    operation: OperationType.SALE,
    price: 350000,
    currency: 'USD',
    neighborhood: "Chacras de Coria",
    location: {
      address: "Calle Viamonte 1200",
      city: "Luján de Cuyo",
      province: "Mendoza",
      department: "Luján de Cuyo",
      locality: "Chacras de Coria",
      lat: -32.985,
      lng: -68.875,
      googleMapsUrl: "https://maps.google.com/?q=-32.985,-68.875"
    },
    features: {
      rooms: 5,
      bedrooms: 3,
      bathrooms: 3,
      m2Total: 800,
      m2Covered: 250,
      amenities: ["Piscina", "Jardín", "Parrilla"]
    },
    images: [
      { id: "img19", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1080&auto=format&fit=crop", fileName: "casa-chacras.jpg", altText: "Casa Chacras", order: 0 }
    ],
    status: 'active',
    viewsCount: 150,
    leadsCount: 6,
    createdAt: "2024-03-25T16:00:00Z",
    updatedAt: "2024-03-25T16:00:00Z",
    lastSyncAt: "2024-03-25T16:00:00Z"
  },
  {
    id: "19",
    externalId: "GVA-119",
    ref: "REF-S60",
    title: "Oficina en Microcentro Mendoza",
    description: "Ideal para estudio contable o jurídico. Muy luminosa y funcional.",
    type: PropertyType.OFFICE,
    operation: OperationType.RENT,
    price: 450000,
    currency: 'ARS',
    neighborhood: "Centro",
    location: {
      address: "Calle San Martín 1000",
      city: "Mendoza",
      province: "Mendoza",
      department: "Capital",
      locality: "Mendoza",
      lat: -32.889,
      lng: -68.844,
      googleMapsUrl: "https://maps.google.com/?q=-32.889,-68.844"
    },
    features: {
      rooms: 3,
      bedrooms: 0,
      bathrooms: 1,
      m2Total: 60,
      m2Covered: 60,
      amenities: ["Ascensor", "Seguridad"]
    },
    images: [
      { id: "img20", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1080&auto=format&fit=crop", fileName: "oficina-mendoza.jpg", altText: "Oficina Mendoza", order: 0 }
    ],
    status: 'active',
    viewsCount: 140,
    leadsCount: 5,
    createdAt: "2024-03-30T10:00:00Z",
    updatedAt: "2024-03-30T10:00:00Z",
    lastSyncAt: "2024-03-30T10:00:00Z"
  },
  {
    id: "20",
    externalId: "GVA-120",
    ref: "REF-T70",
    title: "Lote en Maipú",
    description: "En zona de bodegas. Ideal para emprendimiento turístico o vivienda.",
    type: PropertyType.LOT,
    operation: OperationType.SALE,
    price: 35000,
    currency: 'USD',
    neighborhood: "Maipú",
    location: {
      address: "Calle Urquiza 3000",
      city: "Maipú",
      province: "Mendoza",
      department: "Maipú",
      locality: "Maipú",
      lat: -32.972,
      lng: -68.785,
      googleMapsUrl: "https://maps.google.com/?q=-32.972,-68.785"
    },
    features: {
      rooms: 0,
      bedrooms: 0,
      bathrooms: 0,
      m2Total: 1000,
      m2Covered: 0,
      amenities: ["Servicios", "Seguridad"]
    },
    images: [
      { id: "img21", url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1080&auto=format&fit=crop", fileName: "lote-maipu.jpg", altText: "Lote Maipú", order: 0 }
    ],
    status: 'active',
    viewsCount: 70,
    leadsCount: 2,
    createdAt: "2024-04-01T12:00:00Z",
    updatedAt: "2024-04-01T12:00:00Z",
    lastSyncAt: "2024-04-01T12:00:00Z"
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: "l1",
    name: "Juan Perez",
    email: "juan.perez@email.com",
    phone: "+54 9 264 456-7890",
    message: "Hola! Me interesa visitar el departamento en Recoleta el próximo sábado.",
    propertyId: "1",
    propertyRef: "REF-A12",
    status: 'new',
    createdAt: "2024-02-15T14:30:00Z",
    source: 'web_form'
  }
];

export const BANNERS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1920&auto=format&fit=crop',
    title: 'Encontrá tu próximo hogar',
    subtitle: 'Propiedades exclusivas en San Juan y toda la región',
    ctaText: 'Ver Propiedades',
    ctaAction: 'home'
  },
  {
    id: '2', 
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1920&auto=format&fit=crop',
    title: 'Invertí con confianza',
    subtitle: 'Más de 10 años acompañando inversiones inmobiliarias',
    ctaText: 'Conocer Servicios',
    ctaAction: 'services'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop', 
    title: 'Vendé o alquilá tu propiedad',
    subtitle: 'Te acompañamos en cada paso del proceso',
    ctaText: 'Contactanos',
    ctaAction: 'contacto'
  }
];
