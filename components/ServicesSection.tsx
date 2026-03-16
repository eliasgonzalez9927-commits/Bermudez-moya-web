
import React from 'react';
import { WHATSAPP_NUMBER } from '../constants';

interface ServiceCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon }) => {
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola! Me interesa el servicio de: ${title}. Me gustaría recibir más información.`)}`;
  
  return (
    <div className="bg-white p-10 rounded-[1.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-brand-border flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <div className="w-20 h-20 mb-6 flex items-center justify-center text-brand-red transition-transform group-hover:scale-110 duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-brand-black mb-3 leading-tight">{title}</h3>
      {description && <p className="text-brand-gray text-sm leading-relaxed max-w-[280px] mb-8">{description}</p>}
      
      <a 
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto bg-brand-black text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-red transition-all shadow-lg"
      >
        Consultar Ahora
      </a>
    </div>
  );
};

interface ServicesSectionProps {
  content?: any;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ content }) => {
  const servicesData = content?.servicios || [
    {
      _id: '1',
      titulo: "Gestión Inmobiliaria", 
      descripcion: "Te acompañamos en todo el proceso de tu operación inmobiliaria con total transparencia.",
      icono: "users"
    },
    {
      _id: '2',
      titulo: "Consultoría Profesional", 
      descripcion: "Especialistas en compra, venta, alquiler y tasaciones precisas del mercado actual.",
      icono: "shield"
    },
    {
      _id: '3',
      titulo: "Marketing Digital", 
      descripcion: "Posicionamos tu inmueble con herramientas de última generación y CRM avanzado.",
      icono: "megaphone"
    },
    {
      _id: '4',
      titulo: "Gestión Legal", 
      descripcion: "Documentación y trámites burocráticos simplificados para tu tranquilidad.",
      icono: "document"
    },
    {
      _id: '5',
      titulo: "Inversiones", 
      descripcion: "Análisis de viabilidad para proyectos inmobiliarios y rentabilidad asegurada.",
      icono: "chart"
    },
    {
      _id: '6',
      titulo: "Tasaciones", 
      descripcion: "Determinamos el valor real de mercado de tu propiedad con rigor técnico.",
      icono: "clock"
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'users':
        return <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
      case 'shield':
        return <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
      case 'megaphone':
        return <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.167a2.404 2.404 0 010-1.59l2.147-6.167a1.76 1.76 0 013.417.592zm3.673 13.076c1.222-.356 2.228-1.362 2.584-2.584M14.673 5.042c1.222.356 2.228-1.362 2.584 2.584m-1.054 3.426a4.423 4.423 0 010 1.896m-1.317-2.61a6.602 6.602 0 010 3.324" /></svg>;
      case 'document':
        return <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
      case 'chart':
        return <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
      case 'clock':
        return <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      default:
        return <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
  };

  return (
    <div className="bg-brand-light min-h-screen">
      <section className="py-24 px-4 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-brand-red opacity-50"></div>
            <span className="text-brand-red text-xs font-bold uppercase tracking-[0.3em]">Nuestros Servicios</span>
            <div className="h-px w-12 bg-brand-red opacity-50"></div>
          </div>
          <h2 className="text-5xl font-black text-brand-black tracking-tight">Expertos en Real Estate</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service: any) => (
            <ServiceCard 
              key={service._id}
              title={service.titulo} 
              description={service.descripcion}
              icon={getIcon(service.icono)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ServicesSection;
