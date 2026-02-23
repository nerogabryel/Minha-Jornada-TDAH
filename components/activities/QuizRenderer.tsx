import React, { useState } from 'react';
import { Button } from '../Button';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface Question {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

interface QuizRendererProps {
    content: any;
    isCompleted: boolean;
    onComplete: (data: any) => void;
}

export const QuizRenderer: React.FC<QuizRendererProps> = ({
    content,
    isCompleted,
    onComplete,
}) => {
    const questions: Question[] = content?.questions || [];
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(isCompleted);
    const [userAnswers, setUserAnswers] = useState<number[]>(content?.userAnswers || []);

    if (questions.length === 0) {
        return <p className="text-[rgb(var(--color-wolf))] font-medium">Nenhuma pergunta disponível.</p>;
    }

    const question = questions[currentQuestion];

    const handleAnswer = (index: number) => {
        if (showExplanation) return;
        setSelectedAnswer(index);
        setShowExplanation(true);

        const newAnswers = [...userAnswers, index];
        setUserAnswers(newAnswers);

        if (index === question.correctAnswerIndex) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setIsFinished(true);
            onComplete({ ...content, userAnswers, score: score + (selectedAnswer === question.correctAnswerIndex ? 1 : 0) });
        }
    };

    if (isFinished) {
        const finalScore = content?.score ?? score;
        return (
            <div className="text-center py-6 space-y-6">
                <div className="mx-auto w-20 h-20 rounded-[2rem] bg-[rgb(var(--color-bee))]/10 border-2 border-[rgb(var(--color-bee))]/30 flex items-center justify-center">
                    <span className="text-3xl font-black text-[rgb(var(--color-bee))]">{finalScore}/{questions.length}</span>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-[rgb(var(--color-eel))] mb-2">Quiz concluído!</h3>
                    <p className="text-[rgb(var(--color-wolf))] font-medium">
                        Você acertou {finalScore} de {questions.length} perguntas.
                    </p>
                </div>
                <div className="flex items-center gap-2 justify-center text-[rgb(var(--color-owl))] bg-green-50 px-4 py-3 rounded-2xl border-2 border-[rgb(var(--color-owl))]/20">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wide">Atividade concluída</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[rgb(var(--color-wolf))] uppercase tracking-wide">
                    Pergunta {currentQuestion + 1} de {questions.length}
                </span>
                <span className="text-xs font-bold text-[rgb(var(--color-macaw))]">
                    {score} acerto{score !== 1 ? 's' : ''}
                </span>
            </div>
            <div className="w-full bg-[rgb(var(--color-swan))] rounded-full h-2">
                <div
                    className="bg-[rgb(var(--color-macaw))] h-full rounded-full transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
            </div>

            {/* Question */}
            <h3 className="text-lg font-bold text-[rgb(var(--color-eel))] leading-relaxed">{question.question}</h3>

            {/* Options */}
            <div className="space-y-3">
                {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === question.correctAnswerIndex;
                    let style = 'bg-[rgb(var(--color-snow))] border-[rgb(var(--color-swan))] text-[rgb(var(--color-wolf))] hover:border-[rgb(var(--color-macaw))]';

                    if (showExplanation) {
                        if (isCorrect) {
                            style = 'bg-green-50 border-[rgb(var(--color-owl))] text-[rgb(var(--color-owl))]';
                        } else if (isSelected && !isCorrect) {
                            style = 'bg-red-50 border-[rgb(var(--color-cardinal))] text-[rgb(var(--color-cardinal))]';
                        } else {
                            style = 'bg-[rgb(var(--color-polar))] border-[rgb(var(--color-swan))] text-[rgb(var(--color-hare))] opacity-50';
                        }
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            disabled={showExplanation}
                            className={`w-full p-4 rounded-2xl border-2 border-b-4 text-left font-bold text-sm transition-all flex items-center gap-3 ${!showExplanation ? 'active:border-b-2 active:translate-y-0.5 cursor-pointer' : 'cursor-default'
                                } ${style}`}
                        >
                            <span className="flex-1 uppercase tracking-wide">{option}</span>
                            {showExplanation && isCorrect && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                            {showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 flex-shrink-0" />}
                        </button>
                    );
                })}
            </div>

            {/* Explanation */}
            {showExplanation && (
                <div className="bg-[rgb(var(--color-polar))] rounded-2xl p-4 border-2 border-[rgb(var(--color-swan))] animate-slide-up">
                    <p className="text-sm text-[rgb(var(--color-eel))] leading-relaxed font-medium">
                        <strong className="text-[rgb(var(--color-macaw))]">Explicação:</strong> {question.explanation}
                    </p>
                </div>
            )}

            {/* Next Button */}
            {showExplanation && (
                <Button onClick={handleNext} fullWidth className="animate-slide-up">
                    {currentQuestion < questions.length - 1 ? (
                        <>Próxima <ArrowRight className="w-4 h-4 ml-2" /></>
                    ) : (
                        <>Finalizar Quiz <CheckCircle2 className="w-4 h-4 ml-2" /></>
                    )}
                </Button>
            )}
        </div>
    );
};