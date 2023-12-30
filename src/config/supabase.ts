import { createClient } from '@supabase/supabase-js'
import { Database } from '../Types/supabase'

const supabaseUrl = 'https://miufdqzfqrbtwsnuvbkt.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdWZkcXpmcXJidHdzbnV2Ymt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5MjY3NDAsImV4cCI6MjAxOTUwMjc0MH0.y0ozGqPgQiUQuLYkVemLOr6C_xIDsOCAPAyjfr4eYUs"
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey)