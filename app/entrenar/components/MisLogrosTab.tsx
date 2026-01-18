'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trophy, Flame, Clock, Target, TrendingUp, Award, Calendar, Zap, Heart, Star, TargetIcon } from 'lucide-react';

interface UserStats {
  totalSessions: number;
  totalTime: number; // en minutos
  weeklyCalories: number;
  currentStreak: number;
  favoriteBoxer: string;
  completedRoutines: number;
  weeklyProgress: {
    day: string;
    minutes: number;
    calories: number;
  }[];
}

interface Achievement {
  id: number;
  icon: string;
  title: string;
  desc: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
  color: string;
}

export default function MisLogrosTab() {
  const [stats, setStats] = useState<UserStats>({
    totalSessions: 0,
    totalTime: 0,
    weeklyCalories: 0,
    currentStreak: 0,
    favoriteBoxer: 'Sin entrenamientos',
    completedRoutines: 0,
    weeklyProgress: []
  });
  
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 1, icon: '🥊', title: 'Primer Round', desc: 'Completa 1 sesión', unlocked: true, progress: 1, target: 1, color: 'from-blue-500/20 to-blue-600/20' },
    { id: 2, icon: '🔥', title: 'En Llamas', desc: 'Racha de 7 días', unlocked: true, progress: 7, target: 7, color: 'from-orange-500/20 to-red-500/20' },
    { id: 3, icon: '💪', title: 'Guerrero', desc: '20 sesiones', unlocked: true, progress: 24, target: 20, color: 'from-purple-500/20 to-purple-600/20' },
    { id: 4, icon: '⚡', title: 'Velocista', desc: '3 sesiones en 1 semana', unlocked: true, progress: 4, target: 3, color: 'from-yellow-500/20 to-amber-500/20' },
    { id: 5, icon: '🎯', title: 'Precisión', desc: '10 horas totales', unlocked: false, progress: 6, target: 10, color: 'from-emerald-500/20 to-teal-500/20' },
    { id: 6, icon: '👑', title: 'Campeón', desc: '50 sesiones', unlocked: false, progress: 24, target: 50, color: 'from-amber-500/20 to-yellow-500/20' },
  ]);
  
  const [loading, setLoading] = useState(true);
  const [activeWeek, setActiveWeek] = useState(0);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const mockStats: UserStats = {
        totalSessions: 24,
        totalTime: 360, // 6 horas
        weeklyCalories: 2450,
        currentStreak: 7,
        favoriteBoxer: 'Muhammad Ali',
        completedRoutines: 18,
        weeklyProgress: [
          { day: 'Lun', minutes: 30, calories: 320 },
          { day: 'Mar', minutes: 45, calories: 480 },
          { day: 'Mié', minutes: 0, calories: 0 },
          { day: 'Jue', minutes: 60, calories: 640 },
          { day: 'Vie', minutes: 30, calories: 320 },
          { day: 'Sáb', minutes: 45, calories: 480 },
          { day: 'Dom', minutes: 20, calories: 210 },
        ]
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getProgressPercentage = () => {
    const unlocked = achievements.filter(a => a.unlocked).length;
    return Math.round((unlocked / achievements.length) * 100);
  };

  const getWeekTotal = () => {
    return stats.weeklyProgress.reduce((total, day) => total + day.minutes, 0);
  };

  // CORRECCIÓN: Eliminada la función getDayName que causaba el error
  // En su lugar, usamos directamente day.day del array weeklyProgress

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="relative">
          <div className="w-20 h-20 border-3 border-[#FF4D00] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Trophy size={24} className="text-[#FF4D00]" />
          </div>
        </div>
        <p className="text-[#FF4D00] font-bold text-sm mt-4">CARGANDO TUS LOGROS...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[414px] mx-auto space-y-4">
      {/* ENCABEZADO CON PROGRESO GLOBAL */}
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="text-[#FF8A00]" size={20} />
            <h2 className="text-white font-bold text-sm">TU PROGRESO GLOBAL</h2>
          </div>
          <div className="text-xs text-zinc-400">
            {new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
          </div>
        </div>
        
        {/* BARRA DE PROGRESO GLOBAL */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-zinc-400">Progreso total</span>
            <span className="text-[#00FBFF] font-bold">{getProgressPercentage()}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#00FBFF] to-[#0088FF] h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
        
        {/* MINI ESTADÍSTICAS */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 bg-zinc-900/50 rounded-lg">
            <div className="w-8 h-8 bg-[#FF4D00]/20 rounded-full flex items-center justify-center">
              <Flame size={14} className="text-[#FF4D00]" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Racha</p>
              <p className="text-white font-bold">{stats.currentStreak} días</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-zinc-900/50 rounded-lg">
            <div className="w-8 h-8 bg-[#00FBFF]/20 rounded-full flex items-center justify-center">
              <TargetIcon size={14} className="text-[#00FBFF]" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Rutinas</p>
              <p className="text-white font-bold">{stats.completedRoutines}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS PRINCIPALES - COMPACTAS */}
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-zinc-800">
        <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-[#FF8A00]" />
          ESTADÍSTICAS DE ESTA SEMANA
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* SESIONES */}
          <div className="bg-gradient-to-br from-zinc-900 to-black p-3 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-[#00FBFF]/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🥊</span>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">{stats.totalSessions}</p>
                <p className="text-zinc-400 text-xs">Sesiones</p>
              </div>
            </div>
          </div>
          
          {/* TIEMPO */}
          <div className="bg-gradient-to-br from-zinc-900 to-black p-3 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-[#FF4D00]/20 rounded-full flex items-center justify-center">
                <Clock size={18} className="text-[#FF4D00]" />
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">{formatTime(stats.totalTime)}</p>
                <p className="text-zinc-400 text-xs">Tiempo</p>
              </div>
            </div>
          </div>
          
          {/* CALORÍAS */}
          <div className="bg-gradient-to-br from-zinc-900 to-black p-3 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-[#FF8A00]/20 rounded-full flex items-center justify-center">
                <Flame size={18} className="text-[#FF8A00]" />
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">{stats.weeklyCalories}</p>
                <p className="text-zinc-400 text-xs">Calorías</p>
              </div>
            </div>
          </div>
          
          {/* FAVORITO */}
          <div className="bg-gradient-to-br from-zinc-900 to-black p-3 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-[#FF00AA]/20 rounded-full flex items-center justify-center">
                <Heart size={18} className="text-[#FF00AA]" />
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-sm truncate max-w-[120px]">
                  {stats.favoriteBoxer.split(' ')[0]}
                </p>
                <p className="text-zinc-400 text-xs">Favorito</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GRÁFICO DE PROGRESO SEMANAL - COMPACTO */}
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <Calendar size={16} className="text-[#00FBFF]" />
            PROGRESO SEMANAL
          </h3>
          <div className="text-xs text-[#FF8A00] font-bold">
            {getWeekTotal()} min total
          </div>
        </div>
        
        <div className="flex justify-between items-end h-32 mb-2">
          {stats.weeklyProgress.map((day, index) => {
            const maxMinutes = Math.max(...stats.weeklyProgress.map(d => d.minutes), 1);
            const height = day.minutes > 0 ? (day.minutes / maxMinutes) * 70 : 8;
            
            return (
              <div key={index} className="flex flex-col items-center w-8">
                {/* Barra del gráfico */}
                <div 
                  className={`w-6 rounded-t-lg transition-all duration-500 ${
                    day.minutes > 0 
                      ? 'bg-gradient-to-t from-[#FF4D00] to-[#FF8A00]' 
                      : 'bg-zinc-800'
                  }`}
                  style={{ height: `${height}px` }}
                  title={`${day.minutes} minutos, ${day.calories} calorías`}
                >
                  {day.minutes > 0 && (
                    <div className="text-[10px] text-white font-bold text-center -mt-4">
                      {day.minutes}
                    </div>
                  )}
                </div>
                
                {/* Día de la semana */}
                <div className="mt-2 text-center">
                  <p className={`text-xs font-bold ${
                    day.minutes > 0 ? 'text-white' : 'text-zinc-600'
                  }`}>
                    {day.day}
                  </p>
                  {day.calories > 0 && (
                    <p className="text-[10px] text-[#00FBFF]">{day.calories}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Leyenda */}
        <div className="flex justify-center gap-4 text-xs mt-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#FF4D00] rounded-sm"></div>
            <span className="text-zinc-400">Minutos</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#00FBFF] rounded-sm"></div>
            <span className="text-zinc-400">Calorías</span>
          </div>
        </div>
      </div>

      {/* LOGROS DESBLOQUEADOS */}
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <Award size={16} className="text-[#FF8A00]" />
            TUS LOGROS
          </h3>
          <div className="text-xs text-zinc-400">
            {achievements.filter(a => a.unlocked).length}/{achievements.length}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-xl border transition-all ${
                achievement.unlocked
                  ? 'border-[#FF8A00]/50 bg-gradient-to-br from-[#FF8A00]/10 to-transparent'
                  : 'border-zinc-800 bg-zinc-900/30 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`text-2xl ${achievement.unlocked ? 'opacity-100' : 'opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-bold ${achievement.unlocked ? 'text-white' : 'text-zinc-500'}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-zinc-400">{achievement.desc}</p>
                </div>
              </div>
              
              {achievement.progress !== undefined && achievement.target !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-zinc-400">Progreso</span>
                    <span className={achievement.unlocked ? 'text-[#00FBFF]' : 'text-zinc-500'}>
                      {achievement.progress}/{achievement.target}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-[#FF8A00] to-[#FF4D00]' 
                          : 'bg-gradient-to-r from-[#00FBFF] to-[#0088FF]'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className={`mt-2 text-right`}>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  achievement.unlocked
                    ? 'bg-[#FF8A00] text-black'
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {achievement.unlocked ? '✓ DESBLOQUEADO' : 'EN PROGRESO'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MOTIVACIÓN */}
      <div className="bg-gradient-to-r from-[#FF4D00]/20 via-[#FF8A00]/10 to-[#00FBFF]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#FF4D00]/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF4D00] to-[#FF8A00] rounded-full flex items-center justify-center flex-shrink-0">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">¡SIGUE ASÍ, CAMPEÓN!</h4>
            <p className="text-zinc-300 text-xs italic">
              "No cuentes los días, haz que los días cuenten."
            </p>
            <p className="text-[#FF4D00] text-xs font-bold mt-1">- Muhammad Ali</p>
          </div>
        </div>
      </div>

      {/* COMPARTIR LOGROS */}
      <div className="flex gap-3">
        <button className="flex-1 bg-gradient-to-r from-[#00FBFF] to-[#0088FF] text-black font-bold py-3 rounded-xl text-sm">
          COMPARTIR LOGROS
        </button>
        <button className="flex-1 bg-zinc-800 text-white font-bold py-3 rounded-xl text-sm border border-zinc-700">
          VER MÁS DETALLES
        </button>
      </div>

      {/* PIE DE PÁGINA INFORMATIVO */}
      <div className="pt-3 border-t border-zinc-800">
        <p className="text-center text-[10px] text-zinc-500">
          Tu progreso se sincroniza automáticamente. Cada sesión cuenta.
        </p>
        <div className="flex justify-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-[#FF4D00] rounded-full"></div>
            <span className="text-[10px] text-zinc-400">Sesiones activas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-[#00FBFF] rounded-full"></div>
            <span className="text-[10px] text-zinc-400">Logros</span>
          </div>
        </div>
      </div>
    </div>
  );
}