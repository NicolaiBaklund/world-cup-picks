/**
 * Models Index
 * Exports all models for easy importing
 */

const Nation = require('./Nation');
const Match = require('./Match');
const League = require('./League');
const User = require('./User');
const Bet = require('./Bet');

module.exports = {
  Nation,
  Match,
  League,
  User,
  Bet
};
