import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = !!(supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey);

/**
 * A safe proxy for the Supabase client that prevents hard crashes when environment 
 * variables are missing. It logs errors to the console instead of throwing.
 */
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get: (_, prop) => {
        const mockQuery: any = {
          select: () => mockQuery,
          insert: () => Promise.resolve({ data: [], error: null }),
          upsert: () => Promise.resolve({ data: [], error: null }),
          update: () => mockQuery,
          delete: () => mockQuery,
          eq: () => mockQuery,
          is: () => mockQuery,
          order: () => mockQuery,
          single: () => Promise.resolve({ data: null, error: null }),
          limit: () => mockQuery,
          range: () => mockQuery,
          // Make it awaitable
          then: (onfulfilled: any) => Promise.resolve({ data: [], error: null }).then(onfulfilled),
        };

        if (prop === 'from') return () => mockQuery;
        if (prop === 'storage') {
          return {
            from: () => ({
              upload: () => Promise.resolve({ error: new Error("Supabase not configured") }),
              getPublicUrl: () => ({ data: { publicUrl: '' } })
            })
          };
        }
        
        return (...args: any[]) => {
          console.warn(`Supabase functionality "${String(prop)}" called but not configured. Visit Settings to provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.`);
          return mockQuery;
        };
      }
    });

export const SUPABASE_CONFIGURED = isConfigured;
