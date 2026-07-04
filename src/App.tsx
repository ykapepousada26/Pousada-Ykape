import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, Phone, Mail, Sparkles, Send, CheckCircle, 
  Bed, ShieldCheck, Heart, Coffee, Waves, Tv, Wind, Wifi, 
  MapPin as MapPinIcon, Calendar, ArrowRight, ExternalLink,
  ChevronLeft, ChevronRight, Star, Quote, Clock, Flame, 
  Utensils, Layers, Activity, Shield, Percent, CreditCard, Droplets,
  ChevronDown, ChevronUp, HelpCircle, MessageSquare
} from 'lucide-react';

import { Room, MenuItem, Review, GalleryItem, Reservation, BookingSearch } from './types';
import { 
  INITIAL_ROOMS, 
  INITIAL_MENU, 
  INITIAL_REVIEWS, 
  INITIAL_GALLERY, 
  INITIAL_RESERVATIONS 
} from './data/initialData';

// Custom components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppChat from './components/WhatsAppChat';
import BookingFlow from './components/BookingFlow';
import AdminPanel from './components/AdminPanel';
import PrivacyPolicy from './components/PrivacyPolicy';
import CancellationPolicy from './components/CancellationPolicy';
import RoomDetails from './components/RoomDetails';
import RoomList from './components/RoomList';
import OccupancyPill from './components/OccupancyPill';
import { WeatherWidget } from './components/WeatherWidget';
import { AnnouncementBanner } from './components/AnnouncementBanner';

import { getCollectionData, syncCollectionToFirestore, saveDocument, deleteDocument } from './lib/firebase';

