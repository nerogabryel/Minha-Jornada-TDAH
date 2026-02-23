import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, User as UserIcon, Calendar, X, Map } from 'lucide-react';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'Início', path: '/', icon: Home },
  { label: 'Jornada', path: '/journey', icon: Map },
  { label: 'Módulos', path: '/modules', icon: BookOpen },
  { label: 'Diário', path: '/journal', icon: Calendar },
  { label: 'Perfil', path: '/profile', icon: UserIcon },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  // Mobile Sidebar Overlay and Drawer
  const MobileDrawer = (
    <div className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Drawer */}
      <div className={`absolute left-0 top-0 bottom-0 w-72 bg-[rgb(var(--color-snow))] shadow-2xl transform transition-transform duration-300 ease-out border-r-2 border-[rgb(var(--color-swan))] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b-2 border-[rgb(var(--color-swan))]">
          <span className="text-xl font-bold text-[rgb(var(--color-eel))] tracking-tight uppercase">
            Menu
          </span>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-[rgb(var(--color-hare))] hover:text-[rgb(var(--color-wolf))] rounded-xl hover:bg-[rgb(var(--color-polar))]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto h-[calc(100%-80px)]">
           <SidebarContent onClose={onClose} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {MobileDrawer}
      {/* Desktop Static Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-[rgb(var(--color-snow))] border-r-2 border-[rgb(var(--color-swan))] h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto z-20">
        <div className="p-6 h-full flex flex-col">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
};

const SidebarContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return (
    <>
      <h3 className="text-xs font-bold text-[rgb(var(--color-hare))] uppercase tracking-wider mb-6 pl-3">
        Menu Principal
      </h3>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-200 group relative border-2 border-transparent ${
                isActive
                  ? 'bg-[rgb(var(--color-polar))] text-[rgb(var(--color-macaw))] border-[rgb(var(--color-macaw))]'
                  : 'text-[rgb(var(--color-wolf))] hover:bg-[rgb(var(--color-polar))] hover:border-[rgb(var(--color-swan))]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-[rgb(var(--color-macaw))]' : 'text-[rgb(var(--color-hare))] group-hover:text-[rgb(var(--color-wolf))]'}`} />
                <span className="uppercase tracking-wide text-xs">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t-2 border-[rgb(var(--color-swan))]">
        <div className="bg-[rgb(var(--color-polar))] rounded-2xl p-5 border-2 border-[rgb(var(--color-swan))]">
          <h4 className="font-bold text-[rgb(var(--color-eel))] text-sm mb-1.5 uppercase">Precisa de ajuda?</h4>
          <p className="text-xs text-[rgb(var(--color-wolf))] mb-4 leading-relaxed font-medium">Fale com o suporte técnico ou tire dúvidas sobre as atividades.</p>
          <button className="text-xs font-bold text-[rgb(var(--color-macaw))] bg-[rgb(var(--color-snow))] hover:bg-white py-3 px-4 rounded-xl w-full transition-all border-2 border-[rgb(var(--color-swan))] border-b-4 active:border-b-2 active:translate-y-1 uppercase tracking-wide">
            Contatar Suporte
          </button>
        </div>
      </div>
    </>
  );
};