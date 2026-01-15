import { supabase } from '@/lib/supabaseClient';
import { GeneratedContent } from '../types';

export interface GenerationRecord {
  id: string;
  user_id: string | null;
  pack_id: string;
  target_job: string;
  content_json: GeneratedContent;
  created_at: string;
}

export const generationService = {
  saveGeneration: async (packId: string, targetJob: string, content: GeneratedContent) => {
    if (!supabase) {
      console.warn('Supabase not configured; skipping generation save.');
      return null;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id ?? null;

      const payload = {
        user_id: userId,
        pack_id: packId,
        target_job: targetJob,
        content_json: content,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('generations')
        .insert([payload])
        .select('*')
        .single();

      if (error) {
        console.warn('Cloud Save Warning:', error.message);
        return null;
      }

      return data as GenerationRecord;
    } catch (err) {
      console.warn('Cloud connection skipped.');
      return null;
    }
  },

  logError: (context: string, error: unknown) => {
    console.error(`[SYSTEM] ${context}:`, error);
  }
};



