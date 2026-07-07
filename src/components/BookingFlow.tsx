import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Shield, CheckCircle, CreditCard, ChevronRight, Copy, Check, QrCode, Mail, MessageSquare } from 'lucide-react';
import { Room, GuestData, Reservation, BookingSearch } from '../types';
import { INITIAL_COUPONS } from '../data/initialData';

interface BookingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onNewReservationCreated: (reservation: Reservation) => void;
  initialSearch?: BookingSearch | null;
}

export default function BookingFlow({
  isOpen,
  onClose,
  rooms,
  onNewReservationCreated,
  initialSearch
}: BookingFlowProps) {
  // Booking State
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState<BookingSearch>({
    checkIn: '',
    checkOut: '',
    guests: 2
  });
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  const [guest, setGuest] = useState<GuestData>({
    fullName: '',
    cpf: '',
    phone: '',
    email: '',
    city: '',
    state: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // Percent
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit'>('pix');
  const [creditCardData, setCreditCardData] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });

  const [isPaying, setIsPaying] = useState(false);
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  // Load initial search if provided
  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
      setStep(2); // Jump directly to available rooms step!
    } else {
      // Set default dates (today and tomorrow)
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      setSearch({
        checkIn: today.toISOString().split('T')[0],
        checkOut: tomorrow.toISOString().split('T')[0],
        guests: 2
      });
    }
  }, [initialSearch, isOpen]);

  if (!isOpen) return null;

  // Calculate Nights
  const calculateNights = () => {
    if (!search.checkIn || !search.checkOut) return 1;
    const inDate = new Date(search.checkIn);
    const outDate = new Date(search.checkOut);
    const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const nights = calculateNights();

  // Filter Rooms based on capacity, status, and manual blocked dates
  const availableRooms = rooms.filter(room => {
    if (room.status !== 'available' || room.capacity < search.guests) {
      return false;
    }

    // Check if any date in the stay is manually blocked
    if (room.blockedDates && room.blockedDates.length > 0) {
      const start = new Date(search.checkIn + 'T12:00:00');
      const end = new Date(search.checkOut + 'T12:00:00');
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        if (room.blockedDates.includes(dateStr)) {
          return false;
        }
      }
    }

    return true;
  });

  // Calculations
  const basePrice = selectedRoom ? selectedRoom.pricePerNight * nights : 0;
  const discountAmount = (basePrice * appliedDiscount) / 100;
  const totalValue = basePrice - discountAmount;
  const depositPaid = totalValue * 0.5; // 50% prepayment
  const remainingBalance = totalValue * 0.5; // remaining 50% at check-in

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    const coupon = INITIAL_COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active);
    if (coupon) {
      setAppliedDiscount(coupon.discountPercent);
      setCouponSuccess(`Cupom aplicado! ${coupon.discountPercent}% de desconto concedido.`);
    } else {
      setAppliedDiscount(0);
      setCouponError('Cupom inválido ou expirado.');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.checkIn || !search.checkOut) return;
    if (new Date(search.checkIn) >= new Date(search.checkOut)) {
      alert('A data de Check-out deve ser após a data de Check-in.');
      return;
    }
    setStep(2);
  };

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setStep(3);
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest.fullName || !guest.cpf || !guest.phone || !guest.email || !guest.city || !guest.state) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setStep(5);
  };

  const handleConfirmSubmission = () => {
    setIsPaying(true);

    // Simulate sending reservation request
    setTimeout(() => {
      const reservationCode = 'YKP-' + Math.floor(1000 + Math.random() * 9000);
      const newRes: Reservation = {
        id: 'res-' + Math.random().toString(36).substr(2, 9),
        code: reservationCode,
        roomId: selectedRoom!.id,
        roomName: selectedRoom!.name,
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        guests: search.guests,
        nights,
        totalValue: 0,
        depositPaid: 0,
        remainingBalance: 0,
        paymentMethod: 'pix',
        status: 'pending_payment',
        guest,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      onNewReservationCreated(newRes);
      setCreatedReservation(newRes);
      setIsPaying(false);
      setStep(6); // Success Step!

      // Generate text and redirect to WhatsApp
      const messageText = `Olá, Pousada Ykape! Gostaria de solicitar uma reserva sob consulta:\n\n*Código da Solicitação:* ${reservationCode}\n*Acomodação:* ${selectedRoom!.name}\n*Check-in:* ${search.checkIn}\n*Check-out:* ${search.checkOut}\n*Noites:* ${nights}\n*Hóspedes:* ${search.guests} ${search.guests === 1 ? 'pessoa' : 'pessoas'}\n\n*Dados do Hóspede:*\n*Nome:* ${guest.fullName}\n*CPF:* ${guest.cpf}\n*WhatsApp:* ${guest.phone}\n*E-mail:* ${guest.email}\n*Cidade/Estado:* ${guest.city} - ${guest.state}`;
      const whatsappUrl = `https://wa.me/5513996213162?text=${encodeURIComponent(messageText)}`;
      window.open(whatsappUrl, '_blank');
    }, 1500);
  };

  const copyPixKey = () => {
    const textToCopy = '00020101021126580014br.gov.bcb.pix0136ykapepousadabene392819203810239103810235204000053039865802500.005303986540550.005802BR5913PousadaYkape6009IlhaCompr62070503***6304ABCD';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setCopiedPix(true);
          setTimeout(() => setCopiedPix(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    } else {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
          setCopiedPix(true);
          setTimeout(() => setCopiedPix(false), 2000);
        }
      } catch (err) {
        console.error('Fallback copy failed: ', err);
      }
    }
  };

  const stepsList = [
    { number: 1, label: 'Filtro' },
    { number: 2, label: 'Quartos' },
    { number: 3, label: 'Resumo' },
    { number: 4, label: 'Cadastro' },
    { number: 5, label: 'Confirmação' },
    { number: 6, label: 'Pronto!' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-sand/40">
        
        {/* Header */}
        <div className="bg-ocean text-white p-4 sm:px-6 flex justify-between items-center border-b border-turquoise/20">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-turquoise font-semibold block">Reservas Online</span>
            <h2 className="font-heading font-bold text-lg sm:text-xl text-sand flex items-center gap-2">
              🌊 Garanta sua Estadia Pé na Areia
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Steps Tracker */}
        <div className="bg-sand/25 border-b border-sand/40 px-4 py-3 sm:px-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center min-w-[550px] justify-between">
            {stepsList.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.number
                      ? 'bg-turquoise text-white scale-110 shadow-md ring-2 ring-turquoise/20'
                      : step > s.number
                      ? 'bg-ocean text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.number && s.number < 6 ? '✓' : s.number}
                  </div>
                  <span className={`text-xs font-semibold ${
                    step === s.number ? 'text-ocean font-bold' : 'text-gray-500'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {index < stepsList.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-gray-800">
          
          {/* STEP 1: SELECT DATES & GUESTS */}
          {step === 1 && (
            <form onSubmit={handleSearchSubmit} className="space-y-6 max-w-md mx-auto py-4">
              <div className="text-center space-y-2">
                <h3 className="font-heading font-semibold text-lg text-ocean">Escolha as datas da sua viagem</h3>
                <p className="text-xs text-gray-500">Localizada no Balneário Yemar, a Pousada Ykape oferece piscina e praia lado a lado.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Data de Check-In</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-turquoise" />
                    <input 
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={search.checkIn}
                      onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Data de Check-Out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-turquoise" />
                    <input 
                      type="date"
                      required
                      min={search.checkIn || new Date().toISOString().split('T')[0]}
                      value={search.checkOut}
                      onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Número de Hóspedes</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-turquoise" />
                    <select
                      value={search.guests}
                      onChange={(e) => setSearch({ ...search, guests: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40"
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Hóspede' : 'Hóspedes'}</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">Acomodações comportam até 4 pessoas. Para grupos maiores, faça mais reservas.</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-turquoise hover:bg-turquoise-dark text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer text-sm"
              >
                Buscar Quartos Disponíveis
              </button>
            </form>
          )}

          {/* STEP 2: AVAILABLE ROOMS */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-sand/10 p-3 rounded-lg border border-sand/40 gap-3">
                <div className="text-xs text-gray-600">
                  Período selecionado: <strong className="text-ocean">{search.checkIn}</strong> até <strong className="text-ocean">{search.checkOut}</strong> ({nights} {nights === 1 ? 'noite' : 'noites'}) para <strong className="text-ocean">{search.guests} hóspedes</strong>.
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-turquoise hover:underline font-semibold cursor-pointer"
                >
                  Alterar Datas
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableRooms.length === 0 ? (
                  <div className="col-span-2 text-center py-12 space-y-3">
                    <p className="text-gray-500 font-medium">Nenhum quarto disponível com capacidade para {search.guests} hóspedes nessas datas.</p>
                    <button onClick={() => setStep(1)} className="bg-ocean text-white px-4 py-2 rounded-lg text-xs font-bold">Tentar Outro Período</button>
                  </div>
                ) : (
                  availableRooms.map((room) => (
                    <div 
                      key={room.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div className="relative h-44 w-full bg-gray-100">
                        <img 
                          src={room.images[0]} 
                          alt={room.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 bg-ocean text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {room.type === 'comfort' ? 'Ar Condicionado' : 'Ventilação Natural'}
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h4 className="font-heading font-bold text-base text-ocean">{room.name}</h4>
                          <p className="text-xs text-gray-500 line-clamp-2">{room.description}</p>
                          
                          {/* Amenities list */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {room.amenities.slice(0, 4).map((amenity, i) => (
                              <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {amenity}
                              </span>
                            ))}
                            {room.amenities.length > 4 && (
                              <span className="text-[10px] text-turquoise font-bold">+ {room.amenities.length - 4} mais</span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 block">Tarifa:</span>
                            <span className="text-sm font-bold text-turquoise">Sob Consulta</span>
                          </div>
                          <button
                            onClick={() => handleSelectRoom(room)}
                            className="bg-turquoise hover:bg-turquoise-dark text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                          >
                            Selecionar Quarto
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STEP 3: SUMMARY & REQUEST */}
          {step === 3 && selectedRoom && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Room details info */}
              <div className="md:col-span-3 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                  <h3 className="font-heading font-bold text-lg text-ocean">Resumo da sua Acomodação</h3>
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={selectedRoom.images[0]} 
                      alt={selectedRoom.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-heading font-bold text-base text-gray-800">{selectedRoom.name}</h4>
                    <p className="text-xs text-gray-500">{selectedRoom.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200/60 text-xs">
                    <div>
                      <span className="text-gray-400 block">Check-In:</span>
                      <strong className="text-gray-700">{search.checkIn} (a partir das 14h)</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Check-Out:</span>
                      <strong className="text-gray-700">{search.checkOut} (até as 12h)</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Estadia:</span>
                      <strong className="text-gray-700">{nights} {nights === 1 ? 'noite' : 'noites'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Capacidade Reservada:</span>
                      <strong className="text-gray-700">{search.guests} {search.guests === 1 ? 'pessoa' : 'pessoas'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Calculation Column */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-turquoise/5 rounded-xl p-5 border border-turquoise/20 space-y-3">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-turquoise-dark border-b border-turquoise/10 pb-1.5">Solicitação Sob Consulta</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Esta acomodação não possui tarifas fixadas para reserva automática online.
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Ao prosseguir e preencher seus dados, enviaremos um pedido de reserva personalizado para nossa equipe, que entrará em contato via WhatsApp / E-mail para fornecer o orçamento detalhado.
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-stone-200/50 text-xs space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Compromisso</span>
                    <span className="font-semibold text-ocean">Nenhum custo ou taxa cobrados agora</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex-1 bg-turquoise hover:bg-turquoise-dark text-white font-bold py-2.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    Preencher Dados &raquo;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: GUEST REGISTRATION */}
          {step === 4 && (
            <form onSubmit={handleGuestSubmit} className="space-y-6 max-w-xl mx-auto py-2">
              <div className="text-center space-y-1.5 mb-2">
                <h3 className="font-heading font-semibold text-lg text-ocean">Identificação do Hóspede Titular</h3>
                <p className="text-xs text-gray-500">Dados necessários para emissão da confirmação de reserva e segurança.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nome Completo *</label>
                  <input 
                    type="text"
                    required
                    value={guest.fullName}
                    onChange={(e) => setGuest({ ...guest, fullName: e.target.value })}
                    placeholder="Ex: Maria das Graças Silva"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-turquoise"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">CPF *</label>
                  <input 
                    type="text"
                    required
                    value={guest.cpf}
                    onChange={(e) => setGuest({ ...guest, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-turquoise"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">WhatsApp / Telefone *</label>
                  <input 
                    type="text"
                    required
                    value={guest.phone}
                    onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                    placeholder="(13) 99999-9999"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-turquoise"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">E-mail *</label>
                  <input 
                    type="email"
                    required
                    value={guest.email}
                    onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-turquoise"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cidade *</label>
                    <input 
                      type="text"
                      required
                      value={guest.city}
                      onChange={(e) => setGuest({ ...guest, city: e.target.value })}
                      placeholder="São Paulo"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-turquoise"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">UF *</label>
                    <input 
                      type="text"
                      required
                      maxLength={2}
                      value={guest.state}
                      onChange={(e) => setGuest({ ...guest, state: e.target.value.toUpperCase() })}
                      placeholder="SP"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none text-center focus:ring-1 focus:ring-turquoise"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-turquoise hover:bg-turquoise-dark text-white font-bold py-2.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  Ir para Confirmação &raquo;
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: BOOKING REQUEST CONFIRMATION */}
          {step === 5 && selectedRoom && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-left">
              {/* Left Column: Confirm details */}
              <div className="md:col-span-3 space-y-4">
                <h3 className="font-heading font-semibold text-base text-ocean">Confirmação dos Seus Dados</h3>
                <p className="text-xs text-gray-500">Por favor, revise as informações de contato do hóspede titular antes de enviar a solicitação.</p>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 block uppercase font-bold tracking-wider text-[10px]">Nome Completo:</span>
                      <strong className="text-gray-800 text-sm">{guest.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase font-bold tracking-wider text-[10px]">CPF:</span>
                      <strong className="text-gray-800 text-sm">{guest.cpf}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase font-bold tracking-wider text-[10px]">WhatsApp / Telefone:</span>
                      <strong className="text-gray-800 text-sm">{guest.phone}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase font-bold tracking-wider text-[10px]">E-mail:</span>
                      <strong className="text-gray-800 text-sm">{guest.email}</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-400 block uppercase font-bold tracking-wider text-[10px]">Cidade / Estado:</span>
                      <strong className="text-gray-800 text-sm">{guest.city} - {guest.state}</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-turquoise/5 border border-turquoise/20 rounded-xl p-4 text-xs space-y-2">
                  <span className="text-[10px] bg-turquoise/20 text-turquoise-dark font-bold px-2 py-0.5 rounded-full uppercase">Próximo Passo</span>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    Nossa equipe receberá seus dados instantaneamente em nosso painel de controle e entrará em contato em menos de 24 horas via WhatsApp / E-mail para confirmar a disponibilidade final e acertar os detalhes do seu orçamento personalizado.
                  </p>
                </div>
              </div>

              {/* Right Column: Reservation Request Summary */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-ocean/5 rounded-xl p-4 border border-ocean/15 space-y-4 text-xs">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-ocean border-b border-ocean/10 pb-1.5">Resumo da Solicitação</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Acomodação:</span>
                      <span className="font-semibold text-ocean">{selectedRoom.name}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Período:</span>
                      <span className="font-semibold">{search.checkIn} a {search.checkOut}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Noites:</span>
                      <span className="font-semibold">{nights} {nights === 1 ? 'noite' : 'noites'}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Hóspedes:</span>
                      <span className="font-semibold">{search.guests} {search.guests === 1 ? 'pessoa' : 'pessoas'}</span>
                    </div>
                    <div className="flex justify-between text-turquoise-dark font-bold bg-white p-2.5 rounded border border-turquoise/15">
                      <span>Tarifa:</span>
                      <span className="uppercase">Sob Consulta</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3 space-y-2 text-[11px] text-gray-500 leading-normal">
                    <p className="flex items-start gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-turquoise shrink-0 mt-0.5" />
                      <span>Sua solicitação é sem compromisso de pagamento imediato.</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleConfirmSubmission}
                    disabled={isPaying}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer text-xs flex items-center justify-center gap-1.5"
                  >
                    {isPaying ? (
                      <>
                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                        Enviando Solicitação...
                      </>
                    ) : (
                      <>
                        ✓ Enviar Solicitação de Reserva
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Voltar para Cadastro
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: BOOKING CONFIRMED (SUCCESS!) */}
          {step === 6 && createdReservation && (
            <div className="space-y-6 max-w-2xl mx-auto py-2 text-center">
              <div className="space-y-2">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <span className="text-[11px] uppercase tracking-widest text-emerald-600 font-bold block">Solicitação Enviada</span>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-ocean">Solicitação Recebida com Sucesso!</h3>
                <p className="text-xs text-gray-500">Sua solicitação para a Pousada Ykape já está em nossa central de atendimento.</p>
              </div>

              {/* Booking Voucher Summary */}
              <div className="bg-sand/15 border-2 border-dashed border-sand rounded-xl p-5 space-y-4 text-left shadow-inner">
                <div className="flex justify-between items-center border-b border-sand/40 pb-2.5">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Código da Solicitação:</span>
                    <strong className="text-lg font-mono text-ocean">{createdReservation.code}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Status:</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full uppercase">
                      Sob Consulta / Aguardando Retorno
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700">
                  <div>
                    <span className="text-gray-400 block font-medium">Hóspede Solicitante:</span>
                    <span className="font-semibold text-gray-800">{createdReservation.guest.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Acomodação de Interesse:</span>
                    <span className="font-semibold text-gray-800">{createdReservation.roomName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Período Pretendido:</span>
                    <span className="font-semibold text-gray-800">{createdReservation.checkIn} a {createdReservation.checkOut} ({createdReservation.nights} Noites)</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Quantidade de Hóspedes:</span>
                    <span className="font-semibold text-gray-800">{createdReservation.guests} {createdReservation.guests === 1 ? 'pessoa' : 'pessoas'}</span>
                  </div>
                  <div className="sm:col-span-2 pt-3 border-t border-sand/30 bg-white/50 p-3 rounded">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Informação Adicional</span>
                    <p className="text-xs text-gray-600 mt-1">
                      Nenhum pagamento foi cobrado. Enviaremos o orçamento com valores, formas de pagamento (PIX ou Cartão) e link para quitação do sinal diretamente em seu WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              {/* Simulated Notification Previews (Emails / WhatsApp messages) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {/* Email Simulator */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-3">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs pb-1.5 border-b border-slate-200">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span>[Simulador] E-mail enviado</span>
                  </div>
                  <div className="space-y-1 bg-white p-2.5 rounded border border-slate-100 text-[11px] leading-relaxed">
                    <p className="text-gray-500"><strong>Assunto:</strong> Solicitação de Reserva Recebida ({createdReservation.code}) - Pousada Ykape</p>
                    <p className="text-gray-600 mt-1">Prezada(o) {createdReservation.guest.fullName.split(' ')[0]}, recebemos seu interesse no quarto <strong>{createdReservation.roomName}</strong> para {createdReservation.checkIn} a {createdReservation.checkOut}. Nossa equipe está avaliando a tarifa personalizada para {createdReservation.guests} pessoas e responderá em breve!</p>
                  </div>
                </div>

                {/* WhatsApp Simulator */}
                <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 space-y-3">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs pb-1.5 border-b border-emerald-100">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    <span>[Simulador] WhatsApp enviado</span>
                  </div>
                  <div className="space-y-1 bg-white p-2.5 rounded border border-emerald-500/10 text-[11px] leading-relaxed">
                    <p className="text-emerald-700"><strong>De:</strong> Pousada Ykape</p>
                    <p className="text-gray-600 italic">"Olá, {createdReservation.guest.fullName.split(' ')[0]}! 🌴 Recebemos seu pedido de reserva *{createdReservation.code}* sob consulta para a acomodação *{createdReservation.roomName}*. Já estamos preparando seu orçamento sob medida e enviaremos por aqui!"</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3">
                <a
                  href={`https://wa.me/5513996213162?text=${encodeURIComponent(
                    `Olá, Pousada Ykape! Gostaria de solicitar uma reserva sob consulta:\n\n` +
                    `*Código da Solicitação:* ${createdReservation.code}\n` +
                    `*Acomodação:* ${createdReservation.roomName}\n` +
                    `*Check-in:* ${createdReservation.checkIn}\n` +
                    `*Check-out:* ${createdReservation.checkOut}\n` +
                    `*Noites:* ${createdReservation.nights}\n` +
                    `*Hóspedes:* ${createdReservation.guests} ${createdReservation.guests === 1 ? 'pessoa' : 'pessoas'}\n\n` +
                    `*Dados do Hóspede:*\n` +
                    `*Nome:* ${createdReservation.guest.fullName}\n` +
                    `*CPF:* ${createdReservation.guest.cpf}\n` +
                    `*WhatsApp:* ${createdReservation.guest.phone}\n` +
                    `*E-mail:* ${createdReservation.guest.email}\n` +
                    `*Cidade/Estado:* ${createdReservation.guest.city} - ${createdReservation.guest.state}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition-all cursor-pointer text-sm shadow-md flex items-center gap-2 animate-pulse"
                >
                  <MessageSquare className="w-5 h-5" />
                  Enviar Solicitação via WhatsApp
                </a>
                <button
                  onClick={onClose}
                  className="bg-stone-500 hover:bg-stone-600 text-white font-bold py-3 px-8 rounded-full transition-all cursor-pointer text-sm shadow-md"
                >
                  Voltar ao Site
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
