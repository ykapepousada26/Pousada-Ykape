import { Reservation } from '../types';

/**
 * Determines the occupancy status of a room for the current date based on confirmed reservations.
 * @param roomId The unique ID of the room to check.
 * @param reservations List of all reservations.
 * @returns 'occupied' if there's a confirmed reservation spanning today, 'available' otherwise.
 */
export const getRoomOccupancyStatus = (roomId: string, reservations: Reservation[]): 'available' | 'occupied' => {
  // Use UTC-3 (Brazil) or local time? ISO strings are usually YYYY-MM-DD
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Find a confirmed or checked-in reservation that covers today
  const activeRes = reservations.find(res => {
    if (res.roomId !== roomId) return false;
    if (res.status !== 'confirmed' && res.status !== 'checked_in') return false;
    
    // Check-in is inclusive, Check-out is usually exclusive (morning of departure)
    return res.checkIn <= todayStr && res.checkOut > todayStr;
  });

  return activeRes ? 'occupied' : 'available';
};
