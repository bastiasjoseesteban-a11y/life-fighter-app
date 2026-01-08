import { RutinaAgrupada } from '@/lib/types/rutinas';
import type { EjercicioRutina } from '@/lib/types/rutinas';
import rutinasData from '@/data/rutinas-agrupadas.json';

export function parseRutinasData(): RutinaAgrupada[] {
  // Accedemos a la propiedad boxeadores del JSON
  const data = (rutinasData as any).boxeadores || [];
  
  return data.map((item: any) => ({
    ...item,
    rutinas_json: typeof item.rutinas_json === 'string' 
      ? JSON.parse(item.rutinas_json) 
      : item.rutinas_json
  })) as RutinaAgrupada[];
}

export function getRutinasByBoxeadorId(boxeadorId: number): EjercicioRutina[] {
  const allRutinas = parseRutinasData();
  const boxeadorRutina = allRutinas.find(r => r.boxeador_id === boxeadorId);
  return boxeadorRutina ? (boxeadorRutina.rutinas_json as unknown as EjercicioRutina[]) : [];
}

export function agruparRutinasPorRound(rutinas: EjercicioRutina[]): Record<number, EjercicioRutina[]> {
  return rutinas.reduce((grupos, rutina) => {
    const round = rutina.round;
    if (!grupos[round]) { grupos[round] = []; }
    grupos[round].push(rutina);
    return grupos;
  }, {} as Record<number, EjercicioRutina[]>);
}

export function calcularEstadisticasRutina(rutinas: EjercicioRutina[]) {
  const totalDuracion = rutinas.reduce((sum, r) => sum + r.duracion, 0);
  const rounds = new Set(rutinas.map(r => r.round));
  return {
    totalDuracion,
    totalEjercicios: rutinas.length,
    totalRounds: rounds.size,
    duracionPorRound: rounds.size > 0 ? Math.round(totalDuracion / rounds.size) : 0,
    niveles: Array.from(new Set(rutinas.map(r => r.ejercicio?.split(' ')[0] || '')))
  };
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return minutes > 0 ? `${minutes}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
}