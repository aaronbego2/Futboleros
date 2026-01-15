import { motion } from 'framer-motion';
import { Target, Activity, Trophy, Calendar } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface StatsGridProps {
  totalGoals: number;
  activeMatches: number;
  topScorer: string;
  upcomingMatches: number;
}

export function StatsGrid({ totalGoals, activeMatches, topScorer, upcomingMatches }: StatsGridProps) {
  const { isDark } = useTheme();
  const stats = [
    {
      label: 'Goles de Hoy',
      value: totalGoals,
      icon: Target,
      color: 'text-[#f18904]',
      bgColor: 'bg-[#f18904]/10',
    },
    {
      label: 'Partidos Activos',
      value: activeMatches,
      icon: Activity,
      color: 'text-[#ff0000]',
      bgColor: 'bg-[#ff0000]/10',
    },
    {
      label: 'Máximo Goleador',
      value: topScorer,
      icon: Trophy,
      color: 'text-[#f18904]',
      bgColor: 'bg-[#f18904]/10',
    },
    {
      label: 'Próximos Partidos',
      value: upcomingMatches,
      icon: Calendar,
      color: 'text-[#ff0000]',
      bgColor: 'bg-[#ff0000]/10',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-sm uppercase tracking-wider px-2">
        Estadísticas Rápidas
      </h3>
      <div className="space-y-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-4 hover:glow-teal transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-white/60 text-xs font-mono uppercase tracking-wide">
                    {stat.label}
                  </div>
                  <div className="text-white text-2xl font-mono font-extrabold mt-0.5">
                    {stat.value}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
