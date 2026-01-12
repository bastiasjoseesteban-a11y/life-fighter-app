// app/lib/supabase/rutinas.ts
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

// Obtener todas las rutinas de un boxeador
export async function getRutinasByBoxeador(boxeadorId: number): Promise<Rutina[]> {
  try {
    const { data, error } = await supabase
      .from('rutinas')
      .select('*')
      .eq('boxeador_id', boxeadorId)
      .order('round', { ascending: true });

    if (error) {
      console.error('Error obteniendo rutinas:', error);
      return [];
    }

    return data as Rutina[];
  } catch (error) {
    console.error('Error inesperado:', error);
    return [];
  }
}

// Obtener rutinas agrupadas por round
export async function getRutinasAgrupadas(boxeadorId: number) {
  const rutinas = await getRutinasByBoxeador(boxeadorId);
  
  // Agrupar por round
  const agrupadas = rutinas.reduce((acc, rutina) => {
    const roundKey = `Round ${rutina.round}`;
    
    if (!acc[roundKey]) {
      acc[roundKey] = [];
    }
    
    acc[roundKey].push(rutina);
    return acc;
  }, {} as Record<string, Rutina[]>);

  return agrupadas;
}

// Calcular duración total de la rutina
export function calcularDuracionTotal(rutinas: Rutina[]): number {
  return rutinas.reduce((total, rutina) => total + rutina.duracion_segundos, 0);
}

// Formatear tiempo (segundos a MM:SS)
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}