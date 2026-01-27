/**
 * Nation Repository
 * 
 * Database operations for nations/teams.
 */

const { supabase } = require('../lib/supabase');

const nationRepository = {
  /**
   * Get all nations
   * @returns {Promise<Array>} List of all nations
   */
  async getAll() {
    const { data, error } = await supabase
      .from('nations')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  /**
   * Get nations by group
   * @param {string} group - Group letter (A, B, C, etc.)
   * @returns {Promise<Array>} Nations in the group
   */
  async getByGroup(group) {
    const { data, error } = await supabase
      .from('nations')
      .select('*')
      .eq('group', group)
      .order('points', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Get a nation by ID
   * @param {string} id - Nation UUID
   * @returns {Promise<Object>} Nation data
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('nations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get a nation by code (e.g., 'BRA', 'GER')
   * @param {string} code - FIFA country code
   * @returns {Promise<Object>} Nation data
   */
  async getByCode(code) {
    const { data, error } = await supabase
      .from('nations')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get group standings
   * @param {string} group - Optional group filter
   * @returns {Promise<Array>} Standings
   */
  async getStandings(group = null) {
    let query = supabase
      .from('group_standings')
      .select('*');
    
    if (group) {
      query = query.eq('group', group);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  /**
   * Update nation statistics
   * @param {string} id - Nation UUID
   * @param {Object} stats - Stats to update
   * @returns {Promise<Object>} Updated nation
   */
  async updateStats(id, stats) {
    const { data, error } = await supabase
      .from('nations')
      .update(stats)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

module.exports = nationRepository;
