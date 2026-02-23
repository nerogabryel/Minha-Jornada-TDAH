import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from './Button';

export const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-lg mx-auto text-center py-20 animate-fade-in">
            <div className="mx-auto w-24 h-24 rounded-[2rem] bg-[rgb(var(--color-polar))] border-2 border-[rgb(var(--color-swan))] flex items-center justify-center mb-8">
                <MapPin className="w-12 h-12 text-[rgb(var(--color-hare))]" />
            </div>

            <h1 className="text-4xl font-bold text-[rgb(var(--color-eel))] mb-3 tracking-tight">
                Opa!
            </h1>
            <p className="text-[rgb(var(--color-wolf))] text-lg font-medium mb-8 max-w-sm mx-auto leading-relaxed">
                Parece que essa página não existe. Mas calma, sua jornada continua!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                </Button>
                <Button onClick={() => navigate('/')}>
                    <Home className="w-4 h-4 mr-2" />
                    Ir para Início
                </Button>
            </div>
        </div>
    );
};