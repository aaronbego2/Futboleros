import { Match, MatchEvent } from '@/types/football';

export const mockMatches: Match[] = [
  {
    id: '1',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    homeScore: 2,
    awayScore: 1,
    status: 'Live',
    minute: 67,
    possession: {
      home: 58,
      away: 42,
    },
    events: [
      {
        id: 'e1',
        matchId: '1',
        type: 'goal',
        team: 'home',
        player: 'Vinícius Jr.',
        minute: 23,
        timestamp: Date.now() - 2640000,
      },
      {
        id: 'e2',
        matchId: '1',
        type: 'goal',
        team: 'away',
        player: 'Robert Lewandowski',
        minute: 45,
        timestamp: Date.now() - 1320000,
      },
      {
        id: 'e3',
        matchId: '1',
        type: 'goal',
        team: 'home',
        player: 'Jude Bellingham',
        minute: 56,
        timestamp: Date.now() - 660000,
      },
      {
        id: 'e4',
        matchId: '1',
        type: 'yellow_card',
        team: 'away',
        player: 'Frenkie de Jong',
        minute: 62,
        timestamp: Date.now() - 300000,
      },
    ],
  },
  {
    id: '2',
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    homeScore: 1,
    awayScore: 1,
    status: 'HT',
    minute: 45,
    possession: {
      home: 62,
      away: 38,
    },
    events: [
      {
        id: 'e5',
        matchId: '2',
        type: 'goal',
        team: 'home',
        player: 'Erling Haaland',
        minute: 12,
        timestamp: Date.now() - 1980000,
      },
      {
        id: 'e6',
        matchId: '2',
        type: 'goal',
        team: 'away',
        player: 'Mohamed Salah',
        minute: 38,
        timestamp: Date.now() - 420000,
      },
    ],
  },
  {
    id: '3',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    homeScore: 3,
    awayScore: 2,
    status: 'Live',
    minute: 82,
    possession: {
      home: 55,
      away: 45,
    },
    events: [
      {
        id: 'e7',
        matchId: '3',
        type: 'goal',
        team: 'home',
        player: 'Harry Kane',
        minute: 15,
        timestamp: Date.now() - 4020000,
      },
      {
        id: 'e8',
        matchId: '3',
        type: 'goal',
        team: 'away',
        player: 'Karim Adeyemi',
        minute: 28,
        timestamp: Date.now() - 3240000,
      },
      {
        id: 'e9',
        matchId: '3',
        type: 'goal',
        team: 'home',
        player: 'Jamal Musiala',
        minute: 51,
        timestamp: Date.now() - 1860000,
      },
      {
        id: 'e10',
        matchId: '3',
        type: 'goal',
        team: 'away',
        player: 'Niclas Füllkrug',
        minute: 65,
        timestamp: Date.now() - 1020000,
      },
      {
        id: 'e11',
        matchId: '3',
        type: 'goal',
        team: 'home',
        player: 'Leroy Sané',
        minute: 78,
        timestamp: Date.now() - 240000,
      },
      {
        id: 'e12',
        matchId: '3',
        type: 'red_card',
        team: 'away',
        player: 'Mats Hummels',
        minute: 79,
        timestamp: Date.now() - 180000,
      },
    ],
  },
  {
    id: '4',
    homeTeam: 'Paris Saint-Germain',
    awayTeam: 'Marseille',
    homeScore: 2,
    awayScore: 0,
    status: 'FT',
    possession: {
      home: 68,
      away: 32,
    },
    events: [
      {
        id: 'e13',
        matchId: '4',
        type: 'goal',
        team: 'home',
        player: 'Kylian Mbappé',
        minute: 34,
        timestamp: Date.now() - 5400000,
      },
      {
        id: 'e14',
        matchId: '4',
        type: 'goal',
        team: 'home',
        player: 'Ousmane Dembélé',
        minute: 71,
        timestamp: Date.now() - 3180000,
      },
    ],
  },
  {
    id: '5',
    homeTeam: 'Chelsea',
    awayTeam: 'Arsenal',
    homeScore: 0,
    awayScore: 0,
    status: 'Upcoming',
    events: [],
  },
  {
    id: '6',
    homeTeam: 'Juventus',
    awayTeam: 'AC Milan',
    homeScore: 0,
    awayScore: 0,
    status: 'Upcoming',
    events: [],
  },
];

export function filterMatchesByStatus(matches: Match[], status: string): Match[] {
  if (status === 'All') return matches;
  if (status === 'Live') return matches.filter((m) => m.status === 'Live' || m.status === 'HT');
  if (status === 'Finished') return matches.filter((m) => m.status === 'FT');
  return matches.filter((m) => m.status === status);
}

export function calculateStats(matches: Match[]) {
  const totalGoals = matches.reduce((acc, match) => acc + match.homeScore + match.awayScore, 0);
  const activeMatches = matches.filter((m) => m.status === 'Live' || m.status === 'HT').length;
  const upcomingMatches = matches.filter((m) => m.status === 'Upcoming').length;

  // Find top scorer from events
  const scorers: { [key: string]: number } = {};
  matches.forEach((match) => {
    match.events?.forEach((event) => {
      if (event.type === 'goal') {
        scorers[event.player] = (scorers[event.player] || 0) + 1;
      }
    });
  });

  const topScorer = Object.entries(scorers).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return {
    totalGoals,
    activeMatches,
    topScorer,
    upcomingMatches,
  };
}
