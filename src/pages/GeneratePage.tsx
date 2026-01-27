import React, { useState, useEffect } from 'react';
import { X, Star, Zap, Crown, BookOpen, Gift, Lock } from 'lucide-react';
import { CVTemplateViewer } from '../components/CVTemplateViewer';
import { PackHeader } from '../components/generate/PackHeader';
import { GenerateForm } from '../components/generate/GenerateForm';
import { ServiceStatus } from '../components/generate/ServiceStatus';
import { generateOptimization, generateProfessionalHeadshot } from '../services/geminiService';
import { generationService } from '../services/generationService';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { GeneratedContent } from '../types';
import { getPackDetails } from '../data/packs';

// Constants
const SWISS_SOFT_SKILLS = ["Rigueur", "Ponctualité", "Fiabilité", "Esprit d'équipe", "Autonomie", "Gestion du stress", "Discrétion", "Polyvalence", "Proactivité", "Sens du service", "Adaptabilité", "Communication"];
const SWISS_HARD_SKILLS = ["Office 365", "SAP", "Gestion de Projet", "Comptabilité Suisse", "Droit du Travail", "Service Client", "Salesforce", "Adobe Suite", "Permis B", "Gestion de Stock", "Analyse Financière", "Anglais B2/C1", "Allemand B1/B2"];

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Téléchargement de l'E-book SwissGO
const downloadEbook = () => {
  const a = document.createElement('a');
  a.href = '/E-book-SwissGO.pdf';
  a.download = 'E-book-SwissGO.pdf';
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const GeneratePage: React.FC = () => {
  const [packId, setPackId] = useState<string>('cv-pack');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false); // NOUVEAU : État pour la modale
  const [generatedData, setGeneratedData] = useState<GeneratedContent | null>(null);
  const { user, cvCredits, lmCredits, refreshCredits } = useAuth();

  // Files
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [lmFile, setLmFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Data
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    senderAddress: '', senderZipCity: '',
    nationality: '', infos: '', // Ajout Nationalité + Infos (Permis/Age)
    targetJob: '',
    companyName: '', companyAddress: '', companyZipCity: '',
    softSkills: '', hardSkills: '',
    notes: ''
  });

  const [detailedForm, setDetailedForm] = useState({
    languages: '', hobbies: '',
    experiences: [{ title: '', company: '', date: '', description: '' }],
    educations: [{ degree: '', school: '', date: '' }]
  });

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('?pack=')) {
      const pid = hash.split('?pack=')[1];
      setPackId(pid);
    } else {
      // No pack specified, choose a default based on user's credits
      if (cvCredits > 0 && lmCredits > 0) {
        setPackId('pack-duo'); // User has both, default to duo
      } else if (cvCredits > 0) {
        setPackId('cv-pack'); // Only CV credits
      } else if (lmCredits > 0) {
        setPackId('lm-pack'); // Only LM credits
      } else {
        setPackId('cv-pack'); // Default fallback (will be blocked anyway)
      }
    }
  }, [cvCredits, lmCredits]);

  // --- HANDLERS ---
  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDetailedChange = (e: any) => setDetailedForm({ ...detailedForm, [e.target.name]: e.target.value });

  const toggleSkill = (type: 'soft' | 'hard', skill: string) => {
    const key = type === 'soft' ? 'softSkills' : 'hardSkills';
    const current = (formData as any)[key] ? (formData as any)[key].split(', ').filter((x: string) => x.trim()) : [];
    const updated = current.includes(skill) ? current.filter((x: string) => x !== skill) : [...current, skill];
    setFormData({ ...formData, [key]: updated.join(', ') });
  };

  const updateExperience = (i: number, f: string, v: string) => { const n = [...detailedForm.experiences]; (n[i] as any)[f] = v; setDetailedForm({ ...detailedForm, experiences: n }); };
  const addExperience = () => setDetailedForm({ ...detailedForm, experiences: [...detailedForm.experiences, { title: '', company: '', date: '', description: '' }] });
  const removeExperience = (i: number) => setDetailedForm({ ...detailedForm, experiences: detailedForm.experiences.filter((_, x) => x !== i) });

  const updateEducation = (i: number, f: string, v: string) => { const n = [...detailedForm.educations]; (n[i] as any)[f] = v; setDetailedForm({ ...detailedForm, educations: n }); };
  const addEducation = () => setDetailedForm({ ...detailedForm, educations: [...detailedForm.educations, { degree: '', school: '', date: '' }] });
  const removeEducation = (i: number) => setDetailedForm({ ...detailedForm, educations: detailedForm.educations.filter((_, x) => x !== i) });

  const handleFileChange = (e: any, type: 'cv' | 'lm' | 'photo') => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      if (f.size > 10 * 1024 * 1024) return alert("Fichier trop lourd (Max 10Mo)");
      if (type === 'cv') setCvFile(f); else if (type === 'lm') setLmFile(f); else setPhotoFile(f);
    }
  };

  const updateCredits = async (deltaCv: number, deltaLm: number): Promise<boolean> => {
    if (!user) {
      setErrorMsg("Veuillez vous connecter pour acheter des crédits.");
      return false;
    }
    if (!supabase) {
      setErrorMsg("Service d'authentification non configuré (vérifiez les variables d'environnement).");
      return false;
    }

    const nextCvCredits = cvCredits + deltaCv;
    const nextLmCredits = lmCredits + deltaLm;
    const { error } = await supabase
      .from('profiles')
      .update({ cv_credits: nextCvCredits, lm_credits: nextLmCredits })
      .eq('id', user.id);

    if (error) {
      setErrorMsg(error.message || "Erreur lors de la mise à jour des crédits.");
      return false;
    }

    await refreshCredits();
    return true;
  };

  const handleBuyCredits = async (deltaCv: number, deltaLm: number, priceLabel: string) => {
    const creditParts: string[] = [];
    if (deltaCv > 0) creditParts.push(`${deltaCv} crédit${deltaCv > 1 ? 's' : ''} CV`);
    if (deltaLm > 0) creditParts.push(`${deltaLm} crédit${deltaLm > 1 ? 's' : ''} LM`);
    const creditLabel = creditParts.join(' et ');

    if (confirm(`Confirmer l'achat de ${creditLabel} pour ${priceLabel} ?`)) {
      const ok = await updateCredits(deltaCv, deltaLm);
      if (!ok) return;

      setShowBuyModal(false);
      setErrorMsg(null);
    }
  };

  const handleBuyIntegral = async () => {
    if (confirm("Confirmer l'achat du Pack Intégral (149.-) ?\nCela ajoutera 20 crédits CV et 20 crédits LM et téléchargera le Guide.")) {
      const ok = await updateCredits(20, 20);
      if (!ok) return;

      // Téléchargement du Ebook
      downloadEbook();

      setShowBuyModal(false);
      setErrorMsg(null);
      alert("Félicitations ! 20 crédits CV + 20 crédits LM ajoutés et Guide téléchargé.");
    }
  };

  // --- GENERATION (Gratuite, Pay-on-Download) ---
  const handleGenerateDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Vérifier que l'utilisateur a au moins 1 crédit
    if (cvCredits === 0 && lmCredits === 0) {
      setErrorMsg("Vous n'avez plus de crédits. Veuillez recharger votre compte pour générer vos documents.");
      setShowBuyModal(true);
      return;
    }

    if (!formData.targetJob) return setErrorMsg("Le poste visé est obligatoire.");

    // Détection du mode basée sur le pack
    const isLMOnly = packId === 'lm-pack';
    const isCVNeeded = !isLMOnly; // Si ce n'est pas "LM Pack", alors on a besoin du CV (CV Pack ou Duo)
    const isLMNeeded = ['lm-pack', 'pack-duo', 'pack-integral'].includes(packId);

    if (isLMNeeded && !formData.companyName) return setErrorMsg("Nom de l'entreprise obligatoire pour la lettre.");

    setIsLoading(true);
    setGeneratedData(null);

    try {
      let contentToAnalyze = formData.notes || "";
      let finalPhoto: string | null = null;
      let contactLoc = `${formData.senderAddress}, ${formData.senderZipCity}`;

      if (photoFile && !isLMOnly) {
        try {
          const aiPhoto = await generateProfessionalHeadshot(photoFile);
          finalPhoto = aiPhoto || await fileToBase64(photoFile);
        } catch (err) { finalPhoto = await fileToBase64(photoFile); }
      }

      if (cvFile) {
        if (!formData.firstName) contentToAnalyze += "\n [INFO] Le prénom est dans le CV";
        if (!formData.lastName) contentToAnalyze += "\n [INFO] Le nom est dans le CV";
      }

      const expString = detailedForm.experiences
        .filter(e => e.title)
        .map(e => `Poste: ${e.title} chez ${e.company} (${e.date}). Tâches: ${e.description}`)
        .join('\n');

      const eduString = detailedForm.educations
        .filter(e => e.degree)
        .map(e => `Diplôme: ${e.degree} à ${e.school} (${e.date})`)
        .join('\n');

      const manualContent = `
          MANUAL DATA INPUTS:
          Langues: ${detailedForm.languages}
          Loisirs: ${detailedForm.hobbies}
          EXPERIENCES:\n${expString}
          FORMATIONS:\n${eduString}
      `;
      contentToAnalyze += "\n" + manualContent;

      const result = await generateOptimization(
        contentToAnalyze,
        formData.targetJob,
        `${formData.firstName} ${formData.lastName}`,
        formData.nationality, // Passage de la nationalité
        formData.phone,
        contactLoc,
        formData.infos,
        formData.email,
        formData.companyName, formData.companyAddress, formData.companyZipCity, formData.softSkills, formData.hardSkills,
        isCVNeeded, isLMNeeded, cvFile, lmFile, formData.senderAddress, formData.senderZipCity
      );

      const finalContent = { ...result, generatedPhoto: finalPhoto };
      setGeneratedData(finalContent);

      generationService.saveGeneration(packId, formData.targetJob, finalContent);

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Erreur critique de génération. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentPack = getPackDetails(packId);
  const isLMOnly = packId === 'lm-pack';
  const isCVNeeded = !isLMOnly;
  const isLMNeeded = ['lm-pack', 'pack-duo', 'pack-integral'].includes(packId);

  // Vérifier si l'utilisateur a les crédits nécessaires selon le type de pack
  const hasCVCredits = cvCredits > 0;
  const hasLMCredits = lmCredits > 0;

  // Déterminer si l'accès doit être bloqué
  let isBlocked = false;
  let blockMessage = '';

  if (isLMOnly) {
    // Pack LM uniquement : vérifier les crédits LM
    if (!hasLMCredits) {
      isBlocked = true;
      blockMessage = 'Vous avez besoin de crédits LM (Lettre de Motivation) pour accéder à ce formulaire.';
    }
  } else if (isCVNeeded && isLMNeeded) {
    // Pack nécessitant CV ET LM (ex: pack-duo) : vérifier les deux
    if (!hasCVCredits && !hasLMCredits) {
      isBlocked = true;
      blockMessage = 'Vous avez besoin de crédits CV et LM pour accéder à ce formulaire.';
    } else if (!hasCVCredits) {
      isBlocked = true;
      blockMessage = 'Vous avez besoin de crédits CV pour générer un CV.';
    } else if (!hasLMCredits) {
      isBlocked = true;
      blockMessage = 'Vous avez besoin de crédits LM pour générer une lettre de motivation.';
    }
  } else if (isCVNeeded) {
    // Pack CV uniquement : vérifier les crédits CV
    if (!hasCVCredits) {
      isBlocked = true;
      blockMessage = 'Vous avez besoin de crédits CV pour accéder à ce formulaire.';
    }
  }

  return (
    <div className="min-h-[calc(100vh-88px)] flex flex-col lg:flex-row relative z-10 bg-luxury-black font-sans print:bg-white print:min-h-0 print:block">

      {/* SIDEBAR */}
      <div className="w-full lg:w-[500px] xl:w-[550px] bg-luxury-black border-r border-white/10 p-6 overflow-y-auto h-auto lg:h-[calc(100vh-88px)] z-20 shadow-2xl custom-scrollbar print:hidden">

        <PackHeader packName={currentPack?.name} cvCredits={cvCredits} lmCredits={lmCredits} onOpenBuyModal={() => setShowBuyModal(true)} />

        <ServiceStatus errorMsg={errorMsg} />

        {/* BLOCAGE Si Crédits insuffisants */}
        {isBlocked ? (
          <div className="bg-luxury-gold/10 border border-luxury-gold rounded-sm p-8 text-center mt-6">
            <Lock size={48} className="mx-auto text-luxury-gold mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Accès Restreint</h3>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              {blockMessage}
              <br />
              <span className="text-luxury-gold font-semibold">Payez d'abord, générez ensuite.</span>
            </p>
            <button
              onClick={() => setShowBuyModal(true)}
              className="bg-luxury-gold text-luxury-black px-8 py-3 rounded-sm hover:bg-white transition text-sm font-bold uppercase tracking-widest shadow-lg"
            >
              Acheter des Crédits
            </button>
          </div>
        ) : (
          <GenerateForm
            onSubmit={handleGenerateDirect}
            formData={formData}
            detailedForm={detailedForm}
            cvFile={cvFile}
            photoFile={photoFile}
            handleInputChange={handleInputChange}
            handleDetailedChange={handleDetailedChange}
            handleFileChange={handleFileChange}
            toggleSkill={toggleSkill}
            updateExperience={updateExperience}
            addExperience={addExperience}
            removeExperience={removeExperience}
            updateEducation={updateEducation}
            addEducation={addEducation}
            removeEducation={removeEducation}
            isCVNeeded={isCVNeeded}
            isLMNeeded={isLMNeeded}
            isLMOnly={isLMOnly}
            isLoading={isLoading}
            swissSoftSkills={SWISS_SOFT_SKILLS}
            swissHardSkills={SWISS_HARD_SKILLS}
          />
        )}
      </div>

      {/* VIEWER AVEC CHAT */}
      <div className="flex-1 bg-luxury-charcoal relative overflow-hidden flex flex-col print:overflow-visible print:bg-white print:block print:static print:h-auto">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] print:hidden"></div>
        <div className="flex-1 p-4 md:p-8 overflow-y-auto relative z-10 custom-scrollbar print:overflow-visible print:p-0 print:block print:static print:h-auto">
          <CVTemplateViewer
            isLoading={isLoading}
            generatedContent={generatedData}
            onUpdateContent={setGeneratedData}
            onOpenBuyModal={() => setShowBuyModal(true)}
          />
        </div>
      </div>

      {/* MODAL D'ACHAT */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-luxury-black border border-luxury-gold rounded-sm shadow-2xl max-w-lg w-full relative">
            <button onClick={() => setShowBuyModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Recharger votre Compte</h3>
              <p className="text-gray-400 text-sm mb-8">Choisissez l'option adaptée à votre besoin.</p>

              <div className="space-y-4">
                {/* OPTION DECOUVERTE (GRATUITE) */}
                <button onClick={() => handleBuyCredits(1, 1, 'Offert')} className="w-full flex items-center justify-between p-4 bg-emerald-900/20 border border-emerald-500/30 hover:bg-emerald-900/40 rounded-sm group transition-all">
                  <div className="text-left">
                    <div className="text-white font-bold flex items-center"><Gift size={14} className="text-emerald-500 mr-2" /> Offre Découverte</div>
                    <div className="text-xs text-gray-500">Pour tester sans engagement</div>
                  </div>
                  <div className="text-lg font-bold text-emerald-500 group-hover:text-emerald-400">Gratuit</div>
                </button>

                {/* OPTION PACK CV */}
                <button onClick={() => handleBuyCredits(5, 0, '29,90 €')} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-luxury-gold hover:bg-white/10 rounded-sm group transition-all">
                  <div className="text-left">
                    <div className="text-white font-bold flex items-center"><Zap size={14} className="text-luxury-gold mr-2" /> Pack 5 CV</div>
                    <div className="text-xs text-gray-500">5 téléchargements CV</div>
                  </div>
                  <div className="text-lg font-bold text-white group-hover:text-luxury-gold">29,90 €</div>
                </button>

                {/* OPTION PACK LM */}
                <button onClick={() => handleBuyCredits(0, 5, '29,90 €')} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-sm group transition-all">
                  <div className="text-left">
                    <div className="text-white font-bold flex items-center"><Star size={14} className="text-luxury-gold mr-2" /> Pack 5 LM</div>
                    <div className="text-xs text-gray-500">5 téléchargements Lettre</div>
                  </div>
                  <div className="text-lg font-bold text-white group-hover:text-luxury-gold">29,90 €</div>
                </button>

                {/* OPTION PACK DUO */}
                <button onClick={() => handleBuyCredits(5, 5, '49,90 €')} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-sm group transition-all">
                  <div className="text-left">
                    <div className="text-white font-bold flex items-center"><Star size={14} className="text-luxury-gold mr-2" /> Pack Duo</div>
                    <div className="text-xs text-gray-500">5 CV + 5 LM</div>
                  </div>
                  <div className="text-lg font-bold text-white group-hover:text-luxury-gold">49,90 €</div>
                </button>

                {/* OPTION PACK INTEGRAL */}
                <button onClick={handleBuyIntegral} className="w-full flex items-center justify-between p-4 bg-luxury-gold/10 border border-luxury-gold hover:bg-luxury-gold/20 rounded-sm group transition-all relative">
                  <div className="absolute top-0 right-0 bg-luxury-gold text-black text-[9px] font-bold px-2 py-0.5 uppercase">Ultime</div>
                  <div className="text-left">
                    <div className="text-white font-bold flex items-center"><Crown size={14} className="text-luxury-gold mr-2" /> Pack Intégral</div>
                    <div className="text-xs text-gray-400 flex items-center mt-1"><BookOpen size={10} className="mr-1" /> + Guide Expatriation</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-luxury-gold">149.-</div>
                    <div className="text-[10px] text-gray-400">20 CV + 20 LM inclus</div>
                  </div>
                </button>
              </div>

              <p className="text-[10px] text-gray-600 mt-6">Paiement sécurisé. Facture disponible après achat.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
