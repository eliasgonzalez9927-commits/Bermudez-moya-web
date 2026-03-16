
import React, { useState, useEffect, useRef } from 'react';
import { WHATSAPP_NUMBER } from '../constants';
import { sendLeadToGvamax } from '../services/leadService';

interface ContactSectionProps {
  content?: any;
}

const ContactSection: React.FC<ContactSectionProps> = ({ content }) => {
  const contactoData = content?.contacto || {
    titulo: "Hablemos de tu próximo hogar",
    subtitulo: "Nuestro equipo de expertos está listo para asesorarte en cada paso de tu inversión inmobiliaria.",
    direccion: "Gral. José María Paz Oeste 640, 1er Piso Oficina 14 y 15, San Juan, Argentina",
    email: "bermudezmoyap@gmail.com",
    whatsapp: WHATSAPP_NUMBER,
    mapa: { lat: -31.5369, lng: -68.5251 }
  };

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    celular: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Inicializar el mapa de la oficina
    const officeCoords: [number, number] = [contactoData.mapa?.lat || -31.5369, contactoData.mapa?.lng || -68.5251];
    
    setTimeout(() => {
      const L = (window as any).L;
      if (L && !mapRef.current) {
        mapRef.current = L.map('contact-map', {
          scrollWheelZoom: false
        }).setView(officeCoords, 16);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapRef.current);

        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg></div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        });

        L.marker(officeCoords, { icon: customIcon })
          .addTo(mapRef.current)
          .bindPopup(`
            <div class="p-2 text-center">
              <p class="font-black text-slate-900 text-sm mb-1">Bermudez-Moya Group</p>
              <p class="text-xs text-slate-500">${contactoData.direccion}</p>
            </div>
          `)
          .openPopup();
      }
    }, 200);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [contactoData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);
    
    const success = await sendLeadToGvamax({
      nombre: formData.nombre,
      apellido: formData.apellido,
      celular: formData.celular,
      email: formData.email,
      asunto: formData.asunto,
      detalle: formData.mensaje
    });

    setIsSubmitting(false);
    if (success) {
      setSubmitted(true);
      setFormData({ nombre: '', apellido: '', celular: '', email: '', asunto: '', mensaje: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 5000);
    }
  };

  const waUrl = `https://wa.me/${contactoData.whatsapp || WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola! Estoy en la sección de contacto de la web y me gustaría realizar una consulta.")}`;

  return (
    <div className="bg-brand-light min-h-screen">
      {/* Hero Contact */}
      <div className="relative pt-32 pb-20 px-4 overflow-hidden bg-brand-black">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-red rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red rounded-full blur-[150px] translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1 bg-brand-red/10 text-brand-red text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">Estamos para ayudarte</span>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
            {contactoData.titulo.split(' ').slice(0, -2).join(' ')} <br/><span className="text-brand-red">{contactoData.titulo.split(' ').slice(-2).join(' ')}</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
            {contactoData.subtitulo}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Methods Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[1.5rem] shadow-2xl shadow-black/5 border border-brand-border group">
              <div className="w-14 h-14 bg-red-50 text-brand-red rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-brand-red group-hover:text-white duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-2">Visítanos</h3>
              <p className="text-brand-gray font-medium text-sm leading-relaxed whitespace-pre-line">
                {contactoData.direccion}
              </p>
            </div>

            <div className="bg-white p-8 rounded-[1.5rem] shadow-2xl shadow-black/5 border border-brand-border group">
              <div className="w-14 h-14 bg-red-50 text-brand-red rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-brand-red group-hover:text-white duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-2">Escríbenos</h3>
              <p className="text-brand-gray font-medium text-sm">{contactoData.email}</p>
              <p className="text-brand-gray/60 text-xs mt-1">Respondemos en menos de 24hs</p>
            </div>

            <a 
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-brand-red hover:bg-[#a01520] text-white p-8 rounded-[1.5rem] shadow-2xl shadow-brand-red/20 transition-all hover:-translate-y-1 relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.747-2.874-2.512-2.96-2.626-.088-.113-.716-.953-.716-1.819 0-.866.454-1.292.614-1.457.16-.165.346-.207.461-.207.115 0 .23 0 .331.005.106.005.25-.039.391.305.143.349.491 1.196.535 1.283.043.088.072.19.014.305-.058.115-.088.19-.174.29-.088.098-.184.221-.264.295-.088.081-.18.17-.078.347.103.177.459.755.984 1.222.674.6 1.242.787 1.419.874.177.088.28.073.385-.048.103-.121.442-.512.561-.686.118-.174.237-.145.399-.086.163.058 1.026.484 1.203.573.177.089.294.133.336.207.042.073.042.427-.101.831z"/></svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Canal Directo</span>
                </div>
                <h3 className="text-2xl font-black mb-1">WhatsApp Business</h3>
                <p className="text-white/80 text-sm font-medium">Click para chatear ahora</p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[1.5rem] shadow-2xl shadow-black/5 border border-brand-border">
              <h2 className="text-3xl font-black text-brand-black mb-8">Envíanos un mensaje</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-100 p-8 rounded-[1.5rem] text-center animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-2xl font-black text-green-900 mb-2">¡Mensaje Recibido!</h3>
                  <p className="text-green-700 font-medium">Nos pondremos en contacto contigo a la brevedad.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-center text-brand-red font-bold animate-in fade-in duration-300">
                      Hubo un error al enviar el mensaje. Por favor intenta de nuevo.
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-brand-gray tracking-widest ml-4">Nombre</label>
                      <input 
                         type="text" 
                         required
                         className="w-full px-6 py-4 bg-brand-light border-none rounded-2xl focus:ring-4 focus:ring-brand-red/10 outline-none transition-all font-medium text-brand-black"
                         placeholder="Tu nombre..."
                         value={formData.nombre}
                         onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-brand-gray tracking-widest ml-4">Apellido</label>
                      <input 
                         type="text" 
                         required
                         className="w-full px-6 py-4 bg-brand-light border-none rounded-2xl focus:ring-4 focus:ring-brand-red/10 outline-none transition-all font-medium text-brand-black"
                         placeholder="Tu apellido..."
                         value={formData.apellido}
                         onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                       />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-brand-gray tracking-widest ml-4">Celular</label>
                      <input 
                         type="tel" 
                         required
                         className="w-full px-6 py-4 bg-brand-light border-none rounded-2xl focus:ring-4 focus:ring-brand-red/10 outline-none transition-all font-medium text-brand-black"
                         placeholder="Ej: 2645813030"
                         value={formData.celular}
                         onChange={(e) => setFormData({...formData, celular: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-brand-gray tracking-widest ml-4">Correo Electrónico</label>
                      <input 
                        type="email" 
                        required
                        className="w-full px-6 py-4 bg-brand-light border-none rounded-2xl focus:ring-4 focus:ring-brand-red/10 outline-none transition-all font-medium text-brand-black"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-brand-gray tracking-widest ml-4">Asunto de consulta</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-brand-light border-none rounded-2xl focus:ring-4 focus:ring-brand-red/10 outline-none transition-all font-medium text-brand-black"
                      placeholder="Ej: Tasación de propiedad, Consulta por alquiler..."
                      value={formData.asunto}
                      onChange={(e) => setFormData({...formData, asunto: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-brand-gray tracking-widest ml-4">¿En qué podemos ayudarte?</label>
                    <textarea 
                      rows={6}
                      required
                      className="w-full px-6 py-4 bg-brand-light border-none rounded-2xl focus:ring-4 focus:ring-brand-red/10 outline-none transition-all font-medium text-brand-black resize-none"
                      placeholder="Escribe aquí tu mensaje detallado..."
                      value={formData.mensaje}
                      onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-brand-red text-white px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#a01520] transition-all shadow-xl shadow-brand-red/20 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Enviando...
                      </>
                    ) : 'Enviar Formulario'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="mt-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black text-brand-black">Ubicación Estratégica</h2>
            <div className="h-px flex-1 bg-brand-border"></div>
          </div>
          <div id="contact-map" className="w-full h-[600px] rounded-[1.5rem] shadow-2xl border-8 border-white overflow-hidden relative z-10">
            {/* El mapa se inicializa vía useEffect */}
          </div>
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[1.5rem] shadow-xl border border-brand-border gap-6">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-brand-black rounded-2xl flex items-center justify-center text-white font-bold text-2xl">BM</div>
                <div>
                   <h4 className="font-bold text-brand-black text-lg uppercase tracking-tight">Oficina Central San Juan</h4>
                   <p className="text-brand-gray font-medium">Atención de Lunes a Viernes de 09:00 a 18:00hs</p>
                </div>
             </div>
             <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(contactoData.direccion)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-brand-light hover:bg-brand-border text-brand-black font-bold uppercase text-[10px] tracking-widest rounded-2xl transition-all"
             >
                Cómo Llegar en Google Maps
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
