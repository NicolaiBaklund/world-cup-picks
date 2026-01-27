# World Cup Picks 🏆⚽

A web application for betting on the 2026 World Cup with your friends!

## Features

- **Nations/Teams**: Full nation profiles with statistics and group information
- **Matches**: Match objects containing two nations with results tracking
- **Leagues**: Create private leagues/groups to compete with friends
- **Betting System**: Simple scoring - 1 point for correct winner prediction, 0 for wrong
- **Leaderboards**: Automatic standings calculation for each league
- **World Cup API**: Ready for integration with World Cup data APIs

## Project Structure

```
world-cup-picks/
├── src/
│   ├── models/           # Data models
│   │   ├── Nation.js     # Nation/team model with profiles
│   │   ├── Match.js      # Match model with two nations
│   │   ├── League.js     # League/group model for friends
│   │   ├── User.js       # User model for participants
│   │   ├── Bet.js        # Bet/pick model for predictions
│   │   └── index.js      # Models export
│   ├── services/         # Business logic
│   │   ├── ScoringService.js      # Bet evaluation & scoring
│   │   ├── WorldCupAPIService.js  # API integration
│   │   └── index.js               # Services export
│   └── index.js          # Main entry point
├── examples/
│   └── basic-usage.js    # Complete usage example
└── package.json
```

## Getting Started

### Installation

```bash
npm install
```

### Run the Example

```bash
npm start
```

This will run the example demonstration showing:
- Creating nations with profiles
- Setting up matches
- Creating leagues with friends
- Making predictions/bets
- Evaluating results
- Calculating standings

## Usage Guide

### 1. Create Nations

Each nation has a profile with statistics:

```javascript
const { Nation } = require('./src/models');

const brazil = new Nation('1', 'Brazil', 'BRA', '🇧🇷', 'A');
const germany = new Nation('2', 'Germany', 'GER', '🇩🇪', 'A');
```

### 2. Create Matches

Matches contain two nations:

```javascript
const { Match } = require('./src/models');

const match = new Match(
  'M1',                              // Match ID
  brazil,                            // Home team
  germany,                           // Away team
  new Date('2026-06-11T16:00:00Z'), // Date
  'group',                           // Stage
  'Stadium 1'                        // Venue
);
```

### 3. Create a League

Form leagues/groups with friends:

```javascript
const { League } = require('./src/models');

const league = new League('L1', 'Friends World Cup 2026', creatorUserId);
console.log('Invite code:', league.code); // Share this code with friends

// Friends join the league
league.addMember(friendUserId);
```

### 4. Create Users

```javascript
const { User } = require('./src/models');

const user = new User('U1', 'Alice', 'alice@example.com');
user.joinLeague(league.id);
```

### 5. Place Bets

Users predict match winners:

```javascript
const { Bet } = require('./src/models');

// Predict 'home', 'away', or 'draw'
const bet = new Bet('B1', userId, matchId, leagueId, 'home');
```

### 6. Set Match Results

```javascript
match.setResult(2, 1); // Brazil 2 - 1 Germany
console.log('Winner:', match.getWinner().name); // 'Brazil'
```

### 7. Evaluate Bets & Calculate Scores

```javascript
const { ScoringService } = require('./src/services');

// Evaluate a bet (1 point for correct, 0 for wrong)
const result = ScoringService.evaluateBet(bet, match, league);
console.log('Points earned:', result.pointsEarned);

// Calculate league standings
const standings = ScoringService.calculateStandings(bets, matches, users);
standings.forEach(standing => {
  console.log(`${standing.rank}. ${standing.username}: ${standing.totalPoints} points`);
});
```

## World Cup API Integration

The app is ready to integrate with World Cup APIs. Popular options:

- **football-data.org** - Free tier with 10 requests/minute
- **API-Football** - Comprehensive sports data via RapidAPI
- **TheOddsAPI** - Sports data with betting odds

### Mock Data for Testing

```javascript
const { WorldCupAPIService } = require('./src/services');

// Get mock nations
const nations = WorldCupAPIService.mockNations();

// Get mock matches
const matches = WorldCupAPIService.mockMatches();

// See integration guide
console.log(WorldCupAPIService.getIntegrationGuide());
```

## Scoring System

The initial scoring logic is simple:
- **Correct winner prediction**: 1 point
- **Wrong prediction**: 0 points

League settings can be customized:

```javascript
league.updateSettings({
  pointsForCorrectWinner: 1,
  pointsForWrongGuess: 0,
  allowLateJoin: true,
  isPublic: false
});
```

## Models Overview

### Nation
- Profile with name, code, flag, group
- Statistics tracking (wins, losses, draws, goals)
- Used in Match objects

### Match
- Contains home and away teams (Nation objects)
- Tracks match status and results
- Determines winner

### League
- Groups of friends competing
- Invite code for joining
- Customizable scoring settings
- Member management

### User
- User profiles with email
- Statistics tracking
- Multiple league participation

### Bet
- User's prediction for a match
- Links user, match, and league
- Automatic evaluation against results

## Next Steps

To build a full web application, consider adding:

1. **Database**: Store data persistently (MongoDB, PostgreSQL, etc.)
2. **Backend API**: Express.js or similar framework
3. **Frontend**: React, Vue, or other framework for the UI
4. **Authentication**: User registration and login
5. **Real-time Updates**: WebSockets for live scores
6. **World Cup API**: Integrate with a real data source

## License

ISC
