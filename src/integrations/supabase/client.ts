import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://tgecqvmmkuonuxmdsjlj.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZWNxdm1ta3VvbnV4bWRzamxqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTUxMTE0NiwiZXhwIjoyMTAxMDg3MTQ2fQ.LM4c1WO7jG0i4WNJEVgrCFphfKrPIK2cR9Fij5xPV5E";

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL) && Boolean(SUPABASE_ANON_KEY);
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
