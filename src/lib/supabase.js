// Configuração do Supabase. A anon key é pública por design (vai pro frontend);
// a segurança dos dados deve ser feita via RLS no painel da Supabase.
// Os valores vêm do .env (VITE_*), com fallback embutido para funcionar out-of-the-box.
const FALLBACK_URL = 'https://ewnsttmmbcdzchzpxqjb.supabase.co'
const FALLBACK_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3bnN0dG1tYmNkemNoenB4cWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjMwODAsImV4cCI6MjA4NjQ5OTA4MH0.DhZ9ikOqud4H882NZpJbA6FQV2MuK4adsWG6B_6-goE'

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON
export const SUPABASE_ENABLED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
