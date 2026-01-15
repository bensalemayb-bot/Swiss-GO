import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || 'https://ufraowgnldjxsmfxkwbx.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmcmFvd2dubGRqeHNtZnhrd2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2OTA1NzgsImV4cCI6MjA4MzI2NjU3OH0.9EEdnXO5Nyg092Gl573ZhHWAPMmdPUbMWx73LOQIgYY';

export const supabase: SupabaseClient | null = createClient(supabaseUrl, supabaseAnonKey);
