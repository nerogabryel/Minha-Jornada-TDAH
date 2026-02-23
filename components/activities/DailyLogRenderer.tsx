import React, { useState } from 'react';
import { TextArea } from '../TextArea';
import { Button } from '../Button';
import { Save, CheckCircle2, Calendar } from 'lucide-react';

interface DailyLogRendererProps {
    content: any;
    isCompleted: boolean;
    onComplete: (data: any) => void;
}

export const DailyLogRenderer: React.FC<DailyLogRendererProps> = ({
    content,
    isCompleted,
    onComplete,
}) => {
    const totalDays = content?.totalDays || 7;
    const [logs, setLogs] = useState<string[]>(
        content?.logs || Array.from({ length: totalDays }, () => '')
    );

    const handleSave = () => {
        onComplete({ ...content, logs });
    };

    const filledDays = logs.filter(l => l.trim().length > 0).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[rgb(var(--color-wolf))] uppercase tracking-wider">
                    {filledDays} de {totalDays} dias preenchidos
                </span>
                <div className="w-24 bg-[rgb(var(--color-swan))] rounded-full h-2">
                    <div
                        className="bg-[rgb(var(--color-macaw))] h-full rounded-full transition-all duration-300"
                        style={{ width: `${(filledDays / totalDays) * 100}%` }}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {logs.map((log, index) => (
                    <div key={index} className="bg-[rgb(var(--color-polar))]/50 rounded-2xl p-4 border-2 border-[rgb(var(--color-swan))]">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className={`w-4 h-4 ${log.trim() ? 'text-[rgb(var(--color-macaw))]' : 'text-[rgb(var(--color-hare))]'}`} />
                            <span className="text-xs font-bold text-[rgb(var(--color-wolf))] uppercase tracking-wider">
                                Dia {index + 1}
                            </span>
                            {log.trim() && <CheckCircle2 className="w-3.5 h-3.5 text-[rgb(var(--color-owl))]" />}
                        </div>
                        <TextArea
                            value={log}
                            onChange={(e) => {
                                const newLogs = [...logs];
                                newLogs[index] = e.target.value;
                                setLogs(newLogs);
                            }}
                            placeholder={`O que você observou no dia ${index + 1}?`}
                            rows={2}
                            readOnly={isCompleted}
                        />
                    </div>
                ))}
            </div>

            {!isCompleted && (
                <Button onClick={handleSave} fullWidth disabled={filledDays === 0}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Registros
                </Button>
            )}

            {isCompleted && (
                <div className="flex items-center gap-2 text-[rgb(var(--color-owl))] bg-green-50 px-4 py-3 rounded-2xl border-2 border-[rgb(var(--color-owl))]/20">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wide">Registros concluídos</span>
                </div>
            )}
        </div>
    );
};