import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Wifi, Coffee, Wind, Waves, Bed, Calendar, 
  ArrowRight, ChevronLeft, ChevronRight, CreditCard, Users,
  CheckCircle2, Tv, ShieldCheck, Sparkles, MapPin, BadgePercent
} from 'lucide-react';
import { Room } from '../types';

interface RoomDetailsProps {
  room: Room;
  setActiveTab: (tab: string) => void;
  onBack: () => void;
  onBook: () => void;
}

export default function RoomDetails({ room, setActiveTab, onBack, onBook }: RoomDetailsProps) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [room]);

  const nextImage = () => {
    setActiveImgIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setActiveImgIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  // Icon selector based on amenity name or type
  const getAmenityIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('wi-fi') || lowercaseName.includes('internet')) {
      return <Wifi className="w-5 h-5 text-turquoise" />;
    }
    if (lowercaseName.includes('café') || lowercaseName.includes('cafe')) {
      return <Coffee className="w-5 h-5 text-turquoise" />;
    }
    if (lowercaseName.includes('ar condicionado') || lowercaseName.includes('split')) {
      return <Wind className="w-5 h-5 text-turquoise" />;
    }
    if (lowercaseName.includes('ventilador')) {
      return <Waves className="w-5 h-5 text-turquoise" />;
    }
    if (lowercaseName.includes('cama') || lowercaseName.includes('king') || lowercaseName.includes('casal')) {
      return <Bed className="w-5 h-5 text-turquoise" />;
    }
    if (lowercaseName.includes('tv') || lowercaseName.includes('smart tv') || lowercaseName.includes('streaming')) {
      return <Tv className="w-5 h-5 text-turquoise" />;
    }
    return <CheckCircle2 className="w-5 h-5 text-turquoise" />;
  };

  return (
    <div className="bg-stone-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs text-turquoise hover:text-turquoise-dark font-semibold uppercase tracking-wider transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para as Acomodações
          </button>
          <div className="text-xs text-gray-500">
            Acomodações / <span className="text-gray-800 font-medium">{room.name}</span>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visuals & Specifications (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Elegant Image Gallery/Slider */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-sand/40 relative">
              <div className="relative h-96 sm:h-[480px] w-full bg-stone-100 group">
                
                {/* Main Active Image */}
                <img 
                  src={room.images[activeImgIndex]} 
                  alt={`${room.name} - Imagem ${activeImgIndex + 1}`} 
                  className="w-full h-full object-cover transition-all duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Left/Right Navigation Arrows */}
                {room.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-ocean p-2.5 rounded-full shadow-lg transition-transform hover:scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-ocean p-2.5 rounded-full shadow-lg transition-transform hover:scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Room Category Label */}
                <div className="absolute top-4 left-4 bg-ocean/90 backdrop-blur text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                  {room.type === 'comfort' ? 'Comfort • Ar Condicionado' : 'Standard • Ventilador Teto'}
                </div>

                {/* Image Index Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                  {activeImgIndex + 1} de {room.images.length}
                </div>
              </div>

              {/* Thumbnail Selector Grid */}
              {room.images.length > 1 && (
                <div className="p-4 bg-stone-50 border-t border-stone-200/55 flex gap-3 overflow-x-auto">
                  {room.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        idx === activeImgIndex ? 'border-turquoise ring-2 ring-turquoise/25 scale-[1.03]' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt="Miniatura" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Room Information & Specifications */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-sand/40 space-y-8">
              
              {/* Title & Introduction */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ocean tracking-tight">
                    {room.name}
                  </h1>
                  {room.id === 'apt-master-luxo' && (
                    <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Destaque Premium
                    </span>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {room.description}
                </p>
              </div>

              {/* Core Features Horizontal Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-50/85 rounded-2xl border border-stone-200/50">
                <div className="text-center space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Capacidade</span>
                  <div className="flex items-center justify-center gap-1.5 text-ocean font-semibold text-sm">
                    <Users className="w-4 h-4 text-turquoise" /> Até {room.capacity} pessoas
                  </div>
                </div>
                <div className="text-center space-y-1 border-l border-stone-200/70">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Climatização</span>
                  <div className="flex items-center justify-center gap-1.5 text-ocean font-semibold text-sm">
                    {room.hasAirConditioning ? (
                      <>
                        <Wind className="w-4 h-4 text-turquoise animate-pulse" /> Ar Condicionado
                      </>
                    ) : (
                      <>
                        <Waves className="w-4 h-4 text-turquoise" /> Ventilador Teto
                      </>
                    )}
                  </div>
                </div>
                <div className="text-center space-y-1 border-l border-stone-200/70">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Alimentação</span>
                  <div className="flex items-center justify-center gap-1.5 text-ocean font-semibold text-sm">
                    <Coffee className="w-4 h-4 text-turquoise" /> Café Incluso
                  </div>
                </div>
                <div className="text-center space-y-1 border-l border-stone-200/70">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Internet</span>
                  <div className="flex items-center justify-center gap-1.5 text-ocean font-semibold text-sm">
                    <Wifi className="w-4 h-4 text-turquoise" /> Fibra Óptica
                  </div>
                </div>
              </div>

              {/* Amenities Breakdown */}
              <div className="space-y-4">
                <h3 className="font-heading font-extrabold text-lg text-ocean">
                  O que está incluso nesta acomodação:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {room.amenities.map((amenity, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-3 bg-stone-50/40 rounded-xl border border-stone-200/30 text-gray-700 text-xs sm:text-sm"
                    >
                      <div className="bg-turquoise/10 p-1.5 rounded-lg shrink-0">
                        {getAmenityIcon(amenity)}
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-medium text-ocean">{amenity}</span>
                        <p className="text-[11px] text-gray-400">Cortesia e comodidade inclusas na diária.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra Location Reference Details */}
              <div className="p-4 bg-sand/20 border border-sand/40 rounded-2xl flex items-start gap-3 text-xs text-ocean-dark leading-relaxed">
                <MapPin className="w-5 h-5 text-turquoise shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <strong>Localização privilegiada na Pousada:</strong> Nossos apartamentos estão localizados em pontos estratégicos do pátio interno. Oferecemos unidades no térreo para acessibilidade simplificada e unidades no andar superior para privacidade otimizada. Atravessando a rua, você está diretamente nas águas refrescantes do mar.
                </div>
              </div>


            </div>

          </div>

          {/* Right Column: Pricing & Booking Widget (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sand/60 sticky top-28 space-y-6">
              
              {/* Price Banner */}
              <div className="text-center pb-6 border-b border-stone-100">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Status da Tarifa</span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-extrabold text-turquoise font-heading uppercase tracking-wide">Sob Consulta</span>
                </div>
                <div className="mt-2 text-xs text-turquoise-dark bg-turquoise/5 py-1 px-3 rounded-full inline-block font-semibold">
                  🌴 Orçamento Sob Medida via WhatsApp
                </div>
              </div>

              {/* Secure Payment details */}
              <div className="space-y-4">
                <h4 className="font-heading font-bold text-xs sm:text-sm text-ocean">Solicitação de Reserva Simplificada</h4>
                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-turquoise shrink-0 mt-0.5" />
                    <span>Envie seus dados e datas preferidas sem nenhum pagamento online imediato.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CreditCard className="w-4 h-4 text-turquoise shrink-0 mt-0.5" />
                    <span>Nossa equipe entrará em contato via WhatsApp / E-mail com o melhor preço e opções de pagamento (PIX ou cartão).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <BadgePercent className="w-4 h-4 text-turquoise shrink-0 mt-0.5" />
                    <span>Condições especiais para estadias prolongadas ou pacotes de feriados.</span>
                  </div>
                </div>
              </div>

              {/* Dynamic availability dates notice */}
              <div className="p-3.5 bg-stone-50 border border-stone-200/50 rounded-xl text-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Horários de Estadia</span>
                <div className="grid grid-cols-2 gap-2 text-xs text-ocean font-medium mt-1">
                  <div>Check-in: 12:00h</div>
                  <div className="border-l border-stone-200">Check-out: 11:00h</div>
                </div>
              </div>

              {/* Core Action Button */}
              <button
                onClick={onBook}
                className="w-full bg-turquoise hover:bg-turquoise-dark text-white font-extrabold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                Solicitar Reserva Sob Consulta <ArrowRight className="w-4.5 h-4.5" />
              </button>

              <div className="text-center">
                <p className="text-[10px] text-gray-400">
                  Dúvidas com as datas? <span className="text-turquoise font-medium hover:underline cursor-pointer" onClick={() => setActiveTab('inicio')}>Fale conosco no chat</span>
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
