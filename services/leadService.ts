
import { saveLeadLocally } from './leadStorageService';

const GVAMAX_API = 'https://gvamax.ar/Api/v3';
const GVAMAX_TOKEN = 'b495ce63ede0f4efc9eec62cb947c162';
const GVAMAX_ID = '1253';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export interface LeadData {
  nombre: string;
  apellido: string;
  celular: string;
  email: string;
  asunto: string;
  detalle: string;
  inmueble?: string;
}

const sendEmailNotification = async (lead: LeadData, propertyRef?: string): Promise<void> => {
  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: lead.nombre,
        apellido: lead.apellido,
        email: lead.email,
        celular: lead.celular,
        asunto: lead.asunto,
        detalle: lead.detalle,
        propertyRef,
      }),
    });
  } catch (err) {
    console.warn('Email notification failed (non-blocking):', err);
  }
};

export const sendLeadToGvamax = async (lead: LeadData): Promise<boolean> => {
  // 1. Guardar localmente siempre
  saveLeadLocally({
    name: `${lead.nombre} ${lead.apellido}`.trim(),
    email: lead.email,
    phone: lead.celular,
    message: lead.detalle,
    propertyRef: lead.inmueble || lead.asunto,
    propertyId: lead.inmueble,
  });

  // 2. Enviar notificación al admin + confirmación al usuario (no bloquean)
  sendEmailNotification(lead, lead.inmueble);
  // Confirmación al usuario
  fetch('/api/send-confirmation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: lead.nombre,
      email: lead.email,
      asunto: lead.asunto,
      propertyRef: lead.inmueble,
    }),
  }).catch(() => {/* non-blocking */});

  // 3. Enviar a Gvamax CRM
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
      canal: '2',
    });

    if (lead.inmueble) {
      params.append('inmueble', lead.inmueble);
    }

    const apiUrl = `${GVAMAX_API}/crm/addlead?${params.toString()}`;
    const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
    const response = await fetch(url);
    if (!response.ok) return true; // ya guardamos local, igual es éxito para el usuario

    const data = await response.json();
    return String(data.status) === '200';
  } catch (error) {
    console.error('Error sending lead to Gvamax:', error);
    return true; // ya guardamos local
  }
};
