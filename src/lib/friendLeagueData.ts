import { FriendPlayer, GameSession, PlayerGameStats } from '@/types/football';

const STORAGE_KEY = 'futbol_friend_league';

interface FriendLeagueData {
  players: FriendPlayer[];
  sessions: GameSession[];
}

function getStoredData(): FriendLeagueData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return { players: [], sessions: [] };
}

function saveData(data: FriendLeagueData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getPlayers(): FriendPlayer[] {
  return getStoredData().players;
}

export function addPlayer(player: Omit<FriendPlayer, 'id' | 'goals' | 'assists' | 'gamesPlayed' | 'createdAt'>): FriendPlayer {
  const data = getStoredData();
  const newPlayer: FriendPlayer = {
    ...player,
    id: crypto.randomUUID(),
    goals: 0,
    assists: 0,
    gamesPlayed: 0,
    createdAt: Date.now(),
  };
  data.players.push(newPlayer);
  saveData(data);
  return newPlayer;
}

export function removePlayer(playerId: string): void {
  const data = getStoredData();
  data.players = data.players.filter(p => p.id !== playerId);
  saveData(data);
}

export function getSessions(): GameSession[] {
  return getStoredData().sessions;
}

export function addGameSession(playerStats: PlayerGameStats[]): GameSession {
  const data = getStoredData();
  const session: GameSession = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    playerStats,
  };
  data.sessions.push(session);
  
  // Update player totals
  playerStats.forEach(stat => {
    const player = data.players.find(p => p.id === stat.playerId);
    if (player) {
      player.goals += stat.goals;
      player.assists += stat.assists;
      player.gamesPlayed += 1;
    }
  });
  
  saveData(data);
  return session;
}

export function getLeaderboard(): { 
  topScorers: FriendPlayer[]; 
  topAssisters: FriendPlayer[];
} {
  const players = getPlayers();
  
  const topScorers = [...players]
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10);
    
  const topAssisters = [...players]
    .sort((a, b) => b.assists - a.assists)
    .slice(0, 10);
    
  return { topScorers, topAssisters };
}

export function getPlayerStats(playerId: string): FriendPlayer | undefined {
  return getPlayers().find(p => p.id === playerId);
}

export function calculateAverages(player: FriendPlayer): { 
  goalsPerGame: number; 
  assistsPerGame: number;
} {
  if (player.gamesPlayed === 0) {
    return { goalsPerGame: 0, assistsPerGame: 0 };
  }
  return {
    goalsPerGame: Number((player.goals / player.gamesPlayed).toFixed(2)),
    assistsPerGame: Number((player.assists / player.gamesPlayed).toFixed(2)),
  };
}
