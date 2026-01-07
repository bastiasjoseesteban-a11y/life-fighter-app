'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Boxeador, Rutina } from '@/lib/types';
import { 
  ArrowLeft, Play, Timer, Target, Award, 
  Dumbbell, Heart, Zap, Users, Calendar,
  CheckCircle, Volume2, Settings
} from 'lucide-react';

export default function EntrenamientoPage() {
  const params = useParams();
  const router = useRouter();
  const boxeadorId = params.id as string;
  
  const [boxeador, setBoxeador] = useState<Boxeador | null>(null);
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRound, setActiveRound] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Cargar datos
  useEffect(() => {
    if (!boxeadorId) return;

    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // 1. Cargar boxeador
        const { data: boxeadorData, error: boxeadorError } = await supabase
          .from('boxeadores')
          .select('*')
          .eq('id', boxeadorId)
          .single();

        if (boxeadorError) throw boxeadorError;
        setBoxeador(boxeadorData);

        // 2. Cargar rutinas
        const { data: rutinasData, error: rutinasError } = await supabase
          .from('rutinas')
          .select('*')
          .eq('boxeador_id', boxeadorId)
          .order('round')
          .order('id');

        if (rutinasError) throw rutinasError;
        setRutinas(rutinasData || []);

      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [boxeadorId]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Agrupar rutinas por round
  const rutinasPorRound = rutinas.reduce((acc, rutina) => {
    if (!acc[rutina.round]) {
      acc[rutina.round] = [];
    }
    acc[rutina.round].push(rutina);
    return acc;
  }, {} as Record<number, Rutina[]>);

  // Formatear tiempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular estadísticas
  const estadisticas = {
    totalEjercicios: rutinas.length,
    totalRounds: Object.keys(rutinasPorRound).length,
    totalSegundos: rutinas.reduce((sum, r) => sum + r.duracion_segundos, 0),
    niveles: Array.from(new Set(rutinas.map(r => r.nivel)))
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Dumbbell className="w-12 h-12 text-yellow-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-xl font-bold">PREPARANDO ENTRENAMIENTO</p>
          <p className="text-gray-400 mt-2">Cargando rutina del campeón...</p>
        </div>
      </div>
    );
  }

  if (!boxeador) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-8xl mb-6">🥊</div>
          <h2 className="text-3xl font-bold mb-4">BOXEADOR NO ENCONTRADO</h2>
          <p className="text-gray-400 mb-8">El campeón que buscas no está disponible.</p>
          <Link
            href="/entrenar"
            className="inline-flex items-center px-6 py-3 bg-yellow-600 text-black font-bold rounded-xl hover:bg-yellow-500"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            VOLVER A SELECCIÓN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/entrenar"
              className="flex items-center text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">VOLVER</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl font-black italic text-yellow-500 uppercase">
                MODO ENTRENAMIENTO
              </h1>
              <p className="text-xs text-gray-400">Preparado para comenzar</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Información del Boxeador */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-3xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Avatar y Nombre */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-yellow-600 to-red-600 flex items-center justify-center shadow-2xl">
                <span className="text-8xl">🥊</span>
              </div>
            </div>
            
            {/* Detalles */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <h2 className="text-4xl md:text-5xl font-black uppercase mb-2 sm:mb-0">
                  {boxeador.nombre}
                </h2>
                <div className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold">
                  {estadisticas.totalRounds} ROUNDS
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full font-bold">
                  {boxeador.estilo || 'ESTILO CLÁSICO'}
                </span>
                <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full font-bold">
                  {boxeador.peso || 'PESO COMPLETO'}
                </span>
                <span className="px-4 py-2 bg-red-500/20 text-red-400 rounded-full font-bold">
                  {boxeador.record || 'INVICTO'}
                </span>
              </div>
              
              <p className="text-gray-300 mb-8 max-w-3xl">
                Entrena al estilo de {boxeador.nombre}. {boxeador.nacionalidad && `Campeón de ${boxeador.nacionalidad}.`}
                Esta rutina ha sido diseñada para replicar el entrenamiento que llevó a este campeón a la cima.
              </p>
              
              {/* Botones de Acción */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="flex-1 min-w-[200px] px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-black font-black text-lg rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-105"
                >
                  <Play className="w-6 h-6" />
                  {isTimerRunning ? 'PAUSAR ENTRENAMIENTO' : 'INICIAR ENTRENAMIENTO'}
                </button>
                
                <button className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl flex items-center gap-3 transition">
                  <Calendar className="w-5 h-5" />
                  GUARDAR RUTINA
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Principal: Timer y Rutinas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Timer y Estadísticas */}
          <div className="lg:col-span-1 space-y-6">
            {/* Timer */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Timer className="w-6 h-6 text-blue-500" />
                  TEMPORIZADOR
                </h3>
                <span className="text-sm text-gray-400">ROUND {activeRound || 1}</span>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-6xl md:text-7xl font-black font-mono mb-4">
                  {formatTime(timerSeconds)}
                </div>
                <div className="text-gray-400">TIEMPO RESTANTE</div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTimerSeconds(180)}
                  className="py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold"
                >
                  3 MIN
                </button>
                <button
                  onClick={() => setTimerSeconds(300)}
                  className="py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold"
                >
                  5 MIN
                </button>
                <button
                  onClick={() => setTimerSeconds(60)}
                  className="py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold"
                >
                  1 MIN
                </button>
              </div>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-green-500" />
                ESTADÍSTICAS
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Dumbbell className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">EJERCICIOS</div>
                      <div className="text-xl font-bold">{estadisticas.totalEjercicios}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <Heart className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">DURACIÓN</div>
                      <div className="text-xl font-bold">{formatTime(estadisticas.totalSegundos)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <Zap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">NIVEL</div>
                      <div className="text-xl font-bold">{estadisticas.niveles[0] || 'PRINCIPIANTE'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progreso */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">TU PROGRESO</h3>
              <div className="space-y-3">
                {Object.keys(rutinasPorRound).map(round => (
                  <div key={round} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activeRound === parseInt(round) 
                          ? 'bg-yellow-500 text-black' 
                          : 'bg-gray-700'
                      }`}>
                        {round}
                      </div>
                      <span>Round {round}</span>
                    </div>
                    <CheckCircle className={`w-5 h-5 ${
                      activeRound === parseInt(round) 
                        ? 'text-yellow-500' 
                        : 'text-gray-600'
                    }`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Rutinas */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Award className="w-7 h-7 text-yellow-500" />
                  RUTINA COMPLETA
                </h2>
                <div className="text-sm text-gray-400">
                  {estadisticas.totalEjercicios} ejercicios • {formatTime(estadisticas.totalSegundos)} total
                </div>
              </div>

              {/* Rounds */}
              <div className="space-y-6">
                {Object.entries(rutinasPorRound).map(([round, ejercicios]) => (
                  <div 
                    key={round}
                    className={`border-2 rounded-2xl p-6 transition-all ${
                      activeRound === parseInt(round)
                        ? 'border-yellow-500 bg-yellow-500/5'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setActiveRound(parseInt(round))}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          activeRound === parseInt(round)
                            ? 'bg-yellow-500 text-black'
                            : 'bg-gray-700'
                        }`}>
                          <span className="text-xl font-black">{round}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">ROUND {round}</h3>
                          <p className="text-gray-400">{ejercicios.length} ejercicios</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-gray-700 rounded-lg">
                        <span className="font-bold">{formatTime(
                          ejercicios.reduce((sum, e) => sum + e.duracion_segundos, 0)
                        )}</span>
                      </div>
                    </div>

                    {/* Ejercicios del Round */}
                    <div className="space-y-4">
                      {ejercicios.map((ejercicio) => (
                        <div 
                          key={ejercicio.id}
                          className="bg-gray-900/50 p-5 rounded-xl border-l-4 border-yellow-500"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                  <Dumbbell className="w-5 h-5 text-blue-400" />
                                </div>
                                <h4 className="text-lg font-bold">{ejercicio.ejercicio}</h4>
                              </div>
                              
                              <p className="text-gray-300 mb-4">
                                {ejercicio.descripcion_ejercicio || 
                                  `Ejercicio típico del estilo ${boxeador?.estilo}.`}
                              </p>
                              
                              {ejercicio.instrucciones && (
                                <div className="space-y-2">
                                  <p className="text-sm text-gray-400">Instrucciones:</p>
                                  <ul className="list-disc pl-5 text-sm text-gray-300">
                                    {ejercicio.instrucciones.map((inst, idx) => (
                                      <li key={idx}>{inst}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-end gap-3">
                              <div className="flex items-center gap-2">
                                <Timer className="w-4 h-4 text-gray-400" />
                                <span className="font-bold">{formatTime(ejercicio.duracion_segundos)}</span>
                              </div>
                              
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                ejercicio.nivel === 'Principiante'
                                  ? 'bg-green-500/20 text-green-400'
                                  : ejercicio.nivel === 'Intermedio'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {ejercicio.nivel.toUpperCase()}
                              </span>
                              
                              {ejercicio.video_url && (
                                <a
                                  href={ejercicio.video_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                >
                                  <Play className="w-4 h-4" />
                                  VER DEMO
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Si no hay rutinas */}
              {rutinas.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-6">🥊</div>
                  <h3 className="text-2xl font-bold mb-4">RUTINA EN DESARROLLO</h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Este campeón aún no tiene rutinas configuradas. 
                    Estamos trabajando en añadir su entrenamiento completo.
                  </p>
                  <button
                    onClick={() => router.push('/entrenar')}
                    className="px-6 py-3 bg-yellow-600 text-black font-bold rounded-xl hover:bg-yellow-500"
                  >
                    ELEGIR OTRO BOXEADOR
                  </button>
                </div>
              )}
            </div>

            {/* Consejos de Entrenamiento */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-400" />
                CONSEJOS DEL ENTRENADOR
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span>Calienta 10-15 minutos antes de comenzar. Prepara tu cuerpo para la intensidad.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span>Mantén una botella de agua cerca y bebe pequeños sorbos entre rounds.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span>Concéntrate en la técnica, no en la velocidad. La precisión es clave.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span>Descansa 60-90 segundos entre rounds para máxima recuperación.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span>Lleva un registro de tu progreso. La consistencia es lo que crea campeones.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}