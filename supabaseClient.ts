import { createClient } from '@supabase/supabase-js'

// Estas chaves encontras nas definições do teu projeto Supabase (Project Settings > API)
const supabaseUrl = 'https://deenuyruuribuuldmzwu.supabase.co'
const supabaseAnonKey = 'sb_publishable_WEYY7m1p7QQ5tm2V_7Efaw_VDhgyUzk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)