// React hook for fetching live matches from API-Football

import { useState, useEffect, useCallback } from 'react';
import { Match } from '@/types/football';
import { ApiFixture } from '@/types/apiFootball';
import { getLiveMatches, getFixturesByDate } from '@/lib/footballApi';
import { convertApiFixtureToMatch } from '@/lib/footballApiHelpers';

interface UseFootballApiOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
  mode: 'live' | 'date';
  date?: string; // YYYY-MM-DD format
}

interface UseFootballApiResult {
  matches: Match[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFootballApi(options: UseFootballApiOptions): UseFootballApiResult {
  const { autoRefresh = true, refreshInterval = 30000, mode, date } = options;
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setError(null);
      
      let apiFixtures: ApiFixture[];
      
      if (mode === 'live') {
        apiFixtures = await getLiveMatches();
      } else if (mode === 'date' && date) {
        apiFixtures = await getFixturesByDate(date);
      } else {
        throw new Error('Invalid mode or missing date parameter');
      }

      const convertedMatches = apiFixtures.map(convertApiFixtureToMatch);
      setMatches(convertedMatches);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch matches';
      setError(errorMessage);
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  }, [mode, date]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchMatches();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchMatches]);

  return {
    matches,
    loading,
    error,
    refetch: fetchMatches,
  };
}
