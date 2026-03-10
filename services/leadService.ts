
const GVAMAX_API = 'https://gvamax.ar/Api/v3';
const GVAMAX_TOKEN = 'b495ce63ede0f4efc9eec62cb947c162';
const GVAMAX_ID = '1253';
const PROXY = 'https://api.allorigins.win/raw?url=';

export interface LeadData {
  nombre: string;
  apellido: string;
  celular: string;
  email: string;
  asunto: string;
  detalle: string;
  inmueble?: string;
}

export const sendLeadToGvamax = async (lead: LeadData): Promise<boolean> => {
  try {
    const params = new URLSearchParams({
      token: GVAMAX_TOKEN,
      id: GVAMAX_ID,
      nombre: lead.nombre,
      apellido: lead.apellido,
      celular: lead.celular,
      email: lead.email,
      asunto: lead.asunto,
      detalle: lead.detalle,
      accion: '6',
      condicion: '1',
      canal: '2'
    });

    if (lead.inmueble) {
      params.append('inmueble', lead.inmueble);
    }

    const apiUrl = `${GVAMAX_API}/crm/addlead?${params.toString()}`;
    const url = `${PROXY}${encodeURIComponent(apiUrl)}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`HTTP Error ${response.status}: ${response.statusText}`);
      return false;
    }
    const data = await response.json();

    if (String(data.status) !== "200") {
      console.error("Gvamax Lead API Error:", data);
    }

    return String(data.status) === "200";
  } catch (error) {
    console.error("Error sending lead to Gvamax:", error);
    return false;
  }
};
