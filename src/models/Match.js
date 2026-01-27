/**
 * Match Model
 * Represents a World Cup match between two nations
 */
class Match {
  /**
   * @param {string} id - Unique identifier for the match
   * @param {Object} homeTeam - Home team Nation object or reference
   * @param {Object} awayTeam - Away team Nation object or reference
   * @param {Date} date - Match date and time
   * @param {string} stage - Match stage (e.g., 'group', 'round-of-16', 'quarter-final', 'semi-final', 'final')
   * @param {string} venue - Match venue/stadium
   */
  constructor(id, homeTeam, awayTeam, date, stage = 'group', venue = '') {
    this.id = id;
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.date = date;
    this.stage = stage;
    this.venue = venue;
    this.status = 'scheduled'; // scheduled, in-progress, completed, cancelled
    this.result = {
      homeScore: null,
      awayScore: null,
      winner: null // 'home', 'away', 'draw'
    };
  }

  /**
   * Set the match result
   * @param {number} homeScore - Home team score
   * @param {number} awayScore - Away team score
   */
  setResult(homeScore, awayScore) {
    this.result.homeScore = homeScore;
    this.result.awayScore = awayScore;
    
    if (homeScore > awayScore) {
      this.result.winner = 'home';
    } else if (awayScore > homeScore) {
      this.result.winner = 'away';
    } else {
      this.result.winner = 'draw';
    }
    
    this.status = 'completed';
  }

  /**
   * Get the winning team
   * @returns {Object|null} Winning team or null if draw/not completed
   */
  getWinner() {
    if (this.result.winner === 'home') {
      return this.homeTeam;
    } else if (this.result.winner === 'away') {
      return this.awayTeam;
    }
    return null;
  }

  /**
   * Check if match is completed
   * @returns {boolean}
   */
  isCompleted() {
    return this.status === 'completed';
  }

  /**
   * Get match details
   * @returns {Object} Match information
   */
  getDetails() {
    return {
      id: this.id,
      homeTeam: this.homeTeam,
      awayTeam: this.awayTeam,
      date: this.date,
      stage: this.stage,
      venue: this.venue,
      status: this.status,
      result: this.result
    };
  }
}

module.exports = Match;
