import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PrivacyTerms: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[rgb(var(--color-polar))] p-4 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[rgb(var(--color-macaw))]/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-4xl mx-auto bg-[rgb(var(--color-snow))] rounded-[2rem] shadow-xl p-8 lg:p-12 border-2 border-[rgb(var(--color-swan))] border-b-4 relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-[rgb(var(--color-wolf))] hover:text-[rgb(var(--color-eel))] font-bold py-2 px-4 bg-[rgb(var(--color-polar))] rounded-xl mb-8 border-2 border-[rgb(var(--color-swan))] transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <Shield className="w-12 h-12 text-[rgb(var(--color-macaw))]" />
                    <h1 className="text-3xl font-black text-[rgb(var(--color-eel))] uppercase tracking-tight">Termos e Privacidade</h1>
                </div>

                <div className="space-y-6 text-[rgb(var(--color-wolf))] font-medium leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-[rgb(var(--color-eel))] mb-2">1. Coleta e Proteção de Dados (LGPD)</h2>
                        <p>Levamos sua privacidade a sério. A plataforma "Minha Jornada TDAH" coleta dados de e-mail limitados estritamente à autenticação do sistema. Respostas de questionários comportamentais (como o Big Five) e entradas de diário emocional são criptografadas por Row Level Security (RLS) associadas diretamente à sua chave protegida na nuvem. Nenhuma destas informações é comercializada ou compartilhada com terceiros.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[rgb(var(--color-eel))] mb-2">2. Termos de Serviço</h2>
                        <p>O acesso aos módulos Premium e ao conteúdo restrito está condicionado à confirmação do seu pagamento no Gateway oficial (Kiwify/Stripe). Cópias, gravações ou reprodução não autorizada das videoaulas consistem em pirataria, e nos reservamos o direito de banir contas e IPs sinalizados por quebra deste acordo de confidencialidade.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[rgb(var(--color-eel))] mb-2">3. Exclusão de Conta</h2>
                        <p>Cumprindo as diretrizes de dados globais, você possui o direito irrevogável ao esquecimento. Ao clicar em "Apagar Meu Progresso" nas configurações de Perfil da aplicação, seu diário, histórico de login e identificadores do Módulo são permanentemente expurgados do banco de dados.</p>
                    </section>

                    <div className="mt-12 pt-6 border-t-2 border-[rgb(var(--color-swan))] text-sm text-[rgb(var(--color-hare))] font-bold text-center uppercase tracking-wider">
                        Última Atualização: 23 de Fevereiro de 2026
                    </div>
                </div>
            </div>
        </div>
    );
};
