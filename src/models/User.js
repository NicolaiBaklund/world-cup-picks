/**
 * User Model
 * Represents a user/bettor in the system
 */
class User {
  /**
   * @param {string} id - Unique identifier for the user
   * @param {string} username - User's display name
   * @param {string} email - User's email address
   */
  constructor(id, username, email) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.createdAt = new Date();
    this.stats = {
      totalBets: 0,
      correctBets: 0,
      totalPoints: 0,
      leaguesJoined: []
    };
  }

  /**
   * Join a league
   * @param {string} leagueId - ID of the league to join
   */
  joinLeague(leagueId) {
    if (!this.stats.leaguesJoined.includes(leagueId)) {
      this.stats.leaguesJoined.push(leagueId);
    }
  }

  /**
   * Leave a league
   * @param {string} leagueId - ID of the league to leave
   */
  leaveLeague(leagueId) {
    const index = this.stats.leaguesJoined.indexOf(leagueId);
    if (index > -1) {
      this.stats.leaguesJoined.splice(index, 1);
    }
  }

  /**
   * Update user statistics
   * @param {boolean} wasCorrect - Whether the bet was correct
   * @param {number} points - Points earned
   */
  updateStats(wasCorrect, points) {
    this.stats.totalBets++;
    if (wasCorrect) {
      this.stats.correctBets++;
    }
    this.stats.totalPoints += points;
  }

  /**
   * Get user profile
   * @returns {Object} User profile information
   */
  getProfile() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      createdAt: this.createdAt,
      stats: this.stats
    };
  }

  /**
   * Get user's success rate
   * @returns {number} Percentage of correct bets
   */
  getSuccessRate() {
    if (this.stats.totalBets === 0) return 0;
    return (this.stats.correctBets / this.stats.totalBets) * 100;
  }
}

module.exports = User;
