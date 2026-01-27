/**
 * Bet Model
 * Represents a user's prediction/pick for a match
 */
class Bet {
  /**
   * @param {string} id - Unique identifier for the bet
   * @param {string} userId - ID of the user making the bet
   * @param {string} matchId - ID of the match being bet on
   * @param {string} leagueId - ID of the league this bet belongs to
   * @param {string} predictedWinner - Predicted winner: 'home', 'away', or 'draw'
   */
  constructor(id, userId, matchId, leagueId, predictedWinner) {
    this.id = id;
    this.userId = userId;
    this.matchId = matchId;
    this.leagueId = leagueId;
    this.predictedWinner = predictedWinner;
    this.createdAt = new Date();
    this.result = {
      isCorrect: null,
      pointsEarned: 0,
      evaluated: false
    };
  }

  /**
   * Evaluate the bet against the actual match result
   * @param {Object} match - Match object with results
   * @param {number} pointsForCorrect - Points awarded for correct prediction
   * @param {number} pointsForWrong - Points awarded for wrong prediction
   * @returns {Object} Evaluation result
   */
  evaluate(match, pointsForCorrect = 1, pointsForWrong = 0) {
    if (!match.isCompleted()) {
      throw new Error('Cannot evaluate bet for incomplete match');
    }

    const actualWinner = match.result.winner;
    this.result.isCorrect = this.predictedWinner === actualWinner;
    this.result.pointsEarned = this.result.isCorrect ? pointsForCorrect : pointsForWrong;
    this.result.evaluated = true;

    return {
      isCorrect: this.result.isCorrect,
      pointsEarned: this.result.pointsEarned
    };
  }

  /**
   * Check if the bet has been evaluated
   * @returns {boolean}
   */
  isEvaluated() {
    return this.result.evaluated;
  }

  /**
   * Get bet details
   * @returns {Object} Bet information
   */
  getDetails() {
    return {
      id: this.id,
      userId: this.userId,
      matchId: this.matchId,
      leagueId: this.leagueId,
      predictedWinner: this.predictedWinner,
      createdAt: this.createdAt,
      result: this.result
    };
  }
}

module.exports = Bet;
