# API Documentation

## Models

### Nation

Represents a nation/team participating in the World Cup.

#### Constructor
```javascript
new Nation(id, name, code, flag, group)
```

**Parameters:**
- `id` (string): Unique identifier
- `name` (string): Full nation name (e.g., "Brazil")
- `code` (string): ISO country code (e.g., "BRA")
- `flag` (string): Flag emoji or URL (optional)
- `group` (string): World Cup group letter (e.g., "A")

#### Methods

**`getProfile()`**
Returns nation profile information including stats.

**`updateStats(matchResult)`**
Updates nation statistics after a match.

---

### Match

Represents a World Cup match between two nations.

#### Constructor
```javascript
new Match(id, homeTeam, awayTeam, date, stage, venue)
```

**Parameters:**
- `id` (string): Unique match identifier
- `homeTeam` (Nation): Home team
- `awayTeam` (Nation): Away team
- `date` (Date): Match date and time
- `stage` (string): Match stage (default: 'group')
- `venue` (string): Stadium/venue name (optional)

#### Properties
- `status`: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
- `result.homeScore`: Number or null
- `result.awayScore`: Number or null
- `result.winner`: 'home' | 'away' | 'draw' | null

#### Methods

**`setResult(homeScore, awayScore)`**
Set the final score and determine the winner.

**`getWinner()`**
Returns the winning Nation object or null for a draw.

**`isCompleted()`**
Returns true if match status is 'completed'.

**`getDetails()`**
Returns full match information.

---

### League

Represents a betting league/group.

#### Constructor
```javascript
new League(id, name, creatorId, code)
```

**Parameters:**
- `id` (string): Unique league identifier
- `name` (string): League name
- `creatorId` (string): Creator's user ID
- `code` (string): Invite code (auto-generated if not provided)

#### Properties
- `members`: Array of user IDs
- `settings.pointsForCorrectWinner`: Points for correct prediction (default: 1)
- `settings.pointsForWrongGuess`: Points for wrong prediction (default: 0)
- `settings.allowLateJoin`: Allow joining after tournament starts
- `settings.isPublic`: Public or private league

#### Methods

**`addMember(userId)`**
Add a user to the league. Returns success boolean.

**`removeMember(userId)`**
Remove a user from the league (cannot remove creator). Returns success boolean.

**`isMember(userId)`**
Check if a user is a member.

**`getDetails()`**
Returns league information.

**`updateSettings(newSettings)`**
Update league settings.

---

### User

Represents a user/participant.

#### Constructor
```javascript
new User(id, username, email)
```

**Parameters:**
- `id` (string): Unique user identifier
- `username` (string): Display name
- `email` (string): Email address

#### Properties
- `stats.totalBets`: Total number of bets placed
- `stats.correctBets`: Number of correct predictions
- `stats.totalPoints`: Total points earned
- `stats.leaguesJoined`: Array of league IDs

#### Methods

**`joinLeague(leagueId)`**
Add league to user's joined leagues.

**`leaveLeague(leagueId)`**
Remove league from user's joined leagues.

**`updateStats(wasCorrect, points)`**
Update user statistics after bet evaluation.

**`getProfile()`**
Returns user profile information.

**`getSuccessRate()`**
Returns percentage of correct bets (0-100).

---

### Bet

Represents a user's prediction for a match.

#### Constructor
```javascript
new Bet(id, userId, matchId, leagueId, predictedWinner)
```

**Parameters:**
- `id` (string): Unique bet identifier
- `userId` (string): User making the bet
- `matchId` (string): Match being bet on
- `leagueId` (string): League this bet belongs to
- `predictedWinner` (string): 'home' | 'away' | 'draw'

#### Properties
- `result.isCorrect`: Boolean or null
- `result.pointsEarned`: Number (0 if not evaluated)
- `result.evaluated`: Boolean

#### Methods

**`evaluate(match, pointsForCorrect, pointsForWrong)`**
Evaluate the bet against match results. Throws error if match not completed.

**`isEvaluated()`**
Returns true if bet has been evaluated.

**`getDetails()`**
Returns bet information.

---

## Services

### ScoringService

Static methods for bet evaluation and scoring.

#### Methods

**`evaluateBet(bet, match, league)`**
Evaluate a single bet using league scoring settings.

**Parameters:**
- `bet` (Bet): Bet to evaluate
- `match` (Match): Completed match
- `league` (League): League with scoring rules

**Returns:** `{ isCorrect: boolean, pointsEarned: number }`

---

**`calculateStandings(bets, matches, users)`**
Calculate league standings from all bets.

**Parameters:**
- `bets` (Array<Bet>): All bets in the league
- `matches` (Array<Match>): All matches
- `users` (Array<User>): All users in the league

**Returns:** Array of standings objects sorted by points:
```javascript
[
  {
    rank: 1,
    userId: 'U1',
    username: 'Alice',
    totalPoints: 10,
    correctBets: 8,
    totalBets: 12
  },
  // ...
]
```

---

**`getUserScore(userId, leagueId, bets)`**
Get a specific user's score in a league.

**Parameters:**
- `userId` (string): User ID
- `leagueId` (string): League ID
- `bets` (Array<Bet>): All bets

**Returns:**
```javascript
{
  userId: 'U1',
  leagueId: 'L1',
  totalPoints: 10,
  correctBets: 8,
  totalBets: 12,
  successRate: 66.67
}
```

---

### WorldCupAPIService

Service for integrating with World Cup data APIs.

#### Constructor
```javascript
new WorldCupAPIService(apiKey, apiEndpoint)
```

**Parameters:**
- `apiKey` (string): API authentication key (optional)
- `apiEndpoint` (string): API base URL (optional, defaults to football-data.org)

#### Methods

**`fetchNations()`** (async)
Fetch all teams in the World Cup. Not yet implemented.

**`fetchMatches()`** (async)
Fetch all matches. Not yet implemented.

**`fetchMatch(matchId)`** (async)
Fetch specific match details. Not yet implemented.

#### Static Methods

**`mockNations()`**
Returns array of 16 mock nations for testing.

**`mockMatches()`**
Returns array of 4 mock matches for testing.

**`getIntegrationGuide()`**
Returns integration instructions for popular World Cup APIs.

---

## Usage Examples

### Complete Betting Flow

```javascript
const { Nation, Match, League, User, Bet } = require('./src/models');
const { ScoringService } = require('./src/services');

// 1. Set up nations and matches
const brazil = new Nation('1', 'Brazil', 'BRA', '🇧🇷', 'A');
const germany = new Nation('2', 'Germany', 'GER', '🇩🇪', 'A');

const match = new Match('M1', brazil, germany, new Date(), 'group', 'Stadium');

// 2. Create league and users
const league = new League('L1', 'My League', 'creator-id');
const alice = new User('U1', 'Alice', 'alice@example.com');
const bob = new User('U2', 'Bob', 'bob@example.com');

league.addMember(alice.id);
league.addMember(bob.id);
alice.joinLeague(league.id);
bob.joinLeague(league.id);

// 3. Users place bets
const aliceBet = new Bet('B1', alice.id, match.id, league.id, 'home');
const bobBet = new Bet('B2', bob.id, match.id, league.id, 'away');

// 4. Match completes
match.setResult(3, 1); // Brazil wins 3-1

// 5. Evaluate bets
const aliceResult = ScoringService.evaluateBet(aliceBet, match, league);
const bobResult = ScoringService.evaluateBet(bobBet, match, league);

console.log(aliceResult); // { isCorrect: true, pointsEarned: 1 }
console.log(bobResult);   // { isCorrect: false, pointsEarned: 0 }

// 6. Update user stats
alice.updateStats(aliceResult.isCorrect, aliceResult.pointsEarned);
bob.updateStats(bobResult.isCorrect, bobResult.pointsEarned);

// 7. Calculate standings
const standings = ScoringService.calculateStandings(
  [aliceBet, bobBet],
  [match],
  [alice, bob]
);

console.log(standings);
// [
//   { rank: 1, userId: 'U1', username: 'Alice', totalPoints: 1, ... },
//   { rank: 2, userId: 'U2', username: 'Bob', totalPoints: 0, ... }
// ]
```

### Using Mock Data

```javascript
const { WorldCupAPIService } = require('./src/services');
const { Nation, Match } = require('./src/models');

// Get mock nations
const mockNationsData = WorldCupAPIService.mockNations();

// Create Nation objects from mock data
const nations = mockNationsData.map(n => 
  new Nation(n.id, n.name, n.code, n.flag, n.group)
);

// Get mock matches
const mockMatchesData = WorldCupAPIService.mockMatches();

// Create Match objects from mock data
const matches = mockMatchesData.map(m =>
  new Match(m.id, m.homeTeam, m.awayTeam, m.date, m.stage, m.venue)
);
```
