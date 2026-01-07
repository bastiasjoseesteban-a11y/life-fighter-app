import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface Rutina {
  id: number;
  boxeador_id: number;
  round: number;
  ejercicio: string;
  duracion_segundos: number;
  descripcion_ejercicio: string | null;
  nivel: string;
}

export function useRutinas(boxeadorId: number) {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!boxeadorId) {
      setLoading(false);
      return;
    }

    const fetchRutinas = async () => {
      try {
        const { data, error } = await supabase
          .from('rutinas')
          .select('*')
          .eq('boxeador_id', boxeadorId)
          .order('round', { ascending: true });

        if (error) throw error;
        
        setRutinas(data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error cargando rutinas:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRutinas();
  }, [boxeadorId]);

  // Agrupar rutinas por round
  const rutinasPorRound = rutinas.reduce((grupos, rutina) => {
    const round = rutina.round;
    if (!grupos[round]) {
      grupos[round] = [];
    }
    grupos[round].push(rutina);
    return grupos;
  }, {} as Record<number, Rutina[]>);

  // Calcular estadísticas
  const estadisticas = {
    totalEjercicios: rutinas.length,
    totalRounds: Object.keys(rutinasPorRound).length,
    totalSegundos: rutinas.reduce((sum, r) => sum + r.duracion_segundos, 0),
  };

  return {
    rutinas,
    rutinasPorRound,
    estadisticas,
    loading,
    error
  };
}