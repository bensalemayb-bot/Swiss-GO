import React from 'react';
import { Coins, Plus } from 'lucide-react';

interface PackHeaderProps {
  packName?: string;
  cvCredits: number;
  lmCredits: number;
  onOpenBuyModal: () => void;
}

export const PackHeader: React.FC<PackHeaderProps> = ({ packName, cvCredits, lmCredits, onOpenBuyModal }) => (
  <div className="mb-6 border-b border-white/5 pb-4">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center">
          <span className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse mr-2"></span>
          Création
        </h2>
        <p className="text-xs text-gray-500 font-light mt-1">{packName || 'Pack'}</p>
      </div>
      <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-sm border border-luxury-gold/30">
        <Coins size={12} className="text-luxury-gold" />
        <span className={`text-xs font-bold ${cvCredits === 0 && lmCredits === 0 ? 'text-gray-400' : 'text-white'}`}>
          CV : {cvCredits} | LM : {lmCredits}
        </span>
        <button onClick={onOpenBuyModal} className="ml-2 text-luxury-gold hover:text-white transition" title="Acheter un pack">
          <Plus size={12} />
        </button>
      </div>
    </div>
  </div>
);
