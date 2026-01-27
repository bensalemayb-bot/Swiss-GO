import React, { useState } from 'react';
import { ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { documentPacks, coachingPacks } from '../data/packs';
import { AppRoute, PricingPack } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { AmbientTips } from '../components/AmbientTips';
import { UpsellModal } from '../components/UpsellModal';
import { PaymentModal } from '../components/PaymentModal';
import { useUpsell } from '../hooks/useUpsell';
import heroImage from '../assets/hero-swiss.png';
import teamImage from '../assets/team-working.jpg';

interface LandingPageProps {
  onNavigate: (page: AppRoute, params?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { user, cvCredits, lmCredits, refreshCredits } = useAuth();
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
    const a = document.createElement('a');
    a.href = '/Swiss-Go-50-offres.pdf';
    a.download = 'Swiss-Go-50-offres.pdf';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Fonction de téléchargement de la liste de 100 offres d'emploi (upsell)
  const download100JobOffers = () => {
    const a = document.createElement('a');
    a.href = '/Swiss-Go-100-offres.pdf';
    a.download = 'Swiss-Go-100-offres.pdf';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
    setShowPaymentModal(false);

    // Logique selon le type de pack
    if (selectedPack?.id === 'oe-pack-50') {
      // Pour le pack 50 offres : télécharger le PDF
      downloadJobOffers();
      alert(`Merci pour votre achat du ${selectedPack.name} ! Téléchargement en cours...`);
      onNavigate(AppRoute.HOME);
    } else if (selectedPack?.id === 'oe-pack-100-plus') {
      // Pour le pack 100 offres + agences : télécharger le PDF 100 offres
      download100JobOffers();
      alert(`Merci pour votre achat du ${selectedPack.name} ! Téléchargement en cours...`);
      onNavigate(AppRoute.HOME);
    } else if (selectedPack?.id === 'pack-integral') {
      // Pour le pack intégral : télécharger l'e-book ET la liste de 50 offres ET aller vers Generate
      downloadEbook();
      downloadJobOffers();
      alert('Merci pour votre achat du Pack Intégral ! 20 crédits CV + 20 crédits LM ajoutés. E-book + 50 offres téléchargés.');
      onNavigate(AppRoute.GENERATE, `?pack=${selectedPack.id}`);
    } else {
      // Pour les autres packs : navigation vers Generate
      onNavigate(AppRoute.GENERATE, `?pack=${selectedPack?.id}`);
    }
  };

  return (
    <div className="overflow-x-hidden font-sans text-gray-200">
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Geneva Finance District Luxury"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
        </div>

        {/* Ambient Tips Layer */}
        <AmbientTips />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-normal text-white mb-8 leading-tight tracking-tight animate-fade-in-up drop-shadow-2xl">
            {t('hero_title')}
          </h1>

          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up animate-delay-300">
            <button
              onClick={() => handleOrder('pack-integral')}
              className="px-10 py-4 bg-luxury-gold text-black text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500 rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transform hover:-translate-y-1"
            >
              {t('hero_cta')}
            </button>
          </div>
        </div>
      </section>

      {/* 2. L'INGÉNIERIE DE VOTRE SUCCÈS */}
      <section className="py-32 bg-[#1A1A1A] relative overflow-hidden">
        {/* Spotlight Effect - Gradient Radial */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-luxury-gold/10 via-transparent to-transparent blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Titre Principal */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-sans font-bold text-luxury-gold mb-6 uppercase tracking-[0.2em] leading-tight">
              {t('section_engineering_title')}
            </h2>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed">
              {t('section_engineering_subtitle')}
            </p>
          </div>

          {/* Corps de Texte Premium */}
          <div className="max-w-4xl mx-auto mb-20">
            <p className="text-lg text-gray-300 leading-relaxed mb-6 text-center font-sans font-light">
              {t('section_engineering_p1')}
            </p>
            <p className="text-base text-gray-400 leading-relaxed text-center font-sans font-light">
              {t('section_engineering_p2')}
            </p>
          </div>

          {/* 3 Points Forts - Cards Épurées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Card 1 */}
            <div className="group bg-white/5 border border-luxury-gold/20 hover:border-luxury-gold/60 p-8 rounded-lg transition-all duration-500 hover:bg-white/10">
              <div className="text-luxury-gold mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-sans font-bold text-lg text-center uppercase tracking-wider">
                {t('section_engineering_card1')}
              </h3>
            </div>

            {/* Card 2 */}
            <div className="group bg-white/5 border border-luxury-gold/20 hover:border-luxury-gold/60 p-8 rounded-lg transition-all duration-500 hover:bg-white/10">
              <div className="text-luxury-gold mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-white font-sans font-bold text-lg text-center uppercase tracking-wider">
                {t('section_engineering_card2')}
              </h3>
            </div>

            {/* Card 3 */}
            <div className="group bg-white/5 border border-luxury-gold/20 hover:border-luxury-gold/60 p-8 rounded-lg transition-all duration-500 hover:bg-white/10">
              <div className="text-luxury-gold mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-sans font-bold text-lg text-center uppercase tracking-wider">
                Accès Immédiat
              </h3>
            </div>
          </div>

          {/* CTA Premium */}
          <div className="text-center">
            <button
              onClick={() => onNavigate(AppRoute.PRICING)}
              className="group relative inline-flex items-center justify-center px-12 py-5 bg-luxury-gold text-black font-sans font-bold text-sm uppercase tracking-[0.3em] rounded-lg overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.8)] transform hover:-translate-y-1"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></span>
              <span className="relative">DEVENIR LE CANDIDAT ÉVIDENT</span>
              <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. DOCUMENTS */}
      <section className="py-32 bg-gradient-to-br from-luxury-black via-luxury-charcoal to-luxury-black border-t border-white/5 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <span className="text-luxury-gold text-xs font-bold uppercase tracking-widest">{t('prod_badge')}</span>
              <h2 className="text-3xl font-sans font-bold text-white mt-2">{t('prod_title')}</h2>
            </div>
            <button onClick={() => onNavigate(AppRoute.PRICING)} className="hidden md:block text-gray-400 hover:text-white transition text-sm uppercase tracking-wider border-b border-transparent hover:border-luxury-gold pb-1">{t('prod_view_all')}</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {documentPacks.map((pack, idx) => (
              <div
                key={pack.id}
                className={`group relative p-6 bg-luxury-black/80 backdrop-blur-sm transition-all duration-500 border-2 flex flex-col rounded-lg hover:-translate-y-3 ${pack.recommended
                  ? 'border-luxury-gold shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:shadow-[0_0_60px_rgba(212,175,55,0.6)]'
                  : 'border-luxury-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:border-luxury-gold/60 hover:shadow-[0_0_50px_rgba(212,175,55,0.4)]'
                  }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {pack.recommended && (
                  <div className="absolute top-0 right-0 bg-luxury-gold text-luxury-black text-[10px] font-bold px-2 py-1 uppercase">Recommandé</div>
                )}

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-luxury-gold transition-colors">{pack.name}</h3>
                <p className="text-xs text-gray-500 mb-6 h-8 leading-snug">{pack.description}</p>

                <div className="mb-8">
                  <span className="text-2xl font-bold text-white">{pack.price}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {pack.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-400 text-xs font-medium">
                      <span className="w-1 h-1 bg-luxury-gold rounded-full mt-1.5 mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleOrder(pack.id)}
                  className={`w-full py-3 text-xs font-bold uppercase tracking-wider border rounded-sm transition-all duration-300 ${pack.recommended
                    ? 'bg-luxury-gold border-luxury-gold text-luxury-black hover:bg-white hover:border-white'
                    : 'border-white/20 text-white hover:bg-white hover:text-black'
                    }`}
                >
                  {t('btn_choose')}
                </button>

                {/* Show Generate button if user has credits and it's not a job offer pack */}
                {user && (cvCredits > 0 || lmCredits > 0) && !pack.id.startsWith('oe-') && (
                  <button
                    onClick={() => onNavigate(AppRoute.GENERATE, `?pack=${pack.id}`)}
                    className="w-full py-3 mt-2 text-xs font-bold uppercase tracking-wider bg-white/5 border border-luxury-gold/50 text-luxury-gold hover:bg-luxury-gold hover:text-black rounded-sm transition-all duration-300"
                  >
                    {t('btn_generate_now')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 5. PACK INTEGRAL */}
      <section className="py-32 bg-luxury-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6 tracking-tight">L'Offre Ultime</h2>
            <p className="text-gray-400 max-w-xl mx-auto font-light">
              Tout ce dont vous avez besoin pour réussir, regroupé dans un pack unique.
            </p>
          </div>

          <div className="flex justify-center">
            {coachingPacks.map((pack) => (
              <div
                key={pack.id}
                className="w-full max-w-lg p-10 flex flex-col transition-all duration-300 rounded-sm bg-white text-luxury-black shadow-[0_0_50px_rgba(212,175,55,0.15)] transform hover:scale-105 border-4 border-luxury-gold"
              >
                <div className="mb-4 inline-block bg-luxury-black text-luxury-gold text-[10px] font-bold uppercase tracking-wider px-3 py-1 w-fit rounded-sm shadow-lg mx-auto">
                  Le Choix des Futurs Frontaliers
                </div>

                <div className="mb-6 text-center">
                  <h3 className="text-3xl font-bold mb-2">{pack.name}</h3>
                  <p className="text-sm text-gray-600 italic">{pack.description}</p>
                </div>

                <div className="mb-8 text-center border-y border-gray-100 py-6">
                  <span className="text-6xl font-bold text-luxury-black tracking-tighter">{pack.price}</span>
                </div>

                <div className="flex-grow space-y-4 mb-10 px-4">
                  {pack.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle2 size={20} className="mr-4 text-luxury-gold flex-shrink-0" />
                      <span className="text-base font-bold text-gray-800">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleOrder(pack.id)}
                  className="w-full py-5 text-sm font-bold uppercase tracking-widest rounded-sm transition-all duration-300 bg-luxury-black text-white hover:bg-luxury-gold hover:text-black shadow-xl"
                >
                  Obtenir le Pack Complet
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 6. TÉMOIGNAGES - Carousel Infini */}
      <section className="py-24 bg-luxury-charcoal border-t border-white/5 overflow-hidden">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Ce qu'ils disent de nous</h2>
          <p className="text-gray-400 text-sm">Témoignages authentiques de nos clients</p>
        </div>

        {/* Container avec overflow hidden */}
        <div className="relative w-full">
          {/* Animation de défilement infini */}
          <div className="flex animate-scroll-left">
            {/* Premier groupe de témoignages */}
            {[
              {
                name: "Lucas M.",
                role: "Junior Analyst, Genève (23 ans)",
                text: "J'envoyais 10 CVs par jour sans réponse. J'ai pris le pack, refait mon dossier aux normes suisses, et j'ai signé mon premier CDI en 3 semaines. Le retour sur investissement est immédiat."
              },
              {
                name: "Yasmine K.",
                role: "Infirmière, Lausanne (25 ans)",
                text: "On nous dit toujours que la Suisse c'est compliqué. Franchement, avec le guide et les modèles, tout est devenu clair. J'ai doublé mon salaire par rapport à la France. Merci !"
              },
              {
                name: "Théo D.",
                role: "Ingénieur IT, Bâle (26 ans)",
                text: "Je pensais que mon CV était bon. L'IA me l'a complètement restructuré. Résultat : les recruteurs m'ont enfin rappelé. Si vous hésitez pour le prix, c'est rien comparé au salaire suisse."
              },
              {
                name: "Sophie R.",
                role: "Assistante RH, Zurich (28 ans)",
                text: "Après 6 mois de recherche infructueuse, j'ai utilisé SwissGo. En 2 semaines, j'avais 3 entretiens. La lettre de motivation générée était parfaite, exactement ce que les RH suisses attendent."
              },
              {
                name: "Karim B.",
                role: "Chef de projet, Vaud (31 ans)",
                text: "Le guide m'a ouvert les yeux sur mes erreurs. Mon ancien CV était trop 'français'. Avec les templates suisses et l'optimisation IA, j'ai décroché un poste à 8500 CHF/mois. Investissement rentabilisé dès le premier salaire."
              },
              {
                name: "Marine L.",
                role: "Comptable, Fribourg (27 ans)",
                text: "Les offres d'emploi cachées, c'est le vrai plus ! J'ai trouvé mon job actuel dans leur liste exclusive. Aucune concurrence, contact direct avec le RH. C'est du gain de temps énorme."
              },
              {
                name: "Alexandre P.",
                role: "Marketing Manager, Neuchâtel (29 ans)",
                text: "J'étais sceptique au début mais l'outil a transformé ma recherche. Mon CV maintenant met en avant mes compétences de la bonne manière. 3 propositions en 1 mois, du jamais vu !"
              },
              {
                name: "Émilie T.",
                role: "Développeuse Web, Berne (24 ans)",
                text: "L'assistant de retouche est un game changer. J'ai pu adapter mon CV pour chaque offre en quelques minutes. Résultat : taux de réponse multiplié par 5."
              },
              {
                name: "David L.",
                role: "Responsable Logistique, Lugano (35 ans)",
                text: "Faire la transition France-Suisse semblait impossible. SwissGo m'a guidé pas à pas. Aujourd'hui je gagne 11k CHF/mois. Best decision ever."
              },
              {
                name: "Camille D.",
                role: "Architecte, Sion (30 ans)",
                text: "Le coaching intégré vaut de l'or. J'ai compris comment les recruteurs suisses raisonnent. Mon taux de conversion entretien → offre est passé de 20% à 80%."
              }
            ].concat([
              {
                name: "Lucas M.",
                role: "Junior Analyst, Genève (23 ans)",
                text: "J'envoyais 10 CVs par jour sans réponse. J'ai pris le pack, refait mon dossier aux normes suisses, et j'ai signé mon premier CDI en 3 semaines. Le retour sur investissement est immédiat."
              },
              {
                name: "Yasmine K.",
                role: "Infirmière, Lausanne (25 ans)",
                text: "On nous dit toujours que la Suisse c'est compliqué. Franchement, avec le guide et les modèles, tout est devenu clair. J'ai doublé mon salaire par rapport à la France. Merci !"
              },
              {
                name: "Théo D.",
                role: "Ingénieur IT, Bâle (26 ans)",
                text: "Je pensais que mon CV était bon. L'IA me l'a complètement restructuré. Résultat : les recruteurs m'ont enfin rappelé. Si vous hésitez pour le prix, c'est rien comparé au salaire suisse."
              },
              {
                name: "Sophie R.",
                role: "Assistante RH, Zurich (28 ans)",
                text: "Après 6 mois de recherche infructueuse, j'ai utilisé SwissGo. En 2 semaines, j'avais 3 entretiens. La lettre de motivation générée était parfaite, exactement ce que les RH suisses attendent."
              },
              {
                name: "Karim B.",
                role: "Chef de projet, Vaud (31 ans)",
                text: "Le guide m'a ouvert les yeux sur mes erreurs. Mon ancien CV était trop 'français'. Avec les templates suisses et l'optimisation IA, j'ai décroché un poste à 8500 CHF/mois. Investissement rentabilisé dès le premier salaire."
              },
              {
                name: "Marine L.",
                role: "Comptable, Fribourg (27 ans)",
                text: "Les offres d'emploi cachées, c'est le vrai plus ! J'ai trouvé mon job actuel dans leur liste exclusive. Aucune concurrence, contact direct avec le RH. C'est du gain de temps énorme."
              }
            ]).map((testimonial, i) => (
              <div key={i} className="flex-shrink-0 w-[400px] mx-4 bg-white/5 p-6 rounded-lg border border-white/10 hover:border-luxury-gold/50 transition-all duration-300">
                <div className="mb-4 flex space-x-1 text-luxury-gold">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed font-light italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-white text-xs uppercase tracking-wider">{testimonial.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{testimonial.role}</div>
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

    </div >
  );
};
