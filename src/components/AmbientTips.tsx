import React, { useEffect, useState } from 'react';

const TIPS = [
    "Le SMIC suisse est ~2,5x plus élevé qu'en France.",
    "9 CV sur 10 sont rejetés par ignorance des codes suisses.",
    "La ponctualité en Suisse est la première forme de politesse.",
    "Permis G : le sésame indispensable pour les frontaliers.",
    "42 heures par semaine : l'efficacité helvétique avant tout.",
    "Photo professionnelle : obligatoire pour un dossier d'élite.",
    "Le 2ème pilier (LPP) : votre futur capital retraite.",
    "Zéro lyrisme : restez factuel et précis dans vos écrits.",
    "La méthode STAR : votre arme secrète en entretien.",
    "Ancrage local = Preuve de fiabilité immédiate.",
    "Assurance LAMal : comprenez enfin vos droits d'option.",
    "L'adresse suisse : comment désamorcer le risque logistique.",
    "Secteur Santé : une pénurie de talents sans précédent.",
    "Discrétion et hiérarchie : les clés de l'intégration.",
    "SwissGo : l'architecte de votre succès helvétique."
];

interface Bubble {
    id: number;
    text: string;
    x: number; // % left
    y: number; // % top
    duration: number; // seconds
    delay: number; // seconds
    animationClass: string;
}

export const AmbientTips: React.FC = () => {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [nextId, setNextId] = useState(0);

    useEffect(() => {
        const addBubble = () => {
            // Position aléatoire initiale
            let x = Math.random() * 80 + 10; // 10% à 90%

            const side = Math.random() > 0.5 ? 'left' : 'right';
            if (Math.random() > 0.3) {
                x = side === 'left' ? Math.random() * 25 : 75 + Math.random() * 20;
            }

            const y = Math.random() * 80 + 10; // 10% à 90% Vertical

            // Direction aléatoire
            const animations = ['animate-float-ur', 'animate-float-ul', 'animate-float-dr', 'animate-float-dl'];
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];

            const newBubble: Bubble = {
                id: Date.now(),
                text: TIPS[Math.floor(Math.random() * TIPS.length)],
                x,
                y,
                duration: 15 + Math.random() * 10, // 15-25s de vie
                delay: 0,
                animationClass: randomAnimation
            };

            setBubbles(prev => [...prev.slice(-4), newBubble]); // Max 5 bulles en même temps
        };

        // Première bulle rapide
        setTimeout(addBubble, 1000);

        const interval = setInterval(addBubble, 4000); // Toutes les 4s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            {bubbles.map(bubble => (
                <div
                    key={bubble.id}
                    className={`absolute max-w-[200px] md:max-w-[280px] ${bubble.animationClass}`}
                    style={{
                        left: `${bubble.x}%`,
                        top: `${bubble.y}%`,
                        animationDuration: `${bubble.duration}s`,
                    }}
                >
                    <div className="bg-luxury-black/40 backdrop-blur-[2px] border border-luxury-gold/30 text-gray-200 text-xs md:text-sm font-light px-4 py-2 rounded-sm shadow-xl tracking-wide animate-fade-in-out">
                        {bubble.text}
                    </div>
                </div>
            ))}
        </div>
    );
};
