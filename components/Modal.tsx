import React, { useEffect, useRef } from 'react';
import { X, AlertTriangle, Info } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    type?: 'info' | 'danger';
    children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    type = 'info',
    children,
}) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isDanger = type === 'danger';
    const IconComponent = isDanger ? AlertTriangle : Info;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md bg-[rgb(var(--color-snow))] rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up border-2 border-[rgb(var(--color-swan))]">
                {/* Header */}
                <div className="p-6 border-b-2 border-[rgb(var(--color-swan))] bg-[rgb(var(--color-polar))] flex justify-between items-start">
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl ${isDanger ? 'bg-red-100 text-[rgb(var(--color-cardinal))]' : 'bg-blue-100 text-[rgb(var(--color-macaw))]'}`}>
                            <IconComponent className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-[rgb(var(--color-eel))] uppercase tracking-wide pt-1">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[rgb(var(--color-hare))] hover:text-[rgb(var(--color-wolf))] p-1 rounded-lg hover:bg-[rgb(var(--color-snow))] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {description && (
                        <p className="text-[rgb(var(--color-wolf))] leading-relaxed font-medium mb-6">{description}</p>
                    )}
                    {children}
                </div>

                {/* Footer */}
                {onConfirm && (
                    <div className="p-6 bg-[rgb(var(--color-polar))] border-t-2 border-[rgb(var(--color-swan))] flex gap-3">
                        <Button variant="outline" fullWidth onClick={onClose}>
                            {cancelText}
                        </Button>
                        <Button
                            variant={isDanger ? 'danger' : 'primary'}
                            fullWidth
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};