import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://gzzccmqtkneoosqxvvor.supabase.co";

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
