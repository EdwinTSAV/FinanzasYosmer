
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fonegsoyeslamwjsnort.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbmVnc295ZXNsYW13anNub3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzI5NzEsImV4cCI6MjA2MTk0ODk3MX0.o_xA3i7Lu5diqNOYaVvNmdUnECJTnPyjeHuBqBd7sBg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
