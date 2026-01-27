/**
 * Supabase Client Configuration
 * 
 * This creates a single Supabase client instance for the entire app.
 * The publishable key is safe to use in frontend code.
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://fopdprmeqlednthlyjll.supabase.co';
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_gQSzQwyzSpEH8Ev97XQK2A_SgQc34iD';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase, supabaseUrl, supabaseKey };
