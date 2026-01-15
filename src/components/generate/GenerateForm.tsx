import React from 'react';
import { Wand2 } from 'lucide-react';
import { IdentitySection, JobSection, ExperienceSection, SkillsSection } from '../FormSections';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  senderAddress: string;
  senderZipCity: string;
  nationality: string;
  infos: string;
  targetJob: string;
  companyName: string;
  companyAddress: string;
  companyZipCity: string;
  softSkills: string;
  hardSkills: string;
  notes: string;
}

interface ExperienceItem {
  title: string;
  company: string;
  date: string;
  description: string;
}

interface EducationItem {
  degree: string;
  school: string;
  date: string;
}

interface DetailedForm {
  languages: string;
  hobbies: string;
  experiences: ExperienceItem[];
  educations: EducationItem[];
}

interface GenerateFormProps {
  cvFile: File | null;
  photoFile: File | null;
  onSubmit: (e: React.FormEvent) => void;
  formData: FormData;
  detailedForm: DetailedForm;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleDetailedChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'lm' | 'photo') => void;
  toggleSkill: (type: 'soft' | 'hard', skill: string) => void;
  updateExperience: (index: number, field: string, value: string) => void;
  addExperience: () => void;
  removeExperience: (index: number) => void;
  updateEducation: (index: number, field: string, value: string) => void;
  addEducation: () => void;
  removeEducation: (index: number) => void;
  isCVNeeded: boolean;
  isLMNeeded: boolean;
  isLMOnly: boolean;
  isLoading: boolean;
  swissSoftSkills: string[];
  swissHardSkills: string[];
}

export const GenerateForm: React.FC<GenerateFormProps> = ({
  onSubmit,
  formData,
  detailedForm,
  cvFile,
  photoFile,
  handleInputChange,
  handleDetailedChange,
  handleFileChange,
  toggleSkill,
  updateExperience,
  addExperience,
  removeExperience,
  updateEducation,
  addEducation,
  removeEducation,
  isCVNeeded,
  isLMNeeded,
  isLMOnly,
  isLoading,
  swissSoftSkills,
  swissHardSkills
}) => (
  <form onSubmit={onSubmit} className="space-y-6 pb-20">
    <IdentitySection 
      formData={formData} 
      handleInputChange={handleInputChange} 
      handleFileChange={handleFileChange} 
      photoFile={photoFile} 
      cvFile={cvFile} 
      isCVNeeded={isCVNeeded} 
      isLMOnly={isLMOnly} 
    />
    
    <JobSection 
      formData={formData} 
      handleInputChange={handleInputChange} 
      isLMNeeded={isLMNeeded} 
    />
    
    {/* Section Expérience affichée UNIQUEMENT si le CV est requis */}
    {isCVNeeded && (
      <ExperienceSection 
        detailedForm={detailedForm} 
        updateExperience={updateExperience} 
        addExperience={addExperience} 
        removeExperience={removeExperience} 
        updateEducation={updateEducation} 
        addEducation={addEducation} 
        removeEducation={removeEducation} 
      />
    )}

    {/* Section Skills simplifiée si mode Lettre Uniquement */}
    <SkillsSection 
      formData={formData} 
      handleInputChange={handleInputChange} 
      handleDetailedChange={handleDetailedChange} 
      detailedForm={detailedForm} 
      toggleSkill={toggleSkill} 
      swissSoftSkills={swissSoftSkills} 
      swissHardSkills={swissHardSkills} 
      isCVMode={isCVNeeded}
    />

    <div className="mt-6">
      <label className="block text-xs font-bold text-luxury-gold uppercase tracking-wider mb-2">Instructions Spéciales</label>
      <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-sm text-gray-200 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all placeholder-gray-600 h-20" placeholder={isLMOnly ? "Ex: Insister sur ma motivation pour l'horlogerie..." : "Ex: Insister sur mon expérience en banque..."}></textarea>
    </div>

    <div className="pt-6 border-t border-white/10 sticky bottom-0 bg-luxury-black pb-4 z-30">
      <button type="submit" disabled={isLoading} className="w-full bg-white text-luxury-black py-4 px-4 rounded-sm font-bold uppercase tracking-widest hover:bg-luxury-gold transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg">
        {isLoading 
          ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div> Optimisation...</>
          : <><Wand2 size={16} className="mr-2 group-hover:scale-110 transition-transform" /> GÉNÉRER L'APERÇU (Gratuit)</>}
      </button>
    </div>
  </form>
);
