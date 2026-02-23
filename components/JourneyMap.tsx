import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock, Star, MapPin, X, ChevronRight, BrainCircuit, Book, PlayCircle, Users, GraduationCap, ArrowRight, Play } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import { CelebrationConfetti } from './CelebrationConfetti';

interface Phase {
  id: number;
  title: string;
  description: string;
  status: 'locked' | 'active' | 'completed';
  color: string;
  borderColor: string;
  icon: React.ElementType;
  type?: 'big_five' | 'tool_unlock' | 'video' | 'community' | 'default';
  videoUrl?: string; // Mock URL
}

const INITIAL_PHASES: Phase[] = [
  {
    id: 1,
    title: 'Descoberta',
    description: 'Faça o teste Big Five e descubra os traços da sua personalidade.',
    status: 'active',
    color: 'bg-[rgb(var(--color-owl))]',
    borderColor: 'border-[rgb(88,167,0)]', // Tree Frog
    icon: BrainCircuit,
    type: 'big_five'
  },
  {
    id: 2,
    title: 'Estratégia',
    description: 'Acesso liberado! Comece a usar o Diário para monitorar seu progresso.',
    status: 'locked',
    color: 'bg-[rgb(var(--color-macaw))]',
    borderColor: 'border-[rgb(24,153,214)]', // Whale
    icon: Book,
    type: 'tool_unlock'
  },
  {
    id: 3,
    title: 'Ação',
    description: 'Assista ao CPL1: O Despertar da Consciência.',
    status: 'locked',
    color: 'bg-[rgb(var(--color-humpback))]',
    borderColor: 'border-[#2b70c9]', // Darker Humpback
    icon: PlayCircle,
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Placeholder
  },
  {
    id: 4,
    title: 'Manutenção',
    description: 'Assista ao CPL2: Mantendo a Constância.',
    status: 'locked',
    color: 'bg-[rgb(var(--color-fox))]',
    borderColor: 'border-[#d97706]', // Darker Fox
    icon: PlayCircle,
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 5,
    title: 'Maestria',
    description: 'Assista ao CPL3: O Próximo Nível.',
    status: 'locked',
    color: 'bg-[rgb(var(--color-bee))]',
    borderColor: 'border-[#eab308]', // Darker Bee
    icon: PlayCircle,
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 6,
    title: 'Comunidade',
    description: 'Entre para a comunidade e conecte-se com outras alunas.',
    status: 'locked',
    color: 'bg-[rgb(var(--color-cardinal))]',
    borderColor: 'border-[#b32d2d]', // Darker Cardinal
    icon: Users,
    type: 'community'
  },
  {
    id: 7,
    title: 'Boas Vindas',
    description: 'Aula inaugural: Começando sua nova jornada.',
    status: 'locked',
    color: 'bg-[rgb(var(--color-feather))]',
    borderColor: 'border-[rgb(24,153,214)]', // Whale
    icon: GraduationCap,
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
];

// ... (Big Five Questions remain the same)
const BIG_FIVE_QUESTIONS = [
  { id: 1, text: "Sou a vida da festa.", trait: "Extroversão" },
  { id: 2, text: "Sinto pouca preocupação pelos outros.", trait: "Amabilidade (Invertido)" },
  { id: 3, text: "Estou sempre preparado(a).", trait: "Conscienciosidade" },
  { id: 4, text: "Fico estressado(a) facilmente.", trait: "Neuroticismo" },
  { id: 5, text: "Tenho um vocabulário rico.", trait: "Abertura" }
];

export const JourneyMap: React.FC = () => {
  const navigate = useNavigate();
  const [phases, setPhases] = useState<Phase[]>(INITIAL_PHASES);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Big Five State
  const [showBigFive, setShowBigFive] = useState(false);
  const [bigFiveStep, setBigFiveStep] = useState(0);
  const [bigFiveAnswers, setBigFiveAnswers] = useState<Record<number, number>>({});

  // Video Modal State
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const activePhaseRef = useRef<HTMLDivElement>(null);

  // ... (Load progress useEffect remains the same)
  useEffect(() => {
    const savedProgress = localStorage.getItem('tdah_app_journey_progress');
    if (savedProgress) {
      try {
        const parsedPhases = JSON.parse(savedProgress);
        const merged = INITIAL_PHASES.map((p, i) => ({
            ...p,
            status: parsedPhases[i]?.status || p.status
        }));
        setPhases(merged);
      } catch (e) {
        console.error("Failed to parse journey progress", e);
      }
    }
    
    setTimeout(() => {
        if (activePhaseRef.current) {
            activePhaseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 500);
  }, []);

  const saveProgress = (updatedPhases: Phase[]) => {
    setPhases(updatedPhases);
    localStorage.setItem('tdah_app_journey_progress', JSON.stringify(updatedPhases));
  };

  const handleNodeClick = (phase: Phase) => {
    setSelectedPhase(phase);
  };

  const handleActionClick = () => {
    if (!selectedPhase) return;

    if (selectedPhase.type === 'big_five' && selectedPhase.status !== 'completed') {
        setShowBigFive(true);
        setSelectedPhase(null);
    } else if (selectedPhase.type === 'tool_unlock') {
        // Unlock Journal
        completePhase(selectedPhase.id);
        navigate('/journal');
    } else if (selectedPhase.type === 'video') {
        setCurrentVideoUrl(selectedPhase.videoUrl || '');
        setShowVideoModal(true);
        setSelectedPhase(null);
    } else if (selectedPhase.type === 'community') {
        // Mock external link
        window.open('https://discord.com', '_blank');
        completePhase(selectedPhase.id);
        setSelectedPhase(null);
    } else {
        setShowCheckInModal(true);
    }
  };

  const confirmCheckIn = () => {
    if (!selectedPhase) return;
    completePhase(selectedPhase.id);
    setShowCheckInModal(false);
    setSelectedPhase(null);
  };

  const completePhase = (phaseId: number) => {
    const updatedPhases = phases.map((phase, index) => {
      if (phase.id === phaseId) {
        return { ...phase, status: 'completed' as const };
      }
      // Unlock next phase
      if (index > 0 && phases[index - 1].id === phaseId) {
        return { ...phase, status: 'active' as const };
      }
      return phase;
    });
    
    // Unlock next logic
    const completedIndex = updatedPhases.findIndex(p => p.id === phaseId);
    if (completedIndex !== -1 && completedIndex < updatedPhases.length - 1) {
        updatedPhases[completedIndex + 1].status = 'active';
    }

    saveProgress(updatedPhases);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 5000);
  };

  // ... (Big Five Logic remains the same)
  const handleBigFiveAnswer = (score: number) => {
      setBigFiveAnswers(prev => ({ ...prev, [BIG_FIVE_QUESTIONS[bigFiveStep].id]: score }));
      if (bigFiveStep < BIG_FIVE_QUESTIONS.length - 1) {
          setBigFiveStep(prev => prev + 1);
      } else {
          setShowBigFive(false);
          completePhase(1); 
      }
  };

  // Video Completion Handler
  const handleVideoComplete = () => {
      // Find the phase associated with the current video
      const phase = phases.find(p => p.videoUrl === currentVideoUrl);
      if (phase) {
          completePhase(phase.id);
      }
      setShowVideoModal(false);
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-polar))] pb-24 relative overflow-hidden" ref={containerRef}>
      {showCelebration && <CelebrationConfetti />}

      {/* Header */}
      <div className="bg-[rgb(var(--color-snow))]/90 backdrop-blur-md pt-8 pb-6 px-4 text-center border-b-2 border-[rgb(var(--color-swan))] sticky top-0 z-30 transition-all">
        <h1 className="text-2xl font-bold text-[rgb(var(--color-eel))] tracking-tight">Mapa da Jornada</h1>
        <p className="text-[rgb(var(--color-wolf))] text-sm mt-1 font-medium">Sua evolução passo a passo.</p>
      </div>

      <div className="max-w-md mx-auto relative pt-12 px-4 flex flex-col items-center gap-20 pb-32">
         {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-10 text-[rgb(var(--color-macaw))] opacity-20 animate-pulse">
                <Star className="w-12 h-12 fill-current" />
            </div>
            <div className="absolute top-60 right-10 text-[rgb(var(--color-bee))] opacity-20 animate-bounce" style={{ animationDuration: '4s' }}>
                <Star className="w-8 h-8 fill-current" />
            </div>
            <div className="absolute bottom-40 left-12 text-[rgb(var(--color-cardinal))] opacity-20 animate-pulse" style={{ animationDuration: '3s' }}>
                <Star className="w-16 h-16 fill-current" />
            </div>
        </div>

        {phases.map((phase, index) => {
          const isLocked = phase.status === 'locked';
          const isActive = phase.status === 'active';
          const isCompleted = phase.status === 'completed';
          
          const isLeft = index % 2 === 0;
          const zigzagClass = isLeft ? '-translate-x-16' : 'translate-x-16';

          return (
            <React.Fragment key={phase.id}>
                {/* Season Break Marker */}
                {index === 5 && (
                    <div className="relative z-10 text-center py-8 animate-fade-in">
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[rgb(var(--color-swan))] to-transparent mx-auto mb-4"></div>
                        <h3 className="text-lg font-bold text-[rgb(var(--color-eel))]">Agora você tem consciência</h3>
                        <p className="text-sm text-[rgb(var(--color-macaw))] font-medium">Venha fazer a diferença</p>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[rgb(var(--color-swan))] to-transparent mx-auto mt-4"></div>
                    </div>
                )}

                <div 
                    className={`relative z-10 flex flex-col items-center ${zigzagClass}`}
                    ref={isActive ? activePhaseRef : null}
                >
                
                {/* Connector Line */}
                {index < phases.length - 1 && (
                    <svg 
                        className={`absolute top-16 w-40 h-32 -z-10 pointer-events-none ${isLeft ? 'left-1/2' : 'right-1/2 transform scale-x-[-1]'}`}
                        viewBox="0 0 100 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                    >
                        <path 
                            d="M 0 10 C 20 10, 90 20, 90 80" 
                            stroke={isCompleted ? 'rgb(var(--color-bee))' : 'rgb(var(--color-swan))'} 
                            strokeWidth="12" 
                            strokeLinecap="round" 
                            strokeDasharray="0"
                            className="opacity-50"
                        />
                    </svg>
                )}

                {/* Node Button */}
                <button
                    onClick={() => handleNodeClick(phase)}
                    className={`
                    w-24 h-24 rounded-[2rem] flex items-center justify-center relative transition-all duration-300 group border-b-8
                    ${isLocked 
                        ? 'bg-[rgb(var(--color-swan))] border-[rgb(var(--color-hare))] text-[rgb(var(--color-hare))] cursor-not-allowed' 
                        : isCompleted
                        ? 'bg-[rgb(var(--color-bee))] border-[#eab308] text-white hover:brightness-110 active:border-b-0 active:translate-y-2'
                        : `${phase.color} ${phase.borderColor} text-white hover:brightness-110 active:border-b-0 active:translate-y-2`
                    }
                    `}
                >
                    {/* Inner Ring/Icon */}
                    <div className="relative z-10 transform transition-transform duration-300 group-hover:scale-110">
                    {isCompleted ? (
                        <Check className="w-10 h-10 stroke-[4]" />
                    ) : isLocked ? (
                        <Lock className="w-8 h-8" />
                    ) : (
                        <phase.icon className="w-10 h-10" />
                    )}
                    </div>

                    {/* Active Indicator Ring */}
                    {isActive && (
                        <>
                            <div className="absolute inset-0 rounded-[2rem] border-4 border-white opacity-40 animate-ping"></div>
                            <div className="absolute -inset-6 bg-white/40 rounded-full blur-2xl -z-10 animate-pulse"></div>
                        </>
                    )}
                    
                    {/* Level Number Badge */}
                    {!isLocked && (
                        <div className="absolute -top-3 -right-3 bg-[rgb(var(--color-snow))] text-[rgb(var(--color-eel))] text-sm font-black w-8 h-8 rounded-xl flex items-center justify-center border-2 border-[rgb(var(--color-swan))] shadow-sm transform rotate-12 group-hover:rotate-0 transition-transform">
                            {phase.id}
                        </div>
                    )}
                </button>
                
                {/* Label */}
                <div className={`mt-5 px-5 py-2 rounded-2xl border-2 border-b-4 transition-all duration-300 ${
                    isActive 
                        ? 'bg-[rgb(var(--color-snow))] border-[rgb(var(--color-swan))] text-[rgb(var(--color-macaw))] font-bold scale-110' 
                        : isLocked 
                            ? 'bg-transparent border-transparent text-[rgb(var(--color-hare))]' 
                            : 'bg-[rgb(var(--color-snow))] border-[rgb(var(--color-swan))] text-[rgb(var(--color-wolf))] font-bold'
                }`}>
                    <span className="text-sm tracking-tight text-center block uppercase">
                        {phase.title}
                    </span>
                </div>
                </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Phase Detail Sheet */}
      {selectedPhase && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity animate-fade-in"
                onClick={() => setSelectedPhase(null)}
            ></div>

            <div className="bg-[rgb(var(--color-snow))] w-full max-w-md mx-auto rounded-t-[2rem] sm:rounded-[2rem] p-8 pointer-events-auto animate-slide-up shadow-2xl relative overflow-hidden border-2 border-[rgb(var(--color-swan))]">
                <div className={`absolute top-0 left-0 right-0 h-32 ${selectedPhase.status === 'locked' ? 'bg-[rgb(var(--color-swan))]' : selectedPhase.color}`}></div>
                
                <button 
                    onClick={() => setSelectedPhase(null)}
                    className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 text-white rounded-full p-2 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 flex flex-col items-center text-center -mt-4">
                    <div className={`w-24 h-24 rounded-3xl shadow-lg flex items-center justify-center mb-6 border-4 border-white ${
                        selectedPhase.status === 'locked' ? 'bg-[rgb(var(--color-swan))] text-[rgb(var(--color-hare))]' : `${selectedPhase.color} text-white`
                    }`}>
                        {selectedPhase.status === 'completed' ? <Check className="w-10 h-10" /> : <selectedPhase.icon className="w-10 h-10" />}
                    </div>

                    <h2 className="text-2xl font-bold text-[rgb(var(--color-eel))] mb-2">{selectedPhase.title}</h2>
                    <p className="text-[rgb(var(--color-wolf))] mb-8 leading-relaxed font-medium">
                        {selectedPhase.description}
                    </p>

                    {selectedPhase.status === 'locked' ? (
                        <Button disabled fullWidth className="bg-[rgb(var(--color-swan))] text-[rgb(var(--color-hare))] border-[rgb(var(--color-polar))]">
                            <Lock className="w-4 h-4 mr-2" /> Bloqueado
                        </Button>
                    ) : selectedPhase.status === 'completed' ? (
                        <Button variant="secondary" fullWidth>
                            <Check className="w-4 h-4 mr-2" /> Praticar Novamente
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleActionClick} 
                            fullWidth 
                            size="lg"
                            className="shadow-xl shadow-[rgb(var(--color-macaw))]/20"
                        >
                            {selectedPhase.type === 'big_five' ? 'INICIAR TESTE' : 
                             selectedPhase.type === 'tool_unlock' ? 'ACESSAR FERRAMENTA' :
                             selectedPhase.type === 'video' ? 'ASSISTIR CPL' :
                             selectedPhase.type === 'community' ? 'ACESSAR COMUNIDADE' :
                             'FAZER CHECK-IN'} <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Big Five Modal */}
      {showBigFive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="bg-[rgb(var(--color-snow))] rounded-[2rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-slide-up border-2 border-[rgb(var(--color-swan))]">
                <div className="bg-[rgb(var(--color-owl))] p-6 text-white text-center border-b-4 border-[rgb(88,167,0)]">
                    <h3 className="text-xl font-bold uppercase tracking-wide">Teste Big Five</h3>
                    <p className="text-white/80 text-sm font-bold">Pergunta {bigFiveStep + 1} de {BIG_FIVE_QUESTIONS.length}</p>
                </div>
                <div className="p-8">
                    <h4 className="text-xl font-bold text-[rgb(var(--color-eel))] text-center mb-8 leading-relaxed">
                        {BIG_FIVE_QUESTIONS[bigFiveStep].text}
                    </h4>
                    
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((score) => (
                            <button
                                key={score}
                                onClick={() => handleBigFiveAnswer(score)}
                                className="w-full p-4 rounded-2xl border-2 border-[rgb(var(--color-swan))] border-b-4 hover:bg-[rgb(var(--color-polar))] hover:border-[rgb(var(--color-macaw))] transition-all font-bold text-[rgb(var(--color-wolf))] hover:text-[rgb(var(--color-macaw))] flex items-center justify-between group active:border-b-0 active:translate-y-1"
                            >
                                <span className="uppercase text-sm">{score === 1 ? "Discordo Totalmente" : score === 5 ? "Concordo Totalmente" : score === 3 ? "Neutro" : score === 2 ? "Discordo" : "Concordo"}</span>
                                <div className="w-6 h-6 rounded-full border-2 border-[rgb(var(--color-swan))] group-hover:border-[rgb(var(--color-macaw))] flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-[rgb(var(--color-macaw))] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowVideoModal(false)}></div>
            <div className="bg-black w-full max-w-4xl aspect-video rounded-2xl relative z-10 shadow-2xl flex items-center justify-center overflow-hidden border-4 border-[rgb(var(--color-swan))]">
                <button 
                    onClick={() => setShowVideoModal(false)}
                    className="absolute top-4 right-4 text-white/50 hover:text-white z-20"
                >
                    <X className="w-8 h-8" />
                </button>
                
                <div className="text-center">
                    <PlayCircle className="w-20 h-20 text-white/20 mx-auto mb-4" />
                    <p className="text-white/50 font-bold uppercase">Simulação de Vídeo Player</p>
                    <Button onClick={handleVideoComplete} className="mt-8 bg-white text-black hover:bg-gray-200 border-gray-400">
                        Concluir Aula
                    </Button>
                </div>
            </div>
        </div>
      )}

      <Modal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        title="Confirmar Conclusão"
        description="Você completou esta etapa da jornada?"
        confirmText="SIM, CONCLUIR!"
        onConfirm={confirmCheckIn}
        type="info"
      />
    </div>
  );
};
