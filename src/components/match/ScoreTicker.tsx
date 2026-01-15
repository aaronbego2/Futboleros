import { motion } from 'framer-motion';
import { Match, MatchTeam } from '@/types/football';
import { Target } from 'lucide-react';

interface ScoreTickerProps {
  matches: Match[];
}

// Helper to get team name
function getTeamName(team: string | MatchTeam): string {
  return typeof team === 'string' ? team : team.name;
}

// Helper to get team logo
function getTeamLogo(team: string | MatchTeam): string | undefined {
  return typeof team === 'string' ? undefined : team.logo;
}

export function ScoreTicker({ matches }: ScoreTickerProps) {
  const liveMatches = matches.filter(
    (m) => m.status === 'Live' || m.status === 'HT' || m.status === 'FT'
  );

  if (liveMatches.length === 0) {
    return (
      <div className="relative overflow-hidden glass-card border-b border-[#f18904]/20">
        <div className="flex items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-2 text-[#f18904]">
            <Target className="w-4 h-4" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              Marcadores en Vivo
            </span>
          </div>
          <span className="text-white/40 text-sm font-mono">
            No hay partidos en vivo en este momento
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden glass-card border-b border-[#f18904]/20">
      <div className="flex items-center gap-4 px-6 py-3">
        <div className="flex items-center gap-2 text-[#f18904] flex-shrink-0">
          <Target className="w-4 h-4" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider">
            Marcadores en Vivo
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#f18904]/20 text-[#f18904] text-xs font-mono">
            {liveMatches.length}
          </span>
        </div>
        
        <div className="overflow-hidden flex-1">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: Math.max(20, liveMatches.length * 10),
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex gap-8 whitespace-nowrap"
          >
            {[...liveMatches, ...liveMatches].map((match, index) => {
              const homeName = getTeamName(match.homeTeam);
              const awayName = getTeamName(match.awayTeam);
              const homeLogo = getTeamLogo(match.homeTeam);
              const awayLogo = getTeamLogo(match.awayTeam);
              
              return (
                <div
                  key={`${match.id}-${index}`}
                  className="flex items-center gap-3 text-sm"
                >
                  {/* Home Team */}
                  <div className="flex items-center gap-2">
                    {homeLogo && (
                      <img src={homeLogo} alt={homeName} className="w-5 h-5 object-contain" />
                    )}
                    <span className="text-white/80 font-medium">{homeName}</span>
                  </div>
                  
                  {/* Score */}
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10">
                    <span className="font-mono font-bold text-white">{match.homeScore}</span>
                    <span className="text-white/40">-</span>
                    <span className="font-mono font-bold text-white">{match.awayScore}</span>
                  </div>
                  
                  {/* Away Team */}
                  <div className="flex items-center gap-2">
                    {awayLogo && (
                      <img src={awayLogo} alt={awayName} className="w-5 h-5 object-contain" />
                    )}
                    <span className="text-white/80 font-medium">{awayName}</span>
                  </div>
                  
                  {/* Minute */}
                  {match.minute && (
                    <span className="text-[#ff0000] font-mono text-xs animate-pulse">
                      {match.minute}'
                    </span>
                  )}
                  
                  {/* Status for HT/FT */}
                  {(match.status === 'HT' || match.status === 'FT') && (
                    <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                      match.status === 'HT' ? 'bg-[#f18904]/20 text-[#f18904]' : 'bg-white/10 text-white/60'
                    }`}>
                      {match.status}
                    </span>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
