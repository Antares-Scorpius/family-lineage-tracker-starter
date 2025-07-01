import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dhegxrxwbjledltpxyvo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWd4cnh3YmpsZWRsdHB4eXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODg1OTgsImV4cCI6MjA2Njk2NDU5OH0.fkbk97FYhf8Kir7ySzdQUJ4Wi67K9B0aGBXB7o9XXvk'

export const supabase = createClient(supabaseUrl, supabaseKey)
