import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vymbrudgcgapnhxswjip.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_YgvDdro0x3ZYSqVMt4yqeQ_vilP8MEH';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);