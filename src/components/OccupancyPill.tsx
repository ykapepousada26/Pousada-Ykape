import React from 'react';
import { Reservation } from '../types';
import { getRoomOccupancyStatus } from '../utils/occupancy';
import { CheckCircle2, UserCheck } from 'lucide-react';

interface OccupancyPillProps {
  roomId: string;
  reservations: Reservation[];
}

export default function OccupancyPill({ roomId, reservations }: OccupancyPillProps) {
  const status = getRoomOccupancyStatus(roomId, reservations);
  
  if (status === 'occupied') {
    return (
      <div className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
        <UserCheck className="w-3 h-3" />
        Ocupado Agora
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
      <CheckCircle2 className="w-3 h-3" />
      Disponível
    </div>
  );
}
