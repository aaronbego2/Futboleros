export interface Team {
  id: string;
  name: string;
  badge: string;
  shortName: string;
}

export interface MatchTeam {
  id: string;
  name: string;
  logo?: string;
  score: number;
}

export interface Match {
  id: string;
  homeTeam: string | MatchTeam;
  awayTeam: string | MatchTeam;
  homeScore: number;
  awayScore: number;
  status: 'Live' | 'HT' | 'FT' | 'Upcoming';
  minute?: number;
  league?: string;
  possession?: {
    home: number;
    away: number;
  };
  events?: MatchEvent[];
}

export interface MatchEvent {
  id: string;
  matchId: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  team: 'home' | 'away';
  player: string;
  minute: number;
  timestamp: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  number: number;
  position: string;
}

export type MatchStatus = 'All' | 'Live' | 'Upcoming' | 'Finished';

// Friend League Types
export interface FriendPlayer {
  id: string;
  fullName: string;
  alias: string;
  dorsal: number;
  position: 'Portero' | 'Defensa' | 'Mediocampista' | 'Delantero';
  goals: number;
  assists: number;
  gamesPlayed: number;
  createdAt: number;
}

export interface GameSession {
  id: string;
  date: string;
  playerStats: PlayerGameStats[];
}

export interface PlayerGameStats {
  playerId: string;
  goals: number;
  assists: number;
}
