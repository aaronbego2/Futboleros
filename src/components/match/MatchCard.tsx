import { motion } from 'framer-motion';
import { Match, MatchTeam } from '@/types/football';
import { Clock } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface MatchCardProps {
  match: Match;
  onClick: () => void;
  delay?: number;
  index?: number;
}

// Helper to get team name and logo
function getTeamInfo(team: string | MatchTeam): { name: string; logo?: string; score: number } {
  if (typeof team === 'string') {
    return { name: team, score: 0 };
  }
  return { name: team.name, logo: team.logo, score: team.score };
}

export function MatchCard({ match, onClick, delay = 0 }: MatchCardProps) {
  const { isDark } = useTheme();
  const isLive = match.status === 'Live' || match.status === 'HT';
  
  const homeTeam = getTeamInfo(match.homeTeam);
  const awayTeam = getTeamInfo(match.awayTeam);
  const homeScore = match.homeScore ?? homeTeam.score;
  const awayScore = match.awayScore ?? awayTeam.score;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={onClick}
      className="glass-card rounded-xl p-6 cursor-pointer transition-all duration-150 hover:glow-teal"
    >
      {/* Status Badge */}
      <div className="flex justify-between items-center mb-4">
        <div
          className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
            isLive
              ? 'bg-[#f18904]/20 text-[#f18904] animate-pulse'
              : match.status === 'FT'
              ? `bg-white/10 ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`
              : 'bg-[#ff0000]/20 text-[#ff0000]'
          }`}
        >
          {match.status}
        </div>
        {match.minute && (
          <div className={`flex items-center gap-1 text-sm font-mono ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>
            <Clock className="w-3 h-3" />
            <span>{match.minute}'</span>
          </div>
        )}
      </div>

      {/* League */}
      {match.league && (
        <div className={`text-xs font-mono mb-3 ${isDark ? 'text-white/40' : 'text-[#2b193e]/40'}`}>
          {match.league}
        </div>
      )}

      {/* Teams and Scores */}
      <div className="space-y-4">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {homeTeam.logo ? (
              <img src={homeTeam.logo} alt={homeTeam.name} className="w-10 h-10 object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f18904]/20 to-[#ff0000]/20 flex items-center justify-center text-lg font-bold">
                {homeTeam.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <span className={`font-medium text-lg truncate ${isDark ? 'text-white' : 'text-[#2b193e]'}`}>{homeTeam.name}</span>
          </div>
          <motion.span
            key={homeScore}
            initial={{ scale: 1.5, color: '#f18904' }}
            animate={{ scale: 1, color: isDark ? '#ffffff' : '#2b193e' }}
            transition={{ duration: 0.3 }}
            className="text-5xl font-mono font-extrabold"
          >
            {homeScore}
          </motion.span>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {awayTeam.logo ? (
              <img src={awayTeam.logo} alt={awayTeam.name} className="w-10 h-10 object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff0000]/20 to-[#f18904]/20 flex items-center justify-center text-lg font-bold">
                {awayTeam.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <span className={`font-medium text-lg truncate ${isDark ? 'text-white' : 'text-[#2b193e]'}`}>{awayTeam.name}</span>
          </div>
          <motion.span
            key={awayScore}
            initial={{ scale: 1.5, color: '#f18904' }}
            animate={{ scale: 1, color: isDark ? '#ffffff' : '#2b193e' }}
            transition={{ duration: 0.3 }}
            className="text-5xl font-mono font-extrabold"
          >
            {awayScore}
          </motion.span>
        </div>
      </div>

      {/* Barra de Posesión (si está disponible) */}
      {match.possession && isLive && (
        <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-[#2b193e]/10'}`}>
          <div className={`flex justify-between text-xs mb-2 font-mono ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>
            <span>Posesión</span>
          </div>
          <div className="flex gap-1 h-1.5">
            <div
              className="bg-[#f18904] rounded-full transition-all duration-500"
              style={{ width: `${match.possession.home}%` }}
            />
            <div
              className="bg-[#ff0000] rounded-full transition-all duration-500"
              style={{ width: `${match.possession.away}%` }}
            />
          </div>
          <div className={`flex justify-between text-xs mt-1 font-mono font-bold ${isDark ? 'text-white/80' : 'text-[#2b193e]/80'}`}>
            <span>{match.possession.home}%</span>
            <span>{match.possession.away}%</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
