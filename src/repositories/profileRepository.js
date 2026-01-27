/**
 * Profile Repository
 * 
 * Database operations for user profiles and authentication.
 */

const { supabase } = require('../lib/supabase');

const profileRepository = {
  /**
   * Sign up a new user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} username - Desired username
   * @param {string} displayName - Display name (optional)
   * @returns {Promise<Object>} User data
   */
  async signUp(email, password, username, displayName = null) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName || username
        }
      }
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Sign in an existing user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Session data
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current logged-in user
   * @returns {Promise<Object|null>} User or null
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Get current user's profile
   * @returns {Promise<Object>} Profile data
   */
  async getMyProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not logged in');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get a profile by user ID
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Profile data
   */
  async getById(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get a profile by username
   * @param {string} username - Username
   * @returns {Promise<Object>} Profile data
   */
  async getByUsername(username) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Update current user's profile
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated profile
   */
  async updateMyProfile(updates) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not logged in');

    const allowedFields = ['username', 'display_name', 'avatar_url'];
    const safeUpdates = {};
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        safeUpdates[field] = updates[field];
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(safeUpdates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Check if a username is available
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} True if available
   */
  async isUsernameAvailable(username) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    
    if (error) throw error;
    return data === null;
  },

  /**
   * Subscribe to auth state changes
   * @param {Function} callback - Called when auth state changes
   * @returns {Object} Subscription object (call .unsubscribe() to stop)
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};

module.exports = profileRepository;