const FAQ_ITEMS = [
  {
    q: "Quais são os horários de Check-in e Check-out?",
    a: "Nosso Check-in (entrada) inicia a partir das 12:00 h e o nosso Check-out (saída) deve ser efetuado até às 11:00 h. Caso precise de horários especiais de early check-in ou late check-out, por favor consulte nossa recepção previamente."
  },
  {
    q: "Quais são as comodidades das suítes?",
    a: "Contamos com 20 quartos, sendo 19 suítes simples e 1 suíte dupla. Todas as suítes possuem ventiladores (não são de teto), TV e Wi-Fi. O frigobar é um item opcional disponível à parte."
  },
  {
    q: "A pousada possui piscina?",
    a: "Sim! Dispomos de 02 piscinas mistas para o lazer de nossos hóspedes, além de área infantil com pula-pula e escorregador."
  },
  {
    q: "Como funciona a área gourmet?",
    a: "A área gourmet está disponível mediante agendamento antecipado e possui um custo à parte. É um espaço ideal para confraternizações familiares."
  },
  {
    q: "Como é feita a garantia de reserva?",
    a: "A sua reserva é garantida mediante o pagamento de um sinal correspondente a 50% do valor total da estadia. Os 50% restantes são pagos no momento do check-in."
  }
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    "name": item.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.a
    }
  }))
};

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoomForDetails, setSelectedRoomForDetails] = useState<Room | null>(null);

  // Reviews Carousel states
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Raw states that back our custom setters
  const [rooms, _setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [menuItems, _setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [gallery, _setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [reservations, _setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);

  const [reviews, _setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Wrapped setters that automatically sync to Firestore when changed via AdminPanel
  const setRooms = (value: React.SetStateAction<Room[]>) => {
    _setRooms(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      syncCollectionToFirestore('rooms', prev, next);
      return next;
    });
  };

  const setMenuItems = (value: React.SetStateAction<MenuItem[]>) => {
    _setMenuItems(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      syncCollectionToFirestore('menuItems', prev, next);
      return next;
    });
  };

  const setGallery = (value: React.SetStateAction<GalleryItem[]>) => {
    _setGallery(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      syncCollectionToFirestore('gallery', prev, next);
      return next;
    });
  };

  const setReservations = (value: React.SetStateAction<Reservation[]>) => {
    _setReservations(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      syncCollectionToFirestore('reservations', prev, next);
      return next;
    });
  };

  const setReviews = (value: React.SetStateAction<Review[]>) => {
    _setReviews(prev => {
      const next = typeof value === 'function' ? (value as any)(prev) : value;
      syncCollectionToFirestore('reviews', prev, next);
      return next;
    });
  };

  // Load Firestore data on mount
  useEffect(() => {
    let active = true;

    // Safety timeout of 1.5 seconds to ensure the user is never stuck on the loader
    const safetyTimeout = setTimeout(() => {
      if (active) {
        console.warn('Firebase connection timed out - proceeding with local/cached data');
        setIsLoading(false);
      }
    }, 1500);

    async function loadFirebaseData() {
      try {
        const [loadedRooms, loadedMenu, loadedGallery, loadedReservations, loadedReviews] = await Promise.all([
          getCollectionData<Room>('rooms', INITIAL_ROOMS),
          getCollectionData<MenuItem>('menuItems', INITIAL_MENU),
          getCollectionData<GalleryItem>('gallery', INITIAL_GALLERY),
          getCollectionData<Reservation>('reservations', INITIAL_RESERVATIONS),
          getCollectionData<Review>('reviews', INITIAL_REVIEWS)
        ]);

        let finalRooms = loadedRooms;

        // Try to fetch real Google Drive images from our custom Express API to replace any fictional/placeholder images
        try {
          const apiRes = await fetch('/api/rooms');
          if (apiRes.ok) {
            const apiRooms = await apiRes.json();
            // Merge the actual images from the Google Drive folders
            finalRooms = finalRooms.map(r => {
              const apiRoom = apiRooms.find((ar: any) => ar.id === r.id);
              if (apiRoom && apiRoom.images && apiRoom.images.length > 0) {
                const isDifferent = JSON.stringify(r.images) !== JSON.stringify(apiRoom.images);
                if (isDifferent) {
                  const updated = { ...r, images: apiRoom.images };
                  saveDocument('rooms', r.id, updated).catch(() => {});
                  return updated;
                }
              }
              return r;
            });
          }
        } catch (apiErr) {
          console.error('Failed to load real room images:', apiErr);
        }

        if (active) {
          _setRooms(finalRooms);
          _setMenuItems(loadedMenu);
          _setGallery(loadedGallery);
          _setReservations(loadedReservations);
          _setReviews(loadedReviews);
        }
      } catch (error) {
        console.error('Error connecting to Firebase:', error);
      } finally {
        if (active) {
          clearTimeout(safetyTimeout);
          setIsLoading(false);
        }
      }
    }
    loadFirebaseData();

    return () => {
      active = false;
      clearTimeout(safetyTimeout);
    };
  }, []);

  // Update itemsPerView based on responsive width
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(2);
      } else {
        setItemsPerView(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Autoplay for reviews carousel (slides every 4 seconds)
  React.useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  // Booking Flow Overlay state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [initialSearch, setInitialSearch] = useState<BookingSearch | null>(null);

  // Search Bar state (Home page)
  const [homeSearch, setHomeSearch] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2
  });

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    checkInDate: '',
    checkOutDate: '',
    checkInTime: '',
    checkOutTime: '',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactWhatsappUrl, setContactWhatsappUrl] = useState('');

  // Real-time contact validation errors
  const [contactErrors, setContactErrors] = useState({
    email: '',
    phone: ''
  });

  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) {
      return digits.length > 0 ? `(${digits}` : '';
    }
    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleContactEmailChange = (val: string) => {
    setContactForm(prev => ({ ...prev, email: val }));
    if (!val) {
      setContactErrors(prev => ({ ...prev, email: 'O e-mail é obrigatório.' }));
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setContactErrors(prev => ({ ...prev, email: 'Insira um formato de e-mail válido.' }));
    } else {
      setContactErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handleContactPhoneChange = (val: string) => {
    const formatted = formatPhone(val);
    setContactForm(prev => ({ ...prev, phone: formatted }));
    const digits = formatted.replace(/\D/g, '');
    if (digits.length > 0 && digits.length < 10) {
      setContactErrors(prev => ({ ...prev, phone: 'O telefone deve conter 10 ou 11 dígitos com o DDD.' }));
    } else {
      setContactErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  // Active Album filter in public view
  const [activeAlbum, setActiveAlbum] = useState<string>('todos');

  // Handle Home Search Submit
  const handleHomeSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeSearch.checkIn || !homeSearch.checkOut) {
      // Provide fallback dates
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      const searchData: BookingSearch = {
        checkIn: today.toISOString().split('T')[0],
        checkOut: tomorrow.toISOString().split('T')[0],
        guests: homeSearch.guests
      };
      setInitialSearch(searchData);
    } else {
      setInitialSearch(homeSearch);
    }
    setIsBookingOpen(true);
  };

  // Quick Direct Booking trigger (e.g. from Accommodations Card)
  const handleDirectBook = (room: Room) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 2);

    setInitialSearch({
      checkIn: today.toISOString().split('T')[0],
      checkOut: tomorrow.toISOString().split('T')[0],
      guests: Math.min(room.capacity, 2)
    });
    setIsBookingOpen(true);
  };

  // Receive new reservation from Booking Flow
  const handleNewReservationCreated = (newRes: Reservation) => {
    setReservations(prev => [newRes, ...prev]);
  };

  // Contact form submit simulator
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    // Perform validation check
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email);
    const digits = contactForm.phone.replace(/\D/g, '');
    const isPhoneValid = digits.length === 0 || digits.length === 10 || digits.length === 11;

    if (!isEmailValid) {
      setContactErrors(prev => ({ ...prev, email: 'Insira um formato de e-mail válido.' }));
      return;
    }

    if (!isPhoneValid) {
      setContactErrors(prev => ({ ...prev, phone: 'O telefone deve conter 10 ou 11 dígitos com o DDD.' }));
      return;
    }

    // Formulate WhatsApp message and URL
    const checkInInfo = contactForm.checkInDate 
      ? `\n*Data de Entrada:* ${contactForm.checkInDate}${contactForm.checkInTime ? ` às ${contactForm.checkInTime}` : ''}`
      : '';
    const checkOutInfo = contactForm.checkOutDate 
      ? `\n*Data de Saída:* ${contactForm.checkOutDate}${contactForm.checkOutTime ? ` às ${contactForm.checkOutTime}` : ''}`
      : '';

    const messageText = `Olá, Pousada Ykape! Gostaria de enviar uma mensagem de consulta:\n\n` +
      `*Nome:* ${contactForm.name}\n` +
      `*E-mail:* ${contactForm.email}\n` +
      `*WhatsApp/Celular:* ${contactForm.phone || 'Não informado'}` +
      `${checkInInfo}` +
      `${checkOutInfo}\n\n` +
      `*Mensagem:* ${contactForm.message}`;
    const url = `https://wa.me/5513997654321?text=${encodeURIComponent(messageText)}`;
    
    setContactWhatsappUrl(url);
    setContactSubmitted(true);

    // Redirect to WhatsApp
    window.open(url, '_blank');

    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ 
        name: '', 
        phone: '', 
        email: '', 
        checkInDate: '', 
        checkOutDate: '', 
        checkInTime: '', 
        checkOutTime: '', 
        message: '' 
      });
      setContactErrors({ email: '', phone: '' });
      setContactWhatsappUrl('');
    }, 6000);
  };

  // Filter gallery items for public display
  const filteredGallery = activeAlbum === 'todos' 
    ? gallery 
    : gallery.filter(item => item.album === activeAlbum);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute w-24 h-24 border-4 border-turquoise/20 border-t-turquoise rounded-full animate-spin"></div>
            <img 
              src="https://i.postimg.cc/26z0SP1x/logo-ykape-azul-removebg-preview.png" 
              alt="Pousada Ykapê" 
              className="w-16 h-16 object-contain animate-pulse" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-4">Conectando ao banco de dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans flex flex-col justify-between">
      
      <AnnouncementBanner />

      {/* 1. STICKY TOP HEADER NAVBAR */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdminMode={isAdminMode} 
        setIsAdminMode={setIsAdminMode}
        onOpenBooking={() => {
          setInitialSearch(null);
          setIsBookingOpen(true);
        }}
      />

      {/* 2. ADMIN PANEL OVERLAY OR PUBLIC SITE RENDERING */}
      {isAdminMode ? (
        <AdminPanel 
          rooms={rooms}
          setRooms={setRooms}
          menuItems={menuItems}
          setMenuItems={setMenuItems}
          gallery={gallery}
          setGallery={setGallery}
          reservations={reservations}
          setReservations={setReservations}
          onClose={() => setIsAdminMode(false)}
        />
      ) : activeTab === 'politica-privacidade' ? (
        <PrivacyPolicy setActiveTab={setActiveTab} />
      ) : activeTab === 'politica-cancelamento' ? (
        <CancellationPolicy setActiveTab={setActiveTab} />
      ) : activeTab === 'acomodacoes-lista' ? (
        <RoomList 
          rooms={rooms}
          reservations={reservations}
          setSelectedRoomForDetails={setSelectedRoomForDetails}
          setActiveTab={setActiveTab}
          onBook={handleDirectBook}
        />
      ) : activeTab === 'detalhes-quarto' && selectedRoomForDetails ? (
        <RoomDetails 
          room={selectedRoomForDetails} 
          reservations={reservations}
          setActiveTab={setActiveTab} 
          onBack={() => {
            setActiveTab('inicio');
            setSelectedRoomForDetails(null);
          }} 
          onBook={() => {
            handleDirectBook(selectedRoomForDetails);
          }} 
        />
      ) : (
        <main className="flex-1">
          
          {/* ----- SECTION: HERO / HOME INÍCIO ----- */}
          <section id="inicio" className="relative pt-20 overflow-hidden">
            {/* Ambient Background Hero */}
      <div className="absolute inset-0 z-0 bg-black/80">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <img 
          src="https://lh3.googleusercontent.com/d/1Cve8YF_DENANXcAvIUYCK_20f3IaHA6L" 
          alt="Pousada Ykapê - Frente para o Mar" 
          className="w-full h-full object-cover select-none"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center text-white">
        <WeatherWidget />
        
        <span className="bg-turquoise/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce mt-8">
          <Sparkles className="w-4 h-4 text-yellow-300" /> Pé na Areia • Balneário Yemar
        </span>
        
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl tracking-tight text-ocean mt-6 max-w-3xl leading-tight">
          O paraíso em frente ao mar que você merece
        </h1>
        
        <p className="text-sm sm:text-lg text-white mt-4 max-w-2xl leading-[25.25px]">
          Basta atravessar a Avenida Beira Mar para sentir a brisa do oceano. Desfrute de 02 piscinas maravilhosas, café da manhã farto incluso e conforto total para recarregar as energias.
        </p>

              {/* Home Quick Search booking engine bar */}
              <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-6 mt-12 text-gray-800 shadow-2xl border border-sand/40">
                <form onSubmit={handleHomeSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-left">
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ocean mb-1.5">Check-In</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-turquoise" />
                      <input 
                        type="date"
                        value={homeSearch.checkIn}
                        onChange={(e) => setHomeSearch({ ...homeSearch, checkIn: e.target.value })}
                        className="w-full bg-stone-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-turquoise text-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ocean mb-1.5">Check-Out</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-turquoise" />
                      <input 
                        type="date"
                        value={homeSearch.checkOut}
                        onChange={(e) => setHomeSearch({ ...homeSearch, checkOut: e.target.value })}
                        className="w-full bg-stone-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-turquoise text-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ocean mb-1.5">Hóspedes</label>
                    <select
                      value={homeSearch.guests}
                      onChange={(e) => setHomeSearch({ ...homeSearch, guests: Number(e.target.value) })}
                      className="w-full bg-stone-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none text-gray-700"
                    >
                      <option value={1}>1 Hóspede</option>
                      <option value={2}>2 Hóspedes</option>
                      <option value={3}>3 Hóspedes</option>
                      <option value={4}>4 Hóspedes</option>
                    </select>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full bg-turquoise hover:bg-turquoise-dark text-white font-bold py-3 px-4 rounded-xl shadow transition-colors cursor-pointer text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      Buscar Disponibilidade <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </form>
                <div className="flex flex-col sm:flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-400 gap-2">
                  <span className="flex items-center gap-1 text-turquoise-dark font-medium">💳 Reserve pagando apenas 50% antecipado online</span>
                  <span className="flex items-center gap-1">📍 Localização: Ao lado do Supermercado Monte Carlo</span>
                </div>
              </div>
            </div>

            {/* Core features strip */}
            <div className="bg-sand/35 border-y border-sand/40 py-8 relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                  <div className="space-y-1">
                    <span className="text-2xl">🌅</span>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-white">Frente ao Mar</h4>
                    <p className="text-[10px] text-gray-500">Basta atravessar a Beira Mar</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xl">🏊‍♂️</span>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-white">02 Piscinas</h4>
                    <p className="text-[10px] text-gray-500">Piscinas mistas para seu lazer</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xl">☕</span>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-white">Café Incluso</h4>
                    <p className="text-[10px] text-gray-500">Buffet farto e artesanal</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xl">🚗</span>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-white">Estacionamento</h4>
                    <p className="text-[10px] text-gray-500">Amplo, gratuito e seguro</p>
                  </div>
                  <div className="col-span-2 md:col-span-1 space-y-1">
                    <span className="text-2xl">🍤</span>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-white">Porções & Bebidas</h4>
                    <p className="text-[10px] text-gray-500">Servidos no deck da piscina</p>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* ----- SECTION: ACOMODAÇÕES / APARTAMENTOS ----- */}
          <section id="acomodacoes" className="py-20 bg-stone-50/50 scroll-mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              
              <div className="text-center space-y-3">
                <span className="text-xs uppercase tracking-widest text-turquoise font-extrabold">Nossas Suítes</span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ocean">Acomodações Preparadas para o seu Descanso</h2>
                <p className="text-sm text-gray-500 max-w-xl mx-auto">Nossos 20 apartamentos oferecem conforto, Wi-Fi de fibra óptica e acomodações para até 6 pessoas.</p>
              </div>

              {/* Rooms layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {rooms.slice(0, 4).map((room, idx) => (
                  <motion.div 
                    key={room.id}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200/60 flex flex-col justify-between"
                  >
                    {/* Images slider / visual */}
                    <div 
                      onClick={() => {
                        setSelectedRoomForDetails(room);
                        setActiveTab('detalhes-quarto');
                      }}
                      className="relative h-64 sm:h-72 w-full bg-stone-100 cursor-pointer overflow-hidden group"
                    >
                      <img 
                        src={room.images[0]} 
                        alt={room.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-ocean text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        {room.type === 'comfort' ? 'Comfort • Ar Condicionado' : 'Standard • Ventilador'}
                      </div>
                      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur text-turquoise px-3.5 py-1.5 rounded-lg text-xs font-bold shadow uppercase tracking-wide">
                        {(!room.isPriceOnRequest && room.pricePerNight > 0) ? `R$ ${room.pricePerNight}` : 'Sob Consulta'}
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 
                            onClick={() => {
                              setSelectedRoomForDetails(room);
                              setActiveTab('detalhes-quarto');
                            }}
                            className="font-heading font-extrabold text-xl text-ocean cursor-pointer hover:text-turquoise transition-colors"
                          >
                            {room.name}
                          </h3>
                          <OccupancyPill roomId={room.id} reservations={reservations} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{room.description}</p>
                        
                        {/* Features grid */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-600 flex items-center gap-1.5">
                            <Wifi className="w-4 h-4 text-turquoise shrink-0" /> Wi-Fi de Fibra Óptica
                          </span>
                          <span className="text-xs text-gray-600 flex items-center gap-1.5">
                            <Coffee className="w-4 h-4 text-turquoise shrink-0" /> Café da Manhã Incluso
                          </span>
                          <span className="text-xs text-gray-600 flex items-center gap-1.5">
                            {room.hasAirConditioning ? (
                              <Wind className="w-4 h-4 text-turquoise shrink-0" />
                            ) : (
                              <Waves className="w-4 h-4 text-turquoise shrink-0" />
                            )}
                            {room.hasAirConditioning ? 'Ar Condicionado' : 'Ventilador Silencioso'}
                          </span>
                          <span className="text-xs text-gray-600 flex items-center gap-1.5">
                            <Bed className="w-4 h-4 text-turquoise shrink-0" /> Capacidade: {room.capacity} pessoas
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-center sm:text-left">
                          <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Atendimento Exclusivo</span>
                          <strong className="text-turquoise-dark text-xs uppercase tracking-wide">
                            {(!room.isPriceOnRequest && room.pricePerNight > 0) ? `A partir de R$ ${room.pricePerNight}` : 'Orçamento sob consulta'}
                          </strong>
                        </div>
                        <div className="flex w-full sm:w-auto gap-2">
                          <button
                            onClick={() => {
                              setSelectedRoomForDetails(room);
                              setActiveTab('detalhes-quarto');
                            }}
                            className="flex-1 sm:flex-none border border-turquoise text-turquoise hover:bg-turquoise/5 font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                          >
                            Ver Detalhes
                          </button>
                          <button
                            onClick={() => handleDirectBook(room)}
                            className="flex-1 sm:flex-none bg-turquoise hover:bg-turquoise-dark text-white font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer text-center whitespace-nowrap"
                          >
                            Reservar
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* View All Rooms Button */}
              <div className="text-center pt-8">
                <button
                  onClick={() => {
                    setActiveTab('acomodacoes-lista');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2.5 bg-ocean hover:bg-ocean-dark text-white font-bold py-4 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-xs uppercase tracking-wider"
                >
                  Ver Todos os Quartos
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </section>


          {/* ----- SECTION: SOBRE A POUSADA ----- */}
          <section id="sobre" className="py-20 scroll-mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                <div className="space-y-6">
                  <span className="text-xs uppercase tracking-widest text-turquoise font-extrabold">Sobre Nós</span>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ocean">
                    Nossa História & Hospitalidade Familiar
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Fundada com o propósito de conectar famílias, casais e viajantes com a tranquilidade revigorante do Balneário Yemar, a <strong>Pousada Ykape</strong> destaca-se por sua hospitalidade autêntica, clima familiar aconchegante e localização imbatível na divisa com Porto Velho.
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="font-heading font-bold text-sm text-ocean">Nossos Diferenciais:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-600">
                      <li className="flex items-center gap-2"><span className="text-turquoise font-bold">&bull;</span> Frente para o Mar (Basta atravessar)</li>
                      <li className="flex items-center gap-2"><span className="text-turquoise font-bold">&bull;</span> 02 Piscinas Mistas</li>
                      <li className="flex items-center gap-2"><span className="text-turquoise font-bold">&bull;</span> Estacionamento Amplo Gratuito</li>
                      <li className="flex items-center gap-2"><span className="text-turquoise font-bold">&bull;</span> Lazer infantil (Pula-pula e Escorregador)</li>
                      <li className="flex items-center gap-2"><span className="text-turquoise font-bold">&bull;</span> Suítes para até 06 pessoas</li>
                      <li className="flex items-center gap-2"><span className="text-turquoise font-bold">&bull;</span> Frigobar Opcional (À parte)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-sand/30 border border-sand/60 rounded-xl">
                    <p className="text-xs text-ocean-dark font-medium leading-normal">
                      <strong>📍 Referência Estratégica:</strong> Estamos localizados logo ao lado do Supermercado Monte Carlo, garantindo fácil acesso a conveniências durante toda a sua estadia.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-gray-100 shadow-sm">
                    <img 
                      src="https://lh3.googleusercontent.com/d/1eol-jyuHpaX3veF4sIYAhuBc5WoIS6W8" 
                      alt="Recepção e Refeitório" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-gray-100 shadow-sm mt-8">
                    <img 
                      src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAE-WAa1RhYCj-7v4tSi-CLcz1zl3R-YpQO8KLxSvUcvy6ohZ5lkZw37giBP6I8g-4F7wemp9PGeBeldzbM12tTwu5_KoZgpPWiYAJmsGcLg0xCB-cmPvaSr_6JP5PDdSWW61Juf5RPEaIY=s680-w680-h510-rw" 
                      alt="Lazer na Pousada" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

              </div>
            </div>
          </section>


          {/* ----- SECTION: COMODIDADES, LAZER E POLÍTICAS ----- */}
          <section id="estrutura" className="py-20 bg-stone-50/50 scroll-mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              
              <div className="text-center space-y-3">
                <span className="text-xs uppercase tracking-widest text-turquoise font-extrabold flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-turquoise"></span>
                  Viva essa Experiência
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ocean">Nossas Comodidades, Lazer & Políticas</h2>
                <p className="text-sm text-gray-500 max-w-2xl mx-auto">Tudo o que você precisa para uma estadia tranquila, confortável e divertida em frente ao mar no Balneário Yemar.</p>
              </div>

              {/* Bento-like Grid for the 8 items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. Café da manhã incluso na diária */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Coffee className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-ocean">Café da Manhã Incluso</h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Servido diariamente das <strong className="text-ocean font-bold">08:00 h às 10:00 h</strong>. Buffet farto com bolos artesanais, pães fresquinhos, sucos naturais e frios.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 text-[10px] text-orange-600 font-bold tracking-wider uppercase flex items-center gap-1">
                    <span>☕ Sem custos adicionais</span>
                  </div>
                </div>

                {/* 2. Reserva efetivada com 50% & Prazos */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-ocean">Entradas & Saídas</h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Reserva efetivada com <strong className="text-ocean font-bold">50% de sinal</strong>. Entrada (Check-in) iniciando às <strong className="text-ocean font-bold">12:00 h</strong> e saída (Check-out) até às <strong className="text-ocean font-bold">11:00 h</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 text-[10px] text-emerald-600 font-bold tracking-wider uppercase flex items-center gap-1">
                    <span>💳 Sinal facilitado via Pix</span>
                  </div>
                </div>

                {/* 3. Políticas de cancelamento de 8 dias */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-ocean">Cancelamento Flexível</h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Garantia de reembolso integral ou reagendamento efetuando o cancelamento com até <strong className="text-ocean font-bold">08 dias de antecedência</strong> à data da reserva.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 text-[10px] text-blue-600 font-bold tracking-wider uppercase flex items-center gap-1">
                    <span>🛡️ 08 dias de antecedência</span>
                  </div>
                </div>

                {/* 4. Suítes Confortáveis (Cama casal + cama solteiro) */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Bed className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-ocean">Suítes Equipadas</h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Acomodações com <strong className="text-ocean font-bold">cama de casal e cama de solteiro</strong>. TV, Wi-Fi ultra veloz, frigobar <span className="italic font-medium text-gray-400">(opcional)</span> e ar condicionado <span className="italic font-medium text-gray-400">(opcional)</span>.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 text-[10px] text-purple-600 font-bold tracking-wider uppercase flex items-center gap-1">
                    <span>📺 Lazer e conectividade</span>
                  </div>
                </div>

                {/* 5. 70% Vista Mar, térreo e superior */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-ocean">Apartamentos Vista Mar</h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Dispomos de apartamentos no <strong className="text-ocean font-bold">térreo e no piso superior</strong>, sendo que <strong className="text-ocean font-bold">70% contam com vista</strong> direta e deslumbrante para o mar.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 text-[10px] text-cyan-600 font-bold tracking-wider uppercase flex items-center gap-1">
                    <span>🌅 Escolha térreo ou superior</span>
                  </div>
                </div>

                {/* 6. Serviço de Bebidas & Porções */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Utensils className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-ocean">Porções & Bebidas</h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Serviço completo de bar servindo porções crocantes fofinhas de peixe, batata frita e bebidas trincando de geladas diretamente no deck.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 text-[10px] text-amber-600 font-bold tracking-wider uppercase flex items-center gap-1">
                    <span>🍤 Sabores do nosso litoral</span>
                  </div>
                </div>

                {/* 7. Área gourmet */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Flame className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-ocean">Área Gourmet</h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Espaço equipado para suas confraternizações. <strong className="text-ocean font-bold">Agendamento antecipado necessário (custo à parte)</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 text-[10px] text-red-600 font-bold tracking-wider uppercase flex items-center gap-1">
                    <span>🍖 Churrasqueira & Convívio</span>
                  </div>
                </div>

                {/* 8. 02 Piscinas & Lazer Infantil */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Waves className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-ocean">Lazer Completo</h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Contamos com <strong className="text-ocean font-bold">02 Piscinas Mistas</strong> e área infantil com <strong className="text-ocean font-bold">pula-pula e escorregador</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 text-[10px] text-teal-600 font-bold tracking-wider uppercase flex items-center gap-1">
                    <span>🏊‍♂️ Diversão para toda família</span>
                  </div>
                </div>

              </div>

            </div>
          </section>


          {/* ----- SECTION: PERGUNTAS FREQUENTES (FAQ) ----- */}
          <section id="faq" className="py-20 bg-white border-y border-stone-200/50 scroll-mt-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              
              <div className="text-center space-y-3">
                <span className="text-xs uppercase tracking-widest text-turquoise font-extrabold flex items-center justify-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-turquoise" />
                  Dúvidas Frequentes
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ocean">Perguntas Frequentes</h2>
                <p className="text-sm text-gray-500 max-w-xl mx-auto">
                  Encontre respostas rápidas para as principais dúvidas sobre hospedagem, reservas e serviços na Pousada Ykapê.
                </p>
              </div>

              {/* Accordion Component */}
              <div className="space-y-4">
                {/* Schema.org FAQPage Structured Data */}
                <script 
                  type="application/ld+json" 
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} 
                />

                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div 
                      key={idx} 
                      className="bg-stone-50 border border-gray-200/60 rounded-xl overflow-hidden transition-all duration-300 shadow-sm"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left font-heading font-bold text-sm sm:text-base text-ocean hover:text-turquoise transition-colors focus:outline-none"
                      >
                        <span className="pr-4">{item.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-turquoise shrink-0 transition-transform duration-300" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300" />
                        )}
                      </button>
                      
                      <div 
                        className={`transition-all duration-300 overflow-hidden ${
                          isOpen ? 'max-h-64 border-t border-gray-200/50' : 'max-h-0'
                        }`}
                      >
                        <div className="px-6 py-4 text-xs sm:text-sm text-gray-600 leading-relaxed bg-white">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>


          {/* ----- SECTION: CARDÁPIO (MENU) ----- */}
          <section id="cardapio" className="py-20 scroll-mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              
              <div className="text-center space-y-3">
                <span className="text-xs uppercase tracking-widest text-turquoise font-extrabold">Petiscos & Drinks</span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ocean">Nosso Cardápio da Praia</h2>
                <p className="text-sm text-gray-500 max-w-xl mx-auto">Porções douradas e cervejas trincando de geladas servidas diretamente na área da piscina ou no deck.</p>
              </div>

              {/* Categorized Lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Column 1: Porções */}
                <div className="bg-stone-50 p-6 sm:p-8 rounded-2xl border border-gray-200/60 space-y-6">
                  <h3 className="font-heading font-bold text-lg text-ocean flex items-center gap-2 border-b border-gray-200 pb-3">
                    🍤 Porções, Bebidas e Sucos Naturais
                  </h3>
                  <div className="space-y-4">
                    {menuItems.filter(item => item.category === 'porcoes').map(item => (
                      <div key={item.id} className="flex justify-between items-start gap-4 text-xs sm:text-sm">
                        <div className="space-y-0.5">
                          <strong className="text-gray-800 font-semibold">{item.name}</strong>
                          {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                        </div>
                        <span className="font-bold text-turquoise whitespace-nowrap uppercase tracking-widest text-[10px]">
                          {item.price > 0 ? `R$ ${item.price}` : 'Sob Consulta'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Bebidas & Sucos */}
                <div className="bg-stone-50 p-6 sm:p-8 rounded-2xl border border-gray-200/60 space-y-6">
                  <h3 className="font-heading font-bold text-lg text-ocean flex items-center gap-2 border-b border-gray-200 pb-3">
                    🍹 Bebidas & Sucos Naturais
                  </h3>
                  <div className="space-y-4">
                    {menuItems.filter(item => item.category === 'drinks' || item.category === 'bebidas').map(item => (
                      <div key={item.id} className="flex justify-between items-start gap-4 text-xs sm:text-sm">
                        <div className="space-y-0.5">
                          <strong className="text-gray-800 font-semibold">{item.name}</strong>
                          {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                        </div>
                        <span className="font-bold text-turquoise whitespace-nowrap uppercase tracking-widest text-[10px]">
                          {item.price > 0 ? `R$ ${item.price}` : 'Sob Consulta'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </section>


          {/* ----- SECTION: GALERIA FOTOGRÁFICA ----- */}
          <section id="galeria" className="py-20 bg-stone-50/50 scroll-mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              <div className="text-center space-y-3">
                <span className="text-xs uppercase tracking-widest text-turquoise font-extrabold">Visual da Pousada</span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ocean">Galeria de Fotos Oficiais</h2>
                <p className="text-sm text-gray-500 max-w-xl mx-auto">Navegue pelas belas paisagens do Balneário Yemar, nossas suítes e piscinas.</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { id: 'todos', label: 'Ver Tudo' },
                  { id: 'quartos', label: 'Quartos' },
                  { id: 'piscinas', label: 'Piscinas' },
                  { id: 'externo', label: 'Área Externa' },
                  { id: 'cafe', label: 'Café da Manhã' },
                  { id: 'praia', label: 'Praia / Mar' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAlbum(tab.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeAlbum === tab.id
                        ? 'bg-turquoise text-white shadow-sm'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Pictures Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {filteredGallery.map(item => (
                  <div 
                    key={item.id} 
                    className="relative group rounded-2xl overflow-hidden aspect-square bg-stone-100 shadow-sm border border-gray-200/40"
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-xs font-heading font-semibold text-white tracking-wide">
                        {item.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>


          {/* ----- SECTION: AVALIAÇÕES DE HÓSPEDES ----- */}
          <section className="py-20 bg-ocean text-white relative overflow-hidden">
            {/* Background decorative waves */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
              <svg viewBox="0 0 1440 320" className="w-full h-full object-cover">
                <path fill="#ffffff" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,240C1248,245,1344,203,1392,181.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
              
              <div className="text-center space-y-3">
                <span className="text-xs uppercase tracking-widest text-turquoise font-extrabold flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-turquoise animate-ping"></span>
                  Depoimentos Reais
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-sand">O que dizem os nossos hóspedes</h2>
                <p className="text-sm text-gray-300 max-w-xl mx-auto">Temos orgulho de oferecer momentos inesquecíveis. Confira o carrossel de avaliações 5 estrelas do nosso Google Business!</p>
              </div>

              {/* Google Business Rating Summary Box */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
                <div className="flex items-center gap-4">
                  {/* Styled Google "G" representation */}
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md shrink-0">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-white flex items-center gap-1.5">
                      Pousada Ykapê
                      <span className="text-xs bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Verificado</span>
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xl font-extrabold text-sand">5.0</span>
                      <div className="flex text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <span className="text-xs text-gray-300">(20 avaliações de 5 estrelas)</span>
                    </div>
                  </div>
                </div>
                <a 
                  href="https://www.google.com/travel/search?q=Pousada%20Ykap%C3%AA%20-%20Avenida%20Beira%20Mar%20-%20Balne%C3%A1rio%20Yemar%2C%20Ilha%20Comprida%20-%20SP&hl=pt-BR&gl=br&ap=ugEHcmV2aWV3cw&ictx=111" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-sand hover:bg-sand/90 text-ocean font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 tracking-wide"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver no Google Business
                </a>
              </div>

              {/* Carousel Container */}
              <div className="relative px-2 sm:px-12">
                
                {/* Left navigation arrow */}
                <button 
                  onClick={() => setCarouselIndex(prev => (prev - 1 + reviews.length) % (reviews.length || 1))}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur border border-white/10 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer z-20 shadow-md hover:scale-110"
                  aria-label="Avaliação anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                {/* Right navigation arrow */}
                <button 
                  onClick={() => setCarouselIndex(prev => (prev + 1) % (reviews.length || 1))}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur border border-white/10 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer z-20 shadow-md hover:scale-110"
                  aria-label="Próxima avaliação"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Active Slider Viewports */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 transition-all duration-500 py-2">
                  {Array.from({ length: itemsPerView }).map((_, i) => {
                    if (reviews.length === 0) return null;
                    const idx = (carouselIndex + i) % reviews.length;
                    const rev = reviews[idx];
                    if (!rev) return null;

                    return (
                      <div 
                        key={`${rev.id}-${i}`} 
                        className="bg-white/5 backdrop-blur border border-white/10 hover:border-turquoise/30 p-6 rounded-2xl text-left flex flex-col justify-between space-y-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                      >
                        <div className="space-y-3">
                          {/* Top row with Quote & Stars */}
                          <div className="flex justify-between items-start">
                            <div className="flex gap-0.5 text-yellow-400">
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                            </div>
                            <Quote className="w-8 h-8 text-turquoise/20 shrink-0 group-hover:text-turquoise/40 transition-colors" />
                          </div>
                          
                          {/* Review comment */}
                          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed italic line-clamp-5 group-hover:text-white transition-colors">
                            "{rev.comment}"
                          </p>
                        </div>

                        {/* Guest details footer */}
                        <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                          <div>
                            <strong className="text-sand text-xs sm:text-sm block group-hover:text-sand/90 transition-colors">{rev.guestName}</strong>
                            <span className="text-[9px] text-turquoise uppercase font-bold tracking-wider block mt-0.5">{rev.cityState}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] bg-white/10 text-gray-300 px-2 py-0.5 rounded font-medium tracking-wide block mb-1">
                              {rev.roomType}
                            </span>
                            <span className="block text-[8px] text-gray-400">{rev.date}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dot Pagination Track */}
                <div className="flex flex-wrap justify-center gap-1.5 mt-8 max-w-md mx-auto">
                  {reviews.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCarouselIndex(dotIdx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        carouselIndex === dotIdx ? 'bg-sand w-6' : 'bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Ir para avaliação ${dotIdx + 1}`}
                    />
                  ))}
                </div>

              </div>

            </div>
          </section>


          {/* ----- SECTION: CONTATO & MAPA ----- */}
          <section id="contato" className="py-20 scroll-mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              
              <div className="text-center space-y-3">
                <span className="text-xs uppercase tracking-widest text-turquoise font-extrabold">Fale Conosco</span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ocean">Localização e Formulário de Contato</h2>
                <p className="text-sm text-gray-500 max-w-xl mx-auto">Dúvidas sobre reservas? Mande sua mensagem ou utilize nossas integrações de acesso imediato.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form Column */}
                <div className="lg:col-span-5 bg-stone-50 border border-gray-200/60 p-6 sm:p-8 rounded-2xl space-y-6">
                  <h3 className="font-heading font-bold text-lg text-ocean">Envie uma Mensagem</h3>
                  
                  {contactSubmitted ? (
                    <div className="bg-emerald-50 border border-emerald-500/20 text-emerald-800 p-6 rounded-xl space-y-4 text-center">
                      <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                      <h4 className="font-heading font-bold text-base">Mensagem Direcionada ao WhatsApp!</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">Você está sendo redirecionado para o nosso WhatsApp para atendimento imediato. Caso a janela de conversa não abra automaticamente, por favor clique no botão abaixo:</p>
                      <a 
                        href={contactWhatsappUrl || `https://wa.me/5513997654321`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md transition-all uppercase tracking-wider cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Conversar no WhatsApp
                      </a>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4 text-xs sm:text-sm">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Seu Nome Completo *</label>
                        <input 
                          type="text" 
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" 
                          placeholder="Ex: Pedro de Alcântara"
                        />
                      </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">WhatsApp / Celular</label>
                          <input 
                            type="text" 
                            value={contactForm.phone}
                            onChange={(e) => handleContactPhoneChange(e.target.value)}
                            className={`w-full bg-white border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                              contactErrors.phone 
                                ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400 bg-red-50/10' 
                                : 'border-gray-200 focus:border-ocean/40'
                            }`} 
                            placeholder="(13) 99999-9999"
                          />
                          {contactErrors.phone && (
                            <p className="text-[10px] text-red-500 mt-1 font-semibold animate-in fade-in duration-200">{contactErrors.phone}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">E-mail *</label>
                          <input 
                            type="email" 
                            required
                            value={contactForm.email}
                            onChange={(e) => handleContactEmailChange(e.target.value)}
                            className={`w-full bg-white border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                              contactErrors.email 
                                ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400 bg-red-50/10' 
                                : 'border-gray-200 focus:border-ocean/40'
                            }`} 
                            placeholder="seuemail@exemplo.com"
                          />
                          {contactErrors.email && (
                            <p className="text-[10px] text-red-500 mt-1 font-semibold animate-in fade-in duration-200">{contactErrors.email}</p>
                          )}
                        </div>
                      </div>

                      {/* Check-In Check-Out Date and Time Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-gray-100 py-3.5 my-1">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-ocean uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-turquoise"></span>
                            Período de Entrada
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Data</label>
                              <input 
                                type="date"
                                value={contactForm.checkInDate}
                                onChange={(e) => setContactForm({ ...contactForm, checkInDate: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-xs focus:border-ocean/40"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Horário</label>
                              <input 
                                type="time"
                                value={contactForm.checkInTime}
                                onChange={(e) => setContactForm({ ...contactForm, checkInTime: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-xs focus:border-ocean/40"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 sm:border-l sm:border-gray-100 sm:pl-4">
                          <h4 className="text-xs font-bold text-ocean uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-turquoise-dark"></span>
                            Período de Saída
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Data</label>
                              <input 
                                type="date"
                                value={contactForm.checkOutDate}
                                onChange={(e) => setContactForm({ ...contactForm, checkOutDate: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-xs focus:border-ocean/40"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Horário</label>
                              <input 
                                type="time"
                                value={contactForm.checkOutTime}
                                onChange={(e) => setContactForm({ ...contactForm, checkOutTime: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-xs focus:border-ocean/40"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Sua Mensagem *</label>
                        <textarea 
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none text-xs sm:text-sm" 
                          placeholder="Escreva sua dúvida, sugestão ou elogio aqui..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-ocean hover:bg-ocean-dark text-white font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
                      >
                        Enviar Mensagem <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>

                {/* Map & Address Info Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-stone-50 border border-gray-200/60 p-6 sm:p-8 rounded-2xl space-y-4">
                    <h3 className="font-heading font-bold text-lg text-ocean">Como Chegar na Pousada</h3>
                    <p className="text-xs text-gray-500 leading-normal">
                      Estamos localizados no Balneário Yemar, na maravilhosa Ilha Comprida e região. É fácil nos encontrar seguindo pela Avenida Beira Mar.
                    </p>
                    
                    <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                      <p className="flex items-start gap-1.5">
                        <MapPinIcon className="w-5 h-5 text-turquoise shrink-0 mt-0.5" />
                        <span>Avenida Beira Mar, nº 10.050 • Balneário Yemar • Divisa com Porto Velho</span>
                      </p>
                      <p className="text-xs bg-white border border-gray-200 p-2 rounded text-turquoise-dark">
                        <strong>ℹ Ponto de Referência:</strong> Ao lado do Supermercado Monte Carlo (Yemar). Facilidade máxima de conveniência.
                      </p>
                    </div>

                    {/* Integrated Interactive Google Maps Simulator Frame */}
                    <div className="h-64 bg-stone-100 rounded-xl overflow-hidden border border-gray-200 relative">
                      <iframe 
                        title="Localização Pousada Ykape"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.330883658248!2d-47.82855172382025!3d-24.920803567709328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94db29a397db8fdb%3A0xc6cb1c79c8d50454!2sIlha%20Comprida%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1719114321289!5m2!1spt-BR!2sbr" 
                        className="w-full h-full border-none"
                        allowFullScreen={false} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                      
                      {/* Floating Directions Action */}
                      <a 
                        href="https://maps.google.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="absolute bottom-3 right-3 bg-white hover:bg-stone-50 text-ocean border border-gray-200 py-1.5 px-3 rounded-lg text-xs font-bold shadow-md flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Como Chegar (Google Maps)
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Technical SEO Footer tags section for Local visibility */}
          <section className="bg-stone-100 py-6 border-t border-gray-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block mb-2">Termos Relacionados & SEO Local</span>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-gray-500 font-medium">
                <span>Pousada em Yemar</span> • 
                <span>Pousada frente ao mar</span> • 
                <span>Hospedagem em Yemar</span> • 
                <span>Pousada próximo Porto Velho</span> • 
                <span>Pousada com piscina</span> • 
                <span>Hotel em Yemar</span>
              </div>
            </div>
          </section>

        </main>
      )}

      {/* 3. FLUID AND BEACHY FOOTER COMPONENT */}
      <Footer 
        setActiveTab={setActiveTab} 
        setIsAdminMode={setIsAdminMode}
        onOpenBooking={() => {
          setInitialSearch(null);
          setIsBookingOpen(true);
        }}
      />

      {/* 4. OVERLAY RESERVATION STEP FLOW DIALOG */}
      <BookingFlow 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        rooms={rooms}
        onNewReservationCreated={handleNewReservationCreated}
        initialSearch={initialSearch}
      />

      {/* 5. FLOATING INTEGRATED CHAT WIDGET */}
      <WhatsAppChat 
        onOpenBooking={() => {
          setInitialSearch(null);
          setIsBookingOpen(true);
        }}
        setActiveTab={setActiveTab}
        setIsAdminMode={setIsAdminMode}
      />

    </div>
  );
}
