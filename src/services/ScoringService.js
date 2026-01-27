/**
 * Scoring Service
 * Handles bet evaluation and scoring logic
 */
class ScoringService {
  /**
   * Evaluate a single bet
   * @param {Bet} bet - Bet to evaluate
   * @param {Match} match - Completed match
   * @param {League} league - League with scoring settings
   * @returns {Object} Evaluation result
   */
  static evaluateBet(bet, match, league) {
    const { pointsForCorrectWinner, pointsForWrongGuess } = league.settings;
    return bet.evaluate(match, pointsForCorrectWinner, pointsForWrongGuess);
  }

  /**
   * Calculate standings for a league
   * @param {Array<Bet>} bets - All bets in the league
   * @param {Array<Match>} matches - All matches
   * @param {Array<User>} users - All users in the league
   * @returns {Array<Object>} Standings sorted by points
   */
  static calculateStandings(bets, matches, users) {
    const userScores = {};

    // Initialize scores for all users
    users.forEach(user => {
      userScores[user.id] = {
        userId: user.id,
        username: user.username,
        totalPoints: 0,
        correctBets: 0,
        totalBets: 0
      };
    });

    // Calculate scores from evaluated bets
    bets.forEach(bet => {
      if (bet.isEvaluated()) {
        const userScore = userScores[bet.userId];
        if (userScore) {
          userScore.totalPoints += bet.result.pointsEarned;
          userScore.totalBets++;
          if (bet.result.isCorrect) {
            userScore.correctBets++;
          }
        }
      }
    });

    // Convert to array and sort by points (descending)
    const standings = Object.values(userScores).sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      // Tie-breaker: more correct bets
      return b.correctBets - a.correctBets;
    });

    // Add rank
    standings.forEach((standing, index) => {
      standing.rank = index + 1;
    });

    return standings;
  }

  /**
   * Get user's score in a specific league
   * @param {string} userId - User ID
   * @param {string} leagueId - League ID
   * @param {Array<Bet>} bets - All bets in the league
   * @returns {Object} User's score details
   */
  static getUserScore(userId, leagueId, bets) {
    const userBets = bets.filter(
      bet => bet.userId === userId && bet.leagueId === leagueId && bet.isEvaluated()
    );

    const totalPoints = userBets.reduce((sum, bet) => sum + bet.result.pointsEarned, 0);
    const correctBets = userBets.filter(bet => bet.result.isCorrect).length;

    return {
      userId,
      leagueId,
      totalPoints,
      correctBets,
      totalBets: userBets.length,
      successRate: userBets.length > 0 ? (correctBets / userBets.length) * 100 : 0
    };
  }
}

module.exports = ScoringService;
