import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Compass, Coffee, Sparkles } from 'lucide-react';

interface WhatsAppChatProps {
  onOpenBooking: () => void;
  setActiveTab: (tab: string) => void;
  setIsAdminMode: (mode: boolean) => void;
}

export default function WhatsAppChat({
  onOpenBooking,
  setActiveTab,
  setIsAdminMode
}: WhatsAppChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([]);
  const [unreadCount, setUnreadCount] = useState(1);

  useEffect(() => {
    // Initial welcome message
    setChatHistory([
      {
        sender: 'bot',
        text: 'Olá! Sou a Amanda, sua assistente virtual da Pousada Ykape. 🌴🌊 Como posso ajudar você hoje?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || message;
    if (!text.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedHistory = [
      ...chatHistory,
      { sender: 'user', text, time: userTime }
    ];

    setChatHistory(updatedHistory);
    setMessage('');

    // Simulate response
    setTimeout(() => {
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let replyText = 'Entendido! Encaminhei sua solicitação para a nossa equipe humana de atendimento. Em instantes um de nossos recepcionistas entrará em contato direto com você pelo WhatsApp.';

      const lowercaseText = text.toLowerCase();
      if (lowercaseText.includes('reserva') || lowercaseText.includes('preço') || lowercaseText.includes('diaria') || lowercaseText.includes('quarto') || lowercaseText.includes('valor')) {
        replyText = 'Para agilizar sua reserva e garantir 50% de desconto no pagamento antecipado, você pode clicar no botão "Fazer Reserva Online" aqui no chat ou na barra superior do site! É super seguro e rápido. Quer que eu te guie no processo?';
      } else if (lowercaseText.includes('cardapio') || lowercaseText.includes('porção') || lowercaseText.includes('bebida') || lowercaseText.includes('comida')) {
        replyText = 'Nossa cozinha serve porções fresquinhas frente ao mar (como camarão empanado e isca de peixe) e drinks tropicais! Você pode visualizar todo o nosso cardápio atualizado na aba "Cardápio" do site.';
        setActiveTab('cardapio');
        setIsAdminMode(false);
        const el = document.getElementById('cardapio');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (lowercaseText.includes('onde') || lowercaseText.includes('localizacao') || lowercaseText.includes('endereco') || lowercaseText.includes('como chegar')) {
        replyText = 'Estamos localizados na Avenida Beira Mar, nº 10.050, Balneário Yemar (divisa com Porto Velho), logo ao lado do Supermercado Monte Carlo. É só atravessar a rua e você já está na praia!';
      }

      setChatHistory(prev => [
        ...prev,
        { sender: 'bot', text: replyText, time: botTime }
      ]);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'reserva') {
      handleSendMessage('Olá, gostaria de informações sobre hospedagem na Pousada Ykape.');
      setTimeout(() => {
        onOpenBooking();
        setIsOpen(false);
      }, 1500);
    } else if (action === 'cardapio') {
      handleSendMessage('Quero ver o cardápio da pousada!');
    } else if (action === 'localizacao') {
      handleSendMessage('Qual a localização exata e ponto de referência?');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Badge container */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="relative bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer group"
          id="whatsapp-floating-btn"
        >
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
              {unreadCount}
            </span>
          )}
          <MessageCircle className="w-7 h-7" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-semibold text-sm whitespace-nowrap">
            Fale Conosco
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[340px] sm:w-[360px] rounded-2xl shadow-2xl overflow-hidden border border-emerald-500/20 animate-in fade-in slide-in-from-bottom-5 duration-300 flex flex-col max-h-[480px]">
          {/* Header */}
          <div className="bg-emerald-600 text-white px-4 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg text-emerald-100 uppercase">
                  Y
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-emerald-600 rounded-full"></span>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-sm leading-tight">Atendimento Ykape</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> Online • Responde em instantes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsAdminMode(true);
                  setIsOpen(false);
                }}
                className="text-white/60 hover:text-white p-1 rounded-full transition-colors"
                title="Acesso Admin"
              >
                <Compass className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 bg-stone-50 space-y-3 no-scrollbar max-h-[260px]">
            {chatHistory.map((chat, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] ${
                  chat.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm shadow-sm leading-normal ${
                    chat.sender === 'user'
                      ? 'bg-emerald-500 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {chat.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-0.5 px-1">{chat.time}</span>
              </div>
            ))}
          </div>

          {/* Quick reply buttons */}
          <div className="px-4 py-2 bg-stone-100/50 border-t border-gray-100 flex flex-wrap gap-1.5 justify-start">
            <a
              href="https://wa.me/5513997654321?text=Olá!%20Gostaria%20de%20conversar%20sobre%20as%20acomodações%20da%20Pousada%20Ykape."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-emerald-500 hover:bg-emerald-600 border border-emerald-600 text-white font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 shadow-sm hover:scale-105"
            >
              💬 WhatsApp Direto
            </a>
            <button
              onClick={() => handleQuickAction('reserva')}
              className="text-xs bg-white hover:bg-emerald-50 border border-emerald-500/20 text-emerald-700 font-semibold px-2.5 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
            >
              🛎️ Reservar Agora
            </button>
            <button
              onClick={() => handleQuickAction('cardapio')}
              className="text-xs bg-white hover:bg-emerald-50 border border-emerald-500/20 text-emerald-700 font-semibold px-2.5 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
            >
              🍟 Ver Cardápio
            </button>
            <button
              onClick={() => handleQuickAction('localizacao')}
              className="text-xs bg-white hover:bg-emerald-50 border border-emerald-500/20 text-emerald-700 font-semibold px-2.5 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
            >
              📍 Onde Fica?
            </button>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200 bg-white flex gap-2 items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-800"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!message.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 text-white p-2 rounded-full shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
