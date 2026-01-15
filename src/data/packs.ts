import { PricingPack } from '../types';

// DATA ARCHITECTURE - PRICING PACKS

// CATÉGORIE 1 : PACKS DOCUMENTS ET OFFRES (Basiques)
export const documentPacks: PricingPack[] = [
  {
    id: 'cv-pack',
    name: 'Pack 5 CVs',
    price: '29,90 €',
    description: 'Idéal pour adapter votre CV à différentes offres.',
    features: [
      '5 Téléchargements CV inclus',
      'Modèles Suisses Validés',
      'Analyse Expert illimitée (Aperçu)',
      'Export PDF Haute Définition'
    ]
  },
  {
    id: 'lm-pack',
    name: 'Pack 5 Lettres',
    price: '29,90 €',
    description: 'Personnalisez chaque candidature.',
    features: [
      '5 Lettres de Motivation',
      'Correction Pro illimitée',
      'Export PDF Haute Définition'
    ]
  },
  {
    id: 'oe-pack-50',
    name: 'Pack 50 Offres',
    price: '39,90 €',
    description: 'Accédez à 50 offres d\'emploi exclusives en Suisse.',
    features: [
      '50 Offres d\'emploi cachées',
      'Offres mises à jour quotidiennement',
      'Support prioritaire'
    ]
  },
  {
    id: 'pack-duo',
    name: 'Pack Duo (5 CV + 5 LM)',
    price: '49,90 €',
    description: 'Le kit complet pour une recherche active.',
    recommended: true,
    features: [
      '5 CVs Optimisés',
      '5 Lettres de Motivation',
      'Économie de 10 €',
      "Accès à l'Assistant de retouche"
    ]
  }
];

// CATÉGORIE 2 : PACKS OFFRES D'EMPLOI EN DIRECT (vide - conservé pour compatibilité)
export const jobOfferPacks: PricingPack[] = [];

// CATÉGORIE 3 : PACK INTÉGRAL (Coaching)
export const coachingPacks: PricingPack[] = [
  {
    id: 'pack-integral',
    name: 'Pack Suisse Intégral',
    price: '149.-',
    description: 'Accompagnement complet + Documents Illimités.',
    recommended: false,
    features: [
      '20 Crédits CV + 20 Crédits LM',
      '50 Offres d\'emploi exclusives',
      'E-Book "Guide Expatriation Suisse"',
      'Support prioritaire 7j/7'
    ]
  }
];

// Helper pour retrouver un pack
export const getPackDetails = (id: string): PricingPack | undefined => {
  return [...documentPacks, ...jobOfferPacks, ...coachingPacks].find(p => p.id === id);
};

// Helper pour obtenir les crédits à ajouter selon le pack
export const getPackCredits = (packId: string): { cvCredits: number; lmCredits: number } => {
  switch (packId) {
    case 'cv-pack':
      return { cvCredits: 5, lmCredits: 0 };
    case 'lm-pack':
      return { cvCredits: 0, lmCredits: 5 };
    case 'pack-duo':
      return { cvCredits: 5, lmCredits: 5 };
    case 'pack-integral':
      return { cvCredits: 20, lmCredits: 20 };
    case 'oe-pack-50':
    case 'oe-pack-100-plus':
      // Les packs d'offres d'emploi ne donnent pas de crédits (téléchargement direct)
      return { cvCredits: 0, lmCredits: 0 };
    default:
      return { cvCredits: 0, lmCredits: 0 };
  }
};
