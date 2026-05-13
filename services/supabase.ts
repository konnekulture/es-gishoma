import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = !!(supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey);

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get: (_, prop) => {
        if (prop === 'storage') {
          return {
            from: () => ({
              upload: () => Promise.resolve({ error: new Error("Supabase not configured") }),
              getPublicUrl: () => ({ data: { publicUrl: '' } })
            })
          };
        }
        return () => {
          throw new Error("Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the application settings.");
        };
      }
    });
