'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // CAMBIADO: Usamos tu cliente existente

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
  const [loading, setLoading] = useState(true);
  // ELIMINADO: const supabase = createClientComponentClient(); // No necesario

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      // TODO: Obtener estadísticas reales desde Supabase
      // Por ahora, datos de ejemplo
      
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
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sesiones */}
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-950/50 backdrop-blur-sm border border-blue-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-5xl">🥊</span>
            <span className="text-blue-400 font-bold">+{stats.totalSessions}</span>
          </div>
          <h3 className="text-white text-2xl font-bold">{stats.totalSessions}</h3>
          <p className="text-gray-400 text-sm">Sesiones totales</p>
        </div>

        {/* Tiempo Total */}
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 backdrop-blur-sm border border-purple-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-5xl">⏱️</span>
            <span className="text-purple-400 font-bold">↑</span>
          </div>
          <h3 className="text-white text-2xl font-bold">{formatTime(stats.totalTime)}</h3>
          <p className="text-gray-400 text-sm">Tiempo entrenado</p>
        </div>

        {/* Calorías Semanales */}
        <div className="bg-gradient-to-br from-orange-900/50 to-orange-950/50 backdrop-blur-sm border border-orange-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-5xl">🔥</span>
            <span className="text-orange-400 font-bold">Esta semana</span>
          </div>
          <h3 className="text-white text-2xl font-bold">{stats.weeklyCalories}</h3>
          <p className="text-gray-400 text-sm">Calorías quemadas</p>
        </div>

        {/* Racha Actual */}
        <div className="bg-gradient-to-br from-green-900/50 to-green-950/50 backdrop-blur-sm border border-green-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-5xl">🔥</span>
            <span className="text-green-400 font-bold">Días</span>
          </div>
          <h3 className="text-white text-2xl font-bold">{stats.currentStreak}</h3>
          <p className="text-gray-400 text-sm">Racha actual</p>
        </div>
      </div>

      {/* Progreso Semanal */}
      <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">📊 Progreso Semanal</h2>
        
        <div className="grid grid-cols-7 gap-2 mb-8">
          {stats.weeklyProgress.map((day, index) => {
            const maxMinutes = Math.max(...stats.weeklyProgress.map(d => d.minutes));
            const height = day.minutes > 0 ? (day.minutes / maxMinutes) * 100 : 5;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-full h-40 bg-gray-900 rounded-lg overflow-hidden">
                  <div
                    className={`absolute bottom-0 w-full transition-all duration-500 ${
                      day.minutes > 0
                        ? 'bg-gradient-to-t from-red-600 to-red-400'
                        : 'bg-gray-800'
                    }`}
                    style={{ height: `${height}%` }}
                  >
                    {day.minutes > 0 && (
                      <div className="absolute top-2 left-0 right-0 text-center text-white font-bold text-sm">
                        {day.minutes}m
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-gray-400 font-semibold">{day.day}</p>
                {day.calories > 0 && (
                  <p className="text-xs text-orange-400">{day.calories} cal</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Rutinas completadas</p>
            <p className="text-white text-2xl font-bold">{stats.completedRoutines}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Promedio diario</p>
            <p className="text-white text-2xl font-bold">
              {Math.round(stats.totalTime / 7)}m
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Boxeador favorito</p>
            <p className="text-white text-2xl font-bold">
              {stats.favoriteBoxer}
            </p>
          </div>
        </div>
      </div>

      {/* Logros Desbloqueados */}
      <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">🏆 Logros Desbloqueados</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: '🥇', title: 'Primera Victoria', desc: 'Completa tu primera sesión', unlocked: true },
            { icon: '🔥', title: 'Racha de 7 días', desc: 'Entrena 7 días seguidos', unlocked: true },
            { icon: '💪', title: 'Guerrero', desc: 'Completa 20 sesiones', unlocked: true },
            { icon: '⚡', title: 'Velocista', desc: 'Entrena 3 días esta semana', unlocked: true },
            { icon: '🎯', title: 'Dedicación', desc: 'Acumula 10 horas de entrenamiento', unlocked: false },
            { icon: '👑', title: 'Campeón', desc: 'Completa 50 sesiones', unlocked: false },
          ].map((logro, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                logro.unlocked
                  ? 'bg-gradient-to-br from-yellow-900/30 to-yellow-950/30 border-yellow-600'
                  : 'bg-gray-900/50 border-gray-700 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{logro.icon}</div>
              <h3 className="text-white font-bold mb-1">{logro.title}</h3>
              <p className="text-gray-400 text-sm">{logro.desc}</p>
              {logro.unlocked && (
                <div className="mt-2 text-green-400 text-xs font-semibold">
                  ✓ Desbloqueado
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Motivación */}
      <div className="bg-gradient-to-r from-red-900/50 to-purple-900/50 backdrop-blur-sm border border-red-700 rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          💪 ¡Sigue así, campeón!
        </h2>
        <p className="text-gray-300 text-lg">
          "El boxeo es el deporte más difícil. Se necesita más que solo fuerza física. 
          Se necesita fuerza mental también."
        </p>
        <p className="text-red-400 font-semibold mt-2">- Muhammad Ali</p>
      </div>
    </div>
  );
}