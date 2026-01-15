import React, { useState, useEffect } from 'react';
import { Download, Loader2, FileText, Palette, User, Mail, Camera, MessageSquare, Send, Sparkles, AlertTriangle, Lock } from 'lucide-react';
import { CVData, CoverLetterData, GeneratedContent } from '../types';
import { refineCoverLetter } from '../services/geminiService';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

declare var html2pdf: any;

interface CVTemplateViewerProps {
  isLoading: boolean;
  generatedContent: { cvData: CVData | null; coverLetter: CoverLetterData | null; generatedPhoto?: string | null } | null;
  onUpdateContent?: (newData: GeneratedContent) => void;
  onCreditUsed?: () => void;
  onOpenBuyModal?: () => void;
}

const THEMES = [
  { id: 'swiss-clean', name: 'Suisse Classique', fontHead: 'font-sans', fontBody: 'font-sans', accentColor: 'text-gray-900', borderColor: 'border-gray-200', titleTransform: 'uppercase tracking-widest' },
  { id: 'swiss-red', name: 'Rouge Fédéral', fontHead: 'font-sans', fontBody: 'font-sans', accentColor: 'text-[#DA291C]', borderColor: 'border-red-200', titleTransform: 'uppercase font-bold' },
  { id: 'executive-serif', name: 'Exécutif Élégant', fontHead: 'font-serif', fontBody: 'font-sans', accentColor: 'text-blue-900', borderColor: 'border-blue-900', titleTransform: 'capitalize' },
  { id: 'modern-slab', name: 'Moderne Slab', fontHead: 'font-slab', fontBody: 'font-sans', accentColor: 'text-emerald-800', borderColor: 'border-emerald-600', titleTransform: 'uppercase tracking-tight' }
];

