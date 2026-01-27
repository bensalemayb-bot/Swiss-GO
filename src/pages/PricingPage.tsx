import React, { useState } from 'react';
import { documentPacks, coachingPacks } from '../data/packs';
import { AppRoute, PricingPack } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { UpsellModal } from '../components/UpsellModal';
import { PaymentModal } from '../components/PaymentModal';
import { useUpsell } from '../hooks/useUpsell';
import { useLanguage } from '../contexts/LanguageContext';

interface PricingPageProps {
   onNavigate: (page: AppRoute, params?: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
   const { user, cvCredits, lmCredits, refreshCredits } = useAuth();
   const { t } = useLanguage();
   const { isUpsellOpen, currentOffer, showUpsell, acceptUpsell, declineUpsell, closeUpsell } = useUpsell();
   const [selectedPack, setSelectedPack] = useState<PricingPack | null>(null);
   const [showPaymentModal, setShowPaymentModal] = useState(false);

   // Fonction de téléchargement de l'E-book SwissGO
   const downloadEbook = () => {
      const a = document.createElement('a');
      a.href = '/E-book-SwissGO.pdf';
      a.download = 'E-book-SwissGO.pdf';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
   };

   // Fonction de téléchargement de la liste de 50 offres d'emploi
   const downloadJobOffers = () => {
      const link = document.createElement('a');
      link.href = '/Swiss-Go-50-offres.pdf';
      link.download = 'Swiss-Go-50-offres.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   // Fonction de téléchargement de la liste de 100 offres d'emploi (upsell)
   const download100JobOffers = () => {
      const link = document.createElement('a');
      link.href = '/Swiss-Go-100-offres.pdf';
      link.download = 'Swiss-Go-100-offres.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   // Fonction pour ajouter des crédits
   const updateCredits = async (deltaCv: number, deltaLm: number): Promise<boolean> => {
      if (!user) {
         alert("Veuillez vous connecter pour acheter des crédits.");
         return false;
      }
      if (!supabase) {
         alert("Service d'authentification non configuré.");
         return false;
      }

      const nextCvCredits = cvCredits + deltaCv;
      const nextLmCredits = lmCredits + deltaLm;
      const { error } = await supabase
         .from('profiles')
         .update({ cv_credits: nextCvCredits, lm_credits: nextLmCredits })
         .eq('id', user.id);

      if (error) {
         alert(error.message || "Erreur lors de la mise à jour des crédits.");
         return false;
      }

      await refreshCredits();
      return true;
   };

   const handleOrder = (packId: string) => {
      const pack = [...documentPacks, ...coachingPacks].find(p => p.id === packId);
      if (!pack) return;

      // Special handling for job offer packs (they don't use credits, always show payment)
      if (packId === 'oe-pack-50') {
         setSelectedPack(pack);
         showUpsell({
            fromProductId: 'oe-pack-50',
            toProductId: 'oe-pack-100-plus',
            upsellPrice: '30€',
            totalPrice: '69,90 €',
            upsellFeatures: [
               '50 offres supplémentaires (100 au total)',
               'Offres mises à jour quotidiennement',
               'Accès immédiat'
            ]
         });
         return;
      }

      // For document packs (CV, LM, Duo, Integral), check if user has credits
      if (user && (cvCredits > 0 || lmCredits > 0)) {
         // User has credits, redirect to generation page
         onNavigate(AppRoute.GENERATE, `?pack=${packId}`);
      } else {
         // No credits, show payment modal
         setSelectedPack(pack);
         setShowPaymentModal(true);
      }
   };

   const handleUpsellAccept = () => {
      acceptUpsell();
      // Créer un pack virtuel pour l'upsell
      const upsellPack: PricingPack = {
         id: 'oe-pack-100-plus',
         name: 'Pack 100 Offres',
         price: '69,90 €',
         description: 'Pack upsell avec 100 offres d\'emploi',
         features: [
            '100 Offres d\'emploi cachées',
            'Offres mises à jour quotidiennement',
            'Accès immédiat'
         ]
      };
      setSelectedPack(upsellPack);
      setShowPaymentModal(true);
   };

   const handleUpsellDecline = () => {
      declineUpsell();
      // Afficher le modal de paiement pour le pack initial (50 offres)
      setShowPaymentModal(true);
   };

   const handlePaymentSuccess = () => {
      // On capture l'id du pack avant de fermer quoi que ce soit
      const packId = selectedPack?.id;
      const packName = selectedPack?.name;

      setShowPaymentModal(false);

      if (packId === 'oe-pack-50') {
         // Déclencher le téléchargement
         downloadJobOffers();
         alert(`Merci ! Votre achat du "${packName}" est validé. Le téléchargement a commencé.`);
         // On ne redirige pas immédiatement pour laisser le temps au téléchargement
         setTimeout(() => {
            onNavigate(AppRoute.HOME);
         }, 1500);
      } else if (packId === 'oe-pack-100-plus') {
         // Pour le pack 100 offres + agences : télécharger le PDF 100 offres
         download100JobOffers();
         alert(`Merci ! Votre achat du "${packName}" est validé. Le téléchargement a commencé.`);
         setTimeout(() => {
            onNavigate(AppRoute.HOME);
         }, 1500);
      } else if (packId === 'pack-integral') {
         // Pour le pack intégral : télécharger l'e-book ET la liste de 50 offres
         downloadEbook();
         // Petit délai entre les deux téléchargements pour éviter le blocage navigateur
         setTimeout(() => {
            downloadJobOffers();
         }, 800);
         alert('Merci pour votre achat du Pack Intégral ! Votre E-book et vos 50 offres se téléchargent.');
         onNavigate(AppRoute.GENERATE, `?pack=${packId}`);
      } else {
         // Pour les autres packs
         onNavigate(AppRoute.GENERATE, `?pack=${packId}`);
      }
   };

   return (
      <div className="animate-fade-in-up bg-luxury-black min-h-screen text-gray-200 font-sans">

         {/* Header */}
         <section className="py-24 px-4 text-center border-b border-white/5 bg-luxury-black relative">
            <h1 className="text-5xl md:text-6xl font-sans font-bold text-white mb-6 tracking-tight">Nos Offres</h1>
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em]">
               Investissez en vous-même
            </p>
         </section>

         {/* LISTE DOCUMENTS (CLEAN GRID) */}
         <section className="py-24 max-w-6xl mx-auto px-6">
            <div className="flex items-center mb-16">
               <h2 className="text-3xl font-bold text-white mr-6">Les Basiques</h2>
               <div className="h-px bg-white/10 flex-grow"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {documentPacks.map((pack) => (
                  <div key={pack.id} className="group bg-white/5 border border-white/5 hover:border-luxury-gold/50 p-10 rounded-sm transition duration-500 hover:bg-white/10">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <div className="flex items-center">
                              <h3 className="text-xl font-bold text-white">{pack.name}</h3>
                              {pack.recommended && <span className="ml-3 bg-luxury-gold text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">Top</span>}
                           </div>
                           <p className="text-sm text-gray-400 mt-2 font-light">{pack.description}</p>
                        </div>
                        <span className="text-2xl font-bold text-luxury-gold font-serif">{pack.price}</span>
                     </div>

                     <div className="flex flex-wrap gap-3 mb-8">
                        {pack.features.map((f, i) => (
                           <span key={i} className="text-[10px] uppercase tracking-wider text-gray-300 bg-black/40 border border-white/10 px-3 py-1.5 rounded-sm">{f}</span>
                        ))}
                     </div>

                     <button
                        onClick={() => handleOrder(pack.id)}
                        className="w-full py-4 text-xs font-bold text-white border border-white/20 hover:bg-white hover:text-black hover:border-white transition-all uppercase tracking-[0.2em] rounded-sm"
                     >
                        Choisir
                     </button>

                     {/* Show Generate button if user has credits and it's not a job offer pack */}
                     {user && (cvCredits > 0 || lmCredits > 0) && !pack.id.startsWith('oe-') && (
                        <button
                           onClick={() => onNavigate(AppRoute.GENERATE, `?pack=${pack.id}`)}
                           className="w-full py-4 mt-2 text-xs font-bold uppercase tracking-[0.2em] bg-white/5 border border-luxury-gold/50 text-luxury-gold hover:bg-luxury-gold hover:text-black rounded-sm transition-all duration-300"
                        >
                           {t('btn_generate_now')}
                        </button>
                     )}
                  </div>
               ))}
            </div>
         </section>

         {/* PACK INTEGRAL HIGHLIGHT */}
         <section className="py-24 bg-luxury-charcoal border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
               <div className="text-center mb-20">
                  <h2 className="text-4xl font-sans font-bold text-white mb-4">Pack Intégral</h2>
                  <p className="text-gray-400 font-light max-w-xl mx-auto">La trousse à outils complète pour réussir son expatriation.</p>
               </div>

               <div className="flex justify-center">
                  {coachingPacks.map((pack) => (
                     <div key={pack.id} className="w-full max-w-2xl p-12 border border-luxury-gold bg-luxury-black relative shadow-[0_0_60px_rgba(212,175,55,0.1)] rounded-sm flex flex-col md:flex-row items-center md:items-start gap-10">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-luxury-gold text-black text-xs font-bold uppercase tracking-wider px-4 py-1 shadow-lg">
                           Best Seller
                        </div>

                        <div className="flex-1 text-center md:text-left">
                           <h3 className="text-3xl font-bold text-white mb-2">{pack.name}</h3>
                           <p className="text-sm text-gray-400 font-light mb-6">{pack.description}</p>
                           <div className="text-5xl text-luxury-gold font-serif font-bold mb-8">{pack.price}</div>
                           <button
                              onClick={() => handleOrder(pack.id)}
                              className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all rounded-sm bg-white text-black hover:bg-luxury-gold hover:text-black"
                           >
                              Commander
                           </button>
                        </div>

                        <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-10">
                           <h4 className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-6">Inclus dans le pack :</h4>
                           <ul className="space-y-4">
                              {pack.features.map((feature, idx) => (
                                 <li key={idx} className="text-sm text-gray-300 flex items-center font-light">
                                    <span className="mr-3 text-luxury-gold">✓</span> {feature}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Upsell Modal */}
         <UpsellModal
            isOpen={isUpsellOpen}
            offer={currentOffer}
            onAccept={handleUpsellAccept}
            onDecline={handleUpsellDecline}
            onClose={closeUpsell}
         />

         {/* Payment Modal */}
         <PaymentModal
            isOpen={showPaymentModal}
            pack={selectedPack}
            onPaymentSuccess={handlePaymentSuccess}
            onAddCredits={updateCredits}
            onClose={() => setShowPaymentModal(false)}
         />
      </div>
   );
};
