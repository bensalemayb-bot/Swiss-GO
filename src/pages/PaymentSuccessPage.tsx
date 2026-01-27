import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, Download, ArrowRight, Loader2 } from 'lucide-react';
import { AppRoute } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface PaymentSuccessPageProps {
    onNavigate: (page: AppRoute, params?: string) => void;
}

export const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ onNavigate }) => {
    const { user, refreshCredits } = useAuth();
    const [isProcessing, setIsProcessing] = useState(true);
    const [packId, setPackId] = useState<string | null>(null);
    const hasDownloaded = useRef(false); // Protection contre les téléchargements multiples

    // Fonction de téléchargement de l'E-book
    const downloadEbook = () => {
        const a = document.createElement('a');
        a.href = '/Ebook_SwissGO_Action.pdf';
        a.download = 'Ebook_SwissGO_Action.pdf';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Fonction de téléchargement des 50 offres
    const downloadJobOffers = () => {
        const a = document.createElement('a');
        a.href = '/Swiss-Go-50-offres.pdf';
        a.download = 'Swiss-Go-50-offres.pdf';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Fonction de téléchargement des 100 offres
    const download100JobOffers = () => {
        const a = document.createElement('a');
        a.href = '/Swiss-Go-100-offres.pdf';
        a.download = 'Swiss-Go-100-offres.pdf';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    useEffect(() => {
        // Flag pour éviter les exécutions multiples
        let hasProcessed = false;

        const processPayment = async () => {
            if (hasProcessed) return;
            hasProcessed = true;

            // Récupérer le packId depuis l'URL (hash routing)
            // L'URL est du format: /#payment-success?pack=pack-integral
            const hash = window.location.hash;
            let pack: string | null = null;

            // Extraire le paramètre pack du hash
            if (hash.includes('?')) {
                const hashParams = new URLSearchParams(hash.split('?')[1]);
                pack = hashParams.get('pack');
            }

            console.log('Pack détecté:', pack);
            setPackId(pack);

            if (!pack) {
                setIsProcessing(false);
                return;
            }

            // Ajouter les crédits selon le pack
            if (user && supabase) {
                let cvCredits = 0;
                let lmCredits = 0;

                switch (pack) {
                    case 'cv-pack':
                        cvCredits = 5;
                        break;
                    case 'lm-pack':
                        lmCredits = 5;
                        break;
                    case 'pack-duo':
                        cvCredits = 5;
                        lmCredits = 5;
                        break;
                    case 'pack-integral':
                        cvCredits = 20;
                        lmCredits = 20;
                        break;
                }

                if (cvCredits > 0 || lmCredits > 0) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('cv_credits, lm_credits')
                        .eq('id', user.id)
                        .single();

                    if (profile) {
                        await supabase
                            .from('profiles')
                            .update({
                                cv_credits: (profile.cv_credits || 0) + cvCredits,
                                lm_credits: (profile.lm_credits || 0) + lmCredits,
                            })
                            .eq('id', user.id);

                        await refreshCredits();
                    }
                }
            }

            // Téléchargements automatiques selon le pack (UNE SEULE FOIS)
            setTimeout(() => {
                // Protection supplémentaire avec ref
                if (hasDownloaded.current) {
                    setIsProcessing(false);
                    return;
                }
                hasDownloaded.current = true;

                if (pack === 'oe-pack-50') {
                    downloadJobOffers();
                } else if (pack === 'oe-pack-100-plus') {
                    download100JobOffers();
                } else if (pack === 'pack-integral') {
                    downloadEbook();
                    setTimeout(() => downloadJobOffers(), 1000);
                }
                setIsProcessing(false);
            }, 1500);
        };

        processPayment();

        // Pas de cleanup nécessaire car on utilise hasProcessed
    }, []); // Dépendances vides pour n'exécuter qu'une seule fois

    const getPackName = () => {
        switch (packId) {
            case 'cv-pack': return 'Pack 5 CVs';
            case 'lm-pack': return 'Pack 5 Lettres';
            case 'pack-duo': return 'Pack Duo';
            case 'pack-integral': return 'Pack Suisse Intégral';
            case 'oe-pack-50': return 'Pack 50 Offres';
            case 'oe-pack-100-plus': return 'Pack 100 Offres';
            default: return 'Votre pack';
        }
    };

    return (
        <div className="min-h-screen bg-luxury-black flex items-center justify-center p-4">
            <div className="max-w-lg w-full text-center">
                {isProcessing ? (
                    <div className="animate-fade-in-up">
                        <Loader2 size={64} className="text-luxury-gold animate-spin mx-auto mb-6" />
                        <h1 className="text-2xl font-bold text-white mb-4">Traitement en cours...</h1>
                        <p className="text-gray-400">Veuillez patienter pendant que nous finalisons votre achat.</p>
                    </div>
                ) : (
                    <div className="animate-fade-in-up">
                        {/* Success Icon */}
                        <div className="mb-8">
                            <div className="w-24 h-24 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                <CheckCircle2 size={48} className="text-luxury-gold" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Paiement réussi !
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Merci pour votre achat du <span className="text-luxury-gold font-bold">{getPackName()}</span>
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className="bg-white/5 border border-luxury-gold/20 rounded-lg p-6 mb-8">
                            {(packId === 'oe-pack-50' || packId === 'oe-pack-100-plus' || packId === 'pack-integral') ? (
                                <div className="flex items-center justify-center gap-3 text-luxury-gold">
                                    <Download size={20} />
                                    <span>Votre téléchargement a démarré automatiquement</span>
                                </div>
                            ) : (
                                <p className="text-gray-300">
                                    Vos crédits ont été ajoutés à votre compte. Vous pouvez maintenant générer vos documents !
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            {(packId === 'cv-pack' || packId === 'lm-pack' || packId === 'pack-duo' || packId === 'pack-integral') && (
                                <button
                                    onClick={() => onNavigate(AppRoute.GENERATE)}
                                    className="w-full py-4 bg-luxury-gold text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Créer mon CV / Lettre
                                    <ArrowRight size={18} />
                                </button>
                            )}

                            <button
                                onClick={() => onNavigate(AppRoute.HOME)}
                                className="w-full py-3 border border-white/20 text-white hover:bg-white hover:text-black transition-all rounded-lg text-sm uppercase tracking-wider"
                            >
                                Retour à l'accueil
                            </button>
                        </div>

                        {/* Download Links (backup) */}
                        {(packId === 'oe-pack-50' || packId === 'oe-pack-100-plus' || packId === 'pack-integral') && (
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <p className="text-gray-500 text-sm mb-3">Le téléchargement ne s'est pas lancé ?</p>
                                <button
                                    onClick={() => {
                                        if (packId === 'oe-pack-50') downloadJobOffers();
                                        else if (packId === 'oe-pack-100-plus') download100JobOffers();
                                        else if (packId === 'pack-integral') {
                                            downloadEbook();
                                            setTimeout(() => downloadJobOffers(), 500);
                                        }
                                    }}
                                    className="text-luxury-gold hover:underline text-sm"
                                >
                                    Cliquez ici pour télécharger manuellement
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
