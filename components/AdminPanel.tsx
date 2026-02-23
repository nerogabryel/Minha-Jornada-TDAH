import React, { useState, useEffect } from 'react';
import { Shield, Users, BookOpen, Search, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { showToast } from './Toast';

export const AdminPanel: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'users' | 'content'>('users');
    const [usersList, setUsersList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.isAdmin || !isSupabaseConfigured() || !supabase) {
            setIsLoading(false);
            return;
        }

        const fetchAdminData = async () => {
            try {
                const { data, error } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                setUsersList(data || []);
            } catch (err) {
                console.error("Error fetching admin users", err);
                showToast("Erro ao carregar dados do admin", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminData();
    }, [user, activeTab]);

    if (!user?.isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <Shield className="w-16 h-16 text-[rgb(var(--color-flamingo))] mb-4" />
                <h2 className="text-2xl font-black text-[rgb(var(--color-eel))] mb-2">Acesso Negado</h2>
                <p className="text-[rgb(var(--color-wolf))] font-medium">Você não tem permissão de administrador para visualizar esta página.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[rgb(var(--color-polar))] p-4 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-[rgb(var(--color-eel))] flex items-center gap-3">
                    <Shield className="w-8 h-8 text-[rgb(var(--color-macaw))]" />
                    Backoffice
                </h1>
                <p className="text-[rgb(var(--color-wolf))] mt-2 font-medium">Gerenciamento central de alunas e conteúdo.</p>
            </header>

            {/* TABS */}
            <div className="flex border-b-2 border-[rgb(var(--color-swan))] mb-8 overflow-x-auto hide-scrollbar">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center gap-2 px-6 py-4 font-bold ${activeTab === 'users' ? 'text-[rgb(var(--color-macaw))] border-b-4 border-[rgb(var(--color-macaw))] -mb-[2px]' : 'text-[rgb(var(--color-hare))] hover:text-[rgb(var(--color-wolf))]'}`}
                >
                    <Users className="w-5 h-5" />
                    Alunas ({usersList.length})
                </button>
                <button
                    onClick={() => setActiveTab('content')}
                    className={`flex items-center gap-2 px-6 py-4 font-bold ${activeTab === 'content' ? 'text-[rgb(var(--color-macaw))] border-b-4 border-[rgb(var(--color-macaw))] -mb-[2px]' : 'text-[rgb(var(--color-hare))] hover:text-[rgb(var(--color-wolf))]'}`}
                >
                    <BookOpen className="w-5 h-5" />
                    Módulos & Aulas
                </button>
            </div>

            {/* CONTENT */}
            <div className="bg-[rgb(var(--color-snow))] rounded-2xl border-2 border-[rgb(var(--color-swan))] p-6 shadow-sm flex-1">
                {isLoading ? (
                    <div className="flex justify-center py-12 text-[rgb(var(--color-wolf))] font-bold">Carregando dados confidenciais...</div>
                ) : activeTab === 'users' ? (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[rgb(var(--color-eel))]">Base de Clientes</h2>
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-hare))]" />
                                <input type="text" placeholder="Buscar por ID..." className="pl-10 pr-4 py-2 border-2 border-[rgb(var(--color-swan))] rounded-xl text-sm font-medium w-64 focus:outline-none focus:border-[rgb(var(--color-macaw))]" />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-[rgb(var(--color-swan))]">
                                        <th className="py-4 px-4 font-bold text-sm text-[rgb(var(--color-wolf))] uppercase">Auth ID</th>
                                        <th className="py-4 px-4 font-bold text-sm text-[rgb(var(--color-wolf))] uppercase">Status VIP</th>
                                        <th className="py-4 px-4 font-bold text-sm text-[rgb(var(--color-wolf))] uppercase">Big Five</th>
                                        <th className="py-4 px-4 font-bold text-sm text-[rgb(var(--color-wolf))] uppercase">Ações Manuais</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersList.map(u => (
                                        <tr key={u.id} className="border-b-2 border-[rgb(var(--color-polar))] hover:bg-[rgb(var(--color-polar))]">
                                            <td className="py-4 px-4">
                                                <p className="font-bold text-[rgb(var(--color-eel))]">{String(u.id).substring(0, 8)}...</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                {u.subscription_tier === 'premium' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFD700]/20 text-yellow-700">
                                                        <CheckCircle className="w-3 h-3" /> ATIVO
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-700">
                                                        FREE
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 font-bold text-sm text-[rgb(var(--color-wolf))]">
                                                {u.big_five_trait || '-'}
                                            </td>
                                            <td className="py-4 px-4">
                                                <button className="text-[rgb(var(--color-macaw))] font-bold text-sm hover:underline">Revogar Acesso</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {usersList.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-[rgb(var(--color-wolf))] font-medium">Nenhuma cliente localizada na tabela user_profiles.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <BookOpen className="w-16 h-16 text-[rgb(var(--color-hare))] mb-4" />
                        <h3 className="text-xl font-bold text-[rgb(var(--color-eel))] mb-2">Editor de Aulas e Módulos</h3>
                        <p className="text-[rgb(var(--color-wolf))] font-medium max-w-lg mb-6 leading-relaxed">
                            A interface visual para injetar Parágrafos, Checklists e Vídeos nas Aulas está em construção.<br /><br />
                            Neste exato momento, como você está operando o banco de dados diretamente, acesse o <strong>Supabase SQL Editor</strong> para modificar os textos das atividades ou editar os títulos das lições na tabela `course_activities`.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
