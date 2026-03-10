
import { Property } from '../types';

/**
 * Lógica de Backend: Renombrado SEO Físico
 * Patrón: tipo-operacion-barrio-nombre-inmobiliaria-[id].webp
 */
export const renameImageForSEO = (
  property: { type: string; operation: string; neighborhood: string; id: string },
  index: number
): string => {
  const sanitize = (str: string) => 
    str.toLowerCase()
       .normalize("NFD")
       .replace(/[\u0300-\u036f]/g, "")
       .replace(/[^a-z0-9]/g, "-")
       .replace(/-+/g, "-")
       .trim();

  const type = sanitize(property.type);
  const op = sanitize(property.operation);
  const neighborhood = sanitize(property.neighborhood);
  
  return `${type}-${op}-${neighborhood}-bermudez-moya-${property.id}-${index}.webp`;
};

/**
 * Genera un texto alternativo (alt text) altamente descriptivo para SEO y Accesibilidad.
 * Optimizado para AEO (Answer Engine Optimization) incluyendo detalles clave de la propiedad.
 */
export const generateAltText = (property: Property, index: number): string => {
  const { type, operation, neighborhood, location, features, title } = property;
  const city = location.city;
  const rooms = features.rooms;
  const m2 = features.m2Total;

  // Palabras clave descriptivas basadas en el índice para simular reconocimiento de contenido
  const contextKeywords = [
    "Vista principal",
    "Living comedor amplio",
    "Dormitorio luminoso",
    "Cocina moderna",
    "Baño completo",
    "Balcón terraza",
    "Amenities exclusivos"
  ];

  const context = contextKeywords[index] || `Detalle de la propiedad ${index + 1}`;

  // Estructura: [Contexto] - [Tipo] en [Operación] en [Barrio], [Ciudad] - [Ambientes] amb, [m2]m2 - [Título] - Inmobiliaria Bermudez Moya
  return `${context}: ${type} en ${operation} en ${neighborhood}, ${city}. ${rooms} ambientes, ${m2}m². ${title}. Inmobiliaria Bermudez Moya.`;
};