export const CVTemplateViewer: React.FC<CVTemplateViewerProps> = ({ isLoading, generatedContent, onUpdateContent, onCreditUsed, onOpenBuyModal }) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'cv' | 'lm' | 'photo'>('cv');
  const [isDownloading, setIsDownloading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const { user, cvCredits, lmCredits, refreshCredits } = useAuth();

  useEffect(() => {
    if (generatedContent) {
      if (generatedContent.generatedPhoto && !generatedContent.cvData) setActiveTab('photo');
      else if (generatedContent.cvData) setActiveTab('cv');
      else if (generatedContent.coverLetter) setActiveTab('lm');
    }
  }, [generatedContent]);

  const creditLabel = activeTab === 'lm' ? 'Crédit LM' : 'Crédit CV';

  // --- LOGIQUE DE TÉLÉCHARGEMENT ---
  const handleDownloadClick = () => {
    if (!user) {
      alert("Connectez-vous pour télécharger.");
      return;
    }
    const isLetterDownload = activeTab === 'lm';
    const availableCredits = isLetterDownload ? lmCredits : cvCredits;

    if (availableCredits <= 0) {
      if (onOpenBuyModal) onOpenBuyModal();
      return;
    }

    setShowDownloadModal(true);
  };

  const confirmDownload = async () => {
    if (!user || !supabase) return;

    const isLetterDownload = activeTab === 'lm';
    const activeUser = user;
    const currentCvCredits = cvCredits;
    const currentLmCredits = lmCredits;

    setShowDownloadModal(false);
    setIsDownloading(true);

    setTimeout(async () => {
      try {
        if (activeTab === 'photo' && generatedContent?.generatedPhoto) {
          const link = document.createElement('a');
          link.href = generatedContent.generatedPhoto;
          link.download = 'Photo_CV_Pro_Suisse.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          const element = document.getElementById('document-to-download');
          if (!element) throw new Error("Document introuvable");

          let fileName = "Dossier_Candidature_Suisse.pdf";
          if (activeTab === 'cv' && generatedContent?.cvData?.sidebar.fullName) fileName = `CV_${generatedContent.cvData.sidebar.fullName.replace(/\s+/g, '_')}.pdf`;
          else if (activeTab === 'lm' && generatedContent?.coverLetter?.sender.name) fileName = `LM_${generatedContent.coverLetter.sender.name.replace(/\s+/g, '_')}.pdf`;

          const opt = {
            margin: 0,
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };

          if (typeof html2pdf !== 'undefined') {
            await html2pdf().set(opt).from(element).save();
          } else {
            alert("Le module d'impression n'est pas encore chargé. Réessayez dans 2 secondes.");
            return;
          }
        }

        const nextCvCredits = isLetterDownload ? currentCvCredits : Math.max(0, currentCvCredits - 1);
        const nextLmCredits = isLetterDownload ? Math.max(0, currentLmCredits - 1) : currentLmCredits;
        const { error } = await supabase
          .from('profiles')
          .update({ cv_credits: nextCvCredits, lm_credits: nextLmCredits })
          .eq('id', activeUser.id);

        if (error) {
          console.warn('Credit update warning:', error.message);
        }

        await refreshCredits();
        if (onCreditUsed) onCreditUsed();

      } catch (error) {
        console.error("Erreur téléchargement", error);
        alert("Une erreur est survenue lors de la création du PDF. Veuillez réessayer.");
      } finally {
        setIsDownloading(false);
      }
    }, 500);
  };

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !generatedContent?.coverLetter) return;
    setIsRefining(true);
    try {
      const updatedLetter = await refineCoverLetter(generatedContent.coverLetter, chatInput);
      if (onUpdateContent) onUpdateContent({ ...generatedContent, coverLetter: updatedLetter });
      setChatInput("");
    } catch (error) { alert("Erreur lors de la retouche. Réessayez."); }
    finally { setIsRefining(false); }
  };

  const toggleTheme = () => setCurrentThemeIndex((prev) => (prev + 1) % THEMES.length);
  const theme = THEMES[currentThemeIndex];

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-sm border border-dashed border-white/10 p-8">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin mb-6" />
        <p className="text-white font-bold text-lg tracking-wide uppercase">Création en cours...</p>
      </div>
    );
  }

  if (!generatedContent || (!generatedContent.cvData && !generatedContent.coverLetter && !generatedContent.generatedPhoto)) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-sm border border-dashed border-white/10 p-8 text-center">
        <div className="bg-white/10 p-6 rounded-full shadow-inner mb-6"><FileText size={40} className="text-gray-400" /></div>
        <h3 className="text-xl font-bold text-white mb-2 tracking-wide">Espace de Travail</h3>
        <p className="text-gray-400 text-sm font-light max-w-xs mx-auto">Configurez et générez votre dossier gratuitement à gauche.</p>
      </div>
    );
  }

  const { cvData, coverLetter, generatedPhoto } = generatedContent;
  const showTabs = (cvData && coverLetter) || (cvData && generatedPhoto) || (coverLetter && generatedPhoto);

  return (
    <div className="flex flex-col h-full items-center relative">
      {/* Toolbar */}
      <div className="flex flex-col space-y-4 mb-8 print:hidden w-full max-w-[210mm]">
        <div className="flex justify-between items-center bg-luxury-black/50 p-2 rounded-sm border border-white/10 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            {!generatedPhoto && activeTab !== 'lm' && (
              <button onClick={toggleTheme} className="flex items-center text-[10px] uppercase font-bold tracking-wider text-gray-300 hover:text-white border border-white/10 hover:border-luxury-gold px-3 py-2 rounded-sm transition-all">
                <Palette size={14} className="mr-2 text-luxury-gold" /> {theme.name}
              </button>
            )}
            {activeTab === 'lm' && (
              <button onClick={() => setShowChat(!showChat)} className={`flex items-center text-[10px] uppercase font-bold tracking-wider px-3 py-2 rounded-sm transition-all border ${showChat ? 'bg-luxury-gold text-black border-luxury-gold' : 'text-gray-300 border-white/10 hover:text-white'}`}>
                <MessageSquare size={14} className="mr-2" /> Expert RH
              </button>
            )}
          </div>

          {activeTab === 'photo' ? (
            <button onClick={handleDownloadClick} className="flex items-center bg-luxury-gold text-luxury-black px-4 py-2 rounded-sm hover:bg-white transition text-xs font-bold uppercase tracking-widest shadow-lg">
              <Download size={14} className="mr-2" /> Télécharger (1 {creditLabel})
            </button>
          ) : (
            (activeTab === 'lm' ? lmCredits : cvCredits) > 0 ? (
              <button onClick={handleDownloadClick} disabled={isDownloading} className={`flex items-center bg-luxury-gold text-luxury-black px-6 py-3 rounded-sm hover:bg-white transition text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-xl ${isDownloading ? 'opacity-70 cursor-wait' : ''}`}>
                {isDownloading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Download size={16} className="mr-2" />}
                TÉLÉCHARGER (1 {creditLabel})
              </button>
            ) : (
              <button onClick={onOpenBuyModal} className="flex items-center bg-luxury-gold text-luxury-black px-6 py-3 rounded-sm hover:bg-white transition text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-xl animate-pulse">
                <Lock size={16} className="mr-2" />
                ACHETER DES CRÉDITS
              </button>
            )
          )}
        </div>

        {showTabs && (
          <div className="flex space-x-1">
            {cvData && <button onClick={() => setActiveTab('cv')} className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-t-sm transition-all flex items-center border-t border-x ${activeTab === 'cv' ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-transparent hover:text-white'}`}><User size={14} className="mr-2" /> CV</button>}
            {coverLetter && <button onClick={() => setActiveTab('lm')} className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-t-sm transition-all flex items-center border-t border-x ${activeTab === 'lm' ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-transparent hover:text-white'}`}><Mail size={14} className="mr-2" /> Lettre</button>}
            {generatedPhoto && !cvData && <button onClick={() => setActiveTab('photo')} className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-t-sm transition-all flex items-center border-t border-x ${activeTab === 'photo' ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-transparent hover:text-white'}`}><Camera size={14} className="mr-2" /> Studio</button>}
          </div>
        )}
      </div>

      <div className="flex flex-row w-full justify-center gap-6">
        {/* INTERFACE CHATBOT (LM ONLY) - Repositionné en colonne compacte */}
        {activeTab === 'lm' && showChat && (
          <div className="hidden lg:flex w-64 flex-col bg-luxury-black border border-white/10 rounded-sm max-h-[400px] sticky top-0 shadow-xl animate-fade-in-up">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center text-luxury-gold mb-1"><Sparkles size={16} className="mr-2" /><span className="text-xs font-bold uppercase tracking-widest">Retouche Expert</span></div>
              <p className="text-[10px] text-gray-400">Demandez des modifications précises sur le ton, le contenu ou la structure.</p>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
              <div className="bg-white/5 p-3 rounded-sm mb-4"><p className="text-xs text-gray-300">"Bonjour, je suis votre expert RH suisse. Comment puis-je améliorer cette lettre ?"</p></div>
              <div className="space-y-2">
                <button onClick={() => setChatInput("Rends le ton plus formel.")} className="w-full text-left text-[10px] text-gray-400/70 hover:text-luxury-gold hover:border-luxury-gold/30 hover:bg-luxury-gold/5 p-2.5 border border-white/10 rounded-sm transition-all duration-300">"Plus formel..."</button>
                <button onClick={() => setChatInput("Insiste sur ma fiabilité.")} className="w-full text-left text-[10px] text-gray-400/70 hover:text-luxury-gold hover:border-luxury-gold/30 hover:bg-luxury-gold/5 p-2.5 border border-white/10 rounded-sm transition-all duration-300">"Insiste sur ma fiabilité..."</button>
                <button onClick={() => setChatInput("Raccourcis le paragraphe d'intro.")} className="w-full text-left text-[10px] text-gray-400/70 hover:text-luxury-gold hover:border-luxury-gold/30 hover:bg-luxury-gold/5 p-2.5 border border-white/10 rounded-sm transition-all duration-300">"Raccourcis l'intro..."</button>
              </div>
            </div>
            <div className="p-4 border-t border-white/10 bg-white/5">
              <form onSubmit={handleRefineSubmit} className="relative">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ex: Change le style..." className="w-full bg-luxury-black border border-white/20 rounded-sm text-xs text-white p-3 pr-10 focus:border-luxury-gold outline-none placeholder-gray-600" disabled={isRefining} />
                <button type="submit" disabled={isRefining || !chatInput} className="absolute right-2 top-2.5 text-luxury-gold hover:text-white transition">{isRefining ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}</button>
              </form>
            </div>
          </div>
        )}

        {/* DOCUMENT VIEWER */}
        <div id="printable-area" className="flex justify-center select-none" onContextMenu={(e) => e.preventDefault()}>

          {activeTab === 'cv' && cvData && (
            <div id="document-to-download" className={`relative bg-white w-[210mm] min-h-[297mm] shadow-2xl flex overflow-hidden group ${theme.fontBody} select-none`} onContextMenu={(e) => e.preventDefault()}>
              {/* Watermark de prévisualisation */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden print:hidden" style={{ zIndex: 999 }}>
                <div className="absolute inset-0 flex flex-wrap items-center justify-center" style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}>
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="text-[#D4AF37] opacity-10 text-2xl font-bold uppercase tracking-widest whitespace-nowrap mx-8 my-12">
                      PRÉVISUALISATION SWISSGO
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[33%] bg-gray-50 border-r border-gray-200 p-8 flex flex-col text-gray-900 pt-10 print:bg-gray-50 print:block">
                <div className="mb-10"><h2 className={`text-xl leading-tight ${theme.fontHead} ${theme.accentColor} ${theme.titleTransform}`}>{cvData.main.jobTitle}</h2></div>
                <div className="mb-10 flex justify-center"><div className="relative w-36 h-36 rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-100 group">{generatedPhoto ? <img src={generatedPhoto} alt="Profil" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400"><User size={48} /></div>}</div></div>
                <div className="mb-10 text-center"><h1 className={`text-2xl font-bold leading-tight text-gray-900 ${theme.fontHead}`}>{cvData.sidebar.fullName}</h1></div>
                <div className="mb-10"><h3 className={`text-sm mb-4 border-b pb-2 ${theme.fontHead} ${theme.borderColor} ${theme.titleTransform} ${theme.accentColor}`}>Contact</h3><ul className="text-sm space-y-3 leading-relaxed break-words"><li><span className="font-semibold block text-[10px] uppercase text-gray-400">Tél</span> {cvData.sidebar.contact.phone}</li><li><span className="font-semibold block text-[10px] uppercase text-gray-400">Email</span> {cvData.sidebar.contact.email}</li><li><span className="font-semibold block text-[10px] uppercase text-gray-400">Adresse</span> {cvData.sidebar.contact.location}</li><li className="text-gray-600 mt-2 text-xs italic">{cvData.sidebar.contact.infos}</li></ul></div>
                <div className="mb-10"><h3 className={`text-sm mb-4 border-b pb-2 ${theme.fontHead} ${theme.borderColor} ${theme.titleTransform} ${theme.accentColor}`}>Savoir-être</h3><ul className="text-sm space-y-2 list-disc list-inside text-gray-700">{cvData.sidebar.atouts.map((atout, i) => <li key={i}>{atout}</li>)}</ul></div>
                <div className="mb-10"><h3 className={`text-sm mb-4 border-b pb-2 ${theme.fontHead} ${theme.borderColor} ${theme.titleTransform} ${theme.accentColor}`}>Langues</h3><ul className="text-sm space-y-2 list-disc list-inside text-gray-700">{cvData.sidebar.languages.map((lang, i) => <li key={i}>{lang}</li>)}</ul></div>
                <div><h3 className={`text-sm mb-4 border-b pb-2 ${theme.fontHead} ${theme.borderColor} ${theme.titleTransform} ${theme.accentColor}`}>Intérêts</h3><ul className="text-sm space-y-2 list-disc list-inside text-gray-700">{cvData.sidebar.interests.map((interest, i) => <li key={i}>{interest}</li>)}</ul></div>
              </div>
              <div className="w-[67%] bg-white p-8 pt-10 text-gray-800 leading-relaxed flex flex-col justify-start min-h-full">
                <div className="mb-10 flex-grow"><h3 className={`text-lg mb-6 border-b-2 pb-2 ${theme.fontHead} ${theme.borderColor} ${theme.titleTransform} ${theme.accentColor}`}>Expériences</h3><div className="space-y-8">{cvData.main.experiences.map((exp, i) => (<div key={i}><div className="flex justify-between items-baseline mb-1"><h4 className="font-bold text-gray-900 text-base">{exp.title}</h4><span className="text-xs font-semibold text-gray-500 whitespace-nowrap ml-4 uppercase">{exp.date}</span></div><div className={`text-sm font-medium mb-3 ${theme.accentColor}`}>{exp.company}, {exp.location}</div><ul className="list-disc list-outside ml-4 text-sm space-y-1.5 text-gray-600 leading-relaxed">{exp.tasks.map((task, idx) => <li key={idx}>{task}</li>)}</ul></div>))}</div></div>
                <div className="mb-10"><h3 className={`text-lg mb-6 border-b-2 pb-2 ${theme.fontHead} ${theme.borderColor} ${theme.titleTransform} ${theme.accentColor}`}>Compétences Techniques</h3><div className="grid grid-cols-2 gap-x-6 gap-y-3">{cvData.main.hardSkills.map((skill, i) => (<div key={i} className="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded border border-gray-100"><span className={`w-1.5 h-1.5 rounded-full mr-2.5 ${theme.accentColor.replace('text-', 'bg-')}`}></span>{skill}</div>))}</div></div>
                <div className="mb-6"><h3 className={`text-lg mb-6 border-b-2 pb-2 ${theme.fontHead} ${theme.borderColor} ${theme.titleTransform} ${theme.accentColor}`}>Formation</h3><div className="space-y-6">{cvData.main.educations.map((edu, i) => (<div key={i}><div className="flex justify-between items-baseline"><h4 className="font-bold text-gray-900 text-base">{edu.degree}</h4><span className="text-xs text-gray-500 whitespace-nowrap ml-2 uppercase">{edu.date}</span></div><div className="text-sm mt-1 text-gray-600 font-medium">{edu.school} {edu.location ? `- ${edu.location}` : ''}</div></div>))}</div></div>
              </div>
            </div>
          )}

          {activeTab === 'lm' && coverLetter && (
            <div id="document-to-download" className={`relative bg-white w-[210mm] h-[297mm] shadow-2xl p-[20mm] pt-[15mm] text-gray-900 whitespace-pre-wrap flex flex-col overflow-hidden group ${theme.fontBody} select-none`} onContextMenu={(e) => e.preventDefault()}>
              {/* Watermark de prévisualisation */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden print:hidden" style={{ zIndex: 999 }}>
                <div className="absolute inset-0 flex flex-wrap items-center justify-center" style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="text-[#D4AF37] opacity-10 text-2xl font-bold uppercase tracking-widest whitespace-nowrap mx-8 my-16">
                      PRÉVISUALISATION SWISSGO
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute top-8 left-8 text-red-500/10 pointer-events-none print:hidden"><div className="font-bold text-5xl">+</div></div>
              <div className="mb-4 text-sm font-sans leading-tight"><div className="font-bold text-black">{coverLetter.sender.name}</div><div>{coverLetter.sender.addressLine1}</div><div>{coverLetter.sender.addressLine2}</div><div className="mt-1">{coverLetter.sender.phone}</div><div>{coverLetter.sender.email}</div></div>
              <div className="self-end w-[45%] mt-4 mb-10 text-sm font-sans leading-tight"><div className="font-bold text-black mb-1">{coverLetter.recipient.companyName}</div><div>{coverLetter.recipient.addressLine1}</div><div>{coverLetter.recipient.addressLine2}</div></div>
              <div className="mb-8 text-right text-sm font-sans text-gray-800">{coverLetter.meta.placeDate}</div>
              <div className="mb-6 font-bold text-sm text-black">{coverLetter.meta.object}</div>
              <div className="flex-grow text-[0.85rem] leading-[1.6] text-left font-sans space-y-3">
                <div>{coverLetter.content.opening}</div>
                <div>{coverLetter.content.paragraph1_Company}</div>
                <div>{coverLetter.content.paragraph2_HardSkills}</div>
                <div>{coverLetter.content.paragraph3_SoftSkills}</div>
                <div>{coverLetter.content.paragraph4_Meeting}</div>
                <div className="mt-6">{coverLetter.content.closing}</div>
                <div className="mt-10 text-right pr-4"><div className="font-sans text-sm">{coverLetter.sender.name}</div></div>
              </div>
            </div>
          )}

          {activeTab === 'photo' && generatedPhoto && !cvData && (
            <div className="flex flex-col items-center justify-center w-full h-full bg-white/5 p-8 rounded-sm border border-white/10 print-hidden select-none" onContextMenu={(e) => e.preventDefault()}>
              <div className="relative bg-white p-3 rounded-sm shadow-2xl mb-8 max-w-lg w-full transform rotate-1 transition hover:rotate-0 duration-500 overflow-hidden">
                <img src={generatedPhoto} alt="Photo Pro" className="w-full h-auto" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALE DE CONFIRMATION TÉLÉCHARGEMENT */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-luxury-black border border-luxury-gold rounded-sm shadow-2xl max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Confirmer le Téléchargement</h3>
            <div className="bg-white/5 p-4 rounded-sm mb-6 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Document :</span>
                <span className="text-white font-semibold">{activeTab === 'cv' ? 'CV' : activeTab === 'lm' ? 'Lettre de Motivation' : 'Photo'}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Coût :</span>
                <span className="text-luxury-gold font-bold">1 Crédit {activeTab === 'lm' ? 'LM' : 'CV'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Crédits restants :</span>
                <span className="text-white font-semibold">{(activeTab === 'lm' ? lmCredits : cvCredits) - 1}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => setShowDownloadModal(false)} className="flex-1 px-4 py-3 bg-white/5 border border-white/20 text-gray-300 rounded-sm hover:bg-white/10 transition text-sm font-bold uppercase">
                Annuler
              </button>
              <button onClick={confirmDownload} className="flex-1 px-4 py-3 bg-luxury-gold text-luxury-black rounded-sm hover:bg-white transition text-sm font-bold uppercase tracking-wider shadow-lg">
                Télécharger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
