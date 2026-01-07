// app/lib/services/rutinasService.ts
import { RutinaAgrupada, EjercicioRutina, BoxeadorConRutina } from '@/lib/types/rutinas';
import rutinasData from '@/app/data/rutinas-agrupadas.json';

// Convertir el JSON string a objetos
export function parseRutinasData(): RutinaAgrupada[] {
  return rutinasData.map(item => ({
    ...item,
    rutinas_json: JSON.parse(item.rutinas_json as any) as EjercicioRutina[]
  }));
}

// Obtener rutinas por boxeador ID
export function getRutinasByBoxeadorId(boxeadorId: number): EjercicioRutina[] {
  const allRutinas = parseRutinasData();
  const boxeadorRutina = allRutinas.find(r => r.boxeador_id === boxeadorId);
  
  if (!boxeadorRutina) {
    return [];
  }
  
  return boxeadorRutina.rutinas_json;
}

// Agrupar rutinas por round
export function agruparRutinasPorRound(rutinas: EjercicioRutina[]): Record<number, EjercicioRutina[]> {
  return rutinas.reduce((grupos, rutina) => {
    const round = rutina.round;
    if (!grupos[round]) {
      grupos[round] = [];
    }
    grupos[round].push(rutina);
    return grupos;
  }, {} as Record<number, EjercicioRutina[]>);
}

// Calcular estadísticas de la rutina
export function calcularEstadisticasRutina(rutinas: EjercicioRutina[]) {
  const totalDuracion = rutinas.reduce((sum, r) => sum + r.duracion, 0);
  const rounds = new Set(rutinas.map(r => r.round));
  
  return {
    totalDuracion,
    totalEjercicios: rutinas.length,
    totalRounds: rounds.size,
    duracionPorRound: Math.round(totalDuracion / rounds.size),
    niveles: Array.from(new Set(rutinas.map(r => r.ejercicio.split(' ')[0])))
  };
}

// Formatear tiempo
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
  return `${secs}s`;
}
ARCHIVO 3: Hook personalizado para rutinas (app/lib/hooks/useRutinas.ts)
typescript
// app/lib/hooks/useRutinas.ts
'use client';

import { useState, useEffect } from 'react';
import { EjercicioRutina } from '@/lib/types/rutinas';
import { getRutinasByBoxeadorId, agruparRutinasPorRound, calcularEstadisticasRutina } from '@/lib/services/rutinasService';

export function useRutinas(boxeadorId: number) {
  const [rutinas, setRutinas] = useState<EjercicioRutina[]>([]);
  const [rutinasPorRound, setRutinasPorRound] = useState<Record<number, EjercicioRutina[]>>({});
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!boxeadorId) {
      setError('ID de boxeador no proporcionado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Obtener rutinas del boxeador
      const rutinasData = getRutinasByBoxeadorId(boxeadorId);
      
      if (rutinasData.length === 0) {
        setError(`No se encontraron rutinas para el boxeador ID: ${boxeadorId}`);
      } else {
        setRutinas(rutinasData);
        
        // Agrupar por round
        const agrupadas = agruparRutinasPorRound(rutinasData);
        setRutinasPorRound(agrupadas);
        
        // Calcular estadísticas
        const stats = calcularEstadisticasRutina(rutinasData);
        setEstadisticas(stats);
      }
    } catch (err: any) {
      setError(`Error al cargar rutinas: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [boxeadorId]);

  return {
    rutinas,
    rutinasPorRound,
    estadisticas,
    loading,
    error,
    tieneRutinas: rutinas.length > 0
  };
}