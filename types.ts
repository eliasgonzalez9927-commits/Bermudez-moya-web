
export enum PropertyType {
  HOUSE = 'Casa',
  APARTMENT = 'Departamento',
  LOT = 'Lote',
  OFFICE = 'Oficina',
  COMMERCIAL = 'Local'
}

export enum OperationType {
  SALE = 'Venta',
  RENT = 'Alquiler',
  TEMPORARY = 'Alquiler Temporario'
}

export enum UserRole {
  ADMIN = 'Administrador',
  STAFF = 'Personal'
}

export interface User {
  id: string;
  username: string;
  password?: string; // Solo para simulación en este entorno
  name: string;
  role: UserRole;
  avatar?: string;
  lastLogin?: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  fileName: string;
  altText: string;
  order: number;
}

export interface Property {
  id: string;
  externalId: string;
  ref: string;
  title: string;
  description: string;
  type: PropertyType;
  operation: OperationType;
  price: number;
  currency: 'USD' | 'ARS';
  neighborhood: string;
  location: {
    address: string;
    city: string;
    province: string;
    department: string;
    locality: string;
    lat?: number;
    lng?: number;
    googleMapsUrl?: string;
  };
  features: {
    rooms: number;
    bedrooms: number;
    bathrooms: number;
    m2Total: number;
    m2Covered: number;
    amenities: string[];
  };
  images: PropertyImage[];
  status: 'active' | 'sold' | 'rented' | 'archived';
  viewsCount: number;
  leadsCount: number;
  createdAt: string;
  updatedAt: string;
  lastSyncAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
  propertyRef?: string;
  status: 'new' | 'contacted' | 'closed' | 'discarded';
  createdAt: string;
  source: 'whatsapp' | 'web_form' | 'direct';
}

export interface SyncStats {
  lastSync: string;
  totalSynced: number;
  added: number;
  updated: number;
  deleted: number;
  errors: string[];
}
