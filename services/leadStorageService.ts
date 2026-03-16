
import { Lead } from '../types';

const STORAGE_KEY = 'bm_leads';

export interface NewLeadData {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
  propertyRef?: string;
}

export const saveLeadLocally = (data: NewLeadData): Lead => {
  const lead: Lead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    propertyId: data.propertyId,
    propertyRef: data.propertyRef,
    status: 'new',
    source: 'web_form',
    createdAt: new Date().toISOString(),
  };

  const existing = getLocalLeads();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([lead, ...existing]));
  return lead;
};

export const getLocalLeads = (): Lead[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const updateLeadStatusLocally = (id: string, status: Lead['status']): void => {
  const leads = getLocalLeads().map(l => l.id === id ? { ...l, status } : l);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
};
