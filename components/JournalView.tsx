import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { useProgress } from '../context/ProgressContext';
import { MoodType } from '../types';
import { Button } from './Button';
import { TextArea } from './TextArea';
import { showToast } from './Toast';
import {
    Plus, Smile, Meh, Frown, X, Calendar, Trash2,
    Sparkles, SmilePlus, Angry, ChevronDown
} from 'lucide-react';

const MOOD_OPTIONS: { value: MoodType; label: string; emoji: string; color: string }[] = [
    { value: 'awesome', label: 'Incrível', emoji: '🤩', color: 'bg-[rgb(var(--color-owl))]/10 border-[rgb(var(--color-owl))]/30 text-[rgb(var(--color-owl))]' },
    { value: 'good', label: 'Bem', emoji: '😊', color: 'bg-[rgb(var(--color-macaw))]/10 border-[rgb(var(--color-macaw))]/30 text-[rgb(var(--color-macaw))]' },
    { value: 'neutral', label: 'Neutro', emoji: '😐', color: 'bg-[rgb(var(--color-bee))]/10 border-[rgb(var(--color-bee))]/30 text-[rgb(var(--color-bee))]' },
    { value: 'bad', label: 'Mal', emoji: '😔', color: 'bg-[rgb(var(--color-fox))]/10 border-[rgb(var(--color-fox))]/30 text-[rgb(var(--color-fox))]' },
    { value: 'terrible', label: 'Péssimo', emoji: '😢', color: 'bg-[rgb(var(--color-cardinal))]/10 border-[rgb(var(--color-cardinal))]/30 text-[rgb(var(--color-cardinal))]' },
];

const TAGS = ['Foco', 'Ansiedade', 'Energia', 'Sono', 'Criatividade', 'Produtividade', 'Calma', 'Agitação', 'Motivação', 'Cansaço'];

export const JournalView: React.FC = () => {
    const { entries, addEntry, deleteEntry } = useJournal();
    const { registerDailyActivity } = useProgress();
    const [showForm, setShowForm] = useState(false);
    const [mood, setMood] = useState<MoodType | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [content, setContent] = useState('');

    const handleSubmit = () => {
        if (!mood) return;
        addEntry({ mood, tags: selectedTags, content });
        registerDailyActivity();
        showToast('Registro salvo no seu diário! 📝', 'success');
        resetForm();
    };

    const resetForm = () => {
        setShowForm(false);
        setMood(null);
        setSelectedTags([]);
        setContent('');
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMoodEmoji = (m: MoodType) => MOOD_OPTIONS.find(o => o.value === m)?.emoji || '😐';

    return (
        <div className="max-w-2xl mx-auto animate-fade-in pb-10 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--color-eel))] tracking-tight uppercase">Diário</h1>
                    <p className="text-sm text-[rgb(var(--color-wolf))] font-medium mt-1">
                        {entries.length} registro{entries.length !== 1 ? 's' : ''}
                    </p>
                </div>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Registro
                    </Button>
                )}
            </div>

            {/* New Entry Form */}
            {showForm && (
                <div className="bg-[rgb(var(--color-snow))] rounded-[2rem] p-6 border-2 border-[rgb(var(--color-swan))] border-b-4 animate-slide-up space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[rgb(var(--color-eel))] uppercase tracking-wide">Como você está?</h2>
                        <button onClick={resetForm} className="text-[rgb(var(--color-hare))] hover:text-[rgb(var(--color-wolf))] p-2 rounded-xl hover:bg-[rgb(var(--color-polar))]">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mood Selection */}
                    <div className="flex gap-2 flex-wrap">
                        {MOOD_OPTIONS.map(option => (
                            <button
                                key={option.value}
                                onClick={() => setMood(option.value)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-b-4 font-bold text-sm transition-all active:border-b-2 active:translate-y-0.5 ${mood === option.value
                                        ? `${option.color} border-current`
                                        : 'bg-[rgb(var(--color-polar))] border-[rgb(var(--color-swan))] text-[rgb(var(--color-wolf))] hover:border-[rgb(var(--color-macaw))]'
                                    }`}
                            >
                                <span className="text-xl">{option.emoji}</span>
                                <span className="uppercase tracking-wide text-xs">{option.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Tags */}
                    <div>
                        <h3 className="text-xs font-bold text-[rgb(var(--color-wolf))] uppercase tracking-wider mb-3">Tags (opcional)</h3>
                        <div className="flex flex-wrap gap-2">
                            {TAGS.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide border-2 transition-all ${selectedTags.includes(tag)
                                            ? 'bg-[rgb(var(--color-macaw))]/10 border-[rgb(var(--color-macaw))]/30 text-[rgb(var(--color-macaw))]'
                                            : 'bg-[rgb(var(--color-polar))] border-[rgb(var(--color-swan))] text-[rgb(var(--color-wolf))] hover:border-[rgb(var(--color-macaw))]'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <TextArea
                        label="O que você quer registrar?"
                        placeholder="Escreva sobre como foi seu dia, pensamentos, sentimentos..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                    />

                    {/* Submit */}
                    <Button
                        fullWidth
                        onClick={handleSubmit}
                        disabled={!mood}
                        className="shadow-xl shadow-[rgb(var(--color-macaw))]/20"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Salvar Registro
                    </Button>
                </div>
            )}

            {/* Entries List */}
            {entries.length === 0 && !showForm ? (
                <div className="bg-[rgb(var(--color-snow))] rounded-[2rem] p-10 border-2 border-[rgb(var(--color-swan))] border-b-4 text-center">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-[rgb(var(--color-polar))] border-2 border-[rgb(var(--color-swan))] flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-[rgb(var(--color-hare))]" />
                    </div>
                    <h3 className="text-xl font-bold text-[rgb(var(--color-eel))] mb-2">Nenhum registro ainda</h3>
                    <p className="text-[rgb(var(--color-wolf))] font-medium text-sm">Comece a registrar seus dias para acompanhar sua jornada.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {entries.map(entry => (
                        <div
                            key={entry.id}
                            className="bg-[rgb(var(--color-snow))] rounded-[2rem] p-6 border-2 border-[rgb(var(--color-swan))] border-b-4 transition-all hover:translate-y-0.5 hover:border-b-2"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                                    <div>
                                        <span className="text-xs text-[rgb(var(--color-wolf))] font-bold uppercase tracking-wide block">
                                            {formatDate(entry.date)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteEntry(entry.id)}
                                    className="text-[rgb(var(--color-hare))] hover:text-[rgb(var(--color-cardinal))] p-2 rounded-xl hover:bg-red-50 transition-colors"
                                    title="Excluir"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {entry.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {entry.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2.5 py-0.5 bg-[rgb(var(--color-polar))] text-[rgb(var(--color-macaw))] rounded-lg text-xs font-bold uppercase tracking-wide border border-[rgb(var(--color-swan))]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {entry.content && (
                                <p className="text-[rgb(var(--color-eel))] text-sm leading-relaxed font-medium whitespace-pre-wrap">
                                    {entry.content}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};