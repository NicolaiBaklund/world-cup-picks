/**
 * Example Usage - World Cup Picks Application
 * Demonstrates how to use the betting system
 */

const { Nation, Match, League, User, Bet } = require('../src/models');
const { ScoringService, WorldCupAPIService } = require('../src/services');

console.log('=== World Cup Picks - Example Usage ===\n');

// 1. Create Nations
console.log('1. Creating Nations...');
const brazil = new Nation('1', 'Brazil', 'BRA', '🇧🇷', 'A');
const germany = new Nation('2', 'Germany', 'GER', '🇩🇪', 'A');
const argentina = new Nation('3', 'Argentina', 'ARG', '🇦🇷', 'B');
const france = new Nation('4', 'France', 'FRA', '🇫🇷', 'B');

console.log('✓ Created nations:', [brazil.name, germany.name, argentina.name, france.name].join(', '));
console.log('');

// 2. Create Matches
console.log('2. Creating Matches...');
const match1 = new Match(
  'M1',
  brazil,
  germany,
  new Date('2026-06-11T16:00:00Z'),
  'group',
  'Stadium 1'
);

const match2 = new Match(
  'M2',
  argentina,
  france,
  new Date('2026-06-11T19:00:00Z'),
  'group',
  'Stadium 2'
);

console.log('✓ Created match 1:', `${brazil.name} vs ${germany.name}`);
console.log('✓ Created match 2:', `${argentina.name} vs ${france.name}`);
console.log('');

// 3. Create Users
console.log('3. Creating Users...');
const alice = new User('U1', 'Alice', 'alice@example.com');
const bob = new User('U2', 'Bob', 'bob@example.com');
const charlie = new User('U3', 'Charlie', 'charlie@example.com');

console.log('✓ Created users:', [alice.username, bob.username, charlie.username].join(', '));
console.log('');

// 4. Create a League
console.log('4. Creating League...');
const league = new League('L1', 'Friends World Cup 2026', alice.id);
console.log('✓ League created:', league.name);
console.log('  Invite code:', league.code);
console.log('  Creator:', alice.username);

// Add members to league
league.addMember(bob.id);
league.addMember(charlie.id);
bob.joinLeague(league.id);
charlie.joinLeague(league.id);
alice.joinLeague(league.id);

console.log('  Members:', league.members.length);
console.log('');

// 5. Create Bets
console.log('5. Users making predictions...');
const bet1 = new Bet('B1', alice.id, match1.id, league.id, 'home'); // Alice picks Brazil
const bet2 = new Bet('B2', bob.id, match1.id, league.id, 'away'); // Bob picks Germany
const bet3 = new Bet('B3', charlie.id, match1.id, league.id, 'home'); // Charlie picks Brazil

const bet4 = new Bet('B4', alice.id, match2.id, league.id, 'away'); // Alice picks France
const bet5 = new Bet('B5', bob.id, match2.id, league.id, 'home'); // Bob picks Argentina
const bet6 = new Bet('B6', charlie.id, match2.id, league.id, 'draw'); // Charlie picks Draw

console.log(`✓ ${alice.username} predicts: ${brazil.name} to win Match 1`);
console.log(`✓ ${bob.username} predicts: ${germany.name} to win Match 1`);
console.log(`✓ ${charlie.username} predicts: ${brazil.name} to win Match 1`);
console.log(`✓ ${alice.username} predicts: ${france.name} to win Match 2`);
console.log(`✓ ${bob.username} predicts: ${argentina.name} to win Match 2`);
console.log(`✓ ${charlie.username} predicts: Draw in Match 2`);
console.log('');

// 6. Simulate Match Results
console.log('6. Match Results...');
match1.setResult(2, 1); // Brazil wins 2-1
console.log(`✓ Match 1 Result: ${brazil.name} ${match1.result.homeScore} - ${match1.result.awayScore} ${germany.name}`);
console.log(`  Winner: ${match1.getWinner().name}`);

match2.setResult(1, 1); // Draw 1-1
console.log(`✓ Match 2 Result: ${argentina.name} ${match2.result.homeScore} - ${match2.result.awayScore} ${france.name}`);
console.log(`  Winner: ${match2.getWinner() ? match2.getWinner().name : 'Draw'}`);
console.log('');

// 7. Evaluate Bets
console.log('7. Evaluating Bets...');
const allBets = [bet1, bet2, bet3, bet4, bet5, bet6];

allBets.forEach(bet => {
  const match = bet.matchId === match1.id ? match1 : match2;
  const result = ScoringService.evaluateBet(bet, match, league);
  const user = [alice, bob, charlie].find(u => u.id === bet.userId);
  
  console.log(`✓ ${user.username}'s bet on Match ${bet.matchId}:`, 
    result.isCorrect ? '✓ CORRECT' : '✗ WRONG',
    `(${result.pointsEarned} points)`
  );
  
  user.updateStats(result.isCorrect, result.pointsEarned);
});
console.log('');

// 8. Calculate Standings
console.log('8. League Standings...');
const users = [alice, bob, charlie];
const standings = ScoringService.calculateStandings(allBets, [match1, match2], users);

console.log(`\n${league.name} - Standings:`);
console.log('═══════════════════════════════════════');
standings.forEach(standing => {
  console.log(
    `${standing.rank}. ${standing.username.padEnd(10)} ` +
    `Points: ${standing.totalPoints} ` +
    `(${standing.correctBets}/${standing.totalBets} correct)`
  );
});
console.log('');

// 9. User Profiles
console.log('9. User Profiles...');
users.forEach(user => {
  const profile = user.getProfile();
  console.log(`\n${profile.username}:`);
  console.log(`  Email: ${profile.email}`);
  console.log(`  Total Points: ${profile.stats.totalPoints}`);
  console.log(`  Correct Bets: ${profile.stats.correctBets}/${profile.stats.totalBets}`);
  console.log(`  Success Rate: ${user.getSuccessRate().toFixed(1)}%`);
  console.log(`  Leagues: ${profile.stats.leaguesJoined.length}`);
});
console.log('');

// 10. World Cup API Information
console.log('10. World Cup API Integration...');
console.log(WorldCupAPIService.getIntegrationGuide());
console.log('');

// Mock data example
console.log('\nMock Nations Available:');
const mockNations = WorldCupAPIService.mockNations();
mockNations.slice(0, 5).forEach(nation => {
  console.log(`  ${nation.flag} ${nation.name} (${nation.code}) - Group ${nation.group}`);
});
console.log(`  ... and ${mockNations.length - 5} more`);

console.log('\n=== Example Complete ===');
