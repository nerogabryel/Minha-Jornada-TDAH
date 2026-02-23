import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useJournal } from '../context/JournalContext';
import {
  User, Mail, LogOut, Trophy, Flame, CheckCircle2,
  BookOpen, PenTool, Medal, Bell, Moon, ChevronRight,
  ShieldAlert, Download, AlertTriangle, Edit2, Save, X, Settings, Trash2
} from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';

interface Badge {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  condition: () => boolean;
}

export const ProfileView: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const { getGlobalProgress, streak, modules, resetProgress } = useProgress();
  const { entries } = useJournal();

  const globalProgress = getGlobalProgress();
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('tdah_app_notifications') === 'true';
  });
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('tdah_app_notifications', String(notificationsEnabled));
  }, [notificationsEnabled]);

  // Badge Definitions with Unlocking Logic
  const badges: Badge[] = [
    {
      id: 'first_step',
      label: 'Primeiro Passo',
      description: 'Completou a primeira atividade.',
      icon: CheckCircle2,
      color: 'text-[rgb(var(--color-macaw))] bg-blue-100',
      condition: () => globalProgress.completed >= 1
    },
    {
      id: 'on_fire',
      label: 'Foco Total',
      description: 'Manteve uma ofensiva de 3 dias.',
      icon: Flame,
      color: 'text-[rgb(var(--color-fox))] bg-orange-100',
      condition: () => streak >= 3
    },
    {
      id: 'explorer',
      label: 'Exploradora',
      description: 'Concluiu o Módulo 1.',
      icon: BookOpen,
      color: 'text-[rgb(var(--color-humpback))] bg-indigo-100',
      condition: () => modules.find(m => m.id === 'mod-1')?.progress === 100
    },
    {
      id: 'writer',
      label: 'Escritora',
      description: 'Fez 3 registros no diário.',
      icon: PenTool,
      color: 'text-[rgb(var(--color-cardinal))] bg-pink-100',
      condition: () => entries.length >= 3
    },
    {
      id: 'master',
      label: 'Dedicação',
      description: 'Completou 50% do curso.',
      icon: Medal,
      color: 'text-[rgb(var(--color-bee))] bg-yellow-100',
      condition: () => globalProgress.percentage >= 50
    }
  ];

  const handleExportData = () => {
    const data = {
      user,
      progress: JSON.parse(localStorage.getItem('tdah_app_progress') || '[]'),
      journal: JSON.parse(localStorage.getItem('tdah_app_journal') || '[]'),
      streak: JSON.parse(localStorage.getItem('tdah_app_streak') || '{}'),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jornada-tdah-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    // Clear all related local storage
    resetProgress();
    localStorage.removeItem('tdah_app_journal');
    // Force reload to clear context states cleanly without complex resets
    window.location.reload();
  };

  const AccountDetailsModal = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
      name: user?.name || '',
      avatarUrl: user?.avatarUrl || ''
    });

    const handleSave = () => {
      if (updateUser) {
        updateUser(formData);
        setIsEditing(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowAccountModal(false)}></div>
        <div className="relative w-full max-w-md bg-[rgb(var(--color-snow))] rounded-[2rem] shadow-2xl overflow-hidden transform transition-all animate-slide-up border-2 border-[rgb(var(--color-swan))]">
          <div className="p-6 border-b-2 border-[rgb(var(--color-swan))] flex justify-between items-center bg-[rgb(var(--color-polar))]">
            <h3 className="text-lg font-bold text-[rgb(var(--color-eel))] uppercase tracking-wide">Dados da Conta</h3>
            <button onClick={() => setShowAccountModal(false)} className="text-[rgb(var(--color-hare))] hover:text-[rgb(var(--color-wolf))]">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <img
                  src={formData.avatarUrl}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-[rgb(var(--color-snow))] shadow-lg bg-[rgb(var(--color-polar))]"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + formData.name }}
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-xs font-bold uppercase">Alterar</span>
                  </div>
                )}
              </div>
            </div>

            <Input
              label="Nome Completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              readOnly={!isEditing}
              className={!isEditing ? "bg-[rgb(var(--color-polar))] text-[rgb(var(--color-wolf))] font-bold border-transparent" : "bg-white border-[rgb(var(--color-macaw))] focus:ring-[rgb(var(--color-macaw))] font-bold"}
            />

            {isEditing && (
              <Input
                label="URL do Avatar"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://exemplo.com/foto.jpg"
              />
            )}

            <Input
              label="E-mail"
              value={user?.email}
              readOnly
              className="bg-[rgb(var(--color-polar))] text-[rgb(var(--color-hare))] cursor-not-allowed font-bold border-transparent"
            />

            {!isEditing && (
              <>
                <Input
                  label="Plano Atual"
                  value={user?.subscriptionTier === 'premium' ? 'Premium Anual' : 'Gratuito'}
                  readOnly
                  className="bg-[rgb(var(--color-polar))] text-[rgb(var(--color-macaw))] font-bold border-transparent cursor-not-allowed"
                />
                {user?.bigFiveTrait && (
                  <Input
                    label="Perfil Psicológico (Traço Principal)"
                    value={user.bigFiveTrait}
                    readOnly
                    className="bg-[rgb(var(--color-polar))] text-[rgb(var(--color-fox))] font-bold border-transparent cursor-not-allowed uppercase"
                  />
                )}
              </>
            )}
          </div>
          <div className="p-6 bg-[rgb(var(--color-polar))] border-t-2 border-[rgb(var(--color-swan))] flex gap-3">
            {isEditing ? (
              <>
                <Button variant="outline" fullWidth onClick={() => setIsEditing(false)}>Cancelar</Button>
                <Button fullWidth onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" /> Salvar
                </Button>
              </>
            ) : (
              <Button fullWidth onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" /> Editar Perfil
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-10 space-y-8">
      {showAccountModal && <AccountDetailsModal />}

      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Apagar todo o progresso?"
        description="Esta ação é irreversível. Todas as suas atividades concluídas, diários e conquistas serão apagados deste dispositivo."
        confirmText="SIM, APAGAR TUDO"
        type="danger"
        onConfirm={handleResetData}
      />

      {/* Header Profile Card */}
      <div className="bg-[rgb(var(--color-snow))] rounded-[2rem] p-8 shadow-sm border-2 border-[rgb(var(--color-swan))] border-b-4 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[rgb(var(--color-macaw))]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="relative z-10 group cursor-pointer" onClick={() => setShowAccountModal(true)}>
          <div className="relative">
            <img
              src={user?.avatarUrl}
              alt={user?.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-[rgb(var(--color-snow))] shadow-lg transition-transform group-hover:scale-105 bg-[rgb(var(--color-polar))]"
            />
            <div className="absolute bottom-1 right-1 bg-[rgb(var(--color-owl))] w-6 h-6 rounded-full border-4 border-[rgb(var(--color-snow))]" title="Online"></div>
            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Edit2 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="text-center sm:text-left flex-1 relative z-10">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <h1 className="text-3xl font-bold text-[rgb(var(--color-eel))] tracking-tight">{user?.name}</h1>
            <button onClick={() => setShowAccountModal(true)} className="text-[rgb(var(--color-hare))] hover:text-[rgb(var(--color-macaw))] transition-colors p-1 rounded-full hover:bg-[rgb(var(--color-polar))]">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2 text-[rgb(var(--color-wolf))] text-sm mb-6 font-bold">
            <Mail className="w-4 h-4" />
            <span>{user?.email}</span>
          </div>
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <span className="px-4 py-1.5 bg-[rgb(var(--color-polar))] text-[rgb(var(--color-macaw))] rounded-xl text-xs font-bold uppercase tracking-wide border-2 border-[rgb(var(--color-swan))]">
              Aluna
            </span>
            <span className="px-4 py-1.5 bg-[rgb(var(--color-polar))] text-[rgb(var(--color-fox))] rounded-xl text-xs font-bold uppercase tracking-wide border-2 border-[rgb(var(--color-swan))]">
              Nível {Math.floor(globalProgress.completed / 5) + 1}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[rgb(var(--color-snow))] p-6 rounded-2xl border-2 border-[rgb(var(--color-swan))] border-b-4 text-center">
          <div className="bg-[rgb(var(--color-polar))] w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[rgb(var(--color-macaw))]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="block text-3xl font-bold text-[rgb(var(--color-eel))] tracking-tight">{globalProgress.completed}</span>
          <span className="text-xs text-[rgb(var(--color-hare))] font-bold uppercase tracking-wider mt-1 block">Atividades</span>
        </div>
        <div className="bg-[rgb(var(--color-snow))] p-6 rounded-2xl border-2 border-[rgb(var(--color-swan))] border-b-4 text-center">
          <div className="bg-[rgb(var(--color-polar))] w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[rgb(var(--color-fox))]">
            <Flame className="w-6 h-6" />
          </div>
          <span className="block text-3xl font-bold text-[rgb(var(--color-eel))] tracking-tight">{streak}</span>
          <span className="text-xs text-[rgb(var(--color-hare))] font-bold uppercase tracking-wider mt-1 block">Dias Seguidos</span>
        </div>
        <div className="bg-[rgb(var(--color-snow))] p-6 rounded-2xl border-2 border-[rgb(var(--color-swan))] border-b-4 text-center">
          <div className="bg-[rgb(var(--color-polar))] w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[rgb(var(--color-cardinal))]">
            <PenTool className="w-6 h-6" />
          </div>
          <span className="block text-3xl font-bold text-[rgb(var(--color-eel))] tracking-tight">{entries.length}</span>
          <span className="text-xs text-[rgb(var(--color-hare))] font-bold uppercase tracking-wider mt-1 block">Diários</span>
        </div>
      </div>

      {/* Achievements / Badges */}
      <div className="bg-[rgb(var(--color-snow))] rounded-[2rem] p-8 shadow-sm border-2 border-[rgb(var(--color-swan))] border-b-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[rgb(var(--color-polar))] rounded-xl border-2 border-[rgb(var(--color-swan))]">
            <Trophy className="w-6 h-6 text-[rgb(var(--color-bee))]" />
          </div>
          <h2 className="text-xl font-bold text-[rgb(var(--color-eel))] tracking-tight uppercase">Conquistas</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.map((badge) => {
            const isUnlocked = badge.condition();
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border-2 border-b-4 flex items-center gap-5 transition-all duration-300 ${isUnlocked
                    ? 'bg-[rgb(var(--color-snow))] border-[rgb(var(--color-swan))] hover:-translate-y-1'
                    : 'bg-[rgb(var(--color-polar))] border-[rgb(var(--color-swan))] opacity-50 grayscale'
                  }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-black/5 ${isUnlocked ? badge.color : 'bg-[rgb(var(--color-swan))] text-[rgb(var(--color-hare))]'
                  }`}>
                  <badge.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${isUnlocked ? 'text-[rgb(var(--color-eel))]' : 'text-[rgb(var(--color-wolf))]'}`}>
                    {badge.label}
                  </h3>
                  <p className="text-xs text-[rgb(var(--color-wolf))] leading-relaxed mt-1 font-bold">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-[rgb(var(--color-snow))] rounded-[2rem] p-6 shadow-sm border-2 border-[rgb(var(--color-swan))] border-b-4">
        <h2 className="text-lg font-bold text-[rgb(var(--color-eel))] mb-6 uppercase tracking-wide flex items-center gap-2">
          <Settings className="w-5 h-5 text-[rgb(var(--color-wolf))]" /> Configurações
        </h2>

        <div className="space-y-2">
          <button
            className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-transparent hover:bg-[rgb(var(--color-polar))] hover:border-[rgb(var(--color-swan))] transition-all"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-[rgb(var(--color-polar))] p-2 rounded-xl text-[rgb(var(--color-macaw))]">
                <Bell className="w-5 h-5" />
              </div>
              <span className="font-bold text-[rgb(var(--color-eel))]">Lembretes Diários</span>
            </div>
            <div className={`w-14 h-8 rounded-full relative transition-colors border-2 ${notificationsEnabled ? 'bg-[rgb(var(--color-owl))] border-[rgb(var(--color-owl))]' : 'bg-[rgb(var(--color-swan))] border-[rgb(var(--color-swan))]'}`}>
              <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform shadow-sm ${notificationsEnabled ? 'translate-x-6' : ''}`}></div>
            </div>
          </button>

          <button className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-transparent hover:bg-[rgb(var(--color-polar))] hover:border-[rgb(var(--color-swan))] transition-all">
            <div className="flex items-center gap-3">
              <div className="bg-[rgb(var(--color-polar))] p-2 rounded-xl text-[rgb(var(--color-fox))]">
                <Moon className="w-5 h-5" />
              </div>
              <span className="font-bold text-[rgb(var(--color-eel))]">Modo Escuro</span>
            </div>
            <span className="text-xs font-bold text-[rgb(var(--color-hare))] bg-[rgb(var(--color-polar))] px-3 py-1 rounded-xl uppercase">EM BREVE</span>
          </button>

          <button
            className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-transparent hover:bg-[rgb(var(--color-polar))] hover:border-[rgb(var(--color-swan))] transition-all"
            onClick={() => setShowAccountModal(true)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-[rgb(var(--color-polar))] p-2 rounded-xl text-[rgb(var(--color-wolf))]">
                <User className="w-5 h-5" />
              </div>
              <span className="font-bold text-[rgb(var(--color-eel))]">Dados da Conta</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[rgb(var(--color-hare))]" />
          </button>
        </div>

        {/* Data Management Section */}
        <div className="mt-8 pt-6 border-t-2 border-[rgb(var(--color-swan))]">
          <h3 className="text-xs font-bold text-[rgb(var(--color-hare))] uppercase tracking-wider mb-4">Privacidade e Dados</h3>
          <div className="space-y-3">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-between p-4 bg-[rgb(var(--color-polar))] border-2 border-[rgb(var(--color-swan))] border-b-4 rounded-2xl hover:bg-[rgb(var(--color-snow))] active:border-b-2 active:translate-y-1 transition-all text-[rgb(var(--color-macaw))] group"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5" />
                <span className="font-bold">Exportar meus dados</span>
              </div>
              <span className="text-xs font-bold opacity-60 group-hover:opacity-100">JSON</span>
            </button>

            <button
              onClick={() => setShowResetModal(true)}
              className="w-full flex items-center justify-between p-4 bg-red-50 border-2 border-red-100 border-b-4 rounded-2xl hover:bg-red-100 active:border-b-2 active:translate-y-1 transition-all text-[rgb(var(--color-cardinal))]"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5" />
                <span className="font-bold">Resetar Progresso</span>
              </div>
              <AlertTriangle className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[rgb(var(--color-hare))] mt-4 px-1 leading-relaxed font-bold text-center">
            Seus dados ficam salvos apenas neste dispositivo.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-[rgb(var(--color-swan))]">
          <Button
            variant="ghost"
            className="text-[rgb(var(--color-cardinal))] hover:text-red-700 hover:bg-red-50 w-full justify-start pl-0 font-bold uppercase"
            onClick={logout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sair da conta
          </Button>
        </div>
      </div>

      <p className="text-center text-xs text-[rgb(var(--color-hare))] pb-4 font-bold uppercase">
        Minha Jornada TDAH v1.2.0
      </p>
    </div>
  );
};
