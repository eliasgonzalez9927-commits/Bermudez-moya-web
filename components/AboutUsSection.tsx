
import React from 'react';
import { WHATSAPP_NUMBER } from '../constants';

interface ValueCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, icon }) => (
  <div className="bg-white p-8 rounded-[1rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border-l-4 border-brand-red flex flex-col items-start text-left group hover:-translate-y-2 transition-all duration-500">
    <div className="w-12 h-12 text-brand-red flex items-center justify-center mb-6 transition-colors duration-500">
      {icon}
    </div>
    <h4 className="text-xl font-bold text-brand-black mb-3 tracking-tight">{title}</h4>
    <p className="text-brand-gray text-sm leading-relaxed font-medium">{description}</p>
  </div>
);

interface StaffCardProps {
  name: string;
  role: string[];
  image: string;
  links: {
    instagram?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

const StaffCard: React.FC<StaffCardProps> = ({ name, role, image, links }) => (
  <div className="group relative bg-white rounded-[1.5rem] overflow-hidden shadow-2xl shadow-black/5 border border-brand-border">
    <div className="aspect-[4/5] overflow-hidden relative">
      <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
      
      {/* Social Links Overlay */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        {links.linkedin && (
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center hover:bg-white hover:text-brand-red transition-all">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
        )}
        {links.instagram && (
          <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center hover:bg-white hover:text-pink-600 transition-all">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
        )}
      </div>
    </div>
    <div className="p-8 text-center bg-white">
      <h3 className="text-2xl font-black text-brand-black mb-2 leading-none">{name}</h3>
      <div className="space-y-1">
        {role.map((r, i) => (
          <p key={i} className="text-brand-red font-bold text-[10px] uppercase tracking-widest">{r}</p>
        ))}
      </div>
    </div>
  </div>
);

const AboutUsSection: React.FC = () => {
  return (
    <div className="bg-brand-light min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 px-4 bg-brand-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-red rounded-full blur-[200px] translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-brand-red rounded-full blur-[200px] -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-brand-red"></div>
            <span className="text-brand-red text-xs font-bold uppercase tracking-[0.4em]">Conócenos</span>
            <div className="h-px w-12 bg-brand-red"></div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
            Transformamos sueños en <br/> <span className="text-brand-red">realidades tangibles</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Somos Bermudez-Moya Group, una organización inmobiliaria moderna que combina la pasión por el servicio con tecnología de vanguardia.
          </p>
        </div>
      </section>

      {/* Brand Narrative & Trust Stats */}
      <section className="max-w-7xl mx-auto px-4 -mt-24 relative z-20">
        <div className="bg-white rounded-[1.5rem] p-10 md:p-20 shadow-2xl border border-brand-border flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-4xl font-black text-brand-black leading-tight">Nuestra Historia es <br/> tu seguridad</h2>
            <p className="text-brand-gray text-lg leading-relaxed font-medium">
              Bermudez-Moya nació de la visión compartida de sus fundadores por profesionalizar y dar transparencia al mercado inmobiliario de San Juan. Entendemos que una propiedad no es solo ladrillos, es el proyecto de vida de una persona, de una familia o el fruto del esfuerzo de un inversor.
            </p>
            <p className="text-brand-gray text-lg leading-relaxed font-medium">
              Utilizamos herramientas de CRM avanzadas y marketing digital de precisión para asegurar que cada propiedad encuentre a su dueño ideal en el menor tiempo posible.
            </p>
            <div className="pt-4">
              <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')} className="bg-brand-black text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-brand-red transition-all shadow-xl">Contáctanos Hoy</button>
            </div>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            <div className="bg-brand-light p-10 rounded-[1.5rem] text-center border border-brand-border">
              <p className="text-4xl font-black text-brand-black mb-1">10+</p>
              <p className="text-[10px] font-bold text-brand-gray uppercase tracking-widest">Años de Experiencia</p>
            </div>
            <div className="bg-brand-light p-10 rounded-[1.5rem] text-center border border-brand-border">
              <p className="text-4xl font-black text-brand-red mb-1">500+</p>
              <p className="text-[10px] font-bold text-brand-gray uppercase tracking-widest">Operaciones Exitosas</p>
            </div>
            <div className="bg-brand-light p-10 rounded-[1.5rem] text-center border border-brand-border">
              <p className="text-4xl font-black text-brand-red mb-1">24/7</p>
              <p className="text-[10px] font-bold text-brand-gray uppercase tracking-widest">Asesoramiento Online</p>
            </div>
            <div className="bg-brand-light p-10 rounded-[1.5rem] text-center border border-brand-border">
              <p className="text-4xl font-black text-brand-black mb-1">100%</p>
              <p className="text-[10px] font-bold text-brand-gray uppercase tracking-widest">Clientes Satisfechos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-xs font-bold text-brand-red uppercase tracking-[0.4em] mb-4">Filosofía de Trabajo</h2>
          <h3 className="text-4xl font-black text-brand-black">Nuestros Valores Fundamentales</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ValueCard 
            title="Transparencia" 
            description="Información clara y precisa en cada etapa de la operación, sin sorpresas."
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
          />
          <ValueCard 
            title="Innovación" 
            description="Aplicamos tecnología Gvamax para sincronización y marketing de alta precisión."
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
          <ValueCard 
            title="Compromiso" 
            description="No solo vendemos propiedades, construimos relaciones de confianza a largo plazo."
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
          />
          <ValueCard 
            title="Excelencia" 
            description="Cuidamos cada detalle estético y legal para garantizar una experiencia premium."
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>}
          />
        </div>
      </section>

      {/* Staff Section */}
      <section className="py-32 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
             <h2 className="text-5xl font-black text-brand-black tracking-tighter mb-4">Nuestro Capital Humano</h2>
             <p className="text-brand-gray font-medium text-lg max-w-2xl mx-auto">Un equipo multidisciplinario enfocado en brindar resultados excepcionales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <StaffCard 
              name="Sebastian Bermudez"
              role={["Co - fundador de Bermudez Moya", "Corredor inmobiliario."]}
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
              links={{
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com",
                whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`
              }}
            />
            <StaffCard 
              name="Valeria Moya"
              role={[
                "Co - fundadora de Bermudez Moya", 
                "Lic. en Comercio Internacional"
              ]}
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
              links={{
                instagram: "https://instagram.com",
                whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`
              }}
            />
            <StaffCard 
              name="Pablo Denis Martin"
              role={["Martillero y corredor inmobiliario."]}
              image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
              links={{
                instagram: "https://instagram.com",
                whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`
              }}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto bg-brand-red rounded-[1.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-brand-red/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">¿Listo para encontrar <br/> tu lugar en el mundo?</h2>
            <p className="text-white/80 text-lg mb-12 max-w-xl mx-auto font-medium">Agenda una reunión personalizada con nuestros asesores y empieza a construir tu futuro hoy mismo.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')} className="bg-white text-brand-red px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-brand-black hover:text-white transition-all shadow-xl">Agendar Entrevista</button>
              <button className="bg-brand-red/50 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-brand-black transition-all">Ver Propiedades</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsSection;
