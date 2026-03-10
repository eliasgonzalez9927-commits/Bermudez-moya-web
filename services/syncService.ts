
import { Property, SyncStats, PropertyType, OperationType, PropertyImage } from '../types';

const GVAMAX_API = 'https://gvamax.ar/Api/v3';
const GVAMAX_TOKEN = import.meta.env.VITE_GVAMAX_TOKEN || 'b495ce63ede0f4efc9eec62cb947c162';
const GVAMAX_ID = import.meta.env.VITE_GVAMAX_ID || '1253';
const PROXY = 'https://api.allorigins.win/raw?url=';

const cleanHtml = (text: string): string => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const mapPropertyType = (typeStr: string): PropertyType => {
  const type = typeStr.toLowerCase();
  if (type.includes('casa')) return PropertyType.HOUSE;
  if (type.includes('departamento')) return PropertyType.APARTMENT;
  if (type.includes('lote') || type.includes('terreno')) return PropertyType.LOT;
  if (type.includes('oficina')) return PropertyType.OFFICE;
  if (type.includes('local')) return PropertyType.COMMERCIAL;
  return PropertyType.HOUSE; // Default
};

const mapOperationType = (opStr: string): OperationType => {
  const op = opStr.toLowerCase();
  if (op.includes('venta') || op.includes('compra')) return OperationType.SALE;
  if (op.includes('alquiler temporario')) return OperationType.TEMPORARY;
  if (op.includes('alquiler')) return OperationType.RENT;
  return OperationType.SALE; // Default
};

const mapGvamaxToProperty = (item: any): Property => {
  const coords = item.ubicacion?.coordenadas?.split(',') || [];
  
  const images: PropertyImage[] = [];
  if (item.media?.images) {
    Object.values(item.media.images).forEach((img: any, index: number) => {
      images.push({
        id: img.id || `img-${index}`,
        url: img.url,
        fileName: img.name || '',
        altText: item.tituloComercial || '',
        order: index
      });
    });
  }

  return {
    id: String(item.id),
    externalId: String(item.id),
    ref: item.referencia || String(item.id),
    title: item.tituloComercial || 'Sin título',
    description: cleanHtml(item.descripcion),
    type: mapPropertyType(item.tipoInmueble || ''),
    operation: mapOperationType(item.tipoOperacion || ''),
    price: parseFloat(String(item.precio || '0').replace(/[^0-9.]/g, '')) || 0,
    currency: item.moneda === 'P' ? 'ARS' : 'USD',
    neighborhood: item.ubicacion?.barrio || '',
    location: {
      address: `${item.ubicacion?.calle || ''} ${item.ubicacion?.numero || ''}`.trim(),
      city: item.ubicacion?.localidad || '',
      province: item.ubicacion?.provincia || '',
      department: item.ubicacion?.departamento || '',
      locality: item.ubicacion?.localidad || '',
      lat: coords[0] ? parseFloat(coords[0]) : undefined,
      lng: coords[1] ? parseFloat(coords[1]) : undefined,
    },
    features: {
      rooms: parseInt(item.ambientes) || 0,
      bedrooms: parseInt(item.dormitorios) || 0,
      bathrooms: parseInt(item.banos) || 0,
      m2Total: parseFloat(item.superficies?.metrosTerreno) || 0,
      m2Covered: parseFloat(item.superficies?.metrosCubiertos) || 0,
      amenities: [] // Gvamax structure for amenities might vary, keeping empty for now as per instructions
    },
    images,
    status: item.disponible === 1 ? 'active' : item.disponible === 2 ? 'sold' : 'rented',
    viewsCount: 0,
    leadsCount: 0,
    createdAt: item.fechaIngreso || new Date().toISOString(),
    updatedAt: item.fechaActualizada || new Date().toISOString(),
    lastSyncAt: new Date().toISOString()
  };
};

export const fetchAllProperties = async (): Promise<Property[]> => {
  try {
    const apiUrl = `${GVAMAX_API}/inmuebles?token=${GVAMAX_TOKEN}&id=${GVAMAX_ID}&disponible=1&page=1`;
    const url = `${PROXY}${encodeURIComponent(apiUrl)}`;
    const firstPageRes = await fetch(url);
    if (!firstPageRes.ok) {
      throw new Error(`HTTP Error ${firstPageRes.status}: ${firstPageRes.statusText}`);
    }
    const firstPageData = await firstPageRes.json();
    
    // Some endpoints might not return a status field, so we check for content as the success indicator
    if (!firstPageData.content && String(firstPageData.status) !== "200") {
      console.error("Gvamax API Unexpected Response:", firstPageData);
      throw new Error(`Error fetching from Gvamax: ${firstPageData.message || 'Missing content and status'}`);
    }

    if (!firstPageData.content) {
      console.error("Gvamax API Missing Content:", firstPageData);
      throw new Error("Error fetching from Gvamax: Missing 'content' in response");
    }

    const totalPages = firstPageData.content.totalpages || 1;
    let allItems = [...(firstPageData.content.inmuebles || [])];

    if (totalPages > 1) {
      const pagePromises = [];
      for (let i = 2; i <= totalPages; i++) {
        const pageApiUrl = `${GVAMAX_API}/inmuebles?token=${GVAMAX_TOKEN}&id=${GVAMAX_ID}&disponible=1&page=${i}`;
        const pageUrl = `${PROXY}${encodeURIComponent(pageApiUrl)}`;
        pagePromises.push(
          fetch(pageUrl).then(res => res.json())
        );
      }
      const otherPagesData = await Promise.all(pagePromises);
      otherPagesData.forEach(data => {
        if (data.content?.inmuebles) {
          allItems = [...allItems, ...data.content.inmuebles];
        }
      });
    }

    return allItems.map(mapGvamaxToProperty);
  } catch (error) {
    console.error("Sync error:", error);
    throw error; // Throw error to be caught in App.tsx
  }
};

export const syncWithGvamax = async (): Promise<SyncStats> => {
  const properties = await fetchAllProperties();
  localStorage.setItem('gvamax_properties', JSON.stringify(properties));
  
  return {
    lastSync: new Date().toISOString(),
    totalSynced: properties.length,
    added: properties.length,
    updated: 0,
    deleted: 0,
    errors: []
  };
};

export const getCachedProperties = (): Property[] => {
  const cached = localStorage.getItem('gvamax_properties');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      return [];
    }
  }
  return [];
};
