/**
 * League Repository
 * 
 * Database operations for leagues and memberships.
 */

const { supabase } = require('../lib/supabase');

const leagueRepository = {
  /**
   * Create a new league
   * @param {string} name - League name
   * @param {string} description - League description
   * @returns {Promise<Object>} Created league
   */
  async create(name, description = '') {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Must be logged in to create a league');

    const { data, error } = await supabase
      .from('leagues')
      .insert({
        name,
        description,
        creator_id: user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get league by ID
   * @param {string} id - League UUID
   * @returns {Promise<Object>} League data
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('leagues')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get league by invite code
   * @param {string} code - 6-character invite code
   * @returns {Promise<Object>} League data
   */
  async getByCode(code) {
    const { data, error } = await supabase
      .from('leagues')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get leagues for current user
   * @returns {Promise<Array>} User's leagues
   */
  async getMyLeagues() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await supabase
      .from('league_members')
      .select(`
        league_id,
        role,
        league_points,
        league_correct_bets,
        league_total_bets,
        joined_at,
        leagues (
          id,
          name,
          description,
          code,
          creator_id,
          created_at,
          settings:points_for_correct
        )
      `)
      .eq('user_id', user.id);
    
    if (error) throw error;
    return data;
  },

  /**
   * Join a league using invite code
   * @param {string} code - 6-character invite code
   * @returns {Promise<Object>} Membership data
   */
  async joinByCode(code) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Must be logged in to join a league');

    // First get the league
    const league = await this.getByCode(code);
    
    if (!league) throw new Error('Invalid invite code');

    // Join the league
    const { data, error } = await supabase
      .from('league_members')
      .insert({
        league_id: league.id,
        user_id: user.id,
        role: 'member'
      })
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        throw new Error('You are already a member of this league');
      }
      throw error;
    }
    
    return { league, membership: data };
  },

  /**
   * Leave a league
   * @param {string} leagueId - League UUID
   * @returns {Promise<void>}
   */
  async leave(leagueId) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Must be logged in');

    const { error } = await supabase
      .from('league_members')
      .delete()
      .eq('league_id', leagueId)
      .eq('user_id', user.id);
    
    if (error) throw error;
  },

  /**
   * Get league leaderboard
   * @param {string} leagueId - League UUID
   * @returns {Promise<Array>} Ranked members
   */
  async getLeaderboard(leagueId) {
    const { data, error } = await supabase
      .rpc('get_league_leaderboard', { league_uuid: leagueId });
    
    if (error) throw error;
    return data;
  },

  /**
   * Get league members
   * @param {string} leagueId - League UUID
   * @returns {Promise<Array>} Members with profiles
   */
  async getMembers(leagueId) {
    const { data, error } = await supabase
      .from('league_members')
      .select(`
        user_id,
        role,
        league_points,
        joined_at,
        profiles (
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('league_id', leagueId)
      .order('league_points', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Update league settings
   * @param {string} leagueId - League UUID
   * @param {Object} settings - New settings
   * @returns {Promise<Object>} Updated league
   */
  async updateSettings(leagueId, settings) {
    const { data, error } = await supabase
      .from('leagues')
      .update(settings)
      .eq('id', leagueId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

module.exports = leagueRepository;
