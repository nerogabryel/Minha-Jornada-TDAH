import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { Button } from './Button';
import { showToast } from './Toast';
import { ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react';
import { TextReflectionRenderer } from './activities/TextReflectionRenderer';
import { QuizRenderer } from './activities/QuizRenderer';
import { ChecklistRenderer } from './activities/ChecklistRenderer';
import { DailyLogRenderer } from './activities/DailyLogRenderer';
import { TimelineRenderer } from './activities/TimelineRenderer';
import { ActionPlanRenderer } from './activities/ActionPlanRenderer';
import { Activity, ActivityType } from '../types';

const renderers: Record<ActivityType, React.FC<any>> = {
    text_reflection: TextReflectionRenderer,
    quiz: QuizRenderer,
    checklist: ChecklistRenderer,
    daily_log: DailyLogRenderer,
    timeline: TimelineRenderer,
    action_plan: ActionPlanRenderer,
};

export const ActivityView: React.FC = () => {
    const { activityId } = useParams<{ activityId: string }>();
    const navigate = useNavigate();
    const { modules, updateActivity, registerDailyActivity } = useProgress();

    // Find the activity across all modules
    let foundActivity: Activity | null = null;
    let foundModuleTitle = '';
    let foundLessonTitle = '';

    for (const mod of modules) {
        for (const lesson of mod.lessons) {
            const act = lesson.activities.find(a => a.id === activityId);
            if (act) {
                foundActivity = act;
                foundModuleTitle = mod.title;
                foundLessonTitle = lesson.title;
                break;
            }
        }
        if (foundActivity) break;
    }

    if (!foundActivity) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in">
                <div className="mx-auto w-20 h-20 rounded-[2rem] bg-[rgb(var(--color-polar))] border-2 border-[rgb(var(--color-swan))] flex items-center justify-center mb-6">
                    <BookOpen className="w-10 h-10 text-[rgb(var(--color-hare))]" />
                </div>
                <h2 className="text-2xl font-bold text-[rgb(var(--color-eel))] mb-3">Atividade não encontrada</h2>
                <p className="text-[rgb(var(--color-wolf))] font-medium mb-6">A atividade que você procura não existe ou foi removida.</p>
                <Button onClick={() => navigate('/modules')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar aos Módulos
                </Button>
            </div>
        );
    }

    const Renderer = renderers[foundActivity.type];

    const handleComplete = (updatedContent: any) => {
        updateActivity(foundActivity!.id, {
            isCompleted: true,
            content: updatedContent
        });
        registerDailyActivity();
        showToast('Atividade concluída! 🎉', 'success');
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in pb-10 space-y-6">
            {/* Back Navigation */}
            <button
                onClick={() => navigate('/modules')}
                className="flex items-center gap-2 text-[rgb(var(--color-macaw))] hover:text-[rgb(var(--color-humpback))] font-bold text-sm uppercase tracking-wide p-2 -ml-2 rounded-xl hover:bg-[rgb(var(--color-polar))] transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar
            </button>

            {/* Activity Header */}
            <div className="bg-[rgb(var(--color-snow))] rounded-[2rem] p-6 border-2 border-[rgb(var(--color-swan))] border-b-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-[rgb(var(--color-macaw))]/10 blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[rgb(var(--color-polar))] text-[rgb(var(--color-macaw))] border-2 border-[rgb(var(--color-swan))] uppercase tracking-wide">
                            {foundModuleTitle.split(':')[0]}
                        </span>
                        {foundActivity.isCompleted && (
                            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-green-50 text-[rgb(var(--color-owl))] border-2 border-[rgb(var(--color-owl))]/20 uppercase tracking-wide flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Concluída
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl font-bold text-[rgb(var(--color-eel))] tracking-tight mb-2">
                        {foundActivity.title}
                    </h1>

                    <p className="text-sm text-[rgb(var(--color-wolf))] font-medium leading-relaxed">
                        {foundActivity.instructions}
                    </p>

                    {foundActivity.motivational_text && (
                        <div className="mt-4 bg-[rgb(var(--color-bee))]/10 border-2 border-[rgb(var(--color-bee))]/20 rounded-2xl p-4">
                            <p className="text-sm text-[rgb(var(--color-eel))] font-medium italic leading-relaxed">
                                💡 {foundActivity.motivational_text}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Activity Renderer */}
            <div className="bg-[rgb(var(--color-snow))] rounded-[2rem] p-6 border-2 border-[rgb(var(--color-swan))] border-b-4">
                {Renderer ? (
                    <Renderer
                        content={foundActivity.content}
                        isCompleted={foundActivity.isCompleted}
                        onComplete={handleComplete}
                    />
                ) : (
                    <p className="text-[rgb(var(--color-wolf))] font-medium text-center py-8">
                        Tipo de atividade "{foundActivity.type}" não suportado.
                    </p>
                )}
            </div>
        </div>
    );
};