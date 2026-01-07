"use client";

import { useRutinas } from '@/lib/hooks/useRutinas';
import { Clock, Dumbbell, Layers, Target } from 'lucide-react';

interface RutinasDisplayProps {
  boxeadorId: number;
}

export default function RutinasDisplay({ boxeadorId }: RutinasDisplayProps) {
  const { rutinasPorRound, estadisticas, loading, error } = useRutinas(boxeadorId);

  // Función para formatear tiempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-800/50 rounded-xl">
        <p className="text-gray-300">Cargando rutinas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/30 border border-red-700 rounded-xl">
        <p className="text-red-300">Error: {error}</p>
      </div>
    );
  }

  if (Object.keys(rutinasPorRound).length === 0) {
    return (
      <div className="p-6 bg-gray-800/30 border border-gray-700 rounded-xl text-center">
        <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No hay rutinas configuradas para este boxeador.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Duración</p>
              <p className="text-lg font-bold">{formatTime(estadisticas.totalSegundos)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Ejercicios</p>
              <p className="text-lg font-bold">{estadisticas.totalEjercicios}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">Rounds</p>
              <p className="text-lg font-bold">{estadisticas.totalRounds}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rounds */}
      <div className="space-y-4">
        {Object.entries(rutinasPorRound).map(([round, ejercicios]) => (
          <div key={round} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-500" />
              Round {round}
            </h3>
            
            <div className="space-y-3">
              {ejercicios.map((ejercicio) => (
                <div key={ejercicio.id} className="bg-gray-900/50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{ejercicio.ejercicio}</h4>
                      {ejercicio.descripcion_ejercicio && (
                        <p className="text-gray-400 text-sm mt-1">
                          {ejercicio.descripcion_ejercicio}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                        {formatTime(ejercicio.duracion_segundos)}
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                        {ejercicio.nivel}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}