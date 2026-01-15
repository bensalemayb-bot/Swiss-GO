import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, Lock, Loader2 } from 'lucide-react';
import { PricingPack } from '../types';
import { createStripeCheckout } from '../lib/stripeService';

interface PaymentModalProps {
    isOpen: boolean;
    pack: PricingPack | null;
    onPaymentSuccess: () => void;
    onAddCredits: (cvCredits: number, lmCredits: number) => Promise<boolean>;
    onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    pack,
    onPaymentSuccess,
    onAddCredits,
    onClose,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !pack) return null;

    const handlePayment = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Rediriger vers Stripe Checkout
            await createStripeCheckout({
                packId: pack.id,
                packName: pack.name,
                packPrice: pack.price,
            });
            // La redirection est gérée dans createStripeCheckout
        } catch (err) {
            console.error('Erreur de paiement:', err);
            setError('Une erreur est survenue. Veuillez réessayer.');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in-up">
            {/* Background decorative elements */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl"></div>

            <div className="relative bg-luxury-charcoal border-2 border-luxury-gold/40 rounded-lg shadow-[0_0_80px_rgba(212,175,55,0.3)] max-w-lg w-full p-6 md:p-8">

                {/* Close button */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white transition disabled:opacity-50"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="flex items-center justify-center mb-5">
                    <div className="bg-luxury-gold text-black px-3 py-1.5 rounded-sm flex items-center gap-1.5">
                        <CreditCard size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">Paiement Sécurisé</span>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-5 leading-tight">
                    Finaliser votre achat
                </h2>

                {/* Pack Details */}
                <div className="bg-white/5 border border-luxury-gold/20 rounded-lg p-5 mb-5">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-white mb-1">{pack.name}</h3>
                        <p className="text-sm text-gray-400">{pack.description}</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                        {pack.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                                <CheckCircle2 size={14} className="text-luxury-gold flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Price */}
                    <div className="border-t border-white/10 pt-4 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Total à payer :</span>
                            <span className="text-3xl font-bold text-luxury-gold">{pack.price}</span>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Payment Button */}
                <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full py-3 bg-luxury-gold text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Redirection vers Stripe...
                        </>
                    ) : (
                        <>
                            <Lock size={16} />
                            Payer maintenant
                        </>
                    )}
                </button>

                {/* Security Badge */}
                <div className="mt-4 text-center text-xs text-gray-500">
                    🔒 Paiement sécurisé par Stripe • Accès instantané
                </div>

                {/* Stripe Badge */}
                <div className="mt-3 flex justify-center">
                    <img
                        src="https://stripe.com/img/v3/home/twitter.png"
                        alt="Powered by Stripe"
                        className="h-6 opacity-50"
                    />
                </div>
            </div>
        </div>
    );
};
