import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FriendPlayer, PlayerGameStats } from '@/types/football';
import {
  getPlayers,
  addPlayer,
  removePlayer,
  updatePlayer,
  addGameSession,
} from '@/lib/friendLeagueData';
import { 
  Users, 
  X, 
  UserPlus, 
  Play,
  Medal,
  Shield,
  Pencil,
  Check
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';

type Tab = 'players' | 'register';

export function AdminView() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('players');
  const [players, setPlayers] = useState<FriendPlayer[]>([]);
  const [showAddGame, setShowAddGame] = useState(false);
  const [gameStats, setGameStats] = useState<{ [playerId: string]: { goals: number; assists: number } }>({});
  
  // Edit player state
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    fullName: string;
    alias: string;
    dorsal: number;
    position: FriendPlayer['position'];
  }>({ fullName: '', alias: '', dorsal: 0, position: 'Mediocampista' });

  // Form state for new player
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerAlias, setNewPlayerAlias] = useState('');
  const [newPlayerDorsal, setNewPlayerDorsal] = useState<number>(0);
  const [newPlayerPosition, setNewPlayerPosition] = useState<FriendPlayer['position']>('Mediocampista');

  useEffect(() => {
    setPlayers(getPlayers());
  }, []);

  const refreshPlayers = () => {
    setPlayers(getPlayers());
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim() || !newPlayerAlias.trim()) return;
    
    addPlayer({
      fullName: newPlayerName.trim(),
      alias: newPlayerAlias.trim(),
      dorsal: newPlayerDorsal,
      position: newPlayerPosition,
    });
    
    setNewPlayerName('');
    setNewPlayerAlias('');
    setNewPlayerDorsal(0);
    setNewPlayerPosition('Mediocampista');
    refreshPlayers();
    setActiveTab('players');
  };

  const handleRemovePlayer = (playerId: string) => {
    if (confirm('¿Estás seguro de eliminar este jugador?')) {
      removePlayer(playerId);
      refreshPlayers();
    }
  };

  const handleStartEdit = (player: FriendPlayer) => {
    setEditingPlayerId(player.id);
    setEditForm({
      fullName: player.fullName,
      alias: player.alias || '',
      dorsal: player.dorsal || 0,
      position: player.position,
    });
  };

  const handleSaveEdit = () => {
    if (!editingPlayerId) return;
    updatePlayer(editingPlayerId, editForm);
    setEditingPlayerId(null);
    refreshPlayers();
  };

  const handleCancelEdit = () => {
    setEditingPlayerId(null);
  };

  const handleStartGame = () => {
    const initialStats: { [key: string]: { goals: number; assists: number } } = {};
    players.forEach(p => {
      initialStats[p.id] = { goals: 0, assists: 0 };
    });
    setGameStats(initialStats);
    setShowAddGame(true);
  };

  const handleSaveGame = () => {
    const playerStats: PlayerGameStats[] = Object.entries(gameStats)
      .filter(([_, stats]) => stats.goals > 0 || stats.assists > 0)
      .map(([playerId, stats]) => ({
        playerId,
        goals: stats.goals,
        assists: stats.assists,
      }));
    
    // Also add players who played but didn't score/assist
    players.forEach(p => {
      if (!playerStats.find(ps => ps.playerId === p.id)) {
        playerStats.push({ playerId: p.id, goals: 0, assists: 0 });
      }
    });

    if (playerStats.length > 0) {
      addGameSession(playerStats);
      refreshPlayers();
    }
    setShowAddGame(false);
    setGameStats({});
  };

  const updateGameStat = (playerId: string, type: 'goals' | 'assists', delta: number) => {
    setGameStats(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [type]: Math.max(0, (prev[playerId]?.[type] || 0) + delta),
      },
    }));
  };

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: 'players', label: 'Jugadores', icon: Users },
    { id: 'register', label: 'Agregar Jugador', icon: UserPlus },
  ];

  return (
    <div className={`min-h-screen noise-texture transition-colors duration-300 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f0fa]'}`}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#ff0000]/20">
              <Shield className="w-6 h-6 text-[#ff0000]" />
            </div>
            <h1 className={`text-4xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#2b193e]'}`} style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}>
              Panel de Administrador
            </h1>
          </div>
          <p className={`font-mono text-sm transition-colors duration-300 ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>
            Crear jugadores • Registrar partidos • Gestionar estadísticas
          </p>
          <Link 
            to="/"
            className={`inline-flex items-center gap-2 mt-4 text-sm font-mono transition-colors ${isDark ? 'text-[#f18904] hover:text-[#f18904]/80' : 'text-[#f18904] hover:text-[#f18904]/80'}`}
          >
            ← Ir a vista de Visor
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#f18904] text-white shadow-lg shadow-[#f18904]/30'
                    : isDark 
                      ? 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                      : 'bg-[#1a1a1a]/10 text-[#2b193e]/60 hover:bg-[#1a1a1a]/20 hover:text-[#2b193e]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            );
          })}
          
          {players.length >= 2 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartGame}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm bg-[#ff0000] text-white shadow-lg shadow-[#ff0000]/30"
            >
              <Play className="w-4 h-4" />
              Registrar Partido
            </motion.button>
          )}
        </div>

        {/* Players Tab */}
        {activeTab === 'players' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {players.length === 0 ? (
              <div className="glass-card rounded-xl p-12 text-center">
                <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-white/20' : 'text-[#2b193e]/20'}`} />
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#2b193e]'}`}>No hay jugadores</h3>
                <p className={`mb-6 ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>Registra a tus amigos para comenzar</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('register')}
                  className="px-6 py-3 rounded-full bg-[#f18904] text-white font-medium"
                >
                  Registrar Jugador
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-xl p-6 relative group"
                  >
                    {editingPlayerId === player.id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-sm font-mono ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>Editando jugador</span>
                          <div className="flex gap-2">
                            <button
                              onClick={handleCancelEdit}
                              className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-[#1a1a1a]/10 text-[#2b193e]/60'}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className={`block text-xs mb-1 font-mono ${isDark ? 'text-white/40' : 'text-[#2b193e]/40'}`}>Alias</label>
                          <input
                            type="text"
                            value={editForm.alias}
                            onChange={(e) => setEditForm({ ...editForm, alias: e.target.value })}
                            className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-[#f18904] ${
                              isDark 
                                ? 'bg-white/10 border-white/20 text-white' 
                                : 'bg-[#1a1a1a]/10 border-[#2b193e]/20 text-[#2b193e]'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs mb-1 font-mono ${isDark ? 'text-white/40' : 'text-[#2b193e]/40'}`}>Nombre Completo</label>
                          <input
                            type="text"
                            value={editForm.fullName}
                            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                            className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-[#f18904] ${
                              isDark 
                                ? 'bg-white/10 border-white/20 text-white' 
                                : 'bg-[#1a1a1a]/10 border-[#2b193e]/20 text-[#2b193e]'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs mb-1 font-mono ${isDark ? 'text-white/40' : 'text-[#2b193e]/40'}`}>Dorsal</label>
                          <input
                            type="number"
                            value={editForm.dorsal}
                            onChange={(e) => setEditForm({ ...editForm, dorsal: parseInt(e.target.value) || 0 })}
                            className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-[#f18904] ${
                              isDark 
                                ? 'bg-white/10 border-white/20 text-white' 
                                : 'bg-[#1a1a1a]/10 border-[#2b193e]/20 text-[#2b193e]'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs mb-1 font-mono ${isDark ? 'text-white/40' : 'text-[#2b193e]/40'}`}>Posición</label>
                          <div className="grid grid-cols-2 gap-1">
                            {(['Portero', 'Defensa', 'Mediocampista', 'Delantero'] as const).map((pos) => (
                              <button
                                key={pos}
                                type="button"
                                onClick={() => setEditForm({ ...editForm, position: pos })}
                                className={`px-2 py-1.5 rounded-lg font-medium text-xs transition-all ${
                                  editForm.position === pos
                                    ? 'bg-[#f18904] text-white'
                                    : isDark
                                      ? 'bg-white/10 text-white/60 hover:bg-white/20'
                                      : 'bg-[#1a1a1a]/10 text-[#2b193e]/60 hover:bg-[#1a1a1a]/20'
                                }`}
                              >
                                {pos}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEdit(player)}
                            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-[#1a1a1a]/10 text-[#2b193e]/60'}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemovePlayer(player.id)}
                            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#f18904]/20 to-[#ff0000]/20 flex items-center justify-center text-2xl font-bold relative">
                            {player.dorsal || (player.alias || player.fullName).substring(0, 2).toUpperCase()}
                            {player.dorsal > 0 && (
                              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#f18904] text-white text-[10px] flex items-center justify-center font-mono">
                                #
                              </span>
                            )}
                          </div>
                          <div>
                            <div className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#2b193e]'}`}>
                              {player.alias || player.fullName}
                            </div>
                            {player.alias && (
                              <div className={`text-xs ${isDark ? 'text-white/50' : 'text-[#2b193e]/50'}`}>
                                {player.fullName}
                              </div>
                            )}
                            <div className="text-[#f18904] text-sm font-mono">{player.position}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className={`text-center p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-[#1a1a1a]/5'}`}>
                            <div className="text-2xl font-mono font-extrabold text-[#ff0000]">{player.goals}</div>
                            <div className={`text-xs ${isDark ? 'text-white/40' : 'text-[#2b193e]/40'}`}>Goles</div>
                          </div>
                          <div className={`text-center p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-[#1a1a1a]/5'}`}>
                            <div className="text-2xl font-mono font-extrabold text-[#f18904]">{player.assists}</div>
                            <div className={`text-xs ${isDark ? 'text-white/40' : 'text-[#2b193e]/40'}`}>Asist.</div>
                          </div>
                          <div className={`text-center p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-[#1a1a1a]/5'}`}>
                            <div className={`text-2xl font-mono font-extrabold ${isDark ? 'text-white' : 'text-[#2b193e]'}`}>{player.gamesPlayed}</div>
                            <div className={`text-xs ${isDark ? 'text-white/40' : 'text-[#2b193e]/40'}`}>Partidos</div>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Register Tab */}
        {activeTab === 'register' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="glass-card rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#f18904]/20">
                  <UserPlus className="w-6 h-6 text-[#f18904]" />
                </div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#2b193e]'}`}>Registrar Jugador</h2>
              </div>

              <form onSubmit={handleAddPlayer} className="space-y-6">
                <div>
                  <label className={`block text-sm mb-2 font-mono ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>
                    Alias (visible) *
                  </label>
                  <input
                    type="text"
                    value={newPlayerAlias}
                    onChange={(e) => setNewPlayerAlias(e.target.value)}
                    placeholder="Ej: El Bicho, CR7"
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-[#f18904] transition-colors ${
                      isDark 
                        ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40' 
                        : 'bg-[#1a1a1a]/10 border-[#2b193e]/20 text-[#2b193e] placeholder:text-[#2b193e]/40'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm mb-2 font-mono ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-[#f18904] transition-colors ${
                      isDark 
                        ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40' 
                        : 'bg-[#1a1a1a]/10 border-[#2b193e]/20 text-[#2b193e] placeholder:text-[#2b193e]/40'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm mb-2 font-mono ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>
                    Número de Dorsal
                  </label>
                  <input
                    type="number"
                    value={newPlayerDorsal || ''}
                    onChange={(e) => setNewPlayerDorsal(parseInt(e.target.value) || 0)}
                    placeholder="Ej: 7"
                    min="0"
                    max="99"
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-[#f18904] transition-colors ${
                      isDark 
                        ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40' 
                        : 'bg-[#1a1a1a]/10 border-[#2b193e]/20 text-[#2b193e] placeholder:text-[#2b193e]/40'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm mb-2 font-mono ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>
                    Posición
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Portero', 'Defensa', 'Mediocampista', 'Delantero'] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setNewPlayerPosition(pos)}
                        className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                          newPlayerPosition === pos
                            ? 'bg-[#f18904] text-white'
                            : isDark
                              ? 'bg-white/10 text-white/60 hover:bg-white/20'
                              : 'bg-[#1a1a1a]/10 text-[#2b193e]/60 hover:bg-[#1a1a1a]/20'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 rounded-lg bg-[#f18904] text-white font-bold text-lg"
                >
                  Agregar Jugador
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Add Game Modal */}
        <AnimatePresence>
          {showAddGame && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddGame(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:max-h-[85vh] border rounded-2xl z-50 flex flex-col ${
                  isDark ? 'bg-[#1a1a1a] border-[#f18904]/20' : 'bg-[#f5f0fa] border-[#f18904]/30'
                }`}
              >
                <div className={`p-6 border-b flex-shrink-0 ${isDark ? 'border-white/10' : 'border-[#2b193e]/10'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#ff0000]/20">
                        <Medal className="w-6 h-6 text-[#ff0000]" />
                      </div>
                      <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#2b193e]'}`}>Registrar Partido</h2>
                    </div>
                    <button
                      onClick={() => setShowAddGame(false)}
                      className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-[#1a1a1a]/10'}`}
                    >
                      <X className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`} />
                    </button>
                  </div>
                  <p className={`text-sm mt-2 font-mono ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-4">
                  {players.map((player) => (
                    <div key={player.id} className="glass-card rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f18904]/20 to-[#ff0000]/20 flex items-center justify-center font-bold">
                          {player.dorsal || (player.alias || player.fullName).substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className={`font-medium ${isDark ? 'text-white' : 'text-[#2b193e]'}`}>{player.alias || player.fullName}</div>
                          <div className={`text-xs font-mono ${isDark ? 'text-white/40' : 'text-[#2b193e]/40'}`}>{player.position}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Goals */}
                        <div>
                          <div className={`text-xs mb-2 font-mono ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>Goles</div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateGameStat(player.id, 'goals', -1)}
                              className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                                isDark 
                                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                                  : 'bg-[#1a1a1a]/10 hover:bg-[#1a1a1a]/20 text-[#2b193e]'
                              }`}
                            >
                              -
                            </button>
                            <div className="flex-1 text-center">
                              <span className="text-2xl font-mono font-extrabold text-[#ff0000]">
                                {gameStats[player.id]?.goals || 0}
                              </span>
                            </div>
                            <button
                              onClick={() => updateGameStat(player.id, 'goals', 1)}
                              className="w-10 h-10 rounded-lg bg-[#ff0000]/20 hover:bg-[#ff0000]/30 text-[#ff0000] font-bold transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Assists */}
                        <div>
                          <div className={`text-xs mb-2 font-mono ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>Asistencias</div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateGameStat(player.id, 'assists', -1)}
                              className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                                isDark 
                                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                                  : 'bg-[#1a1a1a]/10 hover:bg-[#1a1a1a]/20 text-[#2b193e]'
                              }`}
                            >
                              -
                            </button>
                            <div className="flex-1 text-center">
                              <span className="text-2xl font-mono font-extrabold text-[#f18904]">
                                {gameStats[player.id]?.assists || 0}
                              </span>
                            </div>
                            <button
                              onClick={() => updateGameStat(player.id, 'assists', 1)}
                              className="w-10 h-10 rounded-lg bg-[#f18904]/20 hover:bg-[#f18904]/30 text-[#f18904] font-bold transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`p-6 border-t flex-shrink-0 ${isDark ? 'border-white/10' : 'border-[#2b193e]/10'}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveGame}
                    className="w-full py-4 rounded-lg bg-[#f18904] text-white font-bold text-lg"
                  >
                    Guardar Partido
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
