// Utility functions to convert API-Football data to our app's format

import { Match, MatchEvent, MatchTeam } from '@/types/football';
import { ApiFixture, ApiFixtureEvent, ApiFixtureStatistic } from '@/types/apiFootball';

export function convertApiFixtureToMatch(apiFixture: ApiFixture): Match {
  const status = apiFixture.fixture.status.short;
  const elapsed = apiFixture.fixture.status.elapsed;

  const homeTeam: MatchTeam = {
    id: apiFixture.teams.home.id.toString(),
    name: apiFixture.teams.home.name,
    logo: apiFixture.teams.home.logo,
    score: apiFixture.goals.home || 0,
  };

  const awayTeam: MatchTeam = {
    id: apiFixture.teams.away.id.toString(),
    name: apiFixture.teams.away.name,
    logo: apiFixture.teams.away.logo,
    score: apiFixture.goals.away || 0,
  };

  return {
    id: apiFixture.fixture.id.toString(),
    homeTeam,
    awayTeam,
    homeScore: apiFixture.goals.home || 0,
    awayScore: apiFixture.goals.away || 0,
    status: mapApiStatus(status),
    minute: elapsed || undefined,
    league: apiFixture.league.name,
  };
}

function mapApiStatus(apiStatus: string): Match['status'] {
  // API-Football status codes:
  // TBD, NS, 1H, HT, 2H, ET, P, FT, AET, PEN, BT, SUSP, INT, PST, CANC, ABD, AWD, WO
  
  const statusMap: Record<string, Match['status']> = {
    'TBD': 'Upcoming',
    'NS': 'Upcoming',
    '1H': 'Live',
    'HT': 'HT',
    '2H': 'Live',
    'ET': 'Live',
    'P': 'Live',
    'FT': 'FT',
    'AET': 'FT',
    'PEN': 'FT',
    'BT': 'Live',
  };

  return statusMap[apiStatus] || 'FT';
}

export function convertApiEventsToMatchEvents(apiEvents: ApiFixtureEvent[]): MatchEvent[] {
  return apiEvents.map(event => ({
    id: `${event.time.elapsed}-${event.player.id}-${event.type}`,
    minute: event.time.elapsed,
    type: mapEventType(event.type),
    team: event.team.name,
    player: event.player.name,
    description: event.detail,
  }));
}

function mapEventType(apiType: string): MatchEvent['type'] {
  const typeMap: Record<string, MatchEvent['type']> = {
    'Goal': 'goal',
    'Card': 'card',
    'subst': 'substitution',
  };

  return typeMap[apiType] || 'substitution';
}

export function extractPossessionFromStatistics(statistics: ApiFixtureStatistic[]): { home: number; away: number } | undefined {
  if (statistics.length < 2) return undefined;

  const homeStats = statistics[0].statistics.find(s => s.type === 'Ball Possession');
  const awayStats = statistics[1].statistics.find(s => s.type === 'Ball Possession');

  if (!homeStats || !awayStats) return undefined;

  const homeValue = typeof homeStats.value === 'string' ? parseInt(homeStats.value) : homeStats.value;
  const awayValue = typeof awayStats.value === 'string' ? parseInt(awayStats.value) : awayStats.value;

  if (typeof homeValue !== 'number' || typeof awayValue !== 'number') return undefined;

  return {
    home: homeValue,
    away: awayValue,
  };
}

export function extractShotsFromStatistics(statistics: ApiFixtureStatistic[]): { home: number; away: number } | undefined {
  if (statistics.length < 2) return undefined;

  const homeStats = statistics[0].statistics.find(s => s.type === 'Total Shots');
  const awayStats = statistics[1].statistics.find(s => s.type === 'Total Shots');

  if (!homeStats || !awayStats) return undefined;

  const homeValue = typeof homeStats.value === 'number' ? homeStats.value : null;
  const awayValue = typeof awayStats.value === 'number' ? awayStats.value : null;

  if (homeValue === null || awayValue === null) return undefined;

  return {
    home: homeValue,
    away: awayValue,
  };
}
