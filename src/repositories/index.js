/**
 * Repositories Index
 * 
 * Export all database repository modules.
 * Repositories handle all Supabase database operations.
 */

const nationRepository = require('./nationRepository');
const matchRepository = require('./matchRepository');
const leagueRepository = require('./leagueRepository');
const betRepository = require('./betRepository');
const profileRepository = require('./profileRepository');

module.exports = {
  nationRepository,
  matchRepository,
  leagueRepository,
  betRepository,
  profileRepository
};
