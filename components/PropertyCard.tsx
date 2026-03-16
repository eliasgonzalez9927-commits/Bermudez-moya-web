
import React from 'react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick: (id: string) => void;
  compact?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, compact = false }) => {
  if (compact) {
    return (
      <div 
        onClick={() => onClick(property.id)}
        className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex gap-4 cursor-pointer hover:shadow-md hover:border-brand-red/20 transition-all group"
      >
        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 relative">
          <img 
            src={property.images[0]?.url || 'https://picsum.photos/200/200'} 
            alt={property.images[0]?.altText || property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {property.images.length > 1 && (
            <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-white text-[8px] px-1.5 py-0.5 rounded-md flex items-center gap-1 font-bold">
              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
              {property.images.length}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <h4 className="text-xs font-black text-slate-900 truncate mb-1 leading-tight">{property.title}</h4>
          <p className="text-brand-red font-black text-sm mb-1">{property.currency} {property.price.toLocaleString('es-AR')}</p>
          <div className="flex gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>{property.features.rooms} Amb</span>
            <span>{property.features.m2Total} m²</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onClick(property.id)}
      className="bg-white rounded-[1.5rem] shadow-[0_5px_20px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer border border-brand-border group flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-light">
        <img 
          src={property.images[0]?.url || 'https://picsum.photos/400/300'} 
          alt={property.images[0]?.altText || property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Indicators Overlay */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <span className={`text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl ${property.operation === 'Venta' ? 'bg-brand-red' : 'bg-brand-black'}`}>
            {property.operation}
          </span>
          <span className="bg-brand-gray text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl">
            {property.type}
          </span>
        </div>

        {/* Image count badge */}
        {property.images.length > 1 && (
          <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold border border-white/30 shadow-lg">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
            {property.images.length} FOTOS
          </div>
        )}

        {property.features.rooms > 0 && (
          <div className="absolute bottom-6 left-6 right-6 flex gap-2">
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
              <span className="text-xs font-bold text-brand-black">{property.features.rooms} Amb.</span>
            </div>
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
              <span className="text-xs font-bold text-brand-black">{property.features.m2Total} m²</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-brand-black truncate leading-tight group-hover:text-brand-red transition-colors mb-1">{property.title}</h3>
            <p className="text-xs font-bold text-brand-gray uppercase tracking-widest truncate">{property.neighborhood}, {property.location.city}</p>
          </div>
          <p className="text-2xl font-black text-brand-red whitespace-nowrap">
            {property.currency} {property.price.toLocaleString('es-AR')}
          </p>
        </div>
        
        <p className="text-brand-gray text-sm mb-6 line-clamp-2 min-h-[2.5rem] font-medium leading-relaxed">
          {property.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-6 border-t border-brand-border">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">REF: {property.ref}</span>
          <div className="flex items-center gap-2 text-brand-red font-bold text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
            Ver Detalle
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
