import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';
import { Input } from './Input';
import { showToast } from './Toast';
import { Mail, Lock, User2, ArrowRight, Sparkles } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'reset';

export const Login: React.FC = () => {
  const { login, signup, resetPassword, isOnlineMode } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'reset') {
      if (!email) { setError('Informe seu email.'); return; }
      setIsLoading(true);
      const result = await resetPassword(email);
      setIsLoading(false);
      if (result.error) { setError(result.error); return; }
      showToast('Email de recuperação enviado! Verifique sua caixa de entrada.', 'success');
      setMode('login');
      return;
    }

    if (!email || !password) { setError('Preencha todos os campos.'); return; }
    if (mode === 'signup' && !name) { setError('Informe seu nome.'); return; }
    if (mode === 'signup' && password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return; }

    setIsLoading(true);
    try {
      let result;
      if (mode === 'signup') {
        result = await signup(email, password, name);
        if (!result.error) {
          if (isOnlineMode) {
            showToast('Conta criada! Verifique seu email para confirmar.', 'success');
            setMode('login');
            setIsLoading(false);
            return;
          }
        }
      } else {
        result = await login(email, password);
      }
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    if (isOnlineMode) return; // Demo only available offline
    setIsLoading(true);
    setEmail('aluna@teste.com');
    setPassword('senha123');
    await login('aluna@teste.com', 'senha123');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[rgb(var(--color-polar))] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[rgb(var(--color-macaw))]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[rgb(var(--color-bee))]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full bg-[rgb(var(--color-snow))] rounded-[2rem] shadow-xl overflow-hidden border-2 border-[rgb(var(--color-swan))] border-b-4 relative z-10">
        <div className="bg-[rgb(var(--color-snow))] px-8 py-10 text-center relative border-b-2 border-[rgb(var(--color-swan))]">
          <div className="mx-auto bg-[rgb(var(--color-polar))] w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-sm border-2 border-[rgb(var(--color-swan))]">
            <svg className="w-10 h-10 text-[rgb(var(--color-macaw))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-eel))] mb-2 tracking-tight uppercase">Minha Jornada TDAH</h1>
          <p className="text-[rgb(var(--color-wolf))] font-bold text-sm max-w-xs mx-auto leading-relaxed">
            {mode === 'login' && 'Acesse suas atividades e continue sua evolução.'}
            {mode === 'signup' && 'Crie sua conta e comece sua jornada.'}
            {mode === 'reset' && 'Informe seu email para recuperar a senha.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 text-[rgb(var(--color-cardinal))] px-4 py-3 rounded-2xl border-2 border-[rgb(var(--color-cardinal))]/20 text-sm font-bold animate-slide-up">
              {error}
            </div>
          )}

          {/* Name field (signup only) */}
          {mode === 'signup' && (
            <Input
              label="Seu Nome"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como quer ser chamada?"
              required
            />
          )}

          <Input
            label="E-mail"
            id="email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            placeholder="seu@email.com"
            required
          />

          {mode !== 'reset' && (
            <div className="space-y-1">
              <Input
                label="Senha"
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                required
                minLength={mode === 'signup' ? 6 : undefined}
              />
              {mode === 'login' && isOnlineMode && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setMode('reset'); setError(''); }}
                    className="text-xs font-bold text-[rgb(var(--color-macaw))] hover:text-[rgb(var(--color-humpback))] transition-colors mt-1 uppercase tracking-wide"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            size="lg"
            className="mt-2 shadow-xl shadow-[rgb(var(--color-macaw))]/20"
          >
            {mode === 'login' && 'ENTRAR NA PLATAFORMA'}
            {mode === 'signup' && 'CRIAR MINHA CONTA'}
            {mode === 'reset' && 'ENVIAR EMAIL DE RECUPERAÇÃO'}
          </Button>

          {/* Mode Toggle */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[rgb(var(--color-swan))]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[rgb(var(--color-snow))] text-[rgb(var(--color-wolf))] font-bold text-xs uppercase tracking-wider">Ou</span>
            </div>
          </div>

          {mode === 'login' && (
            <>
              {isOnlineMode ? (
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={() => { setMode('signup'); setError(''); }}
                  className="font-bold border-2 border-[rgb(var(--color-swan))] border-b-4 active:border-b-2 active:translate-y-1"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  CRIAR UMA CONTA
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  isLoading={isLoading}
                  onClick={handleDemoLogin}
                  className="font-bold border-2 border-[rgb(var(--color-swan))] border-b-4 active:border-b-2 active:translate-y-1"
                >
                  ENTRAR COMO ALUNA (DEMO)
                </Button>
              )}
            </>
          )}

          {(mode === 'signup' || mode === 'reset') && (
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => { setMode('login'); setError(''); }}
              className="font-bold border-2 border-[rgb(var(--color-swan))] border-b-4 active:border-b-2 active:translate-y-1"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              VOLTAR AO LOGIN
            </Button>
          )}

          {/* Offline Mode Badge */}
          {!isOnlineMode && (
            <p className="text-center text-xs text-[rgb(var(--color-hare))] font-bold uppercase tracking-wide mt-4">
              ⚡ Modo Offline — dados salvos no navegador
            </p>
          )}
          {/* Privacy Terms Links */}
          <div className="mt-6 pt-4 border-t-2 border-[rgb(var(--color-swan))] text-center">
            <a href="#/privacy" className="text-xs font-bold text-[rgb(var(--color-hare))] hover:text-[rgb(var(--color-wolf))] uppercase tracking-wide transition-colors">
              Termos de Privacidade e LGPD
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};