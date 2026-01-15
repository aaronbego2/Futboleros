// Example component showing how to use the API-Football integration

import { useFootballApi } from '@/hooks/useFootballApi';
import { MatchCard } from '@/components/match/MatchCard';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function LiveMatchesFromApi() {
  const { isDark } = useTheme();
  const { matches, loading, error, refetch } = useFootballApi({
    mode: 'live',
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-6 py-3 rounded-lg bg-[#f18904] text-white font-medium hover:bg-[#f18904]/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className={`glass-card rounded-xl p-8 text-center ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>
        <p>No live matches at the moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match, index) => (
        <MatchCard
          key={match.id}
          match={match}
          index={index}
          onClick={() => console.log('Match clicked:', match.id)}
        />
      ))}
    </div>
  );
}

// Example: Get matches by date
export function MatchesByDate({ date }: { date: string }) {
  const { isDark } = useTheme();
  const { matches, loading, error } = useFootballApi({
    mode: 'date',
    date, // Format: YYYY-MM-DD
    autoRefresh: false,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`glass-card rounded-xl p-8 text-center text-red-500`}>
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match, index) => (
        <MatchCard
          key={match.id}
          match={match}
          index={index}
          onClick={() => console.log('Match clicked:', match.id)}
        />
      ))}
    </div>
  );
}
