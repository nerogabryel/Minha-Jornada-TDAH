import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles: rounded-2xl, uppercase, bold, tracking-wide
  const baseStyles = 'inline-flex items-center justify-center rounded-2xl font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] touch-manipulation border-b-4 active:border-b-0 active:translate-y-1';
  
  const variants = {
    // Owl (Green)
    primary: 'bg-[rgb(var(--color-owl))] text-white border-[rgb(88,167,0)] hover:brightness-110 focus:ring-[rgb(var(--color-owl))]',
    // Macaw (Blue)
    secondary: 'bg-[rgb(var(--color-macaw))] text-white border-[rgb(24,153,214)] hover:brightness-110 focus:ring-[rgb(var(--color-macaw))]',
    // Snow (White) with Swan (Gray) border
    outline: 'bg-[rgb(var(--color-snow))] text-[rgb(var(--color-macaw))] border-[rgb(var(--color-swan))] border-2 border-b-4 hover:bg-[rgb(var(--color-polar))] focus:ring-[rgb(var(--color-swan))]',
    // Ghost (Transparent) - No 3D effect, just hover
    ghost: 'bg-transparent text-[rgb(var(--color-wolf))] border-transparent border-0 active:translate-y-0 hover:bg-[rgb(var(--color-polar))] focus:ring-[rgb(var(--color-wolf))]',
    // Cardinal (Red)
    danger: 'bg-[rgb(var(--color-cardinal))] text-white border-[#b32d2d] hover:brightness-110 focus:ring-[rgb(var(--color-cardinal))]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyles} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};