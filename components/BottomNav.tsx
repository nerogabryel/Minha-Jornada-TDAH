import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, User, Calendar, Map } from 'lucide-react';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'Início', path: '/', icon: Home },
  { label: 'Jornada', path: '/journey', icon: Map },
  { label: 'Módulos', path: '/modules', icon: BookOpen },
  { label: 'Diário', path: '/journal', icon: Calendar },
  { label: 'Perfil', path: '/profile', icon: User },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[rgb(var(--color-snow))] border-t-2 border-[rgb(var(--color-swan))] pb-safe z-30">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive 
                  ? 'text-[rgb(var(--color-macaw))] font-bold' 
                  : 'text-[rgb(var(--color-hare))] hover:text-[rgb(var(--color-wolf))] font-medium'
              }`
            }
          >
            <item.icon className="h-6 w-6" />
            <span className="text-[10px] uppercase tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};