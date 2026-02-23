import React from 'react';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

export const EmptyState: React.FC = () => {
    return (
        <div className="bg-[rgb(var(--color-snow))] rounded-[2rem] p-10 border-2 border-[rgb(var(--color-swan))] border-b-4 text-center relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 rounded-full bg-[rgb(var(--color-macaw))]/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-[rgb(var(--color-bee))]/10 blur-2xl pointer-events-none" />

            <div className="relative z-10">
                <div className="mx-auto w-20 h-20 rounded-[2rem] bg-[rgb(var(--color-polar))] border-2 border-[rgb(var(--color-swan))] flex items-center justify-center mb-6">
                    <BookOpen className="w-10 h-10 text-[rgb(var(--color-macaw))]" />
                </div>

                <h3 className="text-2xl font-bold text-[rgb(var(--color-eel))] mb-3 tracking-tight">
                    Bem-vinda à sua Jornada!
                </h3>
                <p className="text-[rgb(var(--color-wolf))] max-w-sm mx-auto leading-relaxed font-medium mb-2">
                    Sua jornada de autoconhecimento sobre TDAH começa aqui. Cada atividade foi pensada para você.
                </p>

                <div className="flex items-center justify-center gap-2 text-[rgb(var(--color-macaw))] text-sm font-bold mt-6">
                    <Sparkles className="w-4 h-4" />
                    <span className="uppercase tracking-wide">Comece pelo Módulo 1</span>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
};