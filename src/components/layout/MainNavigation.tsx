import { motion } from "framer-motion";
import { Activity, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/contexts/ThemeContext";

interface MainNavigationProps {
  activeTab: "matches" | "friends";
  onTabChange: (tab: "matches" | "friends") => void;
}

export function MainNavigation({
  activeTab,
  onTabChange,
}: MainNavigationProps) {
  const { isDark } = useTheme();

  const tabs = [
    { id: "matches" as const, label: "Partidos en Vivo", icon: Activity },
    { id: "friends" as const, label: "Liga de Amigos", icon: Users },
  ];

  return (
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
              Futbol App
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`flex gap-1 p-1 rounded-full transition-colors duration-300 ${isDark ? "bg-white/5" : "bg-[#2b193e]/5"}`}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-[#f18904] text-white shadow-lg shadow-[#f18904]/30"
                        : isDark
                          ? "text-white/60 hover:text-white"
                          : "text-[#2b193e]/60 hover:text-[#2b193e]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
