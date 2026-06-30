import React, { useEffect } from 'react';
import { CalendarDays, AlertTriangle, RefreshCw, ArrowLeft, Clock, ShieldAlert } from 'lucide-react';

interface CancellationPolicyProps {
  setActiveTab: (tab: string) => void;
}

export default function CancellationPolicy({ setActiveTab }: CancellationPolicyProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-stone-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-sand/40 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-ocean text-white px-6 py-10 sm:px-12 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <CalendarDays className="w-64 h-64 text-white" />
          </div>
          <button 
            onClick={() => setActiveTab('inicio')}
            className="flex items-center gap-2 text-xs text-turquoise hover:text-white mb-6 font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para o Início
          </button>
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-turquoise" />
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-sand">
              Políticas de Reserva & Cancelamento
            </h1>
          </div>
          <p className="text-gray-200 text-xs sm:text-sm mt-2 max-w-xl">
            Transparência e respeito mútuo. Leia atentamente nossas regras para cancelamento, no-show e alterações de datas.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-12 space-y-8 text-gray-700 leading-relaxed text-sm">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-ocean flex items-center gap-2">
              <span className="bg-turquoise/10 p-1.5 rounded-lg text-turquoise"><Clock className="w-5 h-5" /></span>
              1. Pagamento de Sinal e Confirmação
            </h2>
            <p>
              Para a garantia efetiva da reserva de qualquer uma de nossas suítes, é exigido um sinal correspondente a <strong>50% (cinquenta por cento)</strong> do valor total do período contratado, ou o pagamento integral. O saldo restante das diárias é pago diretamente na recepção no momento do check-in.
            </p>
          </section>

          {/* Section 2: Cancellation Matrix */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-ocean flex items-center gap-2">
              <span className="bg-turquoise/10 p-1.5 rounded-lg text-turquoise"><RefreshCw className="w-5 h-5" /></span>
              2. Prazos e Percentual de Reembolso
            </h2>
            <p>
              Seguindo as orientações do Código de Defesa do Consumidor e da Embratur (Deliberação Normativa nº 161/85), os pedidos de cancelamento estão sujeitos às seguintes condições de devolução do sinal depositado:
            </p>

            {/* Matrix Visual Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl relative">
                <span className="text-xs font-bold text-emerald-600 block uppercase tracking-wider mb-1">15 Dias ou Mais</span>
                <span className="text-2xl font-bold font-heading text-ocean block">100% Reembolso</span>
                <p className="text-[11px] text-gray-500 mt-2">
                  Cancelando com 15 ou mais dias de antecedência da data de check-in, você recebe todo o valor do sinal de volta ou pode transformar 100% em crédito para usar depois.
                </p>
              </div>

              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl relative">
                <span className="text-xs font-bold text-amber-600 block uppercase tracking-wider mb-1">7 a 14 Dias</span>
                <span className="text-2xl font-bold font-heading text-ocean block">50% Reembolso</span>
                <p className="text-[11px] text-gray-500 mt-2">
                  Cancelando entre 7 e 14 dias antes do check-in, haverá devolução de 50% do valor do sinal pago ou a retenção de 100% como carta de crédito para nova estadia em até 6 meses.
                </p>
              </div>

              <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl relative">
                <span className="text-xs font-bold text-rose-600 block uppercase tracking-wider mb-1">Menos de 7 Dias</span>
                <span className="text-2xl font-bold font-heading text-ocean block">Sem Reembolso</span>
                <p className="text-[11px] text-gray-500 mt-2">
                  Para cancelamentos solicitados a menos de 7 dias do check-in, não haverá devolução de valores, por conta do bloqueio de vagas que impede a venda da acomodação.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: No-Show */}
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-ocean flex items-center gap-2">
              <span className="bg-turquoise/10 p-1.5 rounded-lg text-turquoise"><AlertTriangle className="w-5 h-5" /></span>
              3. Não Comparecimento (No-Show)
            </h2>
            <p>
              O não comparecimento sem comunicação prévia por escrito, na data prevista de chegada, será considerado como <strong>No-Show</strong>.
            </p>
            <div className="bg-stone-50 border-l-4 border-turquoise p-3 text-xs sm:text-sm text-gray-600">
              A vaga permanecerá retida por 24 horas a partir do horário oficial de check-in. Passado este período, a reserva será cancelada automaticamente, liberando a suíte e retendo o sinal integralmente, sem direito a reembolsos ou créditos.
            </div>
          </section>

          {/* Section 4: Early departure */}
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-ocean flex items-center gap-2">
              <span className="bg-turquoise/10 p-1.5 rounded-lg text-turquoise"><ShieldAlert className="w-5 h-5" /></span>
              4. Desistência ou Saída Antecipada
            </h2>
            <p>
              A saída antecipada do hóspede, por qualquer motivo, ou a desistência de permanecer hospedado antes do término programado da reserva, <strong>não dará direito</strong> a qualquer tipo de reembolso, restituição pecuniária de diárias pendentes, abatimento no saldo restante ou conversão em novas cartas de crédito. O pacote contratado será cobrado integralmente.
            </p>
          </section>

          {/* Section 5: Step by Step */}
          <section className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="font-heading font-bold text-base text-ocean">Como Solicitar o Cancelamento ou Alteração?</h3>
            <p>
              Todas as solicitações de cancelamento ou alteração de data de hospedagem devem ser formalizadas obrigatoriamente por escrito via e-mail ou através de nossa central do WhatsApp oficial de reservas.
            </p>
            <p className="bg-stone-50 border border-gray-200 p-3 rounded-lg text-xs sm:text-sm inline-block">
              📧 E-mail: <strong>contato@pousadaykape.com.br</strong><br />
              📞 WhatsApp: <strong>(13) 99765-4321</strong>
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-6 py-5 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <span>Última atualização: Junho de 2026</span>
          <button 
            onClick={() => setActiveTab('inicio')}
            className="bg-ocean hover:bg-ocean-dark text-white font-semibold px-5 py-2 rounded-full shadow-md transition-colors cursor-pointer"
          >
            Entendido, Voltar para o Início
          </button>
        </div>
      </div>
    </div>
  );
}
