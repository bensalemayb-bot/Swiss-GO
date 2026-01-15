import React from 'react';
import { User, Camera, Building2, Briefcase, Sparkles, Languages, Heart, Plus, Trash2, UploadCloud, CheckCircle, GraduationCap } from 'lucide-react';

// Classes utilitaires partagées
const inputClasses = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-sm text-gray-200 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all placeholder-gray-600";
const labelClasses = "block text-xs font-bold text-luxury-gold uppercase tracking-wider mb-2 flex items-center";
const sectionTitleClasses = "text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2 mt-8 flex items-center";

// --- SECTIONS DU FORMULAIRE ---

export const IdentitySection = ({ formData, handleInputChange, handleFileChange, photoFile, cvFile, isCVNeeded, isLMOnly }: any) => (
  <div>
    <h3 className={sectionTitleClasses}><User size={14} className="mr-2 text-luxury-gold"/> Identité</h3>
    
    {/* Upload CV */}
    <div className="mb-6 bg-white/5 p-4 rounded-sm border border-white/10">
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center"><UploadCloud size={12} className="mr-2"/> CV Existant (PDF/Image)</h3>
           <div className="relative group">
             <input type="file" id="cv-upload" accept=".pdf,.doc,.docx,image/*" className="hidden" onChange={(e) => handleFileChange(e, 'cv')} />
             <label htmlFor="cv-upload" className={`flex flex-col items-center justify-center w-full h-24 border border-dashed rounded-sm cursor-pointer transition-all ${cvFile ? 'border-luxury-gold bg-luxury-gold/5' : 'bg-white/5 border-white/20 hover:border-luxury-gold'}`}>
                {cvFile ? <div className="text-center"><CheckCircle className="mx-auto text-luxury-gold mb-1" size={16}/><p className="text-xs text-white">{cvFile.name}</p></div> : <div className="text-center"><UploadCloud className="mx-auto text-gray-500 mb-1" size={20} /><p className="text-[10px] text-gray-400">Cliquez pour importer (Pour analyse de parcours)</p></div>}
             </label>
           </div>
    </div>

    {/* Photo & Champs - Photo uniquement si CV demandé */}
    {!isLMOnly && (
      <div className="mb-4 bg-white/5 p-3 rounded-sm border border-white/10">
        <label className={labelClasses}><Camera size={14} className="mr-2"/> Photo CV (Studio)</label>
        <input type="file" id="std-photo-upload" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'photo')} />
        <label htmlFor="std-photo-upload" className="flex items-center justify-center px-4 py-2 border border-dashed border-white/20 rounded-sm cursor-pointer hover:bg-white/5 hover:border-luxury-gold text-xs text-gray-400">
            {photoFile ? <span className="text-luxury-gold font-bold truncate">{photoFile.name}</span> : <span>Choisir photo</span>}
        </label>
      </div>
    )}
    <div className="grid grid-cols-2 gap-4 mb-3">
      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={inputClasses} placeholder="Prénom" required={!cvFile} />
      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={inputClasses} placeholder="Nom" required={!cvFile} />
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-3">
      <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} className={inputClasses} placeholder="Nationalité (ex: Française)" />
      <input type="text" name="infos" value={formData.infos} onChange={handleInputChange} className={inputClasses} placeholder="Infos (Permis, Age...)" />
    </div>

    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`${inputClasses} mb-3`} placeholder="Email" required />
    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className={`${inputClasses} mb-3`} placeholder="Téléphone" />
    <div className="grid grid-cols-2 gap-4">
      <input type="text" name="senderAddress" value={formData.senderAddress} onChange={handleInputChange} className={inputClasses} placeholder="Rue" />
      <input type="text" name="senderZipCity" value={formData.senderZipCity} onChange={handleInputChange} className={inputClasses} placeholder="NPA Ville" />
    </div>
  </div>
);

export const JobSection = ({ formData, handleInputChange, isLMNeeded }: any) => (
  <div>
    <h3 className={sectionTitleClasses}><Briefcase size={14} className="mr-2 text-luxury-gold"/> Poste</h3>
    <div className="mb-4">
      <label className={labelClasses}>Poste Visé *</label>
      <input type="text" name="targetJob" required value={formData.targetJob} onChange={handleInputChange} className={inputClasses} placeholder="Ex: Horloger" />
    </div>
    {isLMNeeded && (
      <div className="bg-white/5 p-4 border border-white/10 rounded-sm">
        <label className={labelClasses}><Building2 size={14} className="mr-2"/> Entreprise Cible</label>
        <input type="text" name="companyName" required={isLMNeeded} value={formData.companyName} onChange={handleInputChange} className={`${inputClasses} mb-2`} placeholder="Nom Entreprise" />
        <div className="grid grid-cols-2 gap-2">
          <input type="text" name="companyAddress" value={formData.companyAddress} onChange={handleInputChange} className={inputClasses} placeholder="Adresse" />
          <input type="text" name="companyZipCity" value={formData.companyZipCity} onChange={handleInputChange} className={inputClasses} placeholder="NPA Ville" />
        </div>
      </div>
    )}
  </div>
);

export const ExperienceSection = ({ detailedForm, updateExperience, addExperience, removeExperience, updateEducation, addEducation, removeEducation }: any) => (
  <div className="space-y-6">
    {/* EXPERIENCES */}
    <div>
      <h3 className={sectionTitleClasses}><Briefcase size={14} className="mr-2 text-luxury-gold"/> Expériences</h3>
      {detailedForm.experiences.map((exp: any, i: number) => (
        <div key={i} className="mb-4 bg-white/5 p-3 rounded-sm border border-white/10 relative group">
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => removeExperience(i)} className="text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input type="text" placeholder="Poste" value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} className={inputClasses} />
            <input type="text" placeholder="Entreprise" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} className={inputClasses} />
          </div>
          <input type="text" placeholder="Dates (ex: 2020 - 2023)" value={exp.date} onChange={(e) => updateExperience(i, 'date', e.target.value)} className={`${inputClasses} mb-2`} />
          <textarea placeholder="Description des tâches..." value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} className={`${inputClasses} h-20 text-xs`} />
        </div>
      ))}
      <button type="button" onClick={addExperience} className="text-xs flex items-center text-luxury-gold hover:text-white font-bold uppercase tracking-wider"><Plus size={12} className="mr-1"/> Ajouter Expérience</button>
    </div>

    {/* FORMATIONS */}
    <div>
      <h3 className={sectionTitleClasses}><GraduationCap size={14} className="mr-2 text-luxury-gold"/> Formations</h3>
      {detailedForm.educations.map((edu: any, i: number) => (
        <div key={i} className="mb-4 bg-white/5 p-3 rounded-sm border border-white/10 relative group">
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => removeEducation(i)} className="text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input type="text" placeholder="Diplôme" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} className={inputClasses} />
            <input type="text" placeholder="École" value={edu.school} onChange={(e) => updateEducation(i, 'school', e.target.value)} className={inputClasses} />
          </div>
          <input type="text" placeholder="Année (ex: 2021)" value={edu.date} onChange={(e) => updateEducation(i, 'date', e.target.value)} className={inputClasses} />
        </div>
      ))}
      <button type="button" onClick={addEducation} className="text-xs flex items-center text-luxury-gold hover:text-white font-bold uppercase tracking-wider"><Plus size={12} className="mr-1"/> Ajouter Formation</button>
    </div>
  </div>
);

export const SkillsSection = ({ formData, handleInputChange, handleDetailedChange, detailedForm, toggleSkill, swissSoftSkills, swissHardSkills, isCVMode }: any) => (
  <div className="animate-fade-in-up">
      <h3 className={sectionTitleClasses}><Sparkles size={14} className="mr-2 text-luxury-gold"/> Compétences {isCVMode ? '& Divers' : ''}</h3>
      
      {/* Soft & Hard - Toujours visibles car utiles pour l'argumentaire de la lettre */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
         <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <label className={labelClasses}>Soft Skills (Savoir-être)</label>
            <div className="flex flex-wrap gap-1.5 mb-2">{swissSoftSkills.map((skill: string) => { const isSelected = formData.softSkills.includes(skill); return (<button key={skill} type="button" onClick={() => toggleSkill('soft', skill)} className={`px-2 py-1 text-[9px] uppercase rounded-sm border ${isSelected ? 'bg-luxury-gold text-black border-luxury-gold' : 'bg-transparent text-gray-500 border-white/10'}`}>{skill}</button>); })}</div>
            <textarea name="softSkills" value={formData.softSkills} onChange={handleInputChange} className={`${inputClasses} h-16 text-xs`} placeholder="Autres..." />
         </div>
         <div className="bg-white/5 p-3 rounded-sm border border-white/10">
            <label className={labelClasses}>Hard Skills (Technique)</label>
            <div className="flex flex-wrap gap-1.5 mb-2">{swissHardSkills.map((skill: string) => { const isSelected = formData.hardSkills.includes(skill); return (<button key={skill} type="button" onClick={() => toggleSkill('hard', skill)} className={`px-2 py-1 text-[9px] uppercase rounded-sm border ${isSelected ? 'bg-luxury-gold text-black border-luxury-gold' : 'bg-transparent text-gray-500 border-white/10'}`}>{skill}</button>); })}</div>
            <textarea name="hardSkills" value={formData.hardSkills} onChange={handleInputChange} className={`${inputClasses} h-16 text-xs`} placeholder="Autres..." />
         </div>
      </div>

      {/* Langues & Loisirs - UNIQUEMENT SI CV */}
      {isCVMode && (
        <div>
          <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelClasses}><Languages size={12} className="mr-1"/> Langues (Niveau)</label>
                <textarea name="languages" value={detailedForm.languages} onChange={handleDetailedChange} className={inputClasses} placeholder="Français (Natif), Anglais (B2)..." />
              </div>
              <div>
                <label className={labelClasses}><Heart size={12} className="mr-1"/> Centres d'intérêt</label>
                <textarea name="hobbies" value={detailedForm.hobbies} onChange={handleDetailedChange} className={inputClasses} placeholder="Football, Lecture..." />
              </div>
          </div>
        </div>
      )}
  </div>
);
