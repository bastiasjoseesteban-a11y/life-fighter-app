'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Play, Pause, RotateCcw, SkipForward, 
  Flame, Volume2, VolumeX, Activity,
  ArrowUpCircle, ArrowDownCircle, Target, ShieldCheck, Zap, Brain, Quote
} from 'lucide-react';

type NivelBoxeo = 'Principiante' | 'Intermedio' | 'Avanzado';

interface BloqueRutina {
  fase: string;
  nombre: string;
  detalle: string;
  duracion: number;
  color: string;
  round?: number;
  totalRounds?: number;
}

interface Boxeador {
  id: number;
  nombre: string;
  apodo: string;
  filosofia_vida?: string;
  instruccion_tecnica?: string;
  combinaciones?: string;
}

interface EntrenamientoCompletoProps {
  boxeadorId: number;
}

export default function EntrenamientoCompleto({ boxeadorId }: EntrenamientoCompletoProps) {
  const [boxeador, setBoxeador] = useState<Boxeador | null>(null);
  const [nivel, setNivel] = useState<NivelBoxeo>('Principiante');
  const [rutina, setRutina] = useState<BloqueRutina[]>([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [calorias, setCalorias] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [mostrarPopUp, setMostrarPopUp] = useState(false);
  const [tipoAjuste, setTipoAjuste] = useState<'subir' | 'bajar' | null>(null);
  const [completado, setCompletado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verFilosofia, setVerFilosofia] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const INFO_NIVEL = {
    'Principiante': { 
      filosofia: "No corras si no sabes caminar. Mejor 3 golpes perfectos que 30 malos.", 
      calFactor: 0.12,
      rounds: 3,
      tiempoRound: 120,
      descanso: 30
    },
    'Intermedio': { 
      filosofia: "La técnica te lleva a la pelea, la condición física te saca victorioso.", 
      calFactor: 0.18,
      rounds: 6,
      tiempoRound: 180,
      descanso: 60
    },
    'Avanzado': { 
      filosofia: "El campeón se hace los días que no tiene ganas de entrenar. Tu rival está entrenando ahora.", 
      calFactor: 0.25,
      rounds: 12,
      tiempoRound: 180,
      descanso: 60
    }
  };

  // AUDIO MEJORADO
  const decir = useCallback((texto: string) => {
    if (isMuted || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-AR';
    u.rate = 0.9;
    u.pitch = 1.1;
    u.volume = 1;
    window.speechSynthesis.speak(u);
  }, [isMuted]);

  // SALTAR BLOQUE
  const saltarBloque = useCallback(() => {
    if (indiceActual < rutina.length - 1) {
      const next = indiceActual + 1;
      setIndiceActual(next);
      setSegundos(rutina[next].duracion);
      setActivo(false);
      decir(`Siguiente: ${rutina[next].nombre}`);
    } else {
      setCompletado(true);
      decir("Entrenamiento completado! Eres un campeón.");
    }
  }, [indiceActual, rutina, decir]);

  // GENERADOR DE RUTINA
  const generarRutina = useCallback((boxer: Boxeador) => {
    const pasos: BloqueRutina[] = [];
    const cfg = INFO_NIVEL[nivel];
    
    for(let i=1; i <= cfg.rounds; i++) {
      pasos.push({ 
        fase: 'Calentamiento', 
        nombre: `Cuerda RD ${i}`, 
        detalle: 'Ritmo constante. Mantén los codos pegados al cuerpo.', 
        duracion: cfg.tiempoRound, 
        color: '#FFD700', 
        round: i, 
        totalRounds: cfg.rounds 
      });
      pasos.push({ 
        fase: 'Descanso', 
        nombre: 'Descanso', 
        detalle: 'Respira profundo por la nariz.', 
        duracion: cfg.descanso, 
        color: '#1a1a1a' 
      });
    }

    pasos.push({ 
      fase: 'Técnica', 
      nombre: 'Sombra', 
      detalle: boxer.instruccion_tecnica || 'Mantén la guardia alta y mueve los pies constantemente.', 
      duracion: 180, 
      color: '#00FBFF' 
    });
    pasos.push({ 
      fase: 'Descanso', 
      nombre: 'Descanso', 
      detalle: 'Hidratación leve. Visualiza tu técnica.', 
      duracion: 60, 
      color: '#1a1a1a' 
    });

    for(let i=1; i <= cfg.rounds; i++) {
      pasos.push({ 
        fase: 'Específico', 
        nombre: `Saco: ${boxer.nombre}`, 
        detalle: boxer.combinaciones || 'Jab-Jab-Derecha. Salida lateral después del combo.', 
        duracion: 180, 
        color: '#FF3131', 
        round: i, 
        totalRounds: cfg.rounds 
      });
      pasos.push({ 
        fase: 'Descanso', 
        nombre: 'Descanso', 
        detalle: 'Respira. Mentaliza el próximo round.', 
        duracion: 60, 
        color: '#1a1a1a' 
      });
    }

    pasos.push({ 
      fase: 'Estiramiento', 
      nombre: 'Vuelta a la calma', 
      detalle: 'Estiramiento estático. Relaja cuello y espalda. 30s por músculo.', 
      duracion: 300, 
      color: '#39FF14' 
    });

    return pasos;
  }, [nivel]);

  // CARGAR BOXEADOR
  useEffect(() => {
    async function cargarBoxeador() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('boxeadores_completo')
          .select('id, nombre, apodo, filosofia_vida, instruccion_tecnica, combinaciones')
          .eq('id', boxeadorId)
          .single();
        
        if (error) {
          console.error('Error cargando boxeador:', error);
          return;
        }

        if (data) {
          setBoxeador(data);
          const r = generarRutina(data);
          setRutina(r);
          setSegundos(r[0].duracion);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    cargarBoxeador();
  }, [boxeadorId, generarRutina]);

  // INSTRUCCIÓN DE VOZ AL CAMBIAR DE BLOQUE
  useEffect(() => {
    if (rutina[indiceActual] && activo) {
      if (rutina[indiceActual].fase === 'Descanso') {
        decir("Descanso. Respira profundo.");
      } else {
        decir(`${rutina[indiceActual].nombre}. ${rutina[indiceActual].detalle}`);
      }
    }
  }, [indiceActual, activo, rutina, decir]);

  // CRONÓMETRO
  useEffect(() => {
    if (activo && segundos > 0) {
      timerRef.current = setInterval(() => {
        setSegundos(s => {
          if (s === 11) decir("Últimos 10 segundos!");
          if (s === 4) decir("3, 2, 1");
          return s - 1;
        });
        setCalorias(c => c + INFO_NIVEL[nivel].calFactor);
      }, 1000);
    } else if (segundos === 0 && activo) {
      saltarBloque();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activo, segundos, nivel, saltarBloque, decir]);

  // LOADING STATE
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl bg-black/40 backdrop-blur-sm border border-zinc-800">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-3 border-[#00FBFF] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-base font-bold text-white">PREPARANDO ENTRENAMIENTO</p>
          <p className="text-gray-400 mt-1 text-sm">Cargando rutina del campeón...</p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (!boxeador || rutina.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 rounded-2xl bg-black/40 backdrop-blur-sm border border-zinc-800">
        <div className="text-center">
          <div className="text-6xl mb-4">🥊</div>
          <h2 className="text-xl font-bold text-white mb-2">ERROR</h2>
          <p className="text-gray-400">No se pudo cargar la información del campeón.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black/40 backdrop-blur-sm rounded-2xl border border-zinc-800 overflow-hidden">
      {/* BARRA DE PROGRESO */}
      <div className="flex w-full h-2 bg-zinc-900/80">
        {rutina.map((p, i) => (
          <div 
            key={i} 
            className="h-full border-r border-black/30 transition-all duration-700"
            style={{ 
              width: `${100/rutina.length}%`, 
              backgroundColor: i < indiceActual ? p.color : i === indiceActual ? '#FFF' : '#222',
              boxShadow: i === indiceActual ? `0 0 8px ${p.color}` : 'none'
            }}
          />
        ))}
      </div>

      {/* HEADER COMPACTO */}
      <div className="p-4 flex justify-between items-center bg-zinc-900/50 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setVerFilosofia(!verFilosofia)}
            className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <Quote size={18} className="text-[#00FBFF]" />
          </button>
          
          <div className="bg-zinc-800 px-3 py-2 rounded-lg border border-zinc-700 flex items-center gap-2">
            <Flame size={16} className="text-orange-500"/>
            <span className="text-base font-black tabular-nums leading-none">
              {Math.floor(calorias)}
            </span>
            <span className="text-[10px] text-zinc-400 uppercase font-black">Kcal</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-zinc-800 px-3 py-2 rounded-lg border border-zinc-700 flex items-center gap-2">
            <Zap size={16} className="text-[#00FBFF]"/>
            <span className="text-sm font-bold uppercase tracking-tighter">
              {nivel}
            </span>
          </div>
          
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            {isMuted ? <VolumeX size={20} className="text-red-500"/> : <Volume2 size={20} className="text-zinc-300"/>}
          </button>
        </div>
      </div>

      {/* MONITOR PRINCIPAL - COMPACTO */}
      <div className="p-4 flex flex-col items-center text-center">
        {/* INDICADOR DE FASE */}
        <div className="mb-3 inline-flex items-center gap-2 bg-zinc-900/80 px-3 py-1 rounded-full border border-white/10">
          <Activity size={12} className="text-[#00FBFF] animate-pulse"/>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
            {rutina[indiceActual].fase} 
            {rutina[indiceActual].round ? ` · RD ${rutina[indiceActual].round}/${rutina[indiceActual].totalRounds}` : ''}
          </span>
        </div>

        {/* NOMBRE DEL EJERCICIO */}
        <h1 className="text-xl font-bold text-white mb-3">
          {rutina[indiceActual].nombre}
        </h1>

        {/* CRONÓMETRO GRANDE */}
        <div className="text-[60px] font-black italic leading-none tracking-tighter mb-4 tabular-nums text-white">
          {Math.floor(segundos/60)}:{(segundos%60).toString().padStart(2,'0')}
        </div>

        {/* INSTRUCCIÓN */}
        <div className="bg-zinc-900/40 p-4 rounded-xl border border-white/5 w-full mb-6">
          <p className="text-xs font-bold text-[#00FBFF] uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
            <ShieldCheck size={14}/> Instrucción del Boxeador
          </p>
          <p className="text-sm text-zinc-200 leading-tight">
            {rutina[indiceActual].detalle}
          </p>
        </div>

        {/* CONTROLES COMPACTOS */}
        <div className="flex items-center justify-center gap-4 w-full">
          <button 
            onClick={() => { setTipoAjuste('subir'); setMostrarPopUp(true); }} 
            className="p-3 bg-zinc-900/50 rounded-xl text-zinc-400 hover:text-white transition-all border border-zinc-800 hover:border-[#00FBFF]/30"
          >
            <ArrowUpCircle size={22}/>
          </button>
          
          <button 
            onClick={() => setSegundos(rutina[indiceActual].duracion)} 
            className="p-3 bg-zinc-900/50 rounded-xl text-zinc-400 hover:text-white transition-all border border-zinc-800"
          >
            <RotateCcw size={20}/>
          </button>

          {/* BOTÓN PLAY/PAUSE CENTRAL */}
          <button 
            onClick={() => {
              if (!activo) {
                decir(rutina[indiceActual].detalle);
              }
              setActivo(!activo);
            }} 
            className="w-16 h-16 bg-gradient-to-r from-[#FF4D00] to-[#FF8A00] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#FF4D00]/30 active:scale-95 transition-transform"
          >
            {activo ? <Pause size={28} fill="white"/> : <Play size={28} fill="white" className="ml-1"/>}
          </button>

          <button 
            onClick={saltarBloque} 
            className="p-3 bg-zinc-900/50 rounded-xl text-[#00FBFF] hover:scale-110 transition-all border border-zinc-800 hover:border-[#00FBFF]/30"
          >
            <SkipForward size={20} fill="currentColor"/>
          </button>

          <button 
            onClick={() => { setTipoAjuste('bajar'); setMostrarPopUp(true); }} 
            className="p-3 bg-zinc-900/50 rounded-xl text-zinc-400 hover:text-white transition-all border border-zinc-800 hover:border-red-500/30"
          >
            <ArrowDownCircle size={22}/>
          </button>
        </div>
      </div>

      {/* FILOSOFÍA - POPUP */}
      {verFilosofia && boxeador && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 max-w-sm w-full border border-zinc-800 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Quote size={16} className="text-[#00FBFF]"/>
                <span className="text-sm font-bold text-white">Filosofía de {boxeador.nombre}</span>
              </div>
              <button 
                onClick={() => setVerFilosofia(false)}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <span className="text-zinc-400">✕</span>
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-[#00FBFF]/10 to-cyan-900/10 border border-[#00FBFF]/20 rounded-xl p-4 mb-4">
              <p className="text-[#00FBFF] text-base italic leading-relaxed">
                "{boxeador.filosofia_vida || 'La disciplina es el puente entre metas y logros.'}"
              </p>
            </div>
            
            <div className="bg-zinc-900/50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Brain size={14} className="text-amber-400"/>
                <p className="text-xs font-bold text-amber-400 uppercase">
                  Consejo de Nivel {nivel}
                </p>
              </div>
              <p className="text-sm text-white font-medium">
                "{INFO_NIVEL[nivel].filosofia}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP CAMBIO DE NIVEL */}
      {mostrarPopUp && (
        <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 max-w-sm w-full border border-zinc-800 shadow-2xl">
            <div className="flex justify-center mb-6">
              {tipoAjuste === 'subir' 
                ? <ArrowUpCircle size={48} className="text-[#00FBFF]"/> 
                : <ArrowDownCircle size={48} className="text-red-500"/>
              }
            </div>
            <p className="text-lg font-medium text-white/90 mb-6 text-center">
              {tipoAjuste === 'subir' 
                ? '¿Subir de nivel? ¡Demuestra que estás listo!' 
                : '¿Bajar de nivel? No hay problema, puedes volver cuando quieras.'}
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  const niveles: NivelBoxeo[] = ['Principiante', 'Intermedio', 'Avanzado'];
                  const idx = niveles.indexOf(nivel);
                  const next = tipoAjuste === 'subir' 
                    ? niveles[Math.min(idx + 1, 2)] 
                    : niveles[Math.max(idx - 1, 0)];
                  setNivel(next);
                  setMostrarPopUp(false);
                  const nuevaRutina = generarRutina(boxeador);
                  setRutina(nuevaRutina);
                  setIndiceActual(0);
                  setSegundos(nuevaRutina[0].duracion);
                  setActivo(false);
                  setCalorias(0);
                }}
                className="w-full bg-gradient-to-r from-[#00FBFF] to-[#0088FF] text-black py-4 rounded-xl font-bold text-sm shadow-lg shadow-[#00FBFF]/30 active:scale-95 transition-all"
              >
                Confirmar Cambio
              </button>
              <button 
                onClick={() => setMostrarPopUp(false)} 
                className="w-full bg-zinc-800 text-white py-4 rounded-xl font-bold text-sm border border-zinc-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PANTALLA DE COMPLETADO */}
      {completado && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#00FBFF] to-cyan-600 flex flex-col items-center justify-center p-6">
          <div className="bg-black/20 p-8 rounded-full mb-6 backdrop-blur-sm">
            <Target size={60} className="text-white" />
          </div>
          <h1 className="text-3xl font-black italic text-white mb-3 text-center">
            ¡ENTRENAMIENTO COMPLETADO!
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-white/80 mb-6 text-center">
            Rutina de {boxeador.nombre}
          </p>
          <div className="bg-white/10 p-6 rounded-2xl mb-8 backdrop-blur-sm">
            <p className="text-lg font-bold text-white mb-2">Estadísticas:</p>
            <p className="text-4xl font-black text-white">{Math.floor(calorias)} KCAL</p>
            <p className="text-sm text-white/80 mt-2">Nivel: {nivel}</p>
          </div>
          <button 
            onClick={() => {
              setCompletado(false);
              setIndiceActual(0);
              setSegundos(rutina[0].duracion);
              setActivo(false);
              setCalorias(0);
            }} 
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-2xl active:scale-95 transition-all"
          >
            Repetir Entrenamiento
          </button>
        </div>
      )}
    </div>
  );
}