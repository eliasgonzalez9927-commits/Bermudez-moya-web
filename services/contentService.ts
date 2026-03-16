import { sanityClient } from './sanityClient';

export const getSiteContent = async () => {
  const query = `{
    "banners": *[_type == "banner"] | order(order asc) {
      _id, titulo, subtitulo, ctaTexto, ctaAccion,
      "imagen": imagen.asset->url
    },
    "nosotros": *[_type == "nosotros"][0] {
      titulo, subtitulo, historia, 
      stats[]{ numero, label },
      valores[]{ icono, titulo, descripcion },
      equipo[]{ nombre, cargo, "foto": foto.asset->url }
    },
    "servicios": *[_type == "servicio"] | order(order asc) {
      _id, icono, titulo, descripcion
    },
    "contacto": *[_type == "contacto"][0] {
      direccion, telefono, email, whatsapp,
      horario, googleMapsUrl
    }
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
};
