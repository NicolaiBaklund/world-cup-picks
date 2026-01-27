/**
 * Nation Model
 * Represents a nation/team participating in the World Cup
 */
class Nation {
  /**
   * @param {string} id - Unique identifier for the nation
   * @param {string} name - Full name of the nation
   * @param {string} code - ISO country code (e.g., 'USA', 'BRA', 'GER')
   * @param {string} flag - URL or path to flag image
   * @param {string} group - World Cup group (e.g., 'A', 'B', 'C')
   */
  constructor(id, name, code, flag = '', group = '') {
    this.id = id;
    this.name = name;
    this.code = code;
    this.flag = flag;
    this.group = group;
    this.stats = {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
    };
  }

  /**
   * Get nation profile information
   * @returns {Object} Nation profile
   */
  getProfile() {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      flag: this.flag,
      group: this.group,
      stats: this.stats
    };
  }

  /**
   * Update nation statistics
   * @param {Object} matchResult - Match result data
   */
  updateStats(matchResult) {
    this.stats.played++;
    this.stats.goalsFor += matchResult.goalsFor;
    this.stats.goalsAgainst += matchResult.goalsAgainst;

    if (matchResult.goalsFor > matchResult.goalsAgainst) {
      this.stats.won++;
      this.stats.points += 3;
    } else if (matchResult.goalsFor === matchResult.goalsAgainst) {
      this.stats.drawn++;
      this.stats.points += 1;
    } else {
      this.stats.lost++;
    }
  }
}

module.exports = Nation;
