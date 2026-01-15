import { useState } from 'react';
import { AdminView } from '@/components/friends/AdminView';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const ADMIN_PASSWORD = 'Futadmin365';

export function AdminPage() {
  const { isDark } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen transition-colors duration-300 flex items-center justify-center ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f0fa]'}`}>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-md mx-4 p-8 rounded-2xl border ${
            isDark ? 'bg-[#1a1a1a]/80 border-[#f18904]/20' : 'bg-white border-[#f18904]/30'
          }`}
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#ff0000] to-[#f18904] flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#2b193e]'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Acceso Administrador
            </h1>
            <p className={`mt-2 text-sm font-mono ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>
              Ingresa la contraseña para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className={`block text-sm mb-2 font-mono ${isDark ? 'text-white/60' : 'text-[#2b193e]/60'}`}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Ingresa la contraseña"
                  className={`w-full px-4 py-3 pr-12 rounded-lg border focus:outline-none focus:border-[#f18904] transition-colors ${
                    isDark 
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40' 
                      : 'bg-[#1a1a1a]/10 border-[#2b193e]/20 text-[#2b193e] placeholder:text-[#2b193e]/40'
                  } ${error ? 'border-red-500' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded ${isDark ? 'text-white/60 hover:text-white' : 'text-[#2b193e]/60 hover:text-[#2b193e]'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 rounded-lg bg-[#f18904] text-white font-bold text-lg flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Ingresar
            </motion.button>
          </form>

          <Link 
            to="/"
            className={`block text-center mt-6 text-sm font-mono transition-colors ${isDark ? 'text-[#f18904] hover:text-[#f18904]/80' : 'text-[#f18904] hover:text-[#f18904]/80'}`}
          >
            ← Volver a vista de Visor
          </Link>
        </motion.div>
      </div>
    );
  }

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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff0000] to-[#f18904] flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔒</span>
              </div>
              <span
                className={`font-bold text-xl transition-colors duration-300 ${isDark ? "text-white" : "text-[#2b193e]"}`}
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Admin - Liga de Amigos
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      <div className="pt-16">
        <AdminView />
      </div>
    </div>
  );
}
