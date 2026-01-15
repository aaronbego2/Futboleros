import { ViewerView } from './friends/ViewerView';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';

function Home() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f0fa]'}`}>
      {/* Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-30 backdrop-blur-lg border-b transition-colors duration-300 ${
          isDark ? "border-[#f18904]/20" : "border-[#f18904]/30 bg-amber-500"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f18904] to-[#ff0000] flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚽</span>
              </div>
              <span
                className={`font-bold text-xl transition-colors duration-300 ${isDark ? "text-white" : "text-[#2b193e]"}`}
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Liga de Amigos
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      <div className="pt-16">
        <ViewerView />
      </div>
    </div>
  );
}

export default Home;
