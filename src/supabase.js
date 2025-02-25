import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ruksxzloyzpdbrdjmvvd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1a3N4emxveXpwZGJyZGptdnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MTczMzQsImV4cCI6MjA1NTA5MzMzNH0.oAmoE8z8QgR774B3hFFLKNwy6aLCrDeJP3bneJzqVMU";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
