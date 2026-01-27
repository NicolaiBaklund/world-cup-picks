/**
 * Match Repository
 * 
 * Database operations for matches.
 */

const { supabase } = require('../lib/supabase');

const matchRepository = {
  /**
   * Get all matches with team details
   * @returns {Promise<Array>} List of matches
   */
  async getAll() {
    const { data, error } = await supabase
      .from('matches_with_teams')
      .select('*')
      .order('date');
    
    if (error) throw error;
    return data;
  },

  /**
   * Get upcoming matches (betting still open)
   * @param {number} limit - Max matches to return
   * @returns {Promise<Array>} Upcoming matches
   */
  async getUpcoming(limit = 10) {
    const { data, error } = await supabase
      .from('matches_with_teams')
      .select('*')
      .gt('betting_deadline', new Date().toISOString())
      .eq('status', 'scheduled')
      .order('date')
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  /**
   * Get live matches
   * @returns {Promise<Array>} Currently playing matches
   */
  async getLive() {
    const { data, error } = await supabase
      .from('matches_with_teams')
      .select('*')
      .eq('status', 'live')
      .order('date');
    
    if (error) throw error;
    return data;
  },

  /**
   * Get completed matches (recent results)
   * @param {number} limit - Max matches to return
   * @returns {Promise<Array>} Recent results
   */
  async getCompleted(limit = 10) {
    const { data, error } = await supabase
      .from('matches_with_teams')
      .select('*')
      .eq('status', 'completed')
      .order('date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  /**
   * Get match by ID with team details
   * @param {string} id - Match UUID
   * @returns {Promise<Object>} Match data
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('matches_with_teams')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get matches by stage
   * @param {string} stage - Tournament stage
   * @returns {Promise<Array>} Matches in that stage
   */
  async getByStage(stage) {
    const { data, error } = await supabase
      .from('matches_with_teams')
      .select('*')
      .eq('stage', stage)
      .order('date');
    
    if (error) throw error;
    return data;
  },

  /**
   * Get matches by group
   * @param {string} group - Group letter
   * @returns {Promise<Array>} Group matches
   */
  async getByGroup(group) {
    const { data, error } = await supabase
      .from('matches_with_teams')
      .select('*')
      .eq('group_name', group)
      .order('date');
    
    if (error) throw error;
    return data;
  },

  /**
   * Set match result
   * @param {string} id - Match UUID
   * @param {number} homeScore - Home team score
   * @param {number} awayScore - Away team score
   * @param {number} homePenalties - Home penalties (optional)
   * @param {number} awayPenalties - Away penalties (optional)
   * @returns {Promise<Object>} Updated match
   */
  async setResult(id, homeScore, awayScore, homePenalties = null, awayPenalties = null) {
    const update = {
      home_score: homeScore,
      away_score: awayScore,
      status: 'completed'
    };

    if (homePenalties !== null) update.home_penalties = homePenalties;
    if (awayPenalties !== null) update.away_penalties = awayPenalties;

    const { data, error } = await supabase
      .from('matches')
      .update(update)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Update match status
   * @param {string} id - Match UUID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated match
   */
  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('matches')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

module.exports = matchRepository;
