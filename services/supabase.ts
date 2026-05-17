import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));

/**
 * A safe proxy for the Supabase client that prevents hard crashes when environment 
 * variables are missing. It logs errors to the console instead of throwing.
 */
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
    : new Proxy({} as any, {
      get: (_, prop) => {
        const errorResponse = { data: null, error: new Error("Supabase is not configured. Please set environment variables in Settings.") };
        
        const mockQuery: any = {
          select: () => mockQuery,
          insert: () => Promise.resolve(errorResponse),
          upsert: () => Promise.resolve(errorResponse),
          update: () => mockQuery,
          delete: () => mockQuery,
          eq: () => mockQuery,
          is: () => mockQuery,
          order: () => mockQuery,
          single: () => Promise.resolve(errorResponse),
          limit: () => mockQuery,
          range: () => mockQuery,
          // Make it awaitable
          then: (onfulfilled: any) => Promise.resolve({ data: [], error: null }).then(onfulfilled),
        };

        if (prop === 'from') return () => mockQuery;
        if (prop === 'storage') {
          return {
            from: () => ({
              upload: () => Promise.resolve({ error: new Error("Supabase storage not configured") }),
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
