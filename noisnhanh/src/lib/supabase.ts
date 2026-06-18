import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kpvsjtcixwstoqcdozop.supabase.co";
const supabaseAnonKey =
  "sb_publishable_iQmKwLujTdnNPxPoousiZA_P_OvgdBN";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);