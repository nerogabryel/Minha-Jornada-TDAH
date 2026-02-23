import React, { useState } from 'react';
import { TextArea } from '../TextArea';
import { Button } from '../Button';
import { Save, CheckCircle2 } from 'lucide-react';

interface Phase {
    id: string;
    title: string;
    subtitle: string;
}

interface Field {
    key: string;
    label: string;
    placeholder: string;
}

interface TimelineRendererProps {
    content: any;
    isCompleted: boolean;
    onComplete: (data: any) => void;
}

export const TimelineRenderer: React.FC<TimelineRendererProps> = ({
    content,
    isCompleted,
    onComplete,
}) => {
    const phases: Phase[] = content?.phases || [];
    const fields: Field[] = content?.fields || [];

    const [entries, setEntries] = useState<Record<string, Record<string, string>>>(
        content?.entries ||
        Object.fromEntries(phases.map(p => [p.id, Object.fromEntries(fields.map(f => [f.key, '']))]))
    );

    const handleChange = (phaseId: string, fieldKey: string, value: string) => {
        setEntries(prev => ({
            ...prev,
            [phaseId]: { ...prev[phaseId], [fieldKey]: value }
        }));
    };

    const handleSave = () => {
        onComplete({ ...content, entries });
    };

    const hasContent = Object.values(entries).some(
        phase => Object.values(phase).some(v => v.trim().length > 0)
    );

    const phaseColors = [
        'border-[rgb(var(--color-macaw))]',
        'border-[rgb(var(--color-owl))]',
        'border-[rgb(var(--color-fox))]',
        'border-[rgb(var(--color-bee))]',
    ];

    return (
        <div className="space-y-6">
            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[rgb(var(--color-swan))]" />

                <div className="space-y-8">
                    {phases.map((phase, index) => (
                        <div key={phase.id} className="relative pl-16">
                            {/* Timeline dot */}
                            <div className={`absolute left-4 top-2 w-5 h-5 rounded-full border-4 bg-[rgb(var(--color-snow))] ${phaseColors[index % phaseColors.length]}`} />

                            <div className="bg-[rgb(var(--color-snow))] rounded-2xl p-5 border-2 border-[rgb(var(--color-swan))]">
                                <h3 className="text-base font-bold text-[rgb(var(--color-eel))] mb-0.5">{phase.title}</h3>
                                <p className="text-xs text-[rgb(var(--color-hare))] font-bold uppercase tracking-wider mb-4">{phase.subtitle}</p>

                                <div className="space-y-3">
                                    {fields.map(field => (
                                        <TextArea
                                            key={field.key}
                                            label={field.label}
                                            value={entries[phase.id]?.[field.key] || ''}
                                            onChange={(e) => handleChange(phase.id, field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            rows={2}
                                            readOnly={isCompleted}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {!isCompleted && (
                <Button onClick={handleSave} fullWidth disabled={!hasContent}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Linha do Tempo
                </Button>
            )}

            {isCompleted && (
                <div className="flex items-center gap-2 text-[rgb(var(--color-owl))] bg-green-50 px-4 py-3 rounded-2xl border-2 border-[rgb(var(--color-owl))]/20">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wide">Linha do tempo concluída</span>
                </div>
            )}
        </div>
    );
};