export type {
  Database,
  Nation,
  NationHero,
  Profile,
  League,
  LeagueMember,
  Match,
  Bet,
  MatchEvent,
  MatchWithTeams,
  UserBetDetailed,
  GroupStanding,
  LeaderboardEntry,
} from './database'

// UI-specific types
export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled'

export type MatchStage =
  | 'group'
  | 'round-of-32'
  | 'round-of-16'
  | 'quarter-final'
  | 'semi-final'
  | 'third-place'
  | 'final'

export type BetPrediction = 'home' | 'away' | 'draw'

export type LeagueRole = 'admin' | 'member'
