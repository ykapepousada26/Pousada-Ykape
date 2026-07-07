import React from 'react';
import { Phone, Mail, MapPin, Compass, ShieldAlert, Heart, Landmark } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setIsAdminMode: (mode: boolean) => void;
  onOpenBooking: () => void;
}

export default function Footer({ setActiveTab, setIsAdminMode, onOpenBooking }: FooterProps) {
  const handleNavClick = (id: string) => {
    setIsAdminMode(false);
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-ocean text-white">
      {/* Top Wave Divider */}
      <div className="relative w-full overflow-hidden leading-[0] bg-stone-100">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12">
          {/* Background Wave Accent */}
          <path 
            d="M0,50 C300,110 500,20 800,80 C1000,110 1100,60 1200,70 L1200,120 L0,120 Z" 
            className="text-turquoise/30" 
            fill="currentColor"
          ></path>
          {/* Foreground Wave Main */}
          <path 
            d="M0,70 C360,120 540,30 840,90 C1040,110 1120,80 1200,95 L1200,120 L0,120 Z" 
            className="text-ocean" 
            fill="currentColor"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About & Differentials */}
          <div className="space-y-4">
            <div className="border-b border-turquoise/30 pb-2">
              <img 
                src="https://i.postimg.cc/NFnDbFp1/logo-ykape-brando-removebg-preview.png" 
                alt="Pousada Ykapê" 
                className="h-16 w-auto object-contain" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              Frente para o mar no Balneário Yemar. Basta atravessar a Avenida Beira Mar para desfrutar da areia e das ondas. Oferecemos 20 apartamentos (19 suítes simples e 1 dupla), duas piscinas mistas, área gourmet, lazer infantil e café da manhã farto incluso. Frigobar opcional à parte.
            </p>
            <div className="flex gap-2 pt-2">
              <span className="text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full text-turquoise font-semibold transition-colors">
                #FrenteProMar
              </span>
              <span className="text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full text-turquoise font-semibold transition-colors">
                #CafeIncluso
              </span>
              <span className="text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full text-turquoise font-semibold transition-colors">
                #YemarBeach
              </span>
            </div>
          </div>

          {/* Col 2: Endereço & Pontos de Referência */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg border-b border-turquoise/30 pb-2 text-sand">
              Localização
            </h3>
            <div className="space-y-3 text-sm text-gray-200">
              <p className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-turquoise shrink-0 mt-0.5" />
                <span>
                  Avenida Beira Mar, nº 10.050<br />
                  Balneário Yemar<br />
                  Divisa com Porto Velho
                </span>
              </p>
              <p className="text-xs text-turquoise bg-white/5 p-2 rounded border border-turquoise/10 leading-normal">
                <strong>Ponto de referência:</strong> Ao lado do Supermercado Monte Carlo (Yemar). O local ideal com conveniência total para suas férias!
              </p>
            </div>
          </div>

          {/* Col 3: Links Rápidos */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg border-b border-turquoise/30 pb-2 text-sand">
              Navegação
            </h3>
            <ul className="space-y-2 text-sm text-gray-200">
              {['inicio', 'acomodacoes', 'sobre', 'estrutura', 'cardapio', 'galeria', 'contato'].map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => handleNavClick(tab)}
                    className="hover:text-turquoise transition-colors capitalize text-left cursor-pointer"
                  >
                    &raquo; {tab === 'inicio' ? 'Início' : tab === 'sobre' ? 'Sobre Nós' : tab === 'acomodacoes' ? 'Acomodações' : tab === 'estrutura' ? 'Estrutura & Lazer' : tab}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <button
                  onClick={() => setIsAdminMode(true)}
                  className="flex items-center gap-1.5 text-xs text-sand hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-all cursor-pointer"
                >
                  <Landmark className="w-3.5 h-3.5" /> Painel de Controle Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contatos & Reservas */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg border-b border-turquoise/30 pb-2 text-sand">
              Contatos Rápidos
            </h3>
            <div className="space-y-3 text-sm text-gray-200">
              <div className="space-y-1">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-turquoise" />
                  <a 
                    id="footer-whatsapp-1"
                    href="https://wa.me/5513996213162?text=Olá,%20gostaria%20de%20informações%20sobre%20as%20reservas!" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-turquoise transition-colors"
                  >
                    (13) 99621-3162 <span className="text-emerald-400 font-semibold text-xs ml-1">(WhatsApp 1)</span>
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-turquoise" />
                  <a 
                    id="footer-whatsapp-2"
                    href="https://wa.me/5511999992965?text=Olá,%20gostaria%20de%20informações%20sobre%20as%20reservas!" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-turquoise transition-colors"
                  >
                    (11) 99999-2965 <span className="text-emerald-400 font-semibold text-xs ml-1">(WhatsApp 2)</span>
                  </a>
                </p>
              </div>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-turquoise" />
                <span>contato@pousadaykape.com.br</span>
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full bg-turquoise hover:bg-turquoise-dark text-white font-semibold py-2.5 px-4 rounded-full text-center text-sm transition-all shadow-md cursor-pointer transform hover:-translate-y-0.5"
                >
                  Fazer Reserva Online (50% Off)
                </button>
                <span className="block text-[10px] text-center text-gray-300 mt-1">
                  *Garanta sua vaga pagando apenas metade agora
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-300">
          <p>&copy; {new Date().getFullYear()} Pousada Ykape. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Desenvolvido com <Heart className="w-3 h-3 text-red-400 fill-red-400" /> para o Balneário Yemar • CNPJ 12.345.678/0001-90
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                setIsAdminMode(false);
                setActiveTab('politica-cancelamento');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="hover:underline cursor-pointer text-gray-300 hover:text-white"
            >
              Políticas de Cancelamento
            </button>
            <button 
              onClick={() => {
                setIsAdminMode(false);
                setActiveTab('politica-privacidade');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="hover:underline cursor-pointer text-gray-300 hover:text-white"
            >
              LGPD & Privacidade
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
