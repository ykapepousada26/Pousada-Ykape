import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Wifi, Coffee, Wind, Waves, Bed, ChevronLeft, ChevronRight, 
  ArrowLeft, ArrowRight, Star, Heart, Tv, HelpCircle, Eye, SlidersHorizontal,
  FolderOpen
} from 'lucide-react';
import { Room } from '../types';

interface RoomListProps {
  rooms: Room[];
  setSelectedRoomForDetails: (room: Room | null) => void;
  setActiveTab: (tab: string) => void;
  onBook: (room: Room) => void;
}

export default function RoomList({ 
  rooms, 
  setSelectedRoomForDetails, 
  setActiveTab, 
  onBook 
}: RoomListProps) {
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedCapacity, setSelectedCapacity] = useState<string>('todos');
  const [hasAC, setHasAC] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<string>('default');
  
  // Keep track of active image index for each room card's mini-carousel
  const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({});

  const handleNextImage = (roomId: string, imagesLength: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardImageIndices(prev => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) + 1) % imagesLength
    }));
  };

  const handlePrevImage = (roomId: string, imagesLength: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardImageIndices(prev => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) - 1 + imagesLength) % imagesLength
    }));
  };

  // Filter and sort rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.amenities.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'todos' || room.type === selectedType;
    
    const matchesAC = hasAC === 'todos' || 
                     (hasAC === 'sim' && room.hasAirConditioning) || 
                     (hasAC === 'nao' && !room.hasAirConditioning);
    
    let matchesCapacity = true;
    if (selectedCapacity === '2') {
      matchesCapacity = room.capacity === 2;
    } else if (selectedCapacity === '3') {
      matchesCapacity = room.capacity === 3;
    } else if (selectedCapacity === '4') {
      matchesCapacity = room.capacity === 4;
    } else if (selectedCapacity === '5') {
      matchesCapacity = room.capacity >= 5;
    }

    return matchesSearch && matchesType && matchesAC && matchesCapacity;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.pricePerNight - b.pricePerNight;
    }
    if (sortBy === 'price-desc') {
      return b.pricePerNight - a.pricePerNight;
    }
    if (sortBy === 'capacity-desc') {
      return b.capacity - a.capacity;
    }
    return 0; // default order
  });

  // Icon selector helper
  const getAmenityIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('wi-fi') || lowercaseName.includes('internet')) {
      return <Wifi className="w-4 h-4 text-turquoise shrink-0" />;
    }
    if (lowercaseName.includes('café') || lowercaseName.includes('cafe')) {
      return <Coffee className="w-4 h-4 text-turquoise shrink-0" />;
    }
    if (lowercaseName.includes('ar condicionado') || lowercaseName.includes('split')) {
      return <Wind className="w-4 h-4 text-turquoise shrink-0" />;
    }
    if (lowercaseName.includes('ventilador')) {
      return <Waves className="w-4 h-4 text-turquoise shrink-0" />;
    }
    if (lowercaseName.includes('cama') || lowercaseName.includes('king') || lowercaseName.includes('casal') || lowercaseName.includes('queen')) {
      return <Bed className="w-4 h-4 text-turquoise shrink-0" />;
    }
    if (lowercaseName.includes('tv') || lowercaseName.includes('smart tv') || lowercaseName.includes('streaming')) {
      return <Tv className="w-4 h-4 text-turquoise shrink-0" />;
    }
    return null;
  };

  return (
    <div id="todos-quartos-view" className="bg-stone-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/40 pb-6">
          <div className="space-y-1">
            <button 
              onClick={() => {
                setActiveTab('inicio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-xs text-turquoise hover:text-turquoise-dark font-semibold uppercase tracking-wider transition-colors cursor-pointer mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para o Início
            </button>
            <h1 className="font-heading font-extrabold text-3xl text-ocean tracking-tight">
              Nossas Suítes & Acomodações
            </h1>
            <p className="text-sm text-gray-500">
              Escolha a acomodação ideal para as suas férias pé na areia no Balneário Yemar.
            </p>
          </div>
          <div className="text-xs text-gray-400 bg-sand/25 border border-sand/50 rounded-xl px-4 py-2 self-start sm:self-center">
            Exibindo <span className="text-ocean font-bold">{filteredRooms.length}</span> de <span className="text-ocean font-bold">{rooms.length}</span> suítes
          </div>
        </div>

        {/* Search & Filtering Panel */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-sand/45 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <SlidersHorizontal className="w-4 h-4 text-turquoise" />
            <h2 className="font-heading font-bold text-sm text-ocean uppercase tracking-wider">Filtros de Busca</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-ocean uppercase tracking-wider">Buscar por palavra-chave</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Ex: Varanda, Vista Mar, Casal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-stone-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-turquoise text-gray-700"
                />
              </div>
            </div>

            {/* Filter by Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-ocean uppercase tracking-wider">Categoria / Tipo</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-stone-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-turquoise text-gray-700 cursor-pointer"
              >
                <option value="todos">Todos os tipos</option>
                <option value="comfort">Comfort (Ar Condicionado)</option>
                <option value="standard">Standard (Ventilador)</option>
              </select>
            </div>

            {/* Filter by Capacity */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-ocean uppercase tracking-wider">Capacidade Máxima</label>
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="w-full bg-stone-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-turquoise text-gray-700 cursor-pointer"
              >
                <option value="todos">Qualquer capacidade</option>
                <option value="2">Até 2 hóspedes</option>
                <option value="3">Até 3 hóspedes</option>
                <option value="4">Até 4 hóspedes</option>
                <option value="5">5 ou mais hóspedes</option>
              </select>
            </div>

            {/* Climatização Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-ocean uppercase tracking-wider">Climatização</label>
              <select
                value={hasAC}
                onChange={(e) => setHasAC(e.target.value)}
                className="w-full bg-stone-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-turquoise text-gray-700 cursor-pointer"
              >
                <option value="todos">Qualquer climatização</option>
                <option value="sim">Apenas com Ar Condicionado</option>
                <option value="nao">Apenas com Ventilador</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-100">
            {/* Quick pre-set filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-400 mr-1">Filtros rápidos:</span>
              <button 
                onClick={() => { setSelectedType('comfort'); setHasAC('sim'); }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  selectedType === 'comfort' && hasAC === 'sim'
                    ? 'bg-turquoise/10 text-turquoise border-turquoise font-bold'
                    : 'bg-stone-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                ❄️ Suítes Climatizadas
              </button>
              <button 
                onClick={() => { setSelectedCapacity('4'); setSelectedType('todos'); }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  selectedCapacity === '4'
                    ? 'bg-turquoise/10 text-turquoise border-turquoise font-bold'
                    : 'bg-stone-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                👨‍👩‍👧‍👦 Família (4+ Pessoas)
              </button>
              <button 
                onClick={() => { setSearchTerm('Vista Mar'); }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  searchTerm === 'Vista Mar'
                    ? 'bg-turquoise/10 text-turquoise border-turquoise font-bold'
                    : 'bg-stone-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                🌊 Vista para o Mar
              </button>
              {(searchTerm || selectedType !== 'todos' || selectedCapacity !== 'todos' || hasAC !== 'todos' || sortBy !== 'default') && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('todos');
                    setSelectedCapacity('todos');
                    setHasAC('todos');
                    setSortBy('default');
                  }}
                  className="text-xs text-red-500 hover:text-red-600 font-bold ml-2 underline cursor-pointer"
                >
                  Limpar todos os filtros
                </button>
              )}
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-gray-500 uppercase">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-stone-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-turquoise text-gray-700 cursor-pointer"
              >
                <option value="default">Relevância / Padrão</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="capacity-desc">Maior Capacidade</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Listings */}
        <AnimatePresence mode="popLayout">
          {filteredRooms.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl p-12 text-center border border-sand/40 max-w-xl mx-auto shadow-sm space-y-4"
            >
              <HelpCircle className="w-12 h-12 text-turquoise/50 mx-auto" />
              <h3 className="font-heading font-bold text-lg text-ocean">Nenhuma suíte encontrada</h3>
              <p className="text-sm text-gray-500">
                Não encontramos nenhuma acomodação correspondente aos filtros selecionados. Experimente buscar termos mais abrangentes ou redefinir os filtros acima.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('todos');
                  setSelectedCapacity('todos');
                  setHasAC('todos');
                  setSortBy('default');
                }}
                className="bg-turquoise hover:bg-turquoise-dark text-white font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer mt-2"
              >
                Limpar Todos os Filtros
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredRooms.map((room) => {
                const activeImgIdx = cardImageIndices[room.id] || 0;
                
                return (
                  <motion.div 
                    layout
                    key={room.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200/60 flex flex-col justify-between"
                  >
                    {/* Multi-image Slider Header */}
                    <div className="relative h-60 sm:h-64 w-full bg-stone-100 overflow-hidden group">
                      <img 
                        src={room.images[activeImgIdx]} 
                        alt={`${room.name} - ${activeImgIdx + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                        referrerPolicy="no-referrer"
                      />

                      {/* Slider controls */}
                      {room.images.length > 1 && (
                        <>
                          <button 
                            onClick={(e) => handlePrevImage(room.id, room.images.length, e)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-ocean p-1.5 rounded-full shadow-md transition-all hover:scale-105 opacity-0 group-hover:opacity-100 cursor-pointer"
                            aria-label="Imagem anterior"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => handleNextImage(room.id, room.images.length, e)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-ocean p-1.5 rounded-full shadow-md transition-all hover:scale-105 opacity-0 group-hover:opacity-100 cursor-pointer"
                            aria-label="Próxima imagem"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* Floating Category Badge */}
                      <div className="absolute top-4 left-4 bg-ocean text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow">
                        {room.type === 'comfort' ? 'Comfort • Ar' : 'Standard • Vent.'}
                      </div>

                      {/* Floating Google Drive Folder Link */}
                      {room.driveFolder && (
                        <a 
                          href={`https://drive.google.com/drive/folders/${room.driveFolder}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-4 right-4 bg-white/95 hover:bg-white text-sky-600 p-2 rounded-full shadow hover:shadow-md transition-all hover:scale-110 flex items-center justify-center cursor-pointer"
                          title="Ver fotos no Google Drive 📂"
                        >
                          <FolderOpen className="w-4 h-4" />
                        </a>
                      )}

                      {/* Image slider dot indicators */}
                      {room.images.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 backdrop-blur-xs py-1 px-2.5 rounded-full">
                          {room.images.map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-1.5 h-1.5 rounded-full transition-all ${
                                i === activeImgIdx ? 'bg-turquoise scale-125' : 'bg-white/60'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 
                            onClick={() => {
                              setSelectedRoomForDetails(room);
                              setActiveTab('detalhes-quarto');
                            }}
                            className="font-heading font-extrabold text-lg text-ocean hover:text-turquoise cursor-pointer transition-colors leading-tight"
                          >
                            {room.name}
                          </h3>
                        </div>

                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                          {room.description}
                        </p>

                        {/* Top Features Icons List */}
                        <div className="flex flex-wrap gap-y-1.5 gap-x-3 pt-2.5 border-t border-stone-100">
                          {room.amenities.map((amenity, i) => {
                            const icon = getAmenityIcon(amenity);
                            if (!icon) return null;
                            return (
                              <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-600 bg-stone-50 border border-stone-100 rounded-lg px-2 py-1">
                                {icon}
                                <span className="font-medium">{amenity.split(' ')[0]}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer CTA & Consulta block */}
                      <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Diárias</span>
                          <span className="text-xs font-bold text-turquoise-dark uppercase tracking-wide">Sob Consulta</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedRoomForDetails(room);
                              setActiveTab('detalhes-quarto');
                            }}
                            className="bg-stone-100 hover:bg-stone-200 text-gray-700 p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onBook(room)}
                            className="bg-turquoise hover:bg-turquoise-dark text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                          >
                            Reservar
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
