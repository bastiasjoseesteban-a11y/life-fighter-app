export interface Boxeador {
  id: number;
  nombre: string;
  estilo: string;
  record: string;
  nacionalidad?: string;
  peso?: string;
  altura?: string;
  imagen_url?: string;
  biografia?: string;
  titulos?: string;
  created_at?: string;
}

export interface Rutina {
  id: number;
  boxeador_id: number;
  round: number;
  ejercicio: string;
  duracion_segundos: number;
  descripcion_ejercicio?: string;
  nivel: 'Principiante' | 'Intermedio' | 'Avanzado';
  video_url?: string;
  instrucciones?: string[];
  created_at?: string;
}

export interface SesionEntrenamiento {
  id: string;
  usuario_id?: string;
  boxeador_id: number;
  fecha: string;
  duracion_minutos: number;
  calorias_estimadas: number;
  rondas_completadas: number;
  notas?: string;
}
