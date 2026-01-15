import { useState, useMemo, useEffect, useCallback } from 'react';
import { Match, MatchStatus } from '@/types/football';
import { MatchCard } from '@/components/match/MatchCard';
import { MatchDetailPanel } from '@/components/match/MatchDetailPanel';
import { ScoreTicker } from '@/components/match/ScoreTicker';
import { StatusFilter } from '@/components/match/StatusFilter';
import { StatsGrid } from '@/components/match/StatsGrid';
import { SyncIndicator } from '@/components/match/SyncIndicator';
import { filterMatchesByStatus, calculateStats } from '@/lib/mockData';
import { useTheme } from '@/contexts/ThemeContext';
import { AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { getLiveMatches, getFixturesByDate } from '@/lib/footballApi';
import { convertApiFixtureToMatch } from '@/lib/footballApiHelpers';
import { ApiFixture } from '@/types/apiFootball';

export function LiveMatchDashboard() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [statusFilter, setStatusFilter] = useState<MatchStatus>('All');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { isDark } = useTheme();

  const fetchLiveMatches = useCallback(async () => {
    try {
      setError(null);
      
      // Obtener la fecha de hoy para los partidos
      const today = new Date().toISOString().split('T')[0];
      
      // Intentar obtener partidos en vivo primero
      const liveFixtures = await getLiveMatches() as ApiFixture[];
      
      let allFixtures: ApiFixture[] = [...liveFixtures];
      
      // Si no hay partidos en vivo, obtener los partidos del día
      if (liveFixtures.length === 0) {
        const todayFixtures = await getFixturesByDate(today) as ApiFixture[];
        allFixtures = todayFixtures;
      }
      
      const convertedMatches = allFixtures.map(convertApiFixtureToMatch);
      setMatches(convertedMatches);
      setIsConnected(true);
      setLastUpdate(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar partidos';
      setError(errorMessage);
      setIsConnected(false);
      console.error('Error al obtener partidos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    fetchLiveMatches();
  }, [fetchLiveMatches]);

  // Auto-actualización cada 60 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLiveMatches();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchLiveMatches]);

  const filteredMatches = useMemo(
    () => filterMatchesByStatus(matches, statusFilter),
    [matches, statusFilter]
  );

  const stats = useMemo(() => calculateStats(matches), [matches]);

  return (
    <div className={`min-h-screen noise-texture transition-colors duration-300 ${isDark ? 'bg-[#2b193e]' : 'bg-[#f5f0fa]'}`}>
      {/* Cinta de Marcadores */}
      <ScoreTicker matches={matches} />

      {/* Contenido Principal */}
      <div className="container mx-auto px-6 py-8">
        {/* Mensaje de Error */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
            isDark 
              ? 'bg-red-500/10 border-red-500/30 text-red-400' 
              : 'bg-red-500/10 border-red-500/40 text-red-600'
          }`}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-mono flex-1">
              <strong>Error:</strong> {error}
            </p>
            <button 
              onClick={fetchLiveMatches}
              className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Estado de Conexión */}
        {isConnected && lastUpdate && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
            isDark 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-green-500/10 border-green-500/40 text-green-600'
          }`}>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-sm font-mono flex-1">
              <strong>Conectado a API-Football</strong> • Última actualización: {lastUpdate.toLocaleTimeString('es-ES')} • Auto-actualización cada 60s
            </p>
            <button 
              onClick={fetchLiveMatches}
              disabled={loading}
              className="px-3 py-1 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#2b193e]'}`} style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}>
              Panel de Partidos en Vivo
            </h1>
            <p className={`font-mono text-sm transition-colors duration-300 ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>
              Resultados y estadísticas de fútbol en tiempo real
            </p>
          </div>
          <SyncIndicator isConnected={isConnected} />
        </div>

        {/* Filtro */}
        <div className="mb-8">
          <StatusFilter selected={statusFilter} onChange={setStatusFilter} />
        </div>

        {/* Diseño */}
        <div className="flex gap-8">
          {/* Área de Contenido Principal */}
          <div className="flex-1">
            {/* Estado de Carga */}
            {loading && matches.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className={`w-12 h-12 animate-spin mb-4 ${isDark ? 'text-[#f18904]' : 'text-[#f18904]'}`} />
                <p className={`text-lg ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>Cargando partidos...</p>
              </div>
            )}

            {/* Cuadrícula de Tarjetas de Partidos */}
            {(!loading || matches.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredMatches.map((match, index) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onClick={() => setSelectedMatch(match)}
                    delay={index * 0.08}
                  />
                ))}
              </div>
            )}

            {!loading && filteredMatches.length === 0 && (
              <div className="text-center py-20">
                <p className={`text-lg mb-4 ${isDark ? 'text-white/40' : 'text-[#2b193e]/40'}`}>
                  {error ? 'Error al cargar partidos' : 'No hay partidos disponibles en este momento'}
                </p>
                <button
                  onClick={fetchLiveMatches}
                  className="px-6 py-3 rounded-lg bg-[#f18904] text-white font-medium hover:bg-[#f18904]/90 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <StatsGrid
                totalGoals={stats.totalGoals}
                activeMatches={stats.activeMatches}
                topScorer={stats.topScorer}
                upcomingMatches={stats.upcomingMatches}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <MatchDetailPanel match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  );
}
