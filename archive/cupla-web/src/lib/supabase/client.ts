import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qqpfoflbzofxbxqyubpw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcGZvZmxiem9meGJ4cXl1YnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NDQ2NDgsImV4cCI6MjA5NTEyMDY0OH0.9DeL0eDhRrZY80OxblXfIey2pS2r1GMK1vCoN9Az3ww';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
