
import { GoogleGenAI } from "@google/genai";
import { Property } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generatePropertyDescription = async (property: Partial<Property>) => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Eres un experto en marketing inmobiliario para la empresa Bermudez-Moya.
    Genera una descripción vendedora, profesional y atractiva para la siguiente propiedad:
    Título: ${property.title}
    Tipo: ${property.type}
    Operación: ${property.operation}
    Precio: ${property.currency} ${property.price}
    Ubicación: ${property.location?.address}, ${property.neighborhood}, ${property.location?.locality}, ${property.location?.province}
    Características: ${property.features?.bedrooms} dormitorios, ${property.features?.bathrooms} baños, ${property.features?.m2Total}m2 totales.
    Amenities: ${property.features?.amenities?.join(", ")}
    
    La descripción debe resaltar los beneficios de la zona y la calidad de la propiedad. 
    Usa un tono sofisticado pero cercano. Máximo 150 palabras.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text || "No se pudo generar la descripción.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Error al conectar con el asistente de IA.";
  }
};

export const getAIInsights = async (properties: Property[]) => {
  const model = "gemini-3-flash-preview";
  
  // Prepare a summary of properties for the AI
  const summary = properties.map(p => ({
    title: p.title,
    price: `${p.currency} ${p.price}`,
    views: p.viewsCount,
    leads: p.leadsCount,
    type: p.type
  }));

  const prompt = `
    Analiza los siguientes datos de la inmobiliaria Bermudez-Moya y actúa como un consultor estratégico senior.
    Datos: ${JSON.stringify(summary)}
    
    Identifica:
    1. Cuál es la propiedad "estrella" (mejor relación vistas/leads).
    2. Tendencias de lo más buscado según los datos.
    3. Una recomendación rápida para mejorar las ventas.
    
    Responde en formato Markdown, de forma concisa y profesional. Usa emojis para resaltar puntos clave.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text || "No hay insights disponibles en este momento.";
  } catch (error) {
    console.error("Error getting insights:", error);
    return "Error al obtener insights de la IA.";
  }
};
