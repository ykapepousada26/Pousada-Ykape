import React, { useState, useEffect } from 'react';
import { 
  BarChart, Users, Calendar, BookOpen, Image as ImageIcon, 
  Plus, Edit, Trash, Filter, RefreshCw, Layers, ShieldCheck, 
  Settings, DollarSign, Bed, CheckCircle, Clock, AlertTriangle, ChevronLeft, ChevronRight,
  LogOut, Lock, Mail, Key, User as UserIcon, Loader2, ArrowRight, Shield, Droplets, Utensils
} from 'lucide-react';
import { Room, MenuItem, Review, GalleryItem, Reservation, GuestData } from '../types';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, sendPasswordResetEmail } from '../lib/firebase';

interface AdminPanelProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  onClose: () => void;
}

type AdminSection = 'dashboard' | 'reservas' | 'quartos' | 'calendario' | 'cardapio' | 'galeria';

export default function AdminPanel({
  rooms,
  setRooms,
  menuItems,
  setMenuItems,
  gallery,
  setGallery,
  reservations,
  setReservations,
  onClose
}: AdminPanelProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('surfads02@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  // Filters state for Reservations
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState('');

  // Editing state for Menu
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuForm, setMenuForm] = useState<{ name: string; category: MenuItem['category']; price: number; description: string; available: boolean }>({
    name: '',
    category: 'porcoes',
    price: 0,
    description: '',
    available: true
  });
  const [isAddingMenu, setIsAddingMenu] = useState(false);

  // Editing state for Rooms
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState<{
    name: string;
    type: 'standard' | 'comfort';
    capacity: number;
    pricePerNight: number;
    description: string;
    hasAirConditioning: boolean;
    amenitiesText: string;
    imagesText: string;
    status: Room['status'];
    totalUnits: number;
    isPriceOnRequest: boolean;
  }>({
    name: '',
    type: 'standard',
    capacity: 2,
    pricePerNight: 200,
    description: '',
    hasAirConditioning: false,
    amenitiesText: '',
    imagesText: '',
    status: 'available',
    totalUnits: 10,
    isPriceOnRequest: false
  });
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  // Adding Reservation manually state
  const [isAddingReservation, setIsAddingReservation] = useState(false);
  const [manualResForm, setManualResForm] = useState({
    fullName: '',
    cpf: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    roomId: rooms[0]?.id || '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    paymentMethod: 'pix' as 'pix' | 'credit' | 'debit',
  });

  // Adding Gallery Item State
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [galleryForm, setGalleryForm] = useState<{ album: GalleryItem['album']; title: string; imageUrl: string }>({
    album: 'quartos',
    title: '',
    imageUrl: ''
  });

  // Month selection state for calendar (0-indexed: 5 = June, 6 = July, 7 = August, etc.)
  const [selectedMonth, setSelectedMonth] = useState<number>(6); // Default: July 2026
  const [calendarPage, setCalendarPage] = useState<1 | 2 | 3>(1); // 1: Days 1-12, 2: Days 13-24, 3: Last 12 days

  // State for cell interaction menu
  const [activeCellMenu, setActiveCellMenu] = useState<{ roomId: string; date: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        setShowSignUp(false);
        setShowResetPassword(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmail.trim();
    if (!email || !loginPassword) {
      setLoginError('Por favor, preencha todos os campos.');
      return;
    }
    setLoginError('');
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, loginPassword);
    } catch (err: any) {
      console.error("Login error:", err);
      const errorCode = err.code;
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        setLoginError('E-mail ou senha incorretos. Verifique seus dados.');
      } else if (errorCode === 'auth/invalid-email') {
        setLoginError('O formato do e-mail é inválido.');
      } else if (errorCode === 'auth/user-disabled') {
        setLoginError('Esta conta foi desativada. Entre em contato com o suporte.');
      } else if (errorCode === 'auth/too-many-requests') {
        setLoginError('Muitas tentativas malsucedidas. Tente novamente mais tarde.');
      } else {
        setLoginError(`Erro (${errorCode}): Tente novamente ou use outro navegador.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmail.trim();
    if (!email || !loginPassword) {
      setLoginError('Preencha e-mail e senha para criar o acesso.');
      return;
    }
    if (loginPassword.length < 6) {
      setLoginError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoginError('');
    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email, loginPassword);
    } catch (err: any) {
      console.error("SignUp error:", err);
      const errorCode = err.code;
      if (errorCode === 'auth/email-already-in-use') {
        setLoginError('Este e-mail já está sendo usado por outra conta.');
      } else if (errorCode === 'auth/invalid-email') {
        setLoginError('O formato do e-mail digitado é inválido.');
      } else if (errorCode === 'auth/operation-not-allowed') {
        setLoginError('O cadastro com e-mail/senha não está habilitado no Console do Firebase. Ative-o em Autenticação > Sign-in method.');
      } else {
        setLoginError(`Erro ao criar conta: ${err.message || 'Verifique os dados e tente novamente.'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmail.trim();
    if (!email) {
      setLoginError('Por favor, digite seu e-mail para receber o link de redefinição.');
      return;
    }
    setLoginError('');
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: any) {
      console.error("Reset password error:", err);
      const errorCode = err.code;
      if (errorCode === 'auth/user-not-found') {
        setLoginError('Não encontramos nenhuma conta com este e-mail.');
      } else if (errorCode === 'auth/invalid-email') {
        setLoginError('O formato do e-mail digitado é inválido.');
      } else {
        setLoginError('Erro ao enviar e-mail. Verifique se o endereço está correto.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-stone-100 border-t-turquoise rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-turquoise" />
          </div>
        </div>
        <p className="text-stone-500 font-heading font-bold animate-pulse tracking-widest uppercase text-xs">Validando Acesso...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] bg-stone-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
          <div className="bg-ocean p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20">
                {showResetPassword ? <Key className="w-8 h-8 text-white" /> : showSignUp ? <UserIcon className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
              </div>
              <h1 className="text-2xl font-heading font-extrabold text-white tracking-tight">
                {showResetPassword ? 'Redefinir Senha' : showSignUp ? 'Criar Conta Admin' : 'Painel Admin Ykapê'}
              </h1>
              <p className="text-turquoise/80 text-xs font-bold uppercase tracking-widest mt-1">
                {showResetPassword ? 'Enviaremos um link para seu e-mail' : showSignUp ? 'Cadastre seu e-mail de acesso' : 'Acesso Restrito'}
              </p>
            </div>
          </div>
          
          <div className="p-8">
            {resetSent ? (
              <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-stone-800 text-lg">E-mail Enviado!</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    Verifique sua caixa de entrada (e spam) para seguir as instruções de redefinição.
                  </p>
                </div>
                <button 
                  onClick={() => { setShowResetPassword(false); setResetSent(false); }}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold py-4 rounded-2xl transition-all"
                >
                  Voltar ao Login
                </button>
              </div>
            ) : (
              <form onSubmit={showResetPassword ? handleResetPassword : showSignUp ? handleSignUp : handleLogin} className="space-y-6">
                {loginError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    {loginError}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider ml-1">E-mail</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-turquoise transition-colors" />
                      <input 
                        required 
                        type="email" 
                        disabled={isSubmitting}
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="admin@pousadaykape.com"
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/20 focus:border-turquoise transition-all placeholder:text-stone-300 disabled:opacity-50"
                      />
                    </div>
                  </div>
                  
                  {!showResetPassword && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Senha</label>
                        {!showSignUp && (
                          <button 
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => { setShowResetPassword(true); setLoginError(''); }}
                            className="text-[10px] font-bold text-turquoise hover:text-turquoise-dark uppercase tracking-widest transition-colors disabled:opacity-50"
                          >
                            Esqueceu?
                          </button>
                        )}
                      </div>
                      <div className="relative group">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-turquoise transition-colors" />
                        <input 
                          required 
                          type="password" 
                          disabled={isSubmitting}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/20 focus:border-turquoise transition-all placeholder:text-stone-300 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-turquoise hover:bg-turquoise-dark text-white font-heading font-extrabold py-4 rounded-2xl shadow-lg shadow-turquoise/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {showResetPassword ? 'Enviar Link de Redefinição' : showSignUp ? 'Criar Conta' : 'Entrar no Sistema'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                
                <div className="flex flex-col gap-3">
                  {(showResetPassword || showSignUp) && (
                    <button 
                      type="button"
                      onClick={() => { setShowResetPassword(false); setShowSignUp(false); setLoginError(''); }}
                      className="w-full text-stone-400 hover:text-stone-600 text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      Voltar ao Login
                    </button>
                  )}
                  
                  {!showResetPassword && !showSignUp && (
                    <>
                      <button 
                        type="button"
                        onClick={() => { setShowSignUp(true); setLoginError(''); }}
                        className="w-full text-turquoise hover:text-turquoise-dark text-[11px] font-bold uppercase tracking-widest transition-colors py-1"
                      >
                        Não tem conta? Criar acesso
                      </button>
                      <button 
                        type="button"
                        onClick={onClose}
                        className="w-full text-stone-400 hover:text-stone-600 text-xs font-bold uppercase tracking-widest transition-colors py-2"
                      >
                        Voltar ao Site
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}
          </div>
          
          <div className="bg-stone-50 p-6 border-t border-stone-100">
            <div className="flex items-center gap-4 text-[10px] text-stone-400 font-bold uppercase tracking-tighter">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SSL Seguro</span>
              <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> Ykapê Cloud</span>
              <span className="ml-auto opacity-50">v2.4.1</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----- KPI CALCULATIONS -----
  const totalUnits = rooms.reduce((acc, curr) => acc + (curr.totalUnits || 1), 0);
  const reservationsThisMonth = reservations.length;
  
  const totalRevenue = reservations.reduce((acc, curr) => {
    if (curr.status !== 'cancelled') {
      return acc + (curr.totalValue || 0);
    }
    return acc;
  }, 0);

  const depositRevenue = reservations.reduce((acc, curr) => {
    if (curr.status !== 'cancelled') {
      return acc + (curr.depositPaid || 0);
    }
    return acc;
  }, 0);

  // Calculate current occupancy based on real reservations for today
  const today = new Date().toISOString().split('T')[0];
  const activeReservationsCount = reservations.filter(res => {
    return (res.status === 'confirmed' || res.status === 'checked_in') && 
           res.checkIn <= today && res.checkOut > today;
  }).length;

  const occupancyRate = totalUnits > 0 ? Math.round((activeReservationsCount / totalUnits) * 100) : 0;
  const availableRoomsCount = totalUnits - activeReservationsCount;

  // ----- HANDLERS FOR RESERVATIONS -----
  const handleStatusChange = (resId: string, newStatus: Reservation['status']) => {
    setReservations(prev => prev.map(res => {
      if (res.id === resId) {
        return { ...res, status: newStatus };
      }
      return res;
    }));
  };

  const handleCreateManualReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedRoomDetails = rooms.find(r => r.id === manualResForm.roomId);
    if (!selectedRoomDetails) return;

    // Calculate nights
    const inDate = new Date(manualResForm.checkIn);
    const outDate = new Date(manualResForm.checkOut);
    const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const totalValue = selectedRoomDetails.pricePerNight * nights;
    const depositPaid = totalValue * 0.5;
    const remainingBalance = totalValue * 0.5;

    const manualRes: Reservation = {
      id: 'res-' + Math.random().toString(36).substr(2, 9),
      code: 'YKP-' + Math.floor(1000 + Math.random() * 9000),
      roomId: manualResForm.roomId,
      roomName: selectedRoomDetails.name,
      checkIn: manualResForm.checkIn,
      checkOut: manualResForm.checkOut,
      guests: manualResForm.guests,
      nights,
      totalValue,
      depositPaid,
      remainingBalance,
      paymentMethod: manualResForm.paymentMethod,
      status: 'confirmed',
      guest: {
        fullName: manualResForm.fullName,
        cpf: manualResForm.cpf,
        phone: manualResForm.phone,
        email: manualResForm.email,
        city: manualResForm.city,
        state: manualResForm.state
      },
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setReservations(prev => [manualRes, ...prev]);
    setIsAddingReservation(false);
    // Reset
    setManualResForm({
      fullName: '',
      cpf: '',
      phone: '',
      email: '',
      city: '',
      state: '',
      roomId: rooms[0]?.id || '',
      checkIn: '',
      checkOut: '',
      guests: 2,
      paymentMethod: 'pix',
    });
  };

  // ----- HANDLERS FOR ROOMS -----
  const handleEditRoomClick = (room: Room) => {
    setEditingRoom(room);
    setRoomForm({
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      pricePerNight: room.pricePerNight,
      description: room.description,
      hasAirConditioning: room.hasAirConditioning,
      amenitiesText: room.amenities.join(', '),
      imagesText: room.images.join(', '),
      status: room.status,
      totalUnits: room.totalUnits,
      isPriceOnRequest: room.isPriceOnRequest || false
    });
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRoom: Room = {
      id: editingRoom ? editingRoom.id : 'room-' + Math.random().toString(36).substr(2, 9),
      name: roomForm.name,
      type: roomForm.type,
      capacity: Number(roomForm.capacity),
      pricePerNight: Number(roomForm.pricePerNight),
      description: roomForm.description,
      hasAirConditioning: roomForm.hasAirConditioning,
      amenities: roomForm.amenitiesText.split(',').map(s => s.trim()).filter(Boolean),
      images: roomForm.imagesText.split(',').map(s => s.trim()).filter(Boolean),
      status: roomForm.status,
      totalUnits: Number(roomForm.totalUnits),
      isPriceOnRequest: roomForm.isPriceOnRequest
    };

    if (editingRoom) {
      setRooms(prev => prev.map(r => r.id === editingRoom.id ? updatedRoom : r));
      setEditingRoom(null);
    } else {
      setRooms(prev => [...prev, updatedRoom]);
      setIsAddingRoom(false);
    }
  };

  const handleDeleteRoom = (id: string) => {
    if (confirm('Deseja realmente excluir este quarto? Todas as reservas associadas a este ID de quarto podem ficar órfãs.')) {
      setRooms(prev => prev.filter(r => r.id !== id));
    }
  };

  // ----- HANDLERS FOR MENU -----
  const handleEditMenuClick = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuForm({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || '',
      available: item.available
    });
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedItem: MenuItem = {
      id: editingMenuItem ? editingMenuItem.id : 'm-' + Math.random().toString(36).substr(2, 9),
      name: menuForm.name,
      category: menuForm.category,
      price: Number(menuForm.price),
      description: menuForm.description,
      available: menuForm.available
    };

    if (editingMenuItem) {
      setMenuItems(prev => prev.map(m => m.id === editingMenuItem.id ? updatedItem : m));
      setEditingMenuItem(null);
    } else {
      setMenuItems(prev => [...prev, updatedItem]);
      setIsAddingMenu(false);
    }
  };

  const handleDeleteMenu = (id: string) => {
    if (confirm('Deseja realmente excluir este produto do cardápio?')) {
      setMenuItems(prev => prev.filter(m => m.id !== id));
    }
  };

  // ----- HANDLERS FOR GALLERY -----
  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.imageUrl) return;

    const newItem: GalleryItem = {
      id: 'g-' + Math.random().toString(36).substr(2, 9),
      album: galleryForm.album,
      title: galleryForm.title || 'Foto da Pousada',
      imageUrl: galleryForm.imageUrl
    };

    setGallery(prev => [...prev, newItem]);
    setIsAddingGallery(false);
    setGalleryForm({ album: 'quartos', title: '', imageUrl: '' });
  };

  const handleDeleteGallery = (id: string) => {
    if (confirm('Deseja realmente remover esta imagem da galeria?')) {
      setGallery(prev => prev.filter(g => g.id !== id));
    }
  };

  // Filter reservations based on state
  const filteredReservations = reservations.filter(res => {
    const matchesName = res.guest.fullName.toLowerCase().includes(filterName.toLowerCase()) || 
                        res.code.toLowerCase().includes(filterName.toLowerCase());
    const matchesStatus = filterStatus === 'all' || res.status === filterStatus;
    const matchesDate = !filterDate || res.checkIn === filterDate || res.checkOut === filterDate;
    return matchesName && matchesStatus && matchesDate;
  });

  const handleToggleDayAvailability = (roomId: string, dateStr: string) => {
    setRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      const currentBlocked = r.blockedDates || [];
      const isBlocked = currentBlocked.includes(dateStr);
      const updatedBlocked = isBlocked 
        ? currentBlocked.filter(d => d !== dateStr) 
        : [...currentBlocked, dateStr];
      return {
        ...r,
        blockedDates: updatedBlocked
      };
    }));
    setActiveCellMenu(null);
  };

  const handleStartReservationFromCalendar = (roomId: string, date: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    // Pre-calculate check-out (next day)
    const checkInDate = new Date(date);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + 1);
    const checkOutStr = checkOutDate.toISOString().split('T')[0];

    setManualResForm({
      ...manualResForm,
      roomId: roomId,
      checkIn: date,
      checkOut: checkOutStr,
    });
    
    setActiveSection('reservas');
    setIsAddingReservation(true);
    setActiveCellMenu(null);
  };

  const MONTHS_OF_2026 = [
    { value: 5, label: "Junho de 2026" },
    { value: 6, label: "Julho de 2026" },
    { value: 7, label: "Agosto de 2026" },
    { value: 8, label: "Setembro de 2026" },
    { value: 9, label: "Outubro de 2026" },
    { value: 10, label: "Novembro de 2026" },
    { value: 11, label: "Dezembro de 2026" },
  ];

  const getSelectedMonthLabel = () => {
    const found = MONTHS_OF_2026.find(m => m.value === selectedMonth);
    return found ? found.label : "Julho de 2026";
  };

  const daysInSelectedMonth = new Date(2026, selectedMonth + 1, 0).getDate();

  const getActiveDays = () => {
    if (calendarPage === 1) {
      return Array.from({ length: 12 }, (_, i) => i + 1);
    } else if (calendarPage === 2) {
      return Array.from({ length: 12 }, (_, i) => i + 13);
    } else {
      return Array.from({ length: 12 }, (_, i) => daysInSelectedMonth - 11 + i);
    }
  };

  const activeDays = getActiveDays();
  
  return (
    <div className="min-h-screen bg-stone-100/60 pt-24 pb-12 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="bg-ocean text-white p-6 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex w-12 h-12 bg-white/10 rounded-xl items-center justify-center border border-white/20 shrink-0">
              <UserIcon className="w-6 h-6 text-turquoise" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-turquoise font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-turquoise" /> Painel de Administração Integrado
              </span>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-sand mt-1">
                Pousada Ykape Back-Office
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <p className="text-[10px] text-gray-200 uppercase font-bold tracking-wider">
                  Logado como: <span className="text-turquoise">{user?.email}</span>
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
          >
            &larr; Voltar para Visualização Pública
          </button>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Tabs Column */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200/60">
              <h3 className="font-heading font-semibold text-xs uppercase tracking-widest text-gray-400 mb-4 px-2">Menu Administrativo</h3>
              
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveSection('dashboard'); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    activeSection === 'dashboard' ? 'bg-ocean text-white shadow-sm' : 'text-gray-600 hover:bg-stone-50'
                  }`}
                >
                  <BarChart className="w-4 h-4" /> Painel de Métricas
                </button>

                <button
                  onClick={() => { setActiveSection('reservas'); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    activeSection === 'reservas' ? 'bg-ocean text-white shadow-sm' : 'text-gray-600 hover:bg-stone-50'
                  }`}
                >
                  <Users className="w-4 h-4" /> Gestão de Reservas
                </button>

                <button
                  onClick={() => { setActiveSection('calendario'); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    activeSection === 'calendario' ? 'bg-ocean text-white shadow-sm' : 'text-gray-600 hover:bg-stone-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" /> Calendário Booking
                </button>

                <button
                  onClick={() => { setActiveSection('quartos'); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    activeSection === 'quartos' ? 'bg-ocean text-white shadow-sm' : 'text-gray-600 hover:bg-stone-50'
                  }`}
                >
                  <Bed className="w-4 h-4" /> Gestão de Quartos
                </button>

                <button
                  onClick={() => { setActiveSection('cardapio'); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    activeSection === 'cardapio' ? 'bg-ocean text-white shadow-sm' : 'text-gray-600 hover:bg-stone-50'
                  }`}
                >
                  <Utensils className="w-4 h-4" /> Cardápio Digital
                </button>

                <button
                  onClick={() => { setActiveSection('galeria'); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    activeSection === 'galeria' ? 'bg-ocean text-white shadow-sm' : 'text-gray-600 hover:bg-stone-50'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" /> Galeria de Fotos
                </button>

                <div className="pt-4 mt-4 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Sair do Sistema
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-sand/20 border border-sand/40 p-4 rounded-xl text-xs space-y-1">
              <h4 className="font-bold text-ocean">🛡️ Modo Administrador</h4>
              <p className="text-gray-600 leading-normal">
                Todas as alterações salvas aqui serão refletidas instantaneamente na interface do usuário para testes interativos de simulação completa.
              </p>
            </div>
          </div>

          {/* Core Content Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 1. SECTION: DASHBOARD */}
            {activeSection === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* METRICS ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200/60 flex items-center gap-4">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Reservas do Mês</span>
                      <h4 className="text-xl font-bold text-gray-800">{reservationsThisMonth}</h4>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200/60 flex items-center gap-4">
                    <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Faturamento Realizado</span>
                      <h4 className="text-xl font-bold text-gray-800">R$ {depositRevenue.toFixed(0)} <span className="text-xs text-gray-400 font-normal">({reservationsThisMonth} res)</span></h4>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200/60 flex items-center gap-4">
                    <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Taxa de Ocupação</span>
                      <h4 className="text-xl font-bold text-gray-800">{occupancyRate}%</h4>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200/60 flex items-center gap-4">
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                      <Bed className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Acomodações Ativas</span>
                      <h4 className="text-xl font-bold text-gray-800">{availableRoomsCount} / {totalUnits}</h4>
                    </div>
                  </div>

                </div>

                {/* GRAPH AND RECENT RESERVATIONS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue projections and instructions */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200/60 space-y-4">
                    <h3 className="font-heading font-bold text-sm text-ocean border-b border-gray-100 pb-2">Projection & Informações da Pousada</h3>
                    <div className="space-y-3 text-xs leading-relaxed">
                      <p>A <strong>Pousada Ykape</strong> conta com {totalUnits} acomodações. Seu faturamento total provisionado é de <strong>R$ {totalRevenue.toFixed(2)}</strong>.</p>
                      
                      <div className="p-3 bg-amber-50 rounded border border-amber-200/60 flex gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-800">Regra de Pagamento de 50% Ativo:</strong>
                          <p className="text-amber-700 mt-0.5">O sistema obriga o pagamento de 50% de sinal online. Atualmente, o valor depositado em conta via gateway simulado é de <strong>R$ {depositRevenue.toFixed(2)}</strong>.</p>
                        </div>
                      </div>

                      <div className="p-3 bg-turquoise/5 rounded border border-turquoise/20">
                        <span className="font-bold text-turquoise-dark">Como Testar o Fluxo Completo:</span>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-gray-600">
                          <li>Vá para a visão pública (botão do cabeçalho)</li>
                          <li>Clique em "Reserve Agora" e faça uma reserva simulada</li>
                          <li>Aplique cupons (Ex: <strong className="font-mono">YKAPE10</strong>)</li>
                          <li>Realize o pagamento de 50% via PIX ou Cartão</li>
                          <li>Volte aqui para conferir os dados atualizados!</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Quick stats on inventory */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200/60 space-y-4">
                    <h3 className="font-heading font-bold text-sm text-ocean border-b border-gray-100 pb-2">Status dos Quartos</h3>
                    <div className="space-y-3">
                      {rooms.map(room => (
                        <div key={room.id} className="flex justify-between items-center text-xs p-2 bg-stone-50 rounded border border-gray-100">
                          <div>
                            <strong className="text-gray-800">{room.name}</strong>
                            <span className="block text-[10px] text-gray-400">{room.type === 'comfort' ? 'Comfort (Ar)' : 'Standard (Sem Ar)'} • Capacidade: {room.capacity} hóspedes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <strong className="text-gray-700">R$ {room.pricePerNight}</strong>
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                              room.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {room.status === 'available' ? 'Disponível' : room.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SECTION: RESERVATIONS GESTÃO */}
            {activeSection === 'reservas' && (
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200/60 space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-ocean">Gestão de Reservas</h3>
                    <p className="text-xs text-gray-500">Controle total dos hóspedes cadastrados, confirmações de pagamento de sinal e status.</p>
                  </div>
                  
                  <button
                    onClick={() => setIsAddingReservation(true)}
                    className="bg-turquoise hover:bg-turquoise-dark text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Adicionar Reserva Manual
                  </button>
                </div>

                {/* MANUAL RESERVATION MODAL FORM */}
                {isAddingReservation && (
                  <form onSubmit={handleCreateManualReservation} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4 text-left">
                    <h4 className="font-heading font-bold text-sm text-ocean">Nova Reserva Manual</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-gray-500 mb-1">Nome do Hóspede *</label>
                        <input required type="text" value={manualResForm.fullName} onChange={(e) => setManualResForm({ ...manualResForm, fullName: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">CPF *</label>
                        <input required type="text" value={manualResForm.cpf} onChange={(e) => setManualResForm({ ...manualResForm, cpf: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">Telefone/WhatsApp *</label>
                        <input required type="text" value={manualResForm.phone} onChange={(e) => setManualResForm({ ...manualResForm, phone: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">E-mail *</label>
                        <input required type="email" value={manualResForm.email} onChange={(e) => setManualResForm({ ...manualResForm, email: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">Cidade *</label>
                        <input required type="text" value={manualResForm.city} onChange={(e) => setManualResForm({ ...manualResForm, city: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">Estado (UF) *</label>
                        <input required type="text" maxLength={2} value={manualResForm.state} onChange={(e) => setManualResForm({ ...manualResForm, state: e.target.value.toUpperCase() })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none text-center" />
                      </div>

                      <div>
                        <label className="block text-gray-500 mb-1">Acomodação *</label>
                        <select value={manualResForm.roomId} onChange={(e) => setManualResForm({ ...manualResForm, roomId: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none">
                          {rooms.map(r => (
                            <option key={r.id} value={r.id}>{r.name} - R$ {r.pricePerNight}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-500 mb-1">Data Check-In *</label>
                        <input required type="date" value={manualResForm.checkIn} onChange={(e) => setManualResForm({ ...manualResForm, checkIn: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none" />
                      </div>

                      <div>
                        <label className="block text-gray-500 mb-1">Data Check-Out *</label>
                        <input required type="date" value={manualResForm.checkOut} onChange={(e) => setManualResForm({ ...manualResForm, checkOut: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-200/60 text-xs">
                      <button type="button" onClick={() => setIsAddingReservation(false)} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-gray-600">Cancelar</button>
                      <button type="submit" className="bg-turquoise text-white px-4 py-2 rounded font-bold">Salvar Reserva</button>
                    </div>
                  </form>
                )}

                {/* FILTERS SECTION */}
                <div className="bg-stone-50 p-4 rounded-xl border border-gray-200/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-500 uppercase tracking-wider mb-1">Buscar por Nome/Código</label>
                    <input 
                      type="text" 
                      placeholder="Ex: YKP-9812 ou Beatriz..." 
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 uppercase tracking-wider mb-1">Filtrar por Status</label>
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none"
                    >
                      <option value="all">Todos os Status</option>
                      <option value="confirmed">Confirmada</option>
                      <option value="pending_payment">Pendente de Pagamento</option>
                      <option value="checked_in">Checked-In</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 uppercase tracking-wider mb-1">Data Check-In/Out</label>
                    <input 
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none"
                    />
                  </div>
                </div>

                {/* TABLE LISTING */}
                <div className="overflow-x-auto rounded-lg border border-gray-100">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-xs sm:text-sm">
                    <thead className="bg-stone-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Cód/Reserva</th>
                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Hóspede</th>
                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Acomodação</th>
                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Período (Nights)</th>
                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Valores (Sinal Paid)</th>
                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Status</th>
                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-[10px] text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 text-gray-700">
                      {filteredReservations.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-400">Nenhuma reserva encontrada correspondente aos filtros aplicados.</td>
                        </tr>
                      ) : (
                        filteredReservations.map((res) => (
                          <tr key={res.id} className="hover:bg-stone-50/50">
                            <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold text-ocean">{res.code}</td>
                            <td className="px-4 py-3.5">
                              <div>
                                <strong className="block text-gray-800">{res.guest.fullName}</strong>
                                <span className="block text-[10px] text-gray-400">CPF: {res.guest.cpf} • {res.guest.city}/{res.guest.state}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-xs">{res.roomName}</td>
                            <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                              {res.checkIn} a {res.checkOut}
                              <span className="block text-[10px] text-gray-400">({res.nights} {res.nights === 1 ? 'noite' : 'noites'})</span>
                            </td>
                            <td className="px-4 py-3.5 text-xs">
                              {res.totalValue === 0 ? (
                                <span className="text-turquoise font-bold uppercase">Sob Consulta</span>
                              ) : (
                                <div>
                                  <strong className="text-gray-800">Total: R$ {res.totalValue.toFixed(0)}</strong>
                                  <span className="block text-[10px] text-emerald-600 font-semibold">Sinal: R$ {res.depositPaid.toFixed(0)}</span>
                                  <span className="block text-[10px] text-gray-400">Saldo: R$ {res.remainingBalance.toFixed(0)}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                res.status === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : res.status === 'pending_payment'
                                  ? 'bg-amber-100 text-amber-800'
                                  : res.status === 'checked_in'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {res.status === 'confirmed' ? 'Confirmada' : res.status === 'pending_payment' ? 'Pendente' : res.status === 'checked_in' ? 'Check-in' : 'Cancelada'}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                              <select
                                value={res.status}
                                onChange={(e) => handleStatusChange(res.id, e.target.value as Reservation['status'])}
                                className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none"
                              >
                                <option value="confirmed">Confirmar</option>
                                <option value="pending_payment">Pendente</option>
                                <option value="checked_in">Check-In</option>
                                <option value="cancelled">Cancelar</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. SECTION: OCCUPANCY CALENDAR */}
            {activeSection === 'calendario' && (
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200/60 space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-ocean">Calendário de Ocupação</h3>
                    <p className="text-xs text-gray-500">Visualização profissional estilo Booking.com para monitoramento diário, reservas, bloqueios e disponibilidade geral.</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setActiveSection('reservas');
                        setIsAddingReservation(true);
                      }}
                      className="bg-turquoise hover:bg-turquoise-dark text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Nova Reserva Manual
                    </button>

                    {/* Month Selection Selector */}
                    <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl">
                    <label htmlFor="calendar-month-select" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mês:</label>
                    <select
                      id="calendar-month-select"
                      value={selectedMonth}
                      onChange={(e) => {
                        setSelectedMonth(Number(e.target.value));
                        setCalendarPage(1); // Reset page to days 1-12
                      }}
                      className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-ocean focus:outline-none focus:ring-2 focus:ring-turquoise cursor-pointer"
                    >
                      {MONTHS_OF_2026.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Instruction Alert box */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <span className="text-base">💡</span> Gestão de Disponibilidade Manual:
                  </p>
                  <p>
                    Clique em qualquer quadrado do calendário para gerenciar as datas. Células em branco (<strong className="text-gray-700">Livre</strong>) podem ser bloqueadas manualmente com um clique. Células vermelhas (<strong className="text-rose-700">Bloqueio Manual</strong>) podem ser desbloqueadas clicando novamente nelas.
                  </p>
                  <p className="text-stone-500 italic mt-1">
                    Nota: Células com reservas confirmadas (✓) ou em manutenção operacional geral (⚠) não podem ser alteradas diretamente no calendário.
                  </p>
                </div>

                {/* Period Pagination controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-stone-50/80 p-3 rounded-xl border border-stone-200/80">
                  <span className="text-xs font-bold text-stone-600">Período de Exibição do Mês:</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setCalendarPage(1)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        calendarPage === 1
                          ? 'bg-ocean text-white shadow-sm'
                          : 'bg-white hover:bg-stone-50 text-gray-600 border border-stone-200/60'
                      }`}
                    >
                      Dias 01 a 12
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarPage(2)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        calendarPage === 2
                          ? 'bg-ocean text-white shadow-sm'
                          : 'bg-white hover:bg-stone-50 text-gray-600 border border-stone-200/60'
                      }`}
                    >
                      Dias 13 a 24
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarPage(3)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        calendarPage === 3
                          ? 'bg-ocean text-white shadow-sm'
                          : 'bg-white hover:bg-stone-50 text-gray-600 border border-stone-200/60'
                      }`}
                    >
                      Dias 25 a {daysInSelectedMonth}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-100 bg-stone-50 p-2">
                  <div className="min-w-[700px] bg-white rounded-lg overflow-hidden border border-gray-200/80 shadow-inner">
                    
                    {/* Month Header row */}
                    <div className="bg-ocean text-white p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-turquoise" />
                        <span className="font-heading font-bold text-sm tracking-wide">
                          Mapa de Ocupação: {getSelectedMonthLabel()}
                        </span>
                      </div>
                      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-emerald-500 rounded-sm shadow-sm"></div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-100">Reservado</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-200 rounded-sm shadow-sm"></div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-100">Disponível</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-rose-500 rounded-sm shadow-sm"></div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-100">Bloqueio</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-amber-400 rounded-sm shadow-sm"></div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-100">Manutenção</span>
                        </div>
                      </div>
                    </div>

                    {/* Grid Layout Header (Days) */}
                    <div className="grid grid-cols-16 border-b border-gray-100 font-mono text-[10px] bg-stone-50 text-gray-400 font-bold text-center">
                      <div className="col-span-4 p-2.5 text-left text-gray-500 font-heading uppercase tracking-widest">Acomodação</div>
                      {activeDays.map(day => (
                        <div key={day} className="p-2.5 border-l border-gray-100 flex flex-col items-center justify-center">
                          <span className="text-[12px] text-ocean">{day.toString().padStart(2, '0')}</span>
                        </div>
                      ))}
                    </div>

                    {/* Grid Rows for each room type/unit */}
                    <div className="divide-y divide-gray-100">
                      {rooms.map(room => {
                        return (
                          <div key={room.id} className="grid grid-cols-16 items-center text-xs">
                            {/* Room info header col */}
                            <div className="col-span-4 p-3 bg-stone-50 border-r border-gray-100 flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-stone-200 overflow-hidden shrink-0 hidden sm:block">
                                <img src={room.images[0]} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <strong className="text-gray-800 text-[11px] block truncate leading-tight">{room.name}</strong>
                                <span className="text-[9px] text-gray-400 block uppercase font-bold">{room.type} • R$ {room.pricePerNight}</span>
                              </div>
                            </div>

                            {/* Daily status block mappings */}
                            {activeDays.map(day => {
                              const monthPart = String(selectedMonth + 1).padStart(2, '0');
                              const dayStr = `2026-${monthPart}-${day.toString().padStart(2, '0')}`;
                              
                              // Check if there is any reservation for this specific day on this room
                              const activeRes = reservations.find(res => {
                                if (res.status === 'cancelled') return false;
                                if (res.roomId !== room.id) return false;
                                return dayStr >= res.checkIn && dayStr <= res.checkOut;
                              });

                              const isManuallyBlocked = room.blockedDates?.includes(dayStr);

                              let blockBg = 'bg-white hover:bg-stone-50';
                              let blockText = '';
                              let blockTooltip = 'Disponível (Clique para Bloquear)';

                              if (activeRes) {
                                blockBg = 'bg-emerald-500 text-white font-bold cursor-default';
                                blockText = '✓';
                                blockTooltip = `Reserva de ${activeRes.guest.fullName.split(' ')[0]} (${activeRes.code})`;
                              } else if (room.status === 'maintenance') {
                                blockBg = 'bg-amber-400 text-amber-900 font-bold cursor-not-allowed';
                                blockText = '⚠';
                                blockTooltip = 'Bloqueado para Manutenção Geral';
                              } else if (isManuallyBlocked) {
                                blockBg = 'bg-rose-500 hover:bg-rose-600 text-white font-bold cursor-pointer';
                                blockText = '✕';
                                blockTooltip = 'Bloqueado Manual (Clique para Liberar)';
                              } else {
                                blockBg = 'bg-white hover:bg-turquoise/10 text-gray-400 hover:text-turquoise cursor-pointer';
                                blockText = '';
                                blockTooltip = 'Disponível (Clique para Ações)';
                              }

                              const handleCellClick = () => {
                                if (activeRes || room.status === 'maintenance') return;
                                if (activeCellMenu?.roomId === room.id && activeCellMenu?.date === dayStr) {
                                  setActiveCellMenu(null);
                                } else {
                                  setActiveCellMenu({ roomId: room.id, date: dayStr });
                                }
                              };

                              return (
                                <div 
                                  key={day} 
                                  title={blockTooltip}
                                  onClick={handleCellClick}
                                  className={`p-2.5 text-center border-l border-gray-100 h-full flex items-center justify-center relative group transition-all text-[11px] select-none ${blockBg}`}
                                >
                                  {blockText}
                                  
                                  {/* Interaction Menu (Pop-over) */}
                                  {activeCellMenu?.roomId === room.id && activeCellMenu?.date === dayStr && (
                                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[60] min-w-[160px] p-1.5 animate-in zoom-in-95 duration-100">
                                      <div className="text-[10px] text-gray-400 font-bold px-2 py-1 border-b border-gray-100 mb-1">Dia {day.toString().padStart(2, '0')} • {room.name}</div>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleStartReservationFromCalendar(room.id, dayStr); }}
                                        className="w-full text-left flex items-center gap-2 px-2 py-1.5 hover:bg-turquoise/10 text-turquoise-dark rounded text-[11px] font-bold transition-colors"
                                      >
                                        <Plus className="w-3.5 h-3.5" /> Nova Reserva
                                      </button>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleToggleDayAvailability(room.id, dayStr); }}
                                        className="w-full text-left flex items-center gap-2 px-2 py-1.5 hover:bg-rose-50 text-rose-600 rounded text-[11px] font-bold transition-colors"
                                      >
                                        {isManuallyBlocked ? <CheckCircle className="w-3.5 h-3.5" /> : <Trash className="w-3.5 h-3.5" />}
                                        {isManuallyBlocked ? 'Liberar Data' : 'Bloquear Data'}
                                      </button>
                                      <div className="border-t border-gray-100 mt-1 pt-1">
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); setActiveCellMenu(null); }}
                                          className="w-full text-center px-2 py-1 hover:bg-gray-100 text-gray-400 rounded text-[10px] font-semibold"
                                        >
                                          Fechar
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Tooltip Hover Bubble */}
                                  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                                    {blockTooltip}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* 4. SECTION: ROOMS GESTÃO */}
            {activeSection === 'quartos' && (
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200/60 space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-ocean">Gestão de Quartos</h3>
                    <p className="text-xs text-gray-500">Cadastre, edite tarifas sazonais, altere as comodidades de cada unidade ou bloqueie para manutenção.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingRoom(null);
                      setRoomForm({
                        name: '',
                        type: 'standard',
                        capacity: 2,
                        pricePerNight: 200,
                        description: '',
                        hasAirConditioning: false,
                        amenitiesText: '',
                        imagesText: '',
                        status: 'available',
                        totalUnits: 10
                      });
                      setIsAddingRoom(true);
                    }}
                    className="bg-turquoise hover:bg-turquoise-dark text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Novo Quarto
                  </button>
                </div>

                {/* ADD/EDIT ROOM FORM IN-PLACE */}
                {(isAddingRoom || editingRoom) && (
                  <form onSubmit={handleSaveRoom} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4 text-left">
                    <h4 className="font-heading font-bold text-sm text-ocean">{editingRoom ? `Editar: ${editingRoom.name}` : 'Cadastrar Novo Quarto'}</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-gray-500 mb-1">Nome do Quarto *</label>
                        <input required type="text" value={roomForm.name} onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none" placeholder="Ex: Apartamento Standard Vista Mar" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-gray-500 mb-1">Tipo *</label>
                          <select value={roomForm.type} onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value as any })} className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none">
                            <option value="standard">Standard</option>
                            <option value="comfort">Comfort</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1">Status Operacional *</label>
                          <select value={roomForm.status} onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value as any })} className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none">
                            <option value="available">Disponível</option>
                            <option value="occupied">Ocupado</option>
                            <option value="maintenance">Manutenção</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-gray-500 mb-1">Capacidade Hóspedes *</label>
                          <input required type="number" value={roomForm.capacity} onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-center" min={1} max={6} />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1">Tarifa (Preço/Noite) *</label>
                          <input 
                            required={!roomForm.isPriceOnRequest} 
                            disabled={roomForm.isPriceOnRequest}
                            type="number" 
                            value={roomForm.pricePerNight} 
                            onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: Number(e.target.value) })} 
                            className={`w-full border rounded px-2.5 py-1.5 text-center focus:outline-none ${roomForm.isPriceOnRequest ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-white border-gray-200'}`} 
                            min={0} 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1">Total Unidades *</label>
                          <input required type="number" value={roomForm.totalUnits} onChange={(e) => setRoomForm({ ...roomForm, totalUnits: Number(e.target.value) })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-center" min={1} />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 pt-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="hasAirCond" checked={roomForm.hasAirConditioning} onChange={(e) => setRoomForm({ ...roomForm, hasAirConditioning: e.target.checked })} className="w-4 h-4 text-turquoise" />
                          <label htmlFor="hasAirCond" className="font-semibold text-gray-700">Ar Condicionado</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="isPriceOnRequest" checked={roomForm.isPriceOnRequest} onChange={(e) => setRoomForm({ ...roomForm, isPriceOnRequest: e.target.checked })} className="w-4 h-4 text-turquoise" />
                          <label htmlFor="isPriceOnRequest" className="font-semibold text-gray-700">Sob Consulta</label>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-gray-500 mb-1">Descrição Curta *</label>
                        <textarea required value={roomForm.description} onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none h-16" placeholder="Acomodação arejada e acolhedora a poucos passos do mar..."></textarea>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-gray-500 mb-1">Comodidades (separadas por vírgula)</label>
                        <input type="text" value={roomForm.amenitiesText} onChange={(e) => setRoomForm({ ...roomForm, amenitiesText: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5" placeholder="Frigobar abastecido, Wi-Fi de fibra óptica, Cama Queen Size" />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-gray-500 mb-1">URLs das Fotos (separadas por vírgula)</label>
                        <input type="text" value={roomForm.imagesText} onChange={(e) => setRoomForm({ ...roomForm, imagesText: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5" placeholder="https://images.unsplash.com/... , https://..." />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 text-xs">
                      <button type="button" onClick={() => { setIsAddingRoom(false); setEditingRoom(null); }} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-gray-600">Cancelar</button>
                      <button type="submit" className="bg-turquoise text-white px-4 py-2 rounded font-bold">Salvar Alterações</button>
                    </div>
                  </form>
                )}

                {/* LISTING ROOMS AS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {rooms.map(room => (
                    <div key={room.id} className="bg-stone-50/50 border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="relative h-32 w-full bg-stone-100">
                        <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-turquoise-dark text-[10px] font-bold px-2.5 py-0.5 rounded shadow uppercase">
                          {room.pricePerNight > 0 ? `R$ ${room.pricePerNight}` : 'Sob Consulta'}
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="font-heading font-bold text-sm text-ocean flex justify-between items-center">
                            {room.name}
                            <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full ${
                              room.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {room.status === 'available' ? 'Livre' : room.status}
                            </span>
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1">{room.description}</p>
                        </div>

                        <div className="flex gap-2 justify-end border-t border-gray-200/50 pt-3">
                          <button
                            type="button"
                            onClick={() => handleEditRoomClick(room)}
                            className="bg-turquoise/10 hover:bg-turquoise/20 text-turquoise-dark p-2 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" /> Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRoom(room.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash className="w-3.5 h-3.5" /> Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. SECTION: MENU GESTÃO */}
            {activeSection === 'cardapio' && (
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200/60 space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-ocean">Gestão do Cardápio</h3>
                    <p className="text-xs text-gray-500">Adicione novos itens de porções ou drinks servidos no bar e deck da piscina da pousada.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingMenuItem(null);
                      setMenuForm({ name: '', category: 'porcoes', price: 0, description: '', available: true });
                      setIsAddingMenu(true);
                    }}
                    className="bg-turquoise hover:bg-turquoise-dark text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Novo Prato/Bebida
                  </button>
                </div>

                {/* ADD/EDIT FORM FOR MENU */}
                {(isAddingMenu || editingMenuItem) && (
                  <form onSubmit={handleSaveMenu} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4 text-left">
                    <h4 className="font-heading font-bold text-sm text-ocean">{editingMenuItem ? `Editar: ${editingMenuItem.name}` : 'Novo Item do Cardápio'}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-gray-500 mb-1">Nome do Item *</label>
                        <input required type="text" value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none" placeholder="Ex: Porção de Peixe Empanado (500g)" />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">Preço R$ *</label>
                        <input required type="number" step="0.01" value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: Number(e.target.value) })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">Categoria *</label>
                        <select value={menuForm.category} onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value as any })} className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none">
                          <option value="porcoes">Porções</option>
                          <option value="bebidas">Bebidas</option>
                          <option value="drinks">Drinks Tropicais</option>
                          <option value="cafe">Café da manhã</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-gray-500 mb-1">Descrição</label>
                        <input type="text" value={menuForm.description} onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5" placeholder="Opcional: Acompanha molho rose e limão fresco" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 text-xs">
                      <button type="button" onClick={() => { setIsAddingMenu(false); setEditingMenuItem(null); }} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-gray-600">Cancelar</button>
                      <button type="submit" className="bg-turquoise text-white px-4 py-2 rounded font-bold">Salvar Item</button>
                    </div>
                  </form>
                )}

                {/* TABLE LISTING FOR CARDAPIO */}
                <div className="overflow-x-auto rounded-lg border border-gray-100">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-xs sm:text-sm">
                    <thead className="bg-stone-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-500 text-[10px] uppercase">Nome</th>
                        <th className="px-4 py-3 font-semibold text-gray-500 text-[10px] uppercase">Categoria</th>
                        <th className="px-4 py-3 font-semibold text-gray-500 text-[10px] uppercase">Preço</th>
                        <th className="px-4 py-3 font-semibold text-gray-500 text-[10px] uppercase text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {menuItems.map(item => (
                        <tr key={item.id} className="hover:bg-stone-50/50">
                          <td className="px-4 py-3">
                            <div>
                              <strong className="text-gray-800 text-sm">{item.name}</strong>
                              {item.description && <span className="block text-[10px] text-gray-400 mt-0.5">{item.description}</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 capitalize text-xs text-gray-600">
                            {item.category === 'porcoes' ? 'Porções' : item.category === 'drinks' ? '🍹 Drinks' : item.category}
                          </td>
                          <td className="px-4 py-3 font-bold text-ocean text-xs whitespace-nowrap">R$ {item.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                            <button
                              onClick={() => handleEditMenuClick(item)}
                              className="bg-turquoise/10 hover:bg-turquoise/20 text-turquoise-dark px-2.5 py-1.5 rounded text-xs font-semibold cursor-pointer"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteMenu(item.id)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1.5 rounded text-xs font-semibold cursor-pointer"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. SECTION: GALLERY GESTÃO */}
            {activeSection === 'galeria' && (
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200/60 space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-ocean">Gestão da Galeria</h3>
                    <p className="text-xs text-gray-500">Organize os álbuns da pousada. Adicione novos links de imagens ou delete fotos antigas.</p>
                  </div>
                  <button
                    onClick={() => setIsAddingGallery(true)}
                    className="bg-turquoise hover:bg-turquoise-dark text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Nova Imagem
                  </button>
                </div>

                {/* ADD FORM GALLERY */}
                {isAddingGallery && (
                  <form onSubmit={handleSaveGallery} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4 text-left">
                    <h4 className="font-heading font-bold text-sm text-ocean">Adicionar Foto à Galeria</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-gray-500 mb-1">Título da Imagem (Exibido no hover)</label>
                        <input type="text" value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5" placeholder="Ex: Vista do Nosso Deck Principal" />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">Álbum correspondente *</label>
                        <select value={galleryForm.album} onChange={(e) => setGalleryForm({ ...galleryForm, album: e.target.value as any })} className="w-full bg-white border border-gray-200 rounded px-2 py-1.5">
                          <option value="quartos">Quartos / Acomodações</option>
                          <option value="piscinas">Piscinas</option>
                          <option value="externo">Área Externa</option>
                          <option value="cafe">Café da Manhã</option>
                          <option value="praia">Praia / Localização</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-gray-500 mb-1">URL Direta da Foto *</label>
                        <input required type="text" value={galleryForm.imageUrl} onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5" placeholder="https://images.unsplash.com/..." />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 text-xs">
                      <button type="button" onClick={() => setIsAddingGallery(false)} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-gray-600">Cancelar</button>
                      <button type="submit" className="bg-turquoise text-white px-4 py-2 rounded font-bold">Adicionar Foto</button>
                    </div>
                  </form>
                )}

                {/* GRID DISPLAY IMAGES */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {gallery.map(item => (
                    <div key={item.id} className="relative group rounded-lg overflow-hidden aspect-square bg-stone-100 border border-gray-200 flex flex-col justify-between shadow-sm">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      
                      {/* Top album badge */}
                      <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
                        {item.album}
                      </div>

                      {/* Remove absolute hover button */}
                      <button
                        onClick={() => handleDeleteGallery(item.id)}
                        className="absolute bottom-2 right-2 bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded-full shadow-md transition-all cursor-pointer"
                        title="Remover imagem"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
