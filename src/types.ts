export interface Room {
  id: string;
  name: string;
  type: 'standard' | 'comfort';
  capacity: number;
  pricePerNight: number;
  description: string;
  hasAirConditioning: boolean;
  amenities: string[];
  images: string[];
  status: 'available' | 'occupied' | 'maintenance';
  totalUnits: number;
  blockedDates?: string[];
  driveFolder?: string;
}

export interface MenuItem {
  id: string;
  category: 'porcoes' | 'bebidas' | 'drinks' | 'cafe';
  name: string;
  description?: string;
  price: number;
  available: boolean;
}

export interface Review {
  id: string;
  guestName: string;
  cityState: string;
  rating: number;
  comment: string;
  date: string;
  roomType: string;
}

export interface GalleryItem {
  id: string;
  album: 'quartos' | 'piscinas' | 'externo' | 'cafe' | 'praia';
  title: string;
  imageUrl: string;
}

export interface GuestData {
  fullName: string;
  cpf: string;
  phone: string;
  email: string;
  city: string;
  state: string;
}

export interface Reservation {
  id: string;
  code: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalValue: number;
  depositPaid: number; // 50%
  remainingBalance: number; // 50% no check-in
  paymentMethod: 'pix' | 'credit' | 'debit';
  status: 'confirmed' | 'pending_payment' | 'checked_in' | 'cancelled';
  guest: GuestData;
  createdAt: string;
}

export interface BookingSearch {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  active: boolean;
}
