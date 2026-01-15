
import React, { useEffect, useState } from 'react';

// Emojis de Papeterie pour le fond dynamique
const ICONS = [
  '📄', '📎', '🖊️', '📝', '📁', '📌', '✂️', '📏', '🇨🇭', '💼'
];

interface IconProps {
  id: number;
  icon: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

export const FloatingBackground: React.FC = () => {
  const [icons, setIcons] = useState<IconProps[]>([]);

  useEffect(() => {
    const newIcons = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      icon: ICONS[Math.floor(Math.random() * ICONS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 30, // Délai étalé pour un flux continu
      duration: 15 + Math.random() * 25, // Vitesse lente et majestueuse
      size: 1 + Math.random() * 2, // Tailles variables
      opacity: 0.03 + Math.random() * 0.08, // Très faible opacité pour effet filigrane
    }));
    setIcons(newIcons);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {icons.map((item) => (
        <div
          key={item.id}
          className="absolute bottom-0 select-none animate-float filter grayscale contrast-200"
          style={{
            left: `${item.left}%`,
            fontSize: `${item.size}rem`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            opacity: item.opacity,
            // Légère rotation aléatoire initiale via CSS dans l'animation float
          }}
        >
          {item.icon}
        </div>
      ))}
      
      {/* Glow ambient doré pour réchauffer le fond noir */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-luxury-gold/5 to-transparent opacity-30 pointer-events-none"></div>
    </div>
  );
};
