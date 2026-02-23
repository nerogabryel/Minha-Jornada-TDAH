import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { PlayCircle, CheckCircle2, Lock, BookOpen, ArrowRight, Sun, Moon, Sunrise, Flame } from 'lucide-react';
import { Button } from './Button';
import { EmptyState } from './EmptyState';

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const { modules, getGlobalProgress, getNextActivity, streak } = useProgress();
  const navigate = useNavigate();
  
  const globalProgress = getGlobalProgress();
  const nextStep = getNextActivity();

  // If no next activity (all done) or locked, fallback to first module or last done
  const currentModule = nextStep ? nextStep.module : modules[0];
  const nextActivity = nextStep ? nextStep.activity : null;
  const isStarted = globalProgress.completed > 0 || (modules[0].lessons[0].activities[0].content?.userAnswers?.some((a:string) => a.length > 0));

  const handleContinue = () => {
      if (nextActivity) {
          navigate(`/activity/${nextActivity.id}`);
      } else {
          navigate('/modules');
      }
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Bom dia', icon: Sunrise };
    if (hour < 18) return { text: 'Boa tarde', icon: Sun };
    return { text: 'Boa noite', icon: Moon };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      {/* Welcome Section */}
      <section className="bg-[rgb(var(--color-snow))] rounded-[2rem] p-6 shadow-sm border-2 border-[rgb(var(--color-swan))] border-b-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:translate-y-1 hover:border-b-2 active:border-b-0 active:translate-y-2">
        <div className="flex items-start gap-4">
            <div className="hidden sm:flex p-3 bg-[rgb(var(--color-polar))] rounded-2xl text-[rgb(var(--color-macaw))] border-2 border-[rgb(var(--color-swan))]">
                <greeting.icon className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[rgb(var(--color-eel))] mb-2 flex items-center gap-2 tracking-tight">
                {greeting.text}, {user?.name.split(' ')[0]}!
                </h1>
                <p className="text-[rgb(var(--color-wolf))] font-medium">
                Você completou <span className="font-bold text-[rgb(var(--color-macaw))]">{globalProgress.completed}</span> de <span className="font-bold text-[rgb(var(--color-eel))]">{globalProgress.total}</span> atividades.
                </p>
            </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
            {streak > 0 && (
                <div className="flex-1 md:flex-none bg-[rgb(var(--color-polar))] px-4 py-2 rounded-2xl border-2 border-[rgb(var(--color-swan))] flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-xl">
                        <Flame className="w-5 h-5 text-[rgb(var(--color-fox))] fill-[rgb(var(--color-fox))] animate-pulse" />
                    </div>
                    <div>
                        <span className="block text-xs text-[rgb(var(--color-fox))] uppercase tracking-wider font-bold">Ofensiva</span>
                        <span className="text-[rgb(var(--color-eel))] font-black text-lg">{streak} dias</span>
                    </div>
                </div>
            )}
            
            <div className="hidden md:block text-right bg-[rgb(var(--color-polar))] px-4 py-2 rounded-2xl border-2 border-[rgb(var(--color-swan))]">
                <span className="block text-xs text-[rgb(var(--color-wolf))] uppercase tracking-wider font-bold">Progresso Geral</span>
                <span className="text-[rgb(var(--color-macaw))] font-black text-xl">{globalProgress.percentage}%</span>
            </div>
        </div>
      </section>

      {/* Current Activity Card or Empty State */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[rgb(var(--color-eel))] flex items-center gap-2 uppercase tracking-wide">
            <span className="w-3 h-3 rounded-full bg-[rgb(var(--color-macaw))] animate-pulse border-2 border-white shadow-sm"></span>
            Em andamento
          </h2>
        </div>
        
        {!isStarted && globalProgress.completed === 0 ? (
            <div className="space-y-6">
                <EmptyState />
                <div className="flex justify-center">
                    <Button onClick={() => navigate('/modules')} className="px-8 shadow-xl shadow-[rgb(var(--color-macaw))]/20" size="lg">
                        <PlayCircle className="mr-2 h-5 w-5" />
                        Começar Módulo 1
                    </Button>
                </div>
            </div>
        ) : (
            <div className="group relative bg-[rgb(var(--color-snow))] rounded-[2rem] p-6 md:p-8 border-2 border-[rgb(var(--color-swan))] border-b-4 overflow-hidden transition-all duration-300 hover:translate-y-1 hover:border-b-2 active:border-b-0 active:translate-y-2">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[rgb(var(--color-macaw))]/10 blur-3xl group-hover:bg-[rgb(var(--color-macaw))]/20 transition-colors"></div>
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-[rgb(var(--color-fox))]/10 blur-2xl"></div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-[rgb(var(--color-polar))] text-[rgb(var(--color-macaw))] border-2 border-[rgb(var(--color-swan))] shadow-sm uppercase tracking-wide">
                        Módulo Atual
                        </span>
                        {nextActivity ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-[rgb(var(--color-bee))]/10 text-[rgb(var(--color-bee))] border-2 border-[rgb(var(--color-bee))]/20 uppercase tracking-wide">
                            Próxima atividade
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-[rgb(var(--color-owl))]/10 text-[rgb(var(--color-owl))] border-2 border-[rgb(var(--color-owl))]/20 uppercase tracking-wide">
                            Tudo concluído!
                            </span>
                        )}
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-[rgb(var(--color-eel))]">{currentModule.title}</h3>
                    <p className="text-[rgb(var(--color-wolf))] mb-8 max-w-xl text-base md:text-lg leading-relaxed font-medium">
                    {currentModule.description}
                    </p>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-t-2 border-[rgb(var(--color-swan))] pt-8">
                    <div className="flex-1 max-w-md">
                        <div className="flex items-center justify-between mb-2 text-sm">
                            <span className="font-bold text-[rgb(var(--color-wolf))] uppercase tracking-wide text-xs">Progresso do módulo</span>
                            <span className="font-bold text-[rgb(var(--color-macaw))]">{currentModule.progress}%</span>
                        </div>
                        <div className="w-full bg-[rgb(var(--color-swan))] rounded-full h-4 overflow-hidden border-2 border-transparent">
                            <div 
                            className="bg-[rgb(var(--color-macaw))] h-full rounded-full transition-all duration-1000 ease-out relative" 
                            style={{ width: `${currentModule.progress}%` }}
                            >
                                <div className="absolute top-1 right-2 w-full h-1 bg-white/30 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <Button 
                        onClick={handleContinue}
                        className="shadow-xl shadow-[rgb(var(--color-macaw))]/20 px-8 py-4 h-auto text-base whitespace-nowrap"
                    >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    {nextActivity ? 'CONTINUAR JORNADA' : 'VER MÓDULOS'}
                    </Button>
                </div>
            </div>
            </div>
        )}
      </section>

      {/* Recent Progress / Modules Overview */}
      <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[rgb(var(--color-eel))] uppercase tracking-wide">Mapa da Jornada</h2>
            <button 
                onClick={() => navigate('/modules')}
                className="text-sm font-bold text-[rgb(var(--color-macaw))] hover:text-[rgb(var(--color-humpback))] flex items-center min-h-[44px] px-4 -mr-2 rounded-xl hover:bg-[rgb(var(--color-polar))] transition-colors uppercase tracking-wide"
            >
                VER TODOS <ArrowRight className="w-4 h-4 ml-1" />
            </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {modules.map((module) => (
            <div 
              key={module.id} 
              onClick={() => !module.locked && navigate('/modules')}
              onKeyDown={(e) => {
                if (!module.locked && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  navigate('/modules');
                }
              }}
              role="button"
              tabIndex={module.locked ? -1 : 0}
              className={`p-5 rounded-[2rem] border-2 border-b-4 transition-all duration-200 ${
                module.locked 
                  ? 'bg-[rgb(var(--color-polar))] border-[rgb(var(--color-swan))] opacity-60 cursor-not-allowed' 
                  : 'bg-[rgb(var(--color-snow))] border-[rgb(var(--color-swan))] hover:border-[rgb(var(--color-macaw))] hover:translate-y-1 hover:border-b-2 active:border-b-0 active:translate-y-2 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-macaw))] focus:ring-offset-2'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl transition-colors border-2 ${
                    module.locked 
                        ? 'bg-[rgb(var(--color-swan))] text-[rgb(var(--color-hare))] border-transparent' 
                        : 'bg-[rgb(var(--color-polar))] text-[rgb(var(--color-macaw))] border-[rgb(var(--color-swan))] group-hover:bg-[rgb(var(--color-macaw))] group-hover:text-white group-hover:border-[rgb(var(--color-macaw))]'
                }`}>
                   {module.locked ? <Lock className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                </div>
                {module.progress === 100 && (
                  <div className="bg-[rgb(var(--color-owl))]/20 p-1.5 rounded-full border-2 border-[rgb(var(--color-owl))]">
                    <CheckCircle2 className="h-5 w-5 text-[rgb(var(--color-owl))]" />
                  </div>
                )}
              </div>
              
              <h3 className={`font-bold text-lg mb-2 ${module.locked ? 'text-[rgb(var(--color-wolf))]' : 'text-[rgb(var(--color-eel))]'}`}>
                  {module.title}
              </h3>
              <p className="text-sm text-[rgb(var(--color-wolf))] mb-5 line-clamp-2 leading-relaxed font-medium">{module.description}</p>
              
              {!module.locked && (
                <div className="w-full bg-[rgb(var(--color-swan))] rounded-full h-3 overflow-hidden border-2 border-transparent">
                  <div 
                    className="bg-[rgb(var(--color-macaw))] h-full rounded-full transition-all duration-500 relative" 
                    style={{ width: `${module.progress}%` }}
                  >
                      <div className="absolute top-0.5 right-0 w-full h-0.5 bg-white/30 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};