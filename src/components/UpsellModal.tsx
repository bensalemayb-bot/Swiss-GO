import React from 'react';
import { X, Zap, Briefcase, CheckCircle2 } from 'lucide-react';
import { UpsellOffer } from '../hooks/useUpsell';

interface UpsellModalProps {
    isOpen: boolean;
    offer: UpsellOffer | null;
    onAccept: () => void;
    onDecline: () => void;
    onClose: () => void;
}

export const UpsellModal: React.FC<UpsellModalProps> = ({
    isOpen,
    offer,
    onAccept,
    onDecline,
    onClose,
}) => {
    if (!isOpen || !offer) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in-up">
            {/* Background decorative elements */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl"></div>

            <div className="relative bg-luxury-charcoal border-2 border-luxury-gold/40 rounded-lg shadow-[0_0_80px_rgba(212,175,55,0.3)] max-w-xl w-full p-5 md:p-7">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
                >
                    <X size={18} />
                </button>

                {/* Badge */}
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-luxury-gold text-black px-3 py-1.5 rounded-sm flex items-center gap-1.5">
                        <Zap size={12} className="animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Offre Exclusive</span>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4 leading-tight">
                    Attendez ! Ne partez pas<br />les mains vides.
                </h2>

                {/* Offer Description */}
                <div className="bg-white/5 border border-luxury-gold/20 rounded-lg p-4 mb-5">
                    <div className="flex items-start gap-2 mb-3">
                        <Briefcase className="text-luxury-gold flex-shrink-0 mt-1" size={18} />
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Passez à la vitesse supérieure. Pour seulement <span className="text-luxury-gold font-bold">{offer.upsellPrice} de plus</span>,
                            recevez <strong className="text-white">50 offres supplémentaires</strong> (soit <strong className="text-white">100 au total</strong>).
                        </p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-2 mt-4">
                        {offer.upsellFeatures.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                                <CheckCircle2 size={14} className="text-luxury-gold flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Comparison */}
                <div className="flex justify-center items-center gap-3 mb-5">
                    <div className="text-center">
                        <div className="text-xs text-gray-500 mb-0.5">Pack Initial</div>
                        <div className="text-base text-gray-400 line-through">39,90 €</div>
                    </div>
                    <div className="text-luxury-gold text-xl">→</div>
                    <div className="text-center bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg px-4 py-2">
                        <div className="text-xs text-luxury-gold mb-0.5 font-bold">Pack Complet</div>
                        <div className="text-xl text-luxury-gold font-bold">{offer.totalPrice}</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={onAccept}
                        className="w-full py-3 bg-luxury-gold text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        OUI, JE VEUX LES 100 OFFRES
                    </button>
                    <button
                        onClick={onDecline}
                        className="w-full py-2 text-gray-400 hover:text-white text-xs transition border-b border-transparent hover:border-gray-400"
                    >
                        Non, je garde mes 50 offres uniquement
                    </button>
                </div>

                {/* Trust badges */}
                <div className="mt-5 text-center text-[10px] text-gray-500">
                    🔒 Paiement sécurisé • 📥 Téléchargement instantané • ✅ Satisfaction garantie
                </div>
            </div>
        </div>
    );
};
