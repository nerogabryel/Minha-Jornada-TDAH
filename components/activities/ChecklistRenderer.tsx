import React, { useState } from 'react';
import { Button } from '../Button';
import { CheckCircle2, Circle, Save } from 'lucide-react';

interface ChecklistRendererProps {
    content: any;
    isCompleted: boolean;
    onComplete: (data: any) => void;
}

export const ChecklistRenderer: React.FC<ChecklistRendererProps> = ({
    content,
    isCompleted,
    onComplete,
}) => {
    const items: string[] = content?.items || [];
    const [checked, setChecked] = useState<boolean[]>(
        content?.checkedItems || items.map(() => false)
    );

    const toggleItem = (index: number) => {
        if (isCompleted) return;
        const newChecked = [...checked];
        newChecked[index] = !newChecked[index];
        setChecked(newChecked);
    };

    const handleSave = () => {
        onComplete({ ...content, checkedItems: checked });
    };

    const checkedCount = checked.filter(Boolean).length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[rgb(var(--color-wolf))] uppercase tracking-wider">
                    {checkedCount} de {items.length} marcados
                </span>
                <div className="w-24 bg-[rgb(var(--color-swan))] rounded-full h-2">
                    <div
                        className="bg-[rgb(var(--color-macaw))] h-full rounded-full transition-all duration-300"
                        style={{ width: `${items.length > 0 ? (checkedCount / items.length) * 100 : 0}%` }}
                    />
                </div>
            </div>

            <div className="space-y-2">
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => toggleItem(index)}
                        disabled={isCompleted}
                        className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all ${checked[index]
                                ? 'bg-green-50/50 border-[rgb(var(--color-owl))]/20'
                                : 'bg-[rgb(var(--color-snow))] border-[rgb(var(--color-swan))] hover:border-[rgb(var(--color-macaw))]'
                            } ${!isCompleted ? 'active:translate-y-0.5 cursor-pointer' : 'cursor-default'}`}
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            {checked[index] ? (
                                <CheckCircle2 className="w-5 h-5 text-[rgb(var(--color-owl))]" />
                            ) : (
                                <Circle className="w-5 h-5 text-[rgb(var(--color-hare))]" />
                            )}
                        </div>
                        <span className={`text-sm font-medium leading-relaxed ${checked[index] ? 'text-[rgb(var(--color-wolf))] line-through' : 'text-[rgb(var(--color-eel))]'
                            }`}>
                            {item}
                        </span>
                    </button>
                ))}
            </div>

            {!isCompleted && (
                <Button onClick={handleSave} fullWidth disabled={checkedCount === 0}>
                    <Save className="w-4 h-4 mr-2" />
                    Concluir Checklist
                </Button>
            )}

            {isCompleted && (
                <div className="flex items-center gap-2 text-[rgb(var(--color-owl))] bg-green-50 px-4 py-3 rounded-2xl border-2 border-[rgb(var(--color-owl))]/20">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wide">Checklist concluído</span>
                </div>
            )}
        </div>
    );
};