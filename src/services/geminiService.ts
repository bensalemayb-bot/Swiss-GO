import { supabase } from '@/lib/supabaseClient';
import type { CVData, CoverLetterData, GeneratedContent } from '../types';
import { SYSTEM_INSTRUCTION_CV, SYSTEM_INSTRUCTION_LETTER } from '../utils/cv-prompts';
import { generationService } from './generationService';

type InlineFile = {
  data: string;
  mimeType: string;
};

type GenerateDocumentPayload = {
  prompt: string;
  type?: string;
  model?: string;
  responseMimeType?: string;
  temperature?: number;
  systemInstruction?: string;
  files?: InlineFile[];
};

const fileToInlineData = (file: File): Promise<InlineFile> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const match = result.match(/^data:(.+);base64,(.+)$/);
      if (!match) {
        reject(new Error('Invalid file encoding.'));
        return;
      }
      resolve({ mimeType: match[1], data: match[2] });
    };
    reader.onerror = () => reject(reader.error ?? new Error('File read error.'));
    reader.readAsDataURL(file);
  });

// Strip code fences and keep the first JSON object if extra text appears.
const cleanJsonString = (raw: string): string => {
  const trimmed = raw.trim();
  const withoutFences = trimmed
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();
  const firstBrace = withoutFences.indexOf('{');
  const lastBrace = withoutFences.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return withoutFences.slice(firstBrace, lastBrace + 1);
  }
  return withoutFences;
};

const invokeGenerateDocument = async (payload: GenerateDocumentPayload): Promise<string> => {
  if (!supabase) {
    throw new Error('Supabase client not configured.');
  }

  const { data, error } = await supabase.functions.invoke('generate-document', {
    body: payload
  });

  if (error) {
    throw new Error(error.message || 'Generation failed.');
  }

  if (!data || typeof data.text !== 'string') {
    throw new Error('Invalid response from generation service.');
  }

  return data.text;
};

const getTodayDateFrench = (): string =>
  new Date().toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' });

export const generateOptimization = async (
  contentToAnalyze: string,
  targetJob: string,
  fullName: string,
  nationality: string,
  phone: string,
  contactLocation: string,
  infos: string,
  email: string,
  companyName: string,
  companyAddress: string,
  companyZipCity: string,
  softSkills: string,
  hardSkills: string,
  isCVNeeded: boolean,
  isLMNeeded: boolean,
  cvFile: File | null,
  lmFile: File | null,
  senderAddress: string,
  senderZipCity: string
): Promise<GeneratedContent> => {
  try {
    const inlineCv = cvFile ? await fileToInlineData(cvFile) : null;
    const inlineLm = lmFile ? await fileToInlineData(lmFile) : null;

    const cvFiles = inlineCv ? [inlineCv] : [];
    const letterFiles = [inlineCv, inlineLm].filter(Boolean) as InlineFile[];

    const result: GeneratedContent = { cvData: null, coverLetter: null };

    if (isCVNeeded) {
      const cvPrompt = `
POSTE VISE: ${targetJob || 'Non renseigne'}
NOM COMPLET: ${fullName || 'Non renseigne'}
NATIONALITE/PERMIS: ${nationality || 'Non renseigne'}
TELEPHONE: ${phone || 'Non renseigne'}
EMAIL: ${email || 'Non renseigne'}
ADRESSE (RUE + NPA/VILLE): ${contactLocation || 'Non renseigne'}
INFOS (AGE/PERMIS/DISPONIBILITE): ${infos || 'Non renseigne'}
SOFT SKILLS: ${softSkills || 'Non renseigne'}
HARD SKILLS: ${hardSkills || 'Non renseigne'}

DONNEES BRUTES:
${contentToAnalyze || 'Aucune note fournie.'}

Si un CV est fourni en fichier, utilise-le en priorite.
Renvoie uniquement le JSON strict.
      `.trim();

      const cvText = await invokeGenerateDocument({
        prompt: cvPrompt,
        type: 'cv',
        model: 'gemini-3-flash-preview',
        responseMimeType: 'application/json',
        temperature: 0.35,
        systemInstruction: SYSTEM_INSTRUCTION_CV,
        files: cvFiles.length ? cvFiles : undefined
      });

      result.cvData = JSON.parse(cleanJsonString(cvText)) as CVData;
    }

    if (isLMNeeded) {
      const letterPrompt = `
POSTE VISE: ${targetJob || 'Non renseigne'}
DATE DU JOUR: ${getTodayDateFrench()}
NOM COMPLET: ${fullName || 'Non renseigne'}
ADRESSE: ${senderAddress || 'Non renseigne'}
NPA/VILLE: ${senderZipCity || 'Non renseigne'}
TELEPHONE: ${phone || 'Non renseigne'}
EMAIL: ${email || 'Non renseigne'}
NATIONALITE/PERMIS: ${nationality || 'Non renseigne'}
INFOS: ${infos || 'Non renseigne'}

ENTREPRISE: ${companyName || 'Non renseigne'}
ADRESSE ENTREPRISE: ${companyAddress || 'Non renseigne'}
NPA/VILLE ENTREPRISE: ${companyZipCity || 'Non renseigne'}

SOFT SKILLS: ${softSkills || 'Non renseigne'}
HARD SKILLS: ${hardSkills || 'Non renseigne'}

DONNEES BRUTES:
${contentToAnalyze || 'Aucune note fournie.'}

Si une lettre ou un CV est fourni en fichier, utilise-les en priorite.
Renvoie uniquement le JSON strict.
      `.trim();

      const letterText = await invokeGenerateDocument({
        prompt: letterPrompt,
        type: 'letter',
        model: 'gemini-3-flash-preview',
        responseMimeType: 'application/json',
        temperature: 0.6,
        systemInstruction: SYSTEM_INSTRUCTION_LETTER,
        files: letterFiles.length ? letterFiles : undefined
      });

      result.coverLetter = JSON.parse(cleanJsonString(letterText)) as CoverLetterData;
    }

    return result;
  } catch (error) {
    generationService.logError('generateOptimization', error);
    const message = error instanceof Error ? error.message : 'Generation error.';
    throw new Error(message);
  }
};

export const refineCoverLetter = async (
  coverLetter: CoverLetterData,
  instruction: string
): Promise<CoverLetterData> => {
  try {
    const refinePrompt = `
Applique la consigne suivante a la lettre de motivation fournie.
Consigne: ${instruction}

LETTRE (JSON):
${JSON.stringify(coverLetter, null, 2)}

Renvoie uniquement le JSON mis a jour.
    `.trim();

    const refinedText = await invokeGenerateDocument({
      prompt: refinePrompt,
      type: 'refine',
      model: 'gemini-3-flash-preview',
      responseMimeType: 'application/json',
      temperature: 0.4
    });

    return JSON.parse(cleanJsonString(refinedText)) as CoverLetterData;
  } catch (error) {
    generationService.logError('refineCoverLetter', error);
    const message = error instanceof Error ? error.message : 'Refine error.';
    throw new Error(message);
  }
};

export const generateProfessionalHeadshot = async (photoFile: File): Promise<string | null> => {
  try {
    const inlinePhoto = await fileToInlineData(photoFile);

    // PROMPT CORPORATE ELITE - Standard SwissGo imposé
    const prompt = `
MISSION CRITIQUE : Transform this portrait into a CORPORATE ELITE professional Swiss CV headshot following STRICT specifications.

**FACE-SWAP REQUIREMENTS (CRITICAL):**
- Preserve EXACTLY the facial features, skin tone, and unique characteristics of the person in the uploaded photo
- Maintain the same eye color, face shape, nose, mouth, and overall facial structure
- Keep natural skin texture and complexion IDENTICAL to the original
- The face must look like the SAME PERSON, not a generic model

**MANDATORY SPECIFICATIONS:**

1. FRAMING & COMPOSITION:
   - Professional headshot / bust portrait (shoulders and head only)
   - Subject centered in frame
   - Direct eye contact with camera
   - Straight, confident posture
   - Head slightly tilted forward (engaging stance)

2. CORPORATE UNIFORM (NON-NEGOTIABLE):
   - SUIT: Dark charcoal gray (anthracite), perfectly tailored, sharp shoulders
   - SHIRT: Crisp white dress shirt, stiff collar, no wrinkles
   - TIE: Navy blue silk tie, solid color, perfectly knotted (Windsor or Half-Windsor)
   - Overall appearance: Immaculate, executive-level business attire

3. STUDIO LIGHTING (PROFESSIONAL STANDARD):
   - Softbox studio lighting setup
   - Key light: Soft, diffused light from 45-degree angle (front-side)
   - Fill light: Subtle fill to prevent harsh shadows
   - NO hard shadows under nose or chin
   - Flattering light that sculpts the face professionally
   - Highlight catchlights in the eyes for vitality

4. BACKGROUND (ABSOLUTE REQUIREMENT):
   - Pure white background (#FFFFFF)
   - Completely uniform, no gradients or textures
   - No shadows cast on the background
   - Clean, ready for seamless cutout/compositing
   - NO studio equipment visible

5. TECHNICAL QUALITY (8K STANDARDS):
   - Ultra-high resolution, 8K quality
   - Perfect sharpness on eyes (critical focus point)
   - Natural skin texture visible (not over-smoothed)
   - Photorealistic rendering (not cartoon, painting, or illustration)
   - Professional color grading (neutral, corporate palette)
   - No visible artifacts, noise, or digital distortion

REFERENCE STYLE: Swiss executive corporate photography, C-suite LinkedIn profile, Fortune 500 standard.

OUTPUT: A photorealistic, professional headshot that maintains the person's unique facial identity while presenting them in immaculate corporate attire against a pristine white studio background.
`.trim();

    const imageDataUrl = await invokeGenerateDocument({
      prompt,
      type: 'image',
      model: 'gemini-2.5-flash-image',
      temperature: 0.15, // Réduit pour plus de cohérence et moins d'aléatoire
      files: [inlinePhoto]
    });

    return imageDataUrl || null;
  } catch (error) {
    generationService.logError('generateProfessionalHeadshot', error);
    const message = error instanceof Error ? error.message : 'Image generation error.';
    throw new Error(message);
  }
};
