
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Property, PropertyType, OperationType, User, UserRole } from './types';
import { getCachedProperties, syncWithGvamax } from './services/syncService';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import PropertyCard from './components/PropertyCard';
import WhatsAppButton from './components/WhatsAppButton';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import StickyContactSidebar from './components/StickyContactSidebar';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import AboutUsSection from './components/AboutUsSection';
import HeroBanner from './components/HeroBanner';

type ViewType = 'home' | 'services' | 'admin' | 'nosotros' | 'contacto';
type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>(getCachedProperties());
  const [syncError, setSyncError] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'All'>('All');
  const [opFilter, setOpFilter] = useState<OperationType | 'All'>('All');
  const [provinceFilter, setProvinceFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [localityFilter, setLocalityFilter] = useState<string>('All');
  const [roomsFilter, setRoomsFilter] = useState<number | 'All'>('All');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const cached = getCachedProperties();
    if (cached.length > 0) {
      setProperties(cached);
    } else {
      setIsSyncing(true);
      syncWithGvamax()
        .then(result => {
          const fresh = getCachedProperties();
          setProperties(fresh);
          setSyncError('');
        })
        .catch(err => {
          setSyncError(`No hay propiedades disponibles en este momento.`);
          console.error('Sync error:', err);
        })
        .finally(() => setIsSyncing(false));
    }
  }, []);

  const absolutePriceRange = useMemo(() => {
    if (properties.length === 0) return { min: 0, max: 1000000 };
    const prices = properties.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [properties]);

  const [priceRange, setPriceRange] = useState<[number, number]>([absolutePriceRange.min, absolutePriceRange.max]);

  // Update price range when properties change
  useEffect(() => {
    setPriceRange([absolutePriceRange.min, absolutePriceRange.max]);
  }, [absolutePriceRange]);

  const mapRef = useRef<any>(null);

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('All');
    setOpFilter('All');
    setProvinceFilter('All');
    setDepartmentFilter('All');
    setLocalityFilter('All');
    setRoomsFilter('All');
    setSelectedAmenities([]);
    setSortBy('newest');
    setPriceRange([absolutePriceRange.min, absolutePriceRange.max]);
  };

  const locationOptions = useMemo(() => {
    const provinces = new Set<string>();
    const departments = new Set<string>();
    const localities = new Set<string>();

    properties.forEach(p => {
      if (p.location.province) provinces.add(p.location.province);
      if (provinceFilter === 'All' || p.location.province === provinceFilter) {
        if (p.location.department) departments.add(p.location.department);
      }
      const matchesProv = provinceFilter === 'All' || p.location.province === provinceFilter;
      const matchesDept = departmentFilter === 'All' || p.location.department === departmentFilter;
      if (matchesProv && matchesDept) {
        if (p.location.locality) localities.add(p.location.locality);
      }
    });

    return {
      provinces: Array.from(provinces).sort(),
      departments: Array.from(departments).sort(),
      localities: Array.from(localities).sort()
    };
  }, [properties, provinceFilter, departmentFilter]);

  const allAmenities = useMemo(() => {
    const amenities = new Set<string>();
    properties.forEach(p => p.features.amenities.forEach(a => amenities.add(a)));
    return Array.from(amenities).sort();
  }, [properties]);

  const filteredAndSortedProperties = useMemo(() => {
    let result = properties.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                           p.neighborhood?.toLowerCase().includes(search.toLowerCase()) ||
                           p.location.address.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'All' || p.type === typeFilter;
      const matchesOp = opFilter === 'All' || p.operation === opFilter;
      const matchesProv = provinceFilter === 'All' || p.location.province === provinceFilter;
      const matchesDept = departmentFilter === 'All' || p.location.department === departmentFilter;
      const matchesLoc = localityFilter === 'All' || p.location.locality === localityFilter;
      const matchesAmenities = selectedAmenities.length === 0 || 
                               selectedAmenities.every(a => p.features.amenities.includes(a));
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesRooms = roomsFilter === 'All' || p.features.rooms >= Number(roomsFilter);
      
      return matchesSearch && matchesType && matchesOp && matchesProv && matchesDept && matchesLoc && matchesAmenities && matchesPrice && matchesRooms && p.status === 'active';
    });

    return result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'newest':
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [properties, search, typeFilter, opFilter, provinceFilter, departmentFilter, localityFilter, selectedAmenities, sortBy, priceRange, roomsFilter]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (showMap && view === 'home' && !selectedPropertyId) {
      setTimeout(() => {
        if (!mapRef.current) {
          mapRef.current = (window as any).L.map('map').setView([-31.537, -68.525], 13);
          (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(mapRef.current);
        } else {
          mapRef.current.eachLayer((layer: any) => {
            if (layer instanceof (window as any).L.Marker) mapRef.current.removeLayer(layer);
          });
        }

        const markers = filteredAndSortedProperties
          .filter(p => p.location.lat && p.location.lng)
          .map(p => {
            const marker = (window as any).L.marker([p.location.lat, p.location.lng])
              .addTo(mapRef.current)
              .bindPopup(`
                <div class="p-1 min-w-[150px]">
                  <img src="${p.images[0]?.url}" class="w-full h-24 object-cover rounded-xl mb-2"/>
                  <h4 class="font-black text-slate-900 text-xs leading-tight mb-1">${p.title}</h4>
                  <p class="text-brand-red font-black text-xs">${p.currency} ${p.price.toLocaleString()}</p>
                </div>
              `);
            return marker;
          });

        if (markers.length > 0) {
          const group = new (window as any).L.featureGroup(markers);
          mapRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
        }
      }, 200);
    }
    
    if (!showMap || !!selectedPropertyId || view !== 'home') {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    }
  }, [showMap, filteredAndSortedProperties, selectedPropertyId, view]);

  const selectedProperty = useMemo(() => 
    properties.find(p => p.id === selectedPropertyId)
  , [properties, selectedPropertyId]);

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleAdminAccess = () => {
    setView('admin');
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('admin');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
  };

  const renderHome = () => {
    if (selectedProperty) {
      const displayImages = selectedProperty.images.length >= 5 
        ? selectedProperty.images 
        : [...selectedProperty.images, ...selectedProperty.images, ...selectedProperty.images].slice(0, 5);

      return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={() => setSelectedPropertyId(null)}
            className="group flex items-center gap-2 text-brand-red font-bold mb-8 hover:text-red-800 transition-colors"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al buscador
          </button>

          <div className="mb-12">
            <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3 h-[600px] rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden">
                <img src={displayImages[0]?.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Principal" />
              </div>
              <div className="relative group cursor-pointer overflow-hidden"><img src={displayImages[1]?.url} className="w-full h-full object-cover" alt="" /></div>
              <div className="relative group cursor-pointer overflow-hidden"><img src={displayImages[2]?.url} className="w-full h-full object-cover" alt="" /></div>
              <div className="relative group cursor-pointer overflow-hidden"><img src={displayImages[3]?.url} className="w-full h-full object-cover" alt="" /></div>
              <div className="relative group cursor-pointer overflow-hidden">
                <img src={displayImages[4]?.url} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-black text-xl">+ {selectedProperty.images.length > 5 ? selectedProperty.images.length - 4 : 'Ver todas'}</span>
                </div>
              </div>
            </div>
            <div className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth custom-scrollbar pb-4 -mx-4 px-4">
              {displayImages.map((img, idx) => (
                <div key={idx} className="min-w-[85vw] aspect-[4/3] snap-center rounded-[1.5rem] overflow-hidden bg-brand-light shadow-xl">
                   <img src={img.url} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-brand-red text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">{selectedProperty.operation}</span>
                  <span className="bg-brand-black text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">{selectedProperty.type}</span>
                </div>
                <h1 className="text-5xl font-black text-brand-black mb-4 tracking-tight leading-tight">{selectedProperty.title}</h1>
                <p className="text-2xl text-brand-gray flex items-center gap-3 font-light">
                   <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {selectedProperty.location.address}, {selectedProperty.neighborhood || 'Barrio'}
                </p>
              </div>
              <div className="prose prose-slate max-w-none">
                <h3 className="text-2xl font-black text-brand-black mb-6">Descripción</h3>
                <p className="text-brand-gray text-lg leading-relaxed whitespace-pre-line">{selectedProperty.description}</p>
              </div>
            </div>
            <div className="hidden lg:block relative"><StickyContactSidebar property={selectedProperty} /></div>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-in fade-in duration-700">
        <HeroBanner onNavigate={(v) => { setView(v as ViewType); setSelectedPropertyId(null); }} />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="space-y-4 mb-12">
          <div className="bg-white p-4 md:p-6 rounded-[3rem] shadow-2xl shadow-brand-red/5 border border-slate-100">
            <div className="flex flex-col gap-6">
              {/* Main Search Row */}
              <div className="flex flex-col lg:flex-row gap-3 items-center w-full">
                <div className="flex-[4] relative w-full">
                  <input type="text" placeholder="Barrio, calle o referencia..." className="w-full pl-6 pr-6 py-5 bg-slate-50 border border-brand-border rounded-[2rem] outline-none text-brand-black font-medium" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex flex-1 gap-2 w-full lg:w-auto">
                  <select className="flex-1 px-6 py-5 bg-slate-50 border-none rounded-[2rem] outline-none font-bold text-slate-600 text-sm appearance-none text-center" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}>
                    <option value="All">Tipos</option>
                    {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select className="flex-1 px-6 py-5 bg-slate-50 border-none rounded-[2rem] outline-none font-bold text-slate-600 text-sm appearance-none text-center" value={opFilter} onChange={(e) => setOpFilter(e.target.value as any)}>
                    <option value="All">Operación</option>
                    {Object.values(OperationType).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-5 rounded-[2rem] transition-all ${showFilters ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </button>
              </div>

              {syncError && !isSyncing && properties.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-slate-400 text-lg">No hay propiedades disponibles en este momento.</p>
                  <p className="text-slate-300 text-sm mt-2">Intentá nuevamente más tarde.</p>
                </div>
              )}

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  {/* Location Filters */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Ubicación</span>
                    <div className="grid grid-cols-1 gap-2">
                      <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none text-sm font-medium text-slate-600" value={provinceFilter} onChange={(e) => setProvinceFilter(e.target.value)}>
                        <option value="All">Provincia: Todas</option>
                        {locationOptions.provinces.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none text-sm font-medium text-slate-600" value={localityFilter} onChange={(e) => setLocalityFilter(e.target.value)}>
                        <option value="All">Localidad: Todas</option>
                        {locationOptions.localities.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Rooms Filter */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Ambientes</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, '5+'].map((num) => (
                        <button
                          key={num}
                          onClick={() => setRoomsFilter(num === '5+' ? 5 : Number(num))}
                          className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${
                            (num === '5+' ? roomsFilter === 5 : roomsFilter === num)
                              ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                              : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        onClick={() => setRoomsFilter('All')}
                        className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                          roomsFilter === 'All'
                            ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        Todos
                      </button>
                    </div>
                  </div>

                  {/* Price Range Slider */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex justify-between items-center px-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rango de Precio (USD)</span>
                      <div className="flex gap-2 text-xs font-black text-brand-red">
                        <span>${priceRange[0].toLocaleString()}</span>
                        <span className="text-slate-300">-</span>
                        <span>${priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="px-4 py-6 bg-slate-50 rounded-2xl">
                      <Slider
                        range
                        min={absolutePriceRange.min}
                        max={absolutePriceRange.max}
                        value={priceRange}
                        onChange={(val) => setPriceRange(val as [number, number])}
                        trackStyle={[{ backgroundColor: '#C21C28', height: 4 }]}
                        handleStyle={[
                          { borderColor: '#C21C28', height: 18, width: 18, marginTop: -7, backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', opacity: 1 },
                          { borderColor: '#C21C28', height: 18, width: 18, marginTop: -7, backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', opacity: 1 }
                        ]}
                        railStyle={{ backgroundColor: '#e2e8f0', height: 4 }}
                      />
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="lg:col-span-4 space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Comodidades / Amenities</span>
                    <div className="flex flex-wrap gap-2">
                      {allAmenities.map(amenity => (
                        <button
                          key={amenity}
                          onClick={() => handleAmenityToggle(amenity)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                            selectedAmenities.includes(amenity)
                              ? 'bg-brand-red/5 border-brand-red/20 text-brand-red'
                              : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                          }`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="lg:col-span-4 flex justify-end pt-4 border-t border-slate-50">
                    <button 
                      onClick={clearFilters}
                      className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
                    >
                      Limpiar Filtros
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center px-4">
            <button onClick={() => setShowMap(!showMap)} className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${showMap ? 'bg-slate-900 text-white' : 'bg-red-600 text-white shadow-xl shadow-red-100 hover:bg-red-700'}`}>
              {showMap ? 'Vista Lista' : 'Vista Mapa'}
            </button>
            <p className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{filteredAndSortedProperties.length} Propiedades</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isSyncing ? (
            [1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-3xl bg-gray-100 animate-pulse h-80" />
            ))
          ) : (
            filteredAndSortedProperties.map(p => <PropertyCard key={p.id} property={p} onClick={setSelectedPropertyId} />)
          )}
        </div>
        <WhatsAppButton propertyRef="HOME" propertyTitle="Inmobiliaria" variant="floating" />
      </div>
    </div>
  );
};

  const renderContent = () => {
    if (view === 'admin') {
      if (!currentUser) {
        return <Login onLogin={handleLogin} onCancel={() => setView('home')} />;
      }
      return <AdminDashboard currentUser={currentUser} onLogout={handleLogout} properties={properties} setProperties={setProperties} />;
    }
    if (view === 'services') return <ServicesSection />;
    if (view === 'contacto') return <ContactSection />;
    if (view === 'nosotros') return <AboutUsSection />;
    return renderHome();
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white sticky top-0 z-[100] border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-24">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => {setView('home'); setSelectedPropertyId(null); setShowMap(false);}}>
            <div style={{
              width: '44px',
              height: '44px', 
              backgroundColor: '#C21C28',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 900,
              fontSize: '18px',
              color: 'white',
              letterSpacing: '-1px'
            }}>BM</div>
            <div>
              <div style={{fontFamily:"'Barlow',sans-serif", fontWeight:900, fontSize:'16px', color:'#1D1D1B', letterSpacing:'2px'}}>BERMUDEZ MOYA</div>
              <div style={{fontFamily:"'Barlow',sans-serif", fontWeight:300, fontSize:'10px', color:'#4C4C4C', letterSpacing:'3px'}}>GESTIÓN INMOBILIARIA</div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-8">
               <button onClick={() => {setView('home'); setSelectedPropertyId(null);}} className={`text-xs font-bold uppercase tracking-widest transition-colors ${view === 'home' ? 'text-brand-red' : 'text-brand-gray hover:text-brand-red'}`}>Propiedades</button>
               <button onClick={() => setView('services')} className={`text-xs font-bold uppercase tracking-widest transition-colors ${view === 'services' ? 'text-brand-red' : 'text-brand-gray hover:text-brand-red'}`}>Servicios</button>
               <button onClick={() => setView('contacto')} className={`text-xs font-bold uppercase tracking-widest transition-colors ${view === 'contacto' ? 'text-brand-red' : 'text-brand-gray hover:text-brand-red'}`}>Contacto</button>
               <button onClick={() => setView('nosotros')} className={`text-xs font-bold uppercase tracking-widest transition-colors ${view === 'nosotros' ? 'text-brand-red' : 'text-brand-gray hover:text-brand-red'}`}>Nosotros</button>
            </div>
            <button onClick={handleAdminAccess} className={`text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all border-2 ${view === 'admin' ? 'bg-brand-black text-white border-brand-black' : 'bg-transparent border-brand-black text-brand-black hover:bg-brand-black hover:text-white'}`}>Panel Admin</button>
          </div>
        </div>
      </nav>
      <main className="pb-20">{renderContent()}</main>
      <footer className="bg-brand-black text-brand-gray py-24">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <div style={{
                  width: '44px',
                  height: '44px', 
                  backgroundColor: '#C21C28',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 900,
                  fontSize: '18px',
                  color: 'white',
                  letterSpacing: '-1px'
                }}>BM</div>
                <div>
                  <div style={{fontFamily:"'Barlow',sans-serif", fontWeight:900, fontSize:'16px', color:'white', letterSpacing:'2px'}}>BERMUDEZ MOYA</div>
                  <div style={{fontFamily:"'Barlow',sans-serif", fontWeight:300, fontSize:'10px', color:'rgba(255,255,255,0.6)', letterSpacing:'3px'}}>GESTIÓN INMOBILIARIA</div>
                </div>
              </div>
              <p className="max-w-md text-lg leading-relaxed font-light">Innovación inmobiliaria con las mejores propiedades de San Juan y la región.</p>
          </div>
          <div className="md:col-span-2 text-right">
             <p className="text-[10px] font-bold text-brand-gray uppercase tracking-[0.4em] mb-4">Bermudez Moya © 2025 · Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

