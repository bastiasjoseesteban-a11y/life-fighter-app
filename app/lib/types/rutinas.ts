// app/lib/types/rutinas.ts
export interface EjercicioRutina {
  id: number;
  round: number;
  ejercicio: string;
  descripcion: string;
  duracion: number;
}

export interface RutinaAgrupada {
  boxeador_id: number;
  nivel: string;
  rutinas_json: EjercicioRutina[];
}

export interface BoxeadorConRutina {
  id: number;
  nombre: string;
  estilo: string;
  record: string;
  rutinas: EjercicioRutina[];
  nivel: string;
}