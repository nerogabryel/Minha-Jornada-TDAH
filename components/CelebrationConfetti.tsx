import React, { useEffect, useState } from 'react';

const CONFETTI_COLORS = [
    'rgb(var(--color-macaw))',
    'rgb(var(--color-owl))',
    'rgb(var(--color-bee))',
    'rgb(var(--color-fox))',
    'rgb(var(--color-cardinal))',
];

interface ConfettiPiece {
    id: number;
    left: number;
    delay: number;
    color: string;
    size: number;
    rotation: number;
}

export const CelebrationConfetti: React.FC = () => {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        const newPieces: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 0.8,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            size: Math.random() * 8 + 6,
            rotation: Math.random() * 360,
        }));
        setPieces(newPieces);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {pieces.map((piece) => (
                <div
                    key={piece.id}
                    className="absolute top-0 animate-confetti"
                    style={{
                        left: `${piece.left}%`,
                        animationDelay: `${piece.delay}s`,
                        animationDuration: `${1.5 + Math.random()}s`,
                    }}
                >
                    <div
                        style={{
                            width: `${piece.size}px`,
                            height: `${piece.size * 0.6}px`,
                            backgroundColor: piece.color,
                            borderRadius: '2px',
                            transform: `rotate(${piece.rotation}deg)`,
                        }}
                    />
                </div>
            ))}
        </div>
    );
};