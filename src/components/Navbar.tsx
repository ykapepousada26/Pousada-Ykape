import React, { useState } from 'react';
import { Menu, X, Landmark, ShieldAlert, Waves } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  onOpenBooking: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  isAdminMode,
  setIsAdminMode,
  onOpenBooking
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'inicio', label: 'Início' },
    { id: 'acomodacoes', label: 'Acomodações' },
    { id: 'sobre', label: 'Sobre Nós' },
    { id: 'estrutura', label: 'Estrutura & Lazer' },
    { id: 'cardapio', label: 'Cardápio' },
    { id: 'galeria', label: 'Galeria' },
    { id: 'contato', label: 'Contato' }
  ];

  const handleNavClick = (id: string) => {
    setIsAdminMode(false);
    setActiveTab(id);
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-md z-40 transition-all border-b border-sand/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo & Name */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('inicio')}>
            <img 
              src="https://i.postimg.cc/26z0SP1x/logo-ykape-azul-removebg-preview.png" 
              alt="Pousada Ykapê" 
              className="h-16 w-auto object-contain py-1" 
              referrerPolicy="no-referrer" 
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  !isAdminMode && activeTab === item.id
                    ? 'text-ocean border-b-2 border-turquoise'
                    : 'text-gray-600 hover:text-ocean hover:bg-sand/10'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Admin Toggle button */}
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setIsOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                isAdminMode
                  ? 'bg-turquoise/10 text-turquoise border-turquoise'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              {isAdminMode ? 'Painel Admin' : 'Admin'}
            </button>

            {/* CTA Button */}
            <button
              onClick={onOpenBooking}
              className="bg-ocean hover:bg-ocean-dark text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
            >
              Reserve Agora
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`p-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all ${
                isAdminMode
                  ? 'bg-turquoise/10 text-turquoise border-turquoise'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-ocean hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-inner px-2 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-2.5 rounded-md text-base font-medium transition-colors ${
                !isAdminMode && activeTab === item.id
                  ? 'bg-ocean/10 text-ocean'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 pb-2 border-t border-gray-100 flex flex-col gap-2 px-4">
            <button
              onClick={onOpenBooking}
              className="w-full bg-ocean hover:bg-ocean-dark text-white font-semibold py-3 rounded-full text-center transition-all shadow-md"
            >
              Reserve Agora
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
