import { createClient } from "@supabase/supabase-js";

/**
 * 🧠 Supabase Client
 * Connects your React app to your Supabase project.
 */
const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";

// ✅ Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
