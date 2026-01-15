import { motion, AnimatePresence } from 'framer-motion';
import { Match, MatchEvent, MatchTeam } from '@/types/football';
import { X, Circle, Users, AlertTriangle } from 'lucide-react';

interface MatchDetailPanelProps {
  match: Match | null;
  onClose: () => void;
}

// Helper to get team info
function getTeamInfo(team: string | MatchTeam): { name: string; logo?: string; score: number } {
  if (typeof team === 'string') {
    return { name: team, score: 0 };
  }
  return { name: team.name, logo: team.logo, score: team.score };
}

export function MatchDetailPanel({ match, onClose }: MatchDetailPanelProps) {
  if (!match) return null;

  const events = match.events || [];
  const sortedEvents = [...events].sort((a, b) => b.minute - a.minute);
  
  const homeTeam = getTeamInfo(match.homeTeam);
  const awayTeam = getTeamInfo(match.awayTeam);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'goal':
        return <Circle className="w-4 h-4 fill-[#ff0000] text-[#ff0000]" />;
      case 'yellow_card':
        return <div className="w-4 h-4 bg-yellow-400 rounded-sm" />;
      case 'red_card':
        return <div className="w-4 h-4 bg-red-500 rounded-sm" />;
      case 'substitution':
        return <Users className="w-4 h-4 text-[#f18904]" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-white/60" />;
    }
  };

  return (
    <AnimatePresence>
      {match && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeOutCubic', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#2b193e] border-l border-[#f18904]/20 z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Encabezado */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Detalles del Partido</h2>
                  <p className="text-white/60 text-sm font-mono">
                    {match.status === 'Live' ? 'En Vivo' : match.status === 'HT' ? 'Entretiempo' : match.status === 'FT' ? 'Finalizado' : 'Próximo'} • {match.minute ? `${match.minute}'` : 'No iniciado'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* League */}
              {match.league && (
                <div className="text-[#f18904] text-sm font-mono mb-2">{match.league}</div>
              )}

              {/* Score Summary */}
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {homeTeam.logo ? (
                      <img src={homeTeam.logo} alt={homeTeam.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#f18904]/20 to-[#ff0000]/20 flex items-center justify-center text-xl font-bold">
                        {homeTeam.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-white font-semibold">{homeTeam.name}</div>
                      <div className="text-white/60 text-xs font-mono">Local</div>
                    </div>
                  </div>
                  <div className="text-5xl font-mono font-extrabold text-white">
                    {match.homeScore}
                  </div>
                </div>
                
                <div className="h-px bg-white/10 my-3" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {awayTeam.logo ? (
                      <img src={awayTeam.logo} alt={awayTeam.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#ff0000]/20 to-[#f18904]/20 flex items-center justify-center text-xl font-bold">
                        {awayTeam.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-white font-semibold">{awayTeam.name}</div>
                      <div className="text-white/60 text-xs font-mono">Visitante</div>
                    </div>
                  </div>
                  <div className="text-5xl font-mono font-extrabold text-white">
                    {match.awayScore}
                  </div>
                </div>
              </div>

              {/* Estadísticas de Posesión */}
              {match.possession && (
                <div className="glass-card rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                    Posesión
                  </h3>
                  <div className="flex gap-2 mb-2">
                    <div
                      className="bg-[#f18904] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${match.possession.home}%` }}
                    />
                    <div
                      className="bg-[#ff0000] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${match.possession.away}%` }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <div className="text-center">
                      <div className="text-3xl font-mono font-extrabold text-[#f18904]">
                        {match.possession.home}%
                      </div>
                      <div className="text-xs text-white/60">{match.homeTeam}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-mono font-extrabold text-[#ff0000]">
                        {match.possession.away}%
                      </div>
                      <div className="text-xs text-white/60">{match.awayTeam}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cronología de Eventos */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                  Cronología de Eventos
                </h3>
                {sortedEvents.length > 0 ? (
                  <div className="space-y-3">
                    {sortedEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center font-mono font-bold text-[#f18904] text-sm">
                          {event.minute}'
                        </div>
                        <div className="flex-shrink-0">{getEventIcon(event.type)}</div>
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm">{event.player}</div>
                          <div className="text-white/60 text-xs capitalize">
                            {event.type === 'goal' ? 'Gol' : event.type === 'yellow_card' ? 'Tarjeta Amarilla' : event.type === 'red_card' ? 'Tarjeta Roja' : event.type === 'substitution' ? 'Sustitución' : event.type.replace('_', ' ')} • {event.team === 'home' ? homeTeam.name : awayTeam.name}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/40 text-sm">
                    No hay eventos registrados aún
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
