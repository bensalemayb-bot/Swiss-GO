export interface PricingPack {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  targetJob: string;
  experienceYears: number;
  cv_credits: number;
  lm_credits: number;
  oe_credits: number; // Offres d'emploi en direct
}

// STRUCTURE STRICTE DU MODÈLE "AYOUB"
export interface CVData {
  sidebar: {
    fullName: string;
    contact: {
      phone: string;
      email: string;
      location: string;
      infos: string; // Ex: 21 ans - Permis C
    };
    atouts: string[]; // Soft Skills (Sens de l'observation...)
    languages: string[]; // Langues avec niveau
    interests: string[]; // Centre d'intérêt
  };
  main: {
    jobTitle: string; // Le grand titre en haut à droite
    educations: {
      school: string;
      date: string;
      degree: string;
      location?: string;
    }[];
    experiences: {
      title: string;
      company: string;
      location: string;
      date: string;
      tasks: string[];
    }[];
    hardSkills: string[]; // Compétences Techniques (Pack Office, Droit civil...) adaptées au poste
  };
}

export interface CoverLetterData {
  sender: {
    name: string;
    addressLine1: string; // Rue
    addressLine2: string; // NPA Localité
    email: string;
    phone: string;
  };
  recipient: {
    companyName: string;
    addressLine1: string;
    addressLine2: string;
  };
  meta: {
    placeDate: string;
    object: string;
    place?: string; // Ajout optionnel pour compatibilité
  };
  content: {
    opening: string;
    paragraph1_Company: string;
    paragraph2_HardSkills: string;
    paragraph3_SoftSkills: string;
    paragraph4_Meeting: string;
    closing: string;
    signature: string;
  };
}

export interface GeneratedContent {
  cvData: CVData | null;
  coverLetter: CoverLetterData | null;
  generatedPhoto?: string | null; // Base64 string de la photo générée
}

export enum AppRoute {
  HOME = 'home',
  GENERATE = 'generate',
  PRICING = 'pricing',
  CONTACT = 'contact',
  LOGIN = 'login',
  MENTIONS_LEGALES = 'mentions-legales',
  CGV = 'cgv',
  CONFIDENTIALITE = 'confidentialite',
  PAYMENT_SUCCESS = 'payment-success'
}
