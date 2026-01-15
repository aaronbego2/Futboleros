// API-Football Service Integration
// Base URL: https://v3.football.api-sports.io/

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY || '';
const BASE_URL = 'https://v3.football.api-sports.io';

// Use a CORS proxy for browser requests
const CORS_PROXY = 'https://corsproxy.io/?';

interface ApiResponse<T> {
  get: string;
  parameters: Record<string, any>;
  errors: Record<string, string> | any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T;
}

// Generic fetch function with API-Football headers
async function fetchFromApi<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  // Use CORS proxy to avoid CORS issues in browser
  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url.toString())}`;

  const response = await fetch(proxyUrl, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
  });

  if (!response.ok) {
    throw new Error(`Error de API: ${response.status} ${response.statusText}`);
  }

  const data: ApiResponse<T> = await response.json();
  
  // Check for errors (can be object or array)
  if (data.errors) {
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      throw new Error(`Error de API: ${JSON.stringify(data.errors)}`);
    }
    if (typeof data.errors === 'object' && Object.keys(data.errors).length > 0) {
      throw new Error(`Error de API: ${JSON.stringify(data.errors)}`);
    }
  }

  return data.response;
}

// Live matches
export async function getLiveMatches() {
  return fetchFromApi('/fixtures', { live: 'all' });
}

// Fixtures by date
export async function getFixturesByDate(date: string) {
  // date format: YYYY-MM-DD
  return fetchFromApi('/fixtures', { date });
}

// Fixtures by league and season
export async function getFixturesByLeague(leagueId: string, season: string) {
  return fetchFromApi('/fixtures', { league: leagueId, season });
}

// Get specific fixture details
export async function getFixtureById(fixtureId: string) {
  return fetchFromApi('/fixtures', { id: fixtureId });
}

// Get fixture statistics
export async function getFixtureStatistics(fixtureId: string) {
  return fetchFromApi('/fixtures/statistics', { fixture: fixtureId });
}

// Get fixture events (goals, cards, substitutions)
export async function getFixtureEvents(fixtureId: string) {
  return fetchFromApi('/fixtures/events', { fixture: fixtureId });
}

// Get fixture lineups
export async function getFixtureLineups(fixtureId: string) {
  return fetchFromApi('/fixtures/lineups', { fixture: fixtureId });
}

// Get leagues
export async function getLeagues(country?: string, season?: string) {
  const params: Record<string, string> = {};
  if (country) params.country = country;
  if (season) params.season = season;
  return fetchFromApi('/leagues', params);
}

// Get teams by league
export async function getTeamsByLeague(leagueId: string, season: string) {
  return fetchFromApi('/teams', { league: leagueId, season });
}

// Get team statistics
export async function getTeamStatistics(teamId: string, leagueId: string, season: string) {
  return fetchFromApi('/teams/statistics', { 
    team: teamId, 
    league: leagueId, 
    season 
  });
}

// Get standings
export async function getStandings(leagueId: string, season: string) {
  return fetchFromApi('/standings', { league: leagueId, season });
}

// Get top scorers
export async function getTopScorers(leagueId: string, season: string) {
  return fetchFromApi('/players/topscorers', { league: leagueId, season });
}

// Get top assists
export async function getTopAssists(leagueId: string, season: string) {
  return fetchFromApi('/players/topassists', { league: leagueId, season });
}
