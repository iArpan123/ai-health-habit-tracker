import { createClient } from '@supabase/supabase-js';

// Placeholder values - replace with your actual Supabase credentials
const SUPABASE_URL = "https://jwtklugwppruuloamyyo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3dGtsdWd3cHBydXVsb2FteXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTI3NTYsImV4cCI6MjA3NjM4ODc1Nn0.3Y9df03WW1wvEqBAh2dOOUVkVu641I2OaFnB_hm-IEM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
