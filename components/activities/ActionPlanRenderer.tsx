import React, { useState } from 'react';
import { TextArea } from '../TextArea';
import { Button } from '../Button';
import { Save, CheckCircle2, Target, Lightbulb, Footprints } from 'lucide-react';

interface ActionPlanRendererProps {
    content: any;
    isCompleted: boolean;
    onComplete: (data: any) => void;
}

export const ActionPlanRenderer: React.FC<ActionPlanRendererProps> = ({
    content,
    isCompleted,
    onComplete,
}) => {
    const [plan, setPlan] = useState({
        sabotage: content?.sabotage || '',
        goal: content?.goal || '',
        step: content?.step || '',
    });

    const handleSave = () => {
        onComplete({ ...content, ...plan });
    };

    const canSave = plan.sabotage.trim() || plan.goal.trim() || plan.step.trim();

    const sections = [
        {
            key: 'sabotage' as const,
            icon: Target,
            label: 'Ponto de Autossabotagem',
            placeholder: 'Qual comportamento ou zona de conforto você quer mudar?',
            color: 'text-[rgb(var(--color-cardinal))]',
            bgColor: 'bg-red-50',
        },
        {
            key: 'goal' as const,
            icon: Lightbulb,
            label: 'Minha Meta',
            placeholder: 'O que você quer alcançar com essa mudança?',
            color: 'text-[rgb(var(--color-bee))]',
            bgColor: 'bg-yellow-50',
        },
        {
            key: 'step' as const,
            icon: Footprints,
            label: 'Meu Primeiro Passo',
            placeholder: 'Qual é o menor passo concreto que você pode dar hoje?',
            color: 'text-[rgb(var(--color-owl))]',
            bgColor: 'bg-green-50',
        },
    ];

    return (
        <div className="space-y-6">
            {sections.map(section => (
                <div key={section.key} className={`${section.bgColor} rounded-2xl p-5 border-2 border-[rgb(var(--color-swan))]`}>
                    <div className="flex items-center gap-2 mb-3">
                        <section.icon className={`w-5 h-5 ${section.color}`} />
                        <h3 className="text-sm font-bold text-[rgb(var(--color-eel))] uppercase tracking-wide">
                            {section.label}
                        </h3>
                    </div>
                    <TextArea
                        value={plan[section.key]}
                        onChange={(e) => setPlan(prev => ({ ...prev, [section.key]: e.target.value }))}
                        placeholder={section.placeholder}
                        rows={3}
                        readOnly={isCompleted}
                    />
                </div>
            ))}

            {!isCompleted && (
                <Button onClick={handleSave} fullWidth disabled={!canSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Plano de Ação
                </Button>
            )}

            {isCompleted && (
                <div className="flex items-center gap-2 text-[rgb(var(--color-owl))] bg-green-50 px-4 py-3 rounded-2xl border-2 border-[rgb(var(--color-owl))]/20">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wide">Plano de ação concluído</span>
                </div>
            )}
        </div>
    );
};