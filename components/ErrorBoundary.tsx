import React, { Component, ErrorInfo } from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-polar))] p-4">
                    <div className="max-w-md w-full bg-[rgb(var(--color-snow))] rounded-[2rem] p-8 border-2 border-[rgb(var(--color-swan))] border-b-4 text-center">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 border-2 border-[rgb(var(--color-cardinal))]/20 flex items-center justify-center mb-6">
                            <span className="text-3xl">😔</span>
                        </div>
                        <h2 className="text-xl font-bold text-[rgb(var(--color-eel))] mb-3">
                            Algo deu errado
                        </h2>
                        <p className="text-sm text-[rgb(var(--color-wolf))] font-medium mb-6 leading-relaxed">
                            Ocorreu um erro inesperado. Tente recarregar a página.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl font-bold uppercase tracking-wider bg-[rgb(var(--color-macaw))] text-white border-b-4 border-[rgb(24,153,214)] hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all text-sm"
                        >
                            Recarregar Página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
