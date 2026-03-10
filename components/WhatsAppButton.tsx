
import React from 'react';
import { WHATSAPP_NUMBER } from '../constants';

interface WhatsAppButtonProps {
  propertyRef: string;
  propertyTitle: string;
  variant?: 'floating' | 'inline';
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ propertyRef, propertyTitle, variant = 'inline' }) => {
  const message = `Hola! Me interesa la propiedad ${propertyTitle} (REF: ${propertyRef}). Me gustaría recibir más información.`;
  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  if (variant === 'floating') {
    return (
      <a 
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.747-2.874-2.512-2.96-2.626-.088-.113-.716-.953-.716-1.819 0-.866.454-1.292.614-1.457.16-.165.346-.207.461-.207.115 0 .23 0 .331.005.106.005.25-.039.391.305.143.349.491 1.196.535 1.283.043.088.072.19.014.305-.058.115-.088.19-.174.29-.088.098-.184.221-.264.295-.088.081-.18.17-.078.347.103.177.459.755.984 1.222.674.6 1.242.787 1.419.874.177.088.28.073.385-.048.103-.121.442-.512.561-.686.118-.174.237-.145.399-.086.163.058 1.026.484 1.203.573.177.089.294.133.336.207.042.073.042.427-.101.831z"/>
        </svg>
      </a>
    );
  }

  return (
    <a 
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full md:w-auto text-lg"
    >
       <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.747-2.874-2.512-2.96-2.626-.088-.113-.716-.953-.716-1.819 0-.866.454-1.292.614-1.457.16-.165.346-.207.461-.207.115 0 .23 0 .331.005.106.005.25-.039.391.305.143.349.491 1.196.535 1.283.043.088.072.19.014.305-.058.115-.088.19-.174.29-.088.098-.184.221-.264.295-.088.081-.18.17-.078.347.103.177.459.755.984 1.222.674.6 1.242.787 1.419.874.177.088.28.073.385-.048.103-.121.442-.512.561-.686.118-.174.237-.145.399-.086.163.058 1.026.484 1.203.573.177.089.294.133.336.207.042.073.042.427-.101.831z"/>
        </svg>
      Consultar por WhatsApp
    </a>
  );
};

export default WhatsAppButton;
