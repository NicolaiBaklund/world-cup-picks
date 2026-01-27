/**
 * Bet Repository
 * 
 * Database operations for bets/predictions.
 */

const { supabase } = require('../lib/supabase');

const betRepository = {
  /**
   * Place a bet on a match
   * @param {string} matchId - Match UUID
   * @param {string} leagueId - League UUID
   * @param {string} predictedWinner - 'home', 'away', or 'draw'
   * @param {number} predictedHomeScore - Optional exact score prediction
   * @param {number} predictedAwayScore - Optional exact score prediction
   * @returns {Promise<Object>} Created bet
   */
  async placeBet(matchId, leagueId, predictedWinner, predictedHomeScore = null, predictedAwayScore = null) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Must be logged in to place a bet');

    const bet = {
      user_id: user.id,
      match_id: matchId,
      league_id: leagueId,
      predicted_winner: predictedWinner
    };

    if (predictedHomeScore !== null) bet.predicted_home_score = predictedHomeScore;
    if (predictedAwayScore !== null) bet.predicted_away_score = predictedAwayScore;

    const { data, error } = await supabase
      .from('bets')
      .upsert(bet, {
        onConflict: 'user_id,match_id,league_id',
        ignoreDuplicates: false
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get user's bet for a specific match in a league
   * @param {string} matchId - Match UUID
   * @param {string} leagueId - League UUID
   * @returns {Promise<Object|null>} Bet or null
   */
  async getMyBet(matchId, leagueId) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', user.id)
      .eq('match_id', matchId)
      .eq('league_id', leagueId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get all my bets in a league
   * @param {string} leagueId - League UUID
   * @returns {Promise<Array>} User's bets with match details
   */
  async getMyBetsInLeague(leagueId) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await supabase
      .from('user_bets_detailed')
      .select('*')
      .eq('user_id', user.id)
      .eq('league_id', leagueId)
      .order('match_date');
    
    if (error) throw error;
    return data;
  },

  /**
   * Get all my bets across all leagues
   * @returns {Promise<Array>} All user's bets
   */
  async getAllMyBets() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await supabase
      .from('user_bets_detailed')
      .select('*')
      .eq('user_id', user.id)
      .order('match_date');
    
    if (error) throw error;
    return data;
  },

  /**
   * Get all bets for a match (visible after deadline)
   * @param {string} matchId - Match UUID
   * @param {string} leagueId - League UUID
   * @returns {Promise<Array>} All bets for the match
   */
  async getBetsForMatch(matchId, leagueId) {
    const { data, error } = await supabase
      .from('bets')
      .select(`
        *,
        profiles (
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('match_id', matchId)
      .eq('league_id', leagueId);
    
    if (error) throw error;
    return data;
  },

  /**
   * Delete a bet (only before deadline)
   * @param {string} betId - Bet UUID
   * @returns {Promise<void>}
   */
  async deleteBet(betId) {
    const { error } = await supabase
      .from('bets')
      .delete()
      .eq('id', betId);
    
    if (error) throw error;
  },

  /**
   * Get betting stats for current user
   * @returns {Promise<Object>} User's betting statistics
   */
  async getMyStats() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await supabase
      .from('profiles')
      .select('total_bets, correct_bets, total_points')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      accuracy: data.total_bets > 0 
        ? ((data.correct_bets / data.total_bets) * 100).toFixed(1) 
        : 0
    };
  }
};

module.exports = betRepository;
