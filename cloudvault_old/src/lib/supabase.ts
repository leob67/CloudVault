import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uvfgfgmjnbuwyobupfip.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2ZmdmZ21qbmJ1d3lvYnVwZmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzc3NTcsImV4cCI6MjA5NDk1Mzc1N30.KxcRUyBudAAKyc-_JaI9Ibzsy-VFrWgKJBjOVD-zAc4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Google OAuth configuration
export const GOOGLE_CLIENT_ID = '466158961924-i5drhg44t074livan7nbkt3talha12m6.apps.googleusercontent.com';
export const REDIRECT_URI = 'https://jtrjnycowv3o.space.minimax.io/auth/callback';