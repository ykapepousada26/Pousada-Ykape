import React from 'react';
import { Tag, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AnnouncementBanner: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-turquoise text-white relative overflow-hidden"
        id="announcement-banner"
      >
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex-1 flex items-center justify-center sm:justify-start">
              <span className="flex p-1.5 rounded-lg bg-white/20 mr-3">
                <Tag className="h-4 w-4 text-white" aria-hidden="true" />
              </span>
              <p className="font-medium text-sm sm:text-base truncate">
                <span className="md:hidden">Promoção de Inverno! 15% OFF</span>
                <span className="hidden md:inline">Aproveite nossa Promoção de Inverno: 15% de desconto em reservas acima de 3 diárias!</span>
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="#reservations"
                className="flex items-center justify-center px-4 py-1 border border-transparent rounded-full shadow-sm text-xs font-bold text-turquoise bg-white hover:bg-turquoise-light transition-colors"
              >
                Reservar Agora <ArrowRight className="ml-1.5 h-3 w-3" />
              </a>
              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="-mr-1 flex p-1 rounded-md hover:bg-white/10 focus:outline-none transition-colors"
              >
                <span className="sr-only">Fechar</span>
                <X className="h-4 w-4 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Subtle decorative pattern */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10 pointer-events-none">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="50" fill="white" />
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
