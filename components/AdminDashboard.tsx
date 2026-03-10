
import React, { useState, useMemo } from 'react';
import { Property, SyncStats, Lead, User } from '../types';
import { MOCK_LEADS } from '../constants';
import { syncWithGvamax, getCachedProperties } from '../services/syncService';

type AdminView = 'overview' | 'leads' | 'sync' | 'settings';

interface AdminDashboardProps {
  currentUser: User;
  onLogout: () => void;
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onLogout, properties, setProperties }) => {
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncHistory, setSyncHistory] = useState<SyncStats[]>([]);
  
  // Settings state
  const [gvamaxApiKey, setGvamaxApiKey] = useState('b495ce63ede0f4efc9eec62cb947c162');
  const [whatsappNumber, setWhatsappNumber] = useState(localStorage.getItem('whatsapp_number') || '5492645813030');

  const stats = useMemo(() => {
    return {
      total: properties.length,
      active: properties.filter(p => p.status === 'active').length,
      leads: leads.length,
      newLeads: leads.filter(l => l.status === 'new').length,
    };
  }, [properties, leads]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncWithGvamax();
      setProperties(getCachedProperties());
      setSyncHistory([result, ...syncHistory]);
    } catch (e) {
      console.error("Error en la sincronización.");
    } finally {
      setIsSyncing(false);
    }
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gvamax_api_key', gvamaxApiKey);
    localStorage.setItem('whatsapp_number', whatsappNumber);
    alert('Configuración guardada correctamente');
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: 'leads', label: 'Leads Web', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { id: 'sync', label: 'Sincronización', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> },
    { id: 'settings', label: 'Configuración', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <div className="flex min-h-[calc(100vh-6rem)] bg-slate-50/30 animate-in fade-in duration-500">
      <aside className="w-72 bg-white border-r border-slate-100 p-8 space-y-4 hidden lg:block sticky top-24 h-[calc(100vh-6rem)]">
        <div className="mb-10 flex items-center gap-4 px-4">
          <img src={currentUser.avatar} className="w-10 h-10 rounded-xl shadow-sm border border-slate-100" alt="" />
          <div className="min-w-0">
            <p className="font-black text-slate-900 text-sm truncate">{currentUser.name}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentUser.role}</p>
          </div>
        </div>

        <div className="space-y-1">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveView(item.id as AdminView)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold transition-all duration-300 ${activeView === item.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-100 space-y-3">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 bg-slate-100 text-slate-600 px-6 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        {activeView === 'overview' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Monitoreo General</h2>
                <p className="text-slate-400 font-medium">Resumen de actividad vinculada con Gvamax.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Propiedades Gvamax', value: stats.active, icon: '🏠' },
                { label: 'Leads Totales', value: stats.leads, icon: '📩' },
                { label: 'Leads Nuevos', value: stats.newLeads, icon: '✨' },
              ].map((card, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
                  <span className="text-2xl mb-4 block">{card.icon}</span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                  <p className="text-3xl font-black text-slate-900">{card.value}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50">
              <h3 className="text-xl font-black text-slate-900 mb-4">Estado de la Plataforma</h3>
              <p className="text-slate-500 leading-relaxed">
                Este panel está configurado para el monitoreo de datos provenientes de Gvamax. 
                La gestión de propiedades y usuarios debe realizarse directamente desde el CRM externo.
              </p>
            </div>
          </div>
        )}

        {activeView === 'leads' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Leads Recibidos</h2>
              <p className="text-slate-400 font-medium">Consultas desde el formulario de contacto web.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-50">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <tr>
                    <th className="px-8 py-6">Cliente</th>
                    <th className="px-8 py-6">Contacto</th>
                    <th className="px-8 py-6">Propiedad / Mensaje</th>
                    <th className="px-8 py-6">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {leads.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-900">{l.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(l.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-slate-600">{l.email}</p>
                        <p className="text-sm text-slate-400">{l.phone}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-black text-blue-600 uppercase mb-1">{l.propertyRef || 'Consulta General'}</p>
                        <p className="text-sm text-slate-500 line-clamp-2">{l.message}</p>
                      </td>
                      <td className="px-8 py-6">
                        <select 
                          value={l.status} 
                          onChange={(e) => updateLeadStatus(l.id, e.target.value as Lead['status'])}
                          className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border-none outline-none cursor-pointer ${
                            l.status === 'new' ? 'bg-blue-50 text-blue-600' :
                            l.status === 'contacted' ? 'bg-amber-50 text-amber-600' :
                            l.status === 'closed' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-slate-100 text-slate-400'
                          }`}
                        >
                          <option value="new">Nuevo</option>
                          <option value="contacted">Contactado</option>
                          <option value="closed">Cerrado</option>
                          <option value="discarded">Descartado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'sync' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Sincronización</h2>
                <p className="text-slate-400 font-medium">Vinculación de datos con Gvamax CRM.</p>
              </div>
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100 disabled:opacity-50"
              >
                {isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50">
                <h3 className="text-xl font-black text-slate-900 mb-6">Última Sincronización</h3>
                {syncHistory.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <span className="text-sm font-bold text-slate-400 uppercase">Fecha</span>
                      <span className="font-black text-slate-900">{new Date(syncHistory[0].lastSync).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <span className="text-sm font-bold text-slate-400 uppercase">Propiedades</span>
                      <span className="font-black text-blue-600">{syncHistory[0].totalSynced}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm font-bold text-slate-400 uppercase">Resultado</span>
                      <span className="font-black text-emerald-500">ÉXITO</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No hay registros de sincronización recientes.</p>
                )}
              </div>

              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50">
                <h3 className="text-xl font-black text-slate-900 mb-6">Historial de Eventos</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4">
                  {syncHistory.map((sync, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Sincronización Exitosa</p>
                        <p className="text-[10px] text-slate-400 font-bold">{new Date(sync.lastSync).toLocaleString()}</p>
                      </div>
                      <span className="text-[10px] font-black text-blue-600">+{sync.added + sync.updated} cambios</span>
                    </div>
                  ))}
                  {syncHistory.length === 0 && <p className="text-slate-400 italic text-sm">El historial aparecerá aquí después de sincronizar.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'settings' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Configuración</h2>
              <p className="text-slate-400 font-medium">Ajustes de conexión y contacto.</p>
            </div>

            <div className="max-w-2xl bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50">
              <form onSubmit={handleSaveSettings} className="space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Gvamax API Key</label>
                    <input 
                      type="password" 
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="Ingresa tu API Key de Gvamax"
                      value={gvamaxApiKey}
                      onChange={(e) => setGvamaxApiKey(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">WhatsApp de Contacto</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="Ej: 5492645813030"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-100"
                >
                  Guardar Configuración
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
