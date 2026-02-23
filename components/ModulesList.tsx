import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { Module } from '../types';
import {
    BookOpen, Lock, CheckCircle2, ChevronDown, ChevronRight,
    PlayCircle, FileText, HelpCircle, ClipboardList, CalendarDays, Timer, Zap
} from 'lucide-react';
import { Button } from './Button';

const activityTypeIcons: Record<string, React.ElementType> = {
    text_reflection: FileText,
    quiz: HelpCircle,
    checklist: ClipboardList,
    daily_log: CalendarDays,
    timeline: Timer,
    action_plan: Zap,
};

const activityTypeLabels: Record<string, string> = {
    text_reflection: 'Reflexão',
    quiz: 'Quiz',
    checklist: 'Checklist',
    daily_log: 'Registro Diário',
    timeline: 'Linha do Tempo',
    action_plan: 'Plano de Ação',
};

export const ModulesList: React.FC = () => {
    const { modules } = useProgress();
    const navigate = useNavigate();
    const [expandedModule, setExpandedModule] = useState<string | null>(
        modules.find(m => !m.locked && m.progress < 100)?.id || null
    );

    const toggleModule = (moduleId: string) => {
        setExpandedModule(prev => prev === moduleId ? null : moduleId);
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in pb-10 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[rgb(var(--color-eel))] tracking-tight uppercase">Módulos</h1>
                <p className="text-sm text-[rgb(var(--color-wolf))] font-medium mt-1">
                    Seu conteúdo de aprendizagem e autoconhecimento
                </p>
            </div>

            <div className="space-y-4">
                {modules.map((module) => {
                    const isLocked = module.locked;
                    const isExpanded = expandedModule === module.id;
                    const isComplete = module.progress === 100;

                    return (
                        <div
                            key={module.id}
                            className={`bg-[rgb(var(--color-snow))] rounded-[2rem] border-2 border-b-4 overflow-hidden transition-all ${isLocked
                                    ? 'border-[rgb(var(--color-swan))] opacity-60'
                                    : 'border-[rgb(var(--color-swan))] hover:border-[rgb(var(--color-macaw))]'
                                }`}
                        >
                            {/* Module Header */}
                            <button
                                onClick={() => !isLocked && toggleModule(module.id)}
                                disabled={isLocked}
                                className={`w-full p-6 flex items-start gap-4 text-left transition-colors ${!isLocked ? 'hover:bg-[rgb(var(--color-polar))]/50 cursor-pointer' : 'cursor-not-allowed'
                                    }`}
                            >
                                <div className={`p-3 rounded-2xl border-2 flex-shrink-0 transition-colors ${isLocked
                                        ? 'bg-[rgb(var(--color-polar))] border-[rgb(var(--color-swan))] text-[rgb(var(--color-hare))]'
                                        : isComplete
                                            ? 'bg-green-50 border-[rgb(var(--color-owl))]/30 text-[rgb(var(--color-owl))]'
                                            : 'bg-[rgb(var(--color-polar))] border-[rgb(var(--color-swan))] text-[rgb(var(--color-macaw))]'
                                    }`}>
                                    {isLocked ? <Lock className="w-6 h-6" /> : isComplete ? <CheckCircle2 className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h2 className={`text-lg font-bold tracking-tight mb-1 ${isLocked ? 'text-[rgb(var(--color-wolf))]' : 'text-[rgb(var(--color-eel))]'
                                        }`}>
                                        {module.title}
                                    </h2>
                                    <p className="text-sm text-[rgb(var(--color-wolf))] font-medium line-clamp-2 leading-relaxed">
                                        {module.description}
                                    </p>

                                    {!isLocked && (
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex-1 bg-[rgb(var(--color-swan))] rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className="bg-[rgb(var(--color-macaw))] h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${module.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-[rgb(var(--color-macaw))] whitespace-nowrap">
                                                {module.progress}%
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {!isLocked && (
                                    <div className="flex-shrink-0 p-1">
                                        {isExpanded
                                            ? <ChevronDown className="w-5 h-5 text-[rgb(var(--color-macaw))]" />
                                            : <ChevronRight className="w-5 h-5 text-[rgb(var(--color-hare))]" />
                                        }
                                    </div>
                                )}
                            </button>

                            {/* Lessons (Expanded) */}
                            {isExpanded && !isLocked && (
                                <div className="border-t-2 border-[rgb(var(--color-swan))] bg-[rgb(var(--color-polar))]/30">
                                    {module.lessons.map((lesson, lessonIndex) => (
                                        <div key={lesson.id} className={`${lessonIndex > 0 ? 'border-t border-[rgb(var(--color-swan))]' : ''}`}>
                                            <div className="px-6 py-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <h3 className="text-sm font-bold text-[rgb(var(--color-eel))] uppercase tracking-wide flex-1">
                                                        {lesson.title}
                                                    </h3>
                                                    {lesson.duration && (
                                                        <span className="text-xs text-[rgb(var(--color-hare))] font-bold bg-[rgb(var(--color-polar))] px-2.5 py-1 rounded-lg border border-[rgb(var(--color-swan))]">
                                                            {lesson.duration}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    {lesson.activities.map((activity) => {
                                                        const Icon = activityTypeIcons[activity.type] || FileText;
                                                        return (
                                                            <button
                                                                key={activity.id}
                                                                onClick={() => navigate(`/activity/${activity.id}`)}
                                                                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all group ${activity.isCompleted
                                                                        ? 'bg-green-50/50 border-[rgb(var(--color-owl))]/20 text-[rgb(var(--color-owl))]'
                                                                        : 'bg-[rgb(var(--color-snow))] border-[rgb(var(--color-swan))] hover:border-[rgb(var(--color-macaw))] text-[rgb(var(--color-wolf))] hover:text-[rgb(var(--color-macaw))]'
                                                                    }`}
                                                            >
                                                                <div className={`p-1.5 rounded-lg ${activity.isCompleted ? 'bg-[rgb(var(--color-owl))]/10' : 'bg-[rgb(var(--color-polar))]'
                                                                    }`}>
                                                                    {activity.isCompleted
                                                                        ? <CheckCircle2 className="w-4 h-4" />
                                                                        : <Icon className="w-4 h-4" />
                                                                    }
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <span className="text-sm font-bold block truncate">{activity.title}</span>
                                                                    <span className="text-xs opacity-70 uppercase tracking-wide font-bold">{activityTypeLabels[activity.type]}</span>
                                                                </div>
                                                                <PlayCircle className={`w-5 h-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${activity.isCompleted ? '' : 'text-[rgb(var(--color-macaw))]'
                                                                    }`} />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};