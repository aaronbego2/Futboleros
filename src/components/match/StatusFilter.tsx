import { motion } from 'framer-motion';
import { MatchStatus } from '@/types/football';

interface StatusFilterProps {
  selected: MatchStatus;
  onChange: (status: MatchStatus) => void;
}

const statuses: MatchStatus[] = ['All', 'Live', 'Upcoming', 'Finished'];

const statusLabels: Record<MatchStatus, string> = {
  'All': 'Todos',
  'Live': 'En Vivo',
  'Upcoming': 'Próximos',
  'Finished': 'Finalizados',
};

export function StatusFilter({ selected, onChange }: StatusFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {statuses.map((status) => (
        <motion.button
          key={status}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(status)}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
            selected === status
              ? 'bg-[#f18904] text-white shadow-lg shadow-[#f18904]/30'
              : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
          }`}
        >
          {statusLabels[status]}
        </motion.button>
      ))}
    </div>
  );
}
