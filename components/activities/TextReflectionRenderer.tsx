import React, { useState, useEffect } from 'react';
import { TextArea } from '../TextArea';
import { Button } from '../Button';
import { Save, CheckCircle2 } from 'lucide-react';

interface TextReflectionRendererProps {
    content: any;
    isCompleted: boolean;
    onComplete: (data: any) => void;
}

export const TextReflectionRenderer: React.FC<TextReflectionRendererProps> = ({
    content,
    isCompleted,
    onComplete,
}) => {
    const prompts: string[] = content?.prompts || ['Escreva sua reflexão aqui.'];
    const [answers, setAnswers] = useState<string[]>(
        content?.userAnswers || prompts.map(() => '')
    );

    const handleSave = () => {
        onComplete({ ...content, userAnswers: answers });
    };

    const canSave = answers.some(a => a.trim().length > 0);

    return (
        <div className="space-y-6">
            {prompts.map((prompt, index) => (
                <div key={index}>
                    <p className="text-[rgb(var(--color-eel))] font-bold text-sm mb-3 leading-relaxed">{prompt}</p>
                    <TextArea
                        value={answers[index]}
                        onChange={(e) => {
                            const newAnswers = [...answers];
                            newAnswers[index] = e.target.value;
                            setAnswers(newAnswers);
                        }}
                        placeholder="Escreva sua reflexão..."
                        rows={4}
                        readOnly={isCompleted}
                        className={isCompleted ? 'bg-green-50/50 border-[rgb(var(--color-owl))]/20' : ''}
                    />
                </div>
            ))}

            {!isCompleted && (
                <Button onClick={handleSave} disabled={!canSave} fullWidth>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Reflexão
                </Button>
            )}

            {isCompleted && (
                <div className="flex items-center gap-2 text-[rgb(var(--color-owl))] bg-green-50 px-4 py-3 rounded-2xl border-2 border-[rgb(var(--color-owl))]/20">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wide">Reflexão concluída</span>
                </div>
            )}
        </div>
    );
};