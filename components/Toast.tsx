import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastData {
    id: string;
    message: string;
    type: ToastType;
}

// Simple toast event system
const listeners: Set<(toast: ToastData) => void> = new Set();

export const showToast = (message: string, type: ToastType = 'success') => {
    const toast: ToastData = {
        id: crypto.randomUUID(),
        message,
        type,
    };
    listeners.forEach((fn) => fn(toast));
};

export const ToastContainer: React.FC = () => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    useEffect(() => {
        const handler = (toast: ToastData) => {
            setToasts((prev) => [...prev, toast]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }, 4000);
        };
        listeners.add(handler);
        return () => { listeners.delete(handler); };
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const icons: Record<ToastType, React.ElementType> = {
        success: CheckCircle2,
        error: AlertCircle,
        info: Info,
    };

    const colors: Record<ToastType, string> = {
        success: 'border-[rgb(var(--color-owl))] bg-green-50 text-[rgb(var(--color-owl))]',
        error: 'border-[rgb(var(--color-cardinal))] bg-red-50 text-[rgb(var(--color-cardinal))]',
        info: 'border-[rgb(var(--color-macaw))] bg-blue-50 text-[rgb(var(--color-macaw))]',
    };

    return (
        <div className="fixed top-4 right-4 z-[110] space-y-3 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => {
                const Icon = icons[toast.type];
                return (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl border-2 border-b-4 shadow-lg animate-slide-up ${colors[toast.type]} bg-[rgb(var(--color-snow))]`}
                    >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-bold text-[rgb(var(--color-eel))] flex-1">{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-[rgb(var(--color-hare))] hover:text-[rgb(var(--color-wolf))] p-1 rounded-lg transition-colors flex-shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};