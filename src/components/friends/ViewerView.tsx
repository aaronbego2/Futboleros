import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FriendPlayer } from "@/types/football";
import {
  getPlayers,
  getLeaderboard,
  calculateAverages,
} from "@/lib/friendLeagueData";
import { Trophy, Target, Users, TrendingUp, Eye } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "react-router-dom";

type Tab = "leaderboard" | "players";

export function ViewerView() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("leaderboard");
  const [players, setPlayers] = useState<FriendPlayer[]>([]);

  useEffect(() => {
    setPlayers(getPlayers());

    // Auto-refresh every 5 seconds to get updated data
    const interval = setInterval(() => {
      setPlayers(getPlayers());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const { topScorers, topAssisters } = getLeaderboard();

  const tabs: { id: Tab; label: string; icon: typeof Trophy }[] = [
    { id: "leaderboard", label: "Rankings", icon: Trophy },
    { id: "players", label: "Jugadores", icon: Users },
  ];

  return (
    <div
      className={`min-h-screen noise-texture transition-colors duration-300 ${isDark ? "bg-[#1a1a1a]" : "bg-[#f5f0fa]"}`}
    >
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#15cfb5]/20">
              <Eye className="w-6 h-6 text-[#fff]" />
            </div>
            <h1
              className={`text-4xl font-bold transition-colors duration-300 ${isDark ? "text-white" : "text-[#2b193e]"}`}
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 800,
              }}
            >
              Liga de Amigos
            </h1>
          </div>
          <p
            className={`font-mono text-sm transition-colors duration-300 ${isDark ? "text-white/60" : "text-[#2b193e]/60"}`}
          >
            Ver estadísticas • Goles y asistencias • Rankings
          </p>
          <Link
            to="/admin"
            className={`inline-flex items-center gap-2 mt-4 text-sm font-mono transition-colors ${isDark ? "text-[#f18904] hover:text-[#f18904]/80" : "text-[#f18904] hover:text-[#f18904]/80"}`}
          >
            🔒 Acceso Administrador →
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
                    ? "bg-[#f18904] text-white shadow-lg shadow-[#f18904]/30"
                    : isDark
                      ? "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                      : "bg-[#1a1a1a]/10 text-[#2b193e]/60 hover:bg-[#1a1a1a]/20 hover:text-[#2b193e]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Scorers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#ff0000]/20">
                  <Target className="w-6 h-6 text-[#ff0000]" />
                </div>
                <h2
                  className={`text-xl font-bold ${isDark ? "text-white" : "text-[#2b193e]"}`}
                >
                  Top Goleadores
                </h2>
              </div>

              {topScorers.length === 0 ? (
                <div
                  className={`text-center py-10 ${isDark ? "text-white/40" : "text-[#2b193e]/40"}`}
                >
                  No hay datos aún.
                </div>
              ) : (
                <div className="space-y-3">
                  {topScorers.map((player, index) => {
                    const averages = calculateAverages(player);
                    return (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-[#1a1a1a]/5 hover:bg-[#1a1a1a]/10"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-black"
                              : index === 1
                                ? "bg-gray-400 text-black"
                                : index === 2
                                  ? "bg-amber-700 text-white"
                                  : isDark
                                    ? "bg-white/10 text-white/60"
                                    : "bg-[#1a1a1a]/10 text-[#2b193e]/60"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div
                            className={`font-medium ${isDark ? "text-white" : "text-[#2b193e]"}`}
                          >
                            {player.alias || player.fullName}
                          </div>
                          <div
                            className={`text-xs font-mono ${isDark ? "text-white/40" : "text-[#2b193e]/40"}`}
                          >
                            {player.alias && (
                              <span className="mr-2">{player.fullName}</span>
                            )}
                            {player.position}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-mono font-extrabold text-[#ff0000]">
                            {player.goals}
                          </div>
                          <div
                            className={`text-xs font-mono ${isDark ? "text-white/40" : "text-[#2b193e]/40"}`}
                          >
                            {averages.goalsPerGame}/partido
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Top Assisters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#f18904]/20">
                  <TrendingUp className="w-6 h-6 text-[#f18904]" />
                </div>
                <h2
                  className={`text-xl font-bold ${isDark ? "text-white" : "text-[#2b193e]"}`}
                >
                  Top Asistencias
                </h2>
              </div>

              {topAssisters.length === 0 ? (
                <div
                  className={`text-center py-10 ${isDark ? "text-white/40" : "text-[#2b193e]/40"}`}
                >
                  No hay datos aún.
                </div>
              ) : (
                <div className="space-y-3">
                  {topAssisters.map((player, index) => {
                    const averages = calculateAverages(player);
                    return (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-[#1a1a1a]/5 hover:bg-[#1a1a1a]/10"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-black"
                              : index === 1
                                ? "bg-gray-400 text-black"
                                : index === 2
                                  ? "bg-amber-700 text-white"
                                  : isDark
                                    ? "bg-white/10 text-white/60"
                                    : "bg-[#1a1a1a]/10 text-[#2b193e]/60"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div
                            className={`font-medium ${isDark ? "text-white" : "text-[#2b193e]"}`}
                          >
                            {player.alias || player.fullName}
                          </div>
                          <div
                            className={`text-xs font-mono ${isDark ? "text-white/40" : "text-[#2b193e]/40"}`}
                          >
                            {player.alias && (
                              <span className="mr-2">{player.fullName}</span>
                            )}
                            {player.position}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-mono font-extrabold text-[#f18904]">
                            {player.assists}
                          </div>
                          <div
                            className={`text-xs font-mono ${isDark ? "text-white/40" : "text-[#2b193e]/40"}`}
                          >
                            {averages.assistsPerGame}/partido
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Players Tab */}
        {activeTab === "players" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {players.length === 0 ? (
              <div className="glass-card rounded-xl p-12 text-center">
                <Users
                  className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-white/20" : "text-[#2b193e]/20"}`}
                />
                <h3
                  className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-[#2b193e]"}`}
                >
                  No hay jugadores
                </h3>
                <p
                  className={`${isDark ? "text-white/60" : "text-[#2b193e]/60"}`}
                >
                  El administrador aún no ha registrado jugadores.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {players.map((player, index) => {
                  const averages = calculateAverages(player);
                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card rounded-xl p-6"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#f18904]/20 to-[#ff0000]/20 flex items-center justify-center text-2xl font-bold relative">
                          {player.dorsal ||
                            (player.alias || player.fullName)
                              .substring(0, 2)
                              .toUpperCase()}
                          {player.dorsal > 0 && (
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#f18904] text-white text-[10px] flex items-center justify-center font-mono">
                              #
                            </span>
                          )}
                        </div>
                        <div>
                          <div
                            className={`font-bold text-lg ${isDark ? "text-white" : "text-[#2b193e]"}`}
                          >
                            {player.alias || player.fullName}
                          </div>
                          {player.alias && (
                            <div
                              className={`text-xs ${isDark ? "text-white/50" : "text-[#2b193e]/50"}`}
                            >
                              {player.fullName}
                            </div>
                          )}
                          <div className="text-[#f18904] text-sm font-mono">
                            {player.position}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div
                          className={`text-center p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-[#1a1a1a]/5"}`}
                        >
                          <div className="text-2xl font-mono font-extrabold text-[#ff0000]">
                            {player.goals}
                          </div>
                          <div
                            className={`text-xs ${isDark ? "text-white/40" : "text-[#2b193e]/40"}`}
                          >
                            Goles
                          </div>
                        </div>
                        <div
                          className={`text-center p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-[#1a1a1a]/5"}`}
                        >
                          <div className="text-2xl font-mono font-extrabold text-[#f18904]">
                            {player.assists}
                          </div>
                          <div
                            className={`text-xs ${isDark ? "text-white/40" : "text-[#2b193e]/40"}`}
                          >
                            Asist.
                          </div>
                        </div>
                        <div
                          className={`text-center p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-[#1a1a1a]/5"}`}
                        >
                          <div
                            className={`text-2xl font-mono font-extrabold ${isDark ? "text-white" : "text-[#2b193e]"}`}
                          >
                            {player.gamesPlayed}
                          </div>
                          <div
                            className={`text-xs ${isDark ? "text-white/40" : "text-[#2b193e]/40"}`}
                          >
                            Partidos
                          </div>
                        </div>
                      </div>

                      <div
                        className={`mt-4 pt-4 border-t ${isDark ? "border-white/10" : "border-[#2b193e]/10"}`}
                      >
                        <div className="flex justify-between text-sm">
                          <span
                            className={
                              isDark ? "text-white/60" : "text-[#2b193e]/60"
                            }
                          >
                            Promedio goles
                          </span>
                          <span className="font-mono text-[#ff0000]">
                            {averages.goalsPerGame}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span
                            className={
                              isDark ? "text-white/60" : "text-[#2b193e]/60"
                            }
                          >
                            Promedio asist.
                          </span>
                          <span className="font-mono text-[#f18904]">
                            {averages.assistsPerGame}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
