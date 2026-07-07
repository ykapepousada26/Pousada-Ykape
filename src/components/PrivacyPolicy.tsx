import React, { useEffect } from 'react';
import { Shield, Lock, FileText, ArrowLeft, Eye, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyProps {
  setActiveTab: (tab: string) => void;
}

export default function PrivacyPolicy({ setActiveTab }: PrivacyPolicyProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-stone-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-sand/40 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-ocean text-white px-6 py-10 sm:px-12 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Shield className="w-64 h-64 text-white" />
          </div>
          <button 
            onClick={() => setActiveTab('inicio')}
            className="flex items-center gap-2 text-xs text-turquoise hover:text-white mb-6 font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para o Início
          </button>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-turquoise" />
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-sand">
              Diretrizes de LGPD & Privacidade
            </h1>
          </div>
          <p className="text-gray-200 text-xs sm:text-sm mt-2 max-w-xl">
            Entenda como a Pousada Ykapê coleta, utiliza e protege suas informações pessoais de acordo com a legislação brasileira.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-12 space-y-8 text-gray-700 leading-relaxed text-sm">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-ocean flex items-center gap-2">
              <span className="bg-turquoise/10 p-1.5 rounded-lg text-turquoise"><Eye className="w-5 h-5" /></span>
              1. Introdução e Compromisso
            </h2>
            <p>
              A <strong>Pousada Ykapê</strong> (inscrita sob o CNPJ 12.345.678/0001-90, situada na Avenida Beira Mar, nº 10.050, Balneário Yemar) valoriza a privacidade dos seus hóspedes e usuários. Nosso compromisso é garantir a transparência absoluta no tratamento dos seus dados pessoais, em total conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-ocean flex items-center gap-2">
              <span className="bg-turquoise/10 p-1.5 rounded-lg text-turquoise"><FileText className="w-5 h-5" /></span>
              2. Dados que Coletamos
            </h2>
            <p>
              Durante sua interação com o nosso site, canais de atendimento ou ao realizar uma reserva, coletamos apenas os dados estritamente necessários para viabilizar e aprimorar sua hospedagem:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 mt-2">
              {[
                'Dados Cadastrais (Nome completo, CPF, RG)',
                'Informações de Contato (Telefone, E-mail, WhatsApp)',
                'Dados de Pagamento (Tratados de forma 100% segura e criptografada)',
                'Dados de Reserva (Período de estadia, número de hóspedes e preferências)',
                'Informações de Veículo (Para controle do estacionamento gratuito interno)'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-turquoise shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-ocean flex items-center gap-2">
              <span className="bg-turquoise/10 p-1.5 rounded-lg text-turquoise"><Lock className="w-5 h-5" /></span>
              3. Finalidade do Uso das Informações
            </h2>
            <p>
              Seus dados pessoais são utilizados de forma responsável e para finalidades específicas:
            </p>
            <div className="bg-stone-50 p-4 rounded-xl border border-sand/30 space-y-2 text-xs sm:text-sm">
              <p><strong>• Gestão de Reservas:</strong> Processar e confirmar sua reserva online, bem como emitir faturas e comprovantes de pagamento.</p>
              <p><strong>• Atendimento ao Hóspede:</strong> Enviar lembretes importantes de check-in, suporte via WhatsApp ou sanar dúvidas de estadia.</p>
              <p><strong>• Cumprimento Legal:</strong> Atender à ficha de cadastro nacional obrigatória exigida pelo Ministério do Turismo (FNRH).</p>
              <p><strong>• Melhorias do Serviço:</strong> Otimizar o desempenho do nosso site e personalizar ofertas de tarifas e cupons promocionais especiais.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-ocean flex items-center gap-2">
              <span className="bg-turquoise/10 p-1.5 rounded-lg text-turquoise"><Shield className="w-5 h-5" /></span>
              4. Compartilhamento e Proteção
            </h2>
            <p>
              <strong>Nós não vendemos, alugamos ou comercializamos seus dados em hipótese alguma.</strong> Seus dados são confidenciais e armazenados em servidores seguros com proteção contra acessos não autorizados. 
            </p>
            <p>
              O compartilhamento de dados ocorre unicamente com operadoras de pagamento integradas (para processamento do sinal de reserva) e órgãos do governo para cumprimento de obrigações fiscais ou de turismo obrigatórias por lei.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-ocean flex items-center gap-2">
              <span className="bg-turquoise/10 p-1.5 rounded-lg text-turquoise"><CheckCircle2 className="w-5 h-5" /></span>
              5. Seus Direitos (LGPD)
            </h2>
            <p>
              Como titular dos dados, você possui total controle sobre as suas informações pessoais e pode exercer seus direitos a qualquer momento:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-teal-50/50 rounded-lg border border-teal-100">
                <span className="font-semibold block text-ocean text-xs sm:text-sm">Acesso e Correção</span>
                <span className="text-[11px] text-gray-500 mt-1 block">Confirmar a existência do tratamento de dados e atualizar qualquer informação inexata ou desatualizada.</span>
              </div>
              <div className="p-3 bg-teal-50/50 rounded-lg border border-teal-100">
                <span className="font-semibold block text-ocean text-xs sm:text-sm">Exclusão & Anonimização</span>
                <span className="text-[11px] text-gray-500 mt-1 block">Solicitar a exclusão definitiva ou anonimização de suas informações pessoais da nossa base de dados (exceto quando exigido por obrigações legais).</span>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="font-heading font-bold text-base text-ocean">Fale Conosco sobre Privacidade</h3>
            <p>
              Para dúvidas, solicitações de exclusão de dados ou esclarecimentos sobre as nossas práticas de LGPD, envie um e-mail para o nosso Encarregado de Proteção de Dados (DPO):
            </p>
            <p className="bg-stone-50 border border-gray-200 p-3 rounded-lg text-xs sm:text-sm inline-block">
              📧 E-mail: <strong>contato@pousadaykape.com.br</strong><br />
              📞 WhatsApp: <strong>(13) 99621-3162</strong>
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
