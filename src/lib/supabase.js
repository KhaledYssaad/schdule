import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing in .env file');
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }) }) }),
        insert: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
        update: () => ({ eq: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }) }),
        delete: () => ({ eq: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }) }),
      })
    };
