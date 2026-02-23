import React from 'react';
import { LogOut, Menu, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { Button } from './Button';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { streak } = useProgress();

  return (
    <header className="bg-[rgb(var(--color-snow))]/90 backdrop-blur-md border-b-2 border-[rgb(var(--color-swan))] sticky top-0 z-30 h-16 transition-all duration-200">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-[rgb(var(--color-wolf))] hover:bg-[rgb(var(--color-polar))] rounded-xl transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-[rgb(var(--color-polar))] p-2 rounded-xl border-2 border-[rgb(var(--color-swan))] group-hover:border-[rgb(var(--color-macaw))] transition-colors">
                <svg className="w-5 h-5 text-[rgb(var(--color-macaw))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            </div>
            <span className="text-lg font-bold text-[rgb(var(--color-eel))] tracking-tight hidden sm:block group-hover:text-[rgb(var(--color-macaw))] transition-colors uppercase">
              Jornada TDAH
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Streak Counter */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 transition-all ${
             streak > 0 
               ? 'bg-orange-50 border-[rgb(var(--color-fox))] text-[rgb(var(--color-fox))]' 
               : 'bg-[rgb(var(--color-polar))] border-[rgb(var(--color-swan))] text-[rgb(var(--color-hare))] grayscale opacity-60'
          }`} title={`${streak} dias seguidos`}>
             <Flame className={`w-4 h-4 ${streak > 0 ? 'fill-[rgb(var(--color-fox))] text-[rgb(var(--color-fox))] animate-pulse' : ''}`} />
             <span className="font-bold text-sm">{streak}</span>
          </div>

          <div className="h-8 w-0.5 bg-[rgb(var(--color-swan))]"></div>

          <Link to="/profile" className="flex items-center gap-3 hover:bg-[rgb(var(--color-polar))] p-1.5 -mr-1.5 rounded-xl transition-all group">
            <span className="text-sm font-bold text-[rgb(var(--color-eel))] hidden md:block group-hover:text-[rgb(var(--color-macaw))] transition-colors uppercase">
              {user?.name}
            </span>
            <img
              src={user?.avatarUrl}
              alt={user?.name}
              className="h-9 w-9 rounded-full object-cover border-2 border-[rgb(var(--color-swan))] shadow-sm group-hover:border-[rgb(var(--color-macaw))] transition-all"
            />
          </Link>
          <div className="h-8 w-0.5 bg-[rgb(var(--color-swan))] hidden sm:block"></div>
          <Button variant="ghost" className="p-2 text-[rgb(var(--color-hare))] hover:text-[rgb(var(--color-cardinal))] hover:bg-red-50 rounded-xl transition-colors" onClick={logout} title="Sair">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};