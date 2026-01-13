'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { 
  Play, Pause, ChevronLeft, RotateCcw, SkipForward, 
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
  filosofia_vida?: string;  // CORREGIDO: era 'filosofa_vida'
  instruccion_tecnica?: string;
  combinaciones?: string;
}

interface EntrenamientoCompletoProps {
  boxeadorId: number;
}

export default function EntrenamientoCompleto({ boxeadorId }: EntrenamientoCompletoProps) {
  const router = useRouter();
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
  const [verFilosofia, setVerFilosofia] = useState(true);
  
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
          .select('id, nombre, apodo, filosofia_vida, instruccion_tecnica, combinaciones') // CORREGIDO: 'filosofia_vida'
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-[#00FBFF] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-xl font-bold text-white">PREPARANDO ENTRENAMIENTO</p>
          <p className="text-gray-400 mt-2">Cargando rutina del campeón...</p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (!boxeador || rutina.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-8xl mb-6">??</div>
          <h2 className="text-3xl font-bold text-white mb-4">ERROR</h2>
          <p className="text-gray-400 mb-8">No se pudo cargar la información del campeón.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden select-none">
      {/* BARRA DE PROGRESO */}
      <div className="flex w-full h-3 bg-zinc-900 border-b border-white/5">
        {rutina.map((p, i) => (
          <div 
            key={i} 
            className="h-full border-r border-black/30 transition-all duration-700"
            style={{ 
              width: `${100/rutina.length}%`, 
              backgroundColor: i < indiceActual ? p.color : i === indiceActual ? '#FFF' : '#222',
              boxShadow: i === indiceActual ? `0 0 15px ${p.color}` : 'none'
            }}
          />
        ))}
      </div>

      {/* HEADER */}
      <nav className="p-6 flex justify-between items-center bg-zinc-950/90 backdrop-blur-xl z-50">
        <button onClick={() => router.back()} className="p-2 active:scale-90">
          <ChevronLeft size={32}/>
        </button>
        
        <div className="flex gap-6">
          <div className="bg-zinc-900 px-6 py-3 rounded-[1.5rem] border border-white/5 flex flex-col items-center min-w-[100px]">
            <Flame size={18} className="text-orange-500 mb-1"/>
            <span className="text-xl font-black tabular-nums leading-none">
              {Math.floor(calorias)}
            </span>
            <span className="text-[10px] text-zinc-500 uppercase font-black">Kcal</span>
          </div>
          <div className="bg-zinc-900 px-6 py-3 rounded-[1.5rem] border border-white/5 flex flex-col items-center min-w-[100px]">
            <Zap size={18} className="text-[#00FBFF] mb-1"/>
            <span className="text-xl font-black uppercase tracking-tighter leading-none">
              {nivel}
            </span>
            <span className="text-[10px] text-zinc-500 uppercase font-black">Nivel</span>
          </div>
        </div>
        
        <button onClick={() => setIsMuted(!isMuted)} className="p-2">
          {isMuted ? <VolumeX size={28} className="text-red-500"/> : <Volume2 size={28} className="text-zinc-400"/>}
        </button>
      </nav>

      {/* MONITOR PRINCIPAL */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
        <div className="mb-6 inline-flex items-center gap-2 bg-zinc-900/80 px-5 py-2 rounded-full border border-white/10 shadow-xl">
          <Activity size={14} className="text-[#00FBFF] animate-pulse"/>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            {rutina[indiceActual].fase} 
            {rutina[indiceActual].round ? ` · RD ${rutina[indiceActual].round}/${rutina[indiceActual].totalRounds}` : ''}
          </span>
        </div>

        <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4 leading-none">
          {rutina[indiceActual].nombre}
        </h1>

        <div className="text-[140px] font-black italic leading-none tracking-tighter mb-8 tabular-nums drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {Math.floor(segundos/60)}:{(segundos%60).toString().padStart(2,'0')}
        </div>

        <div className="bg-zinc-900/40 p-6 rounded-[2.5rem] border border-white/5 w-full max-w-md mb-12 backdrop-blur-md">
          <p className="text-[9px] font-black text-[#00FBFF] uppercase tracking-[0.2em] mb-3 flex items-center justify-center gap-2">
            <ShieldCheck size={14}/> Instrucción del Boxeador
          </p>
          <p className="text-lg font-medium italic text-zinc-200 leading-tight">
            {rutina[indiceActual].detalle}
          </p>
        </div>

        {/* CONTROLES */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => { setTipoAjuste('subir'); setMostrarPopUp(true); }} 
            className="p-4 bg-zinc-900/50 rounded-full text-zinc-600 hover:text-white transition-colors border border-white/5 active:scale-90"
          >
            <ArrowUpCircle size={28}/>
          </button>
          
          <button 
            onClick={() => setSegundos(rutina[indiceActual].duracion)} 
            className="p-3 text-zinc-700 hover:text-white transition-all active:scale-90"
          >
            <RotateCcw size={24}/>
          </button>

          <button 
            onClick={() => {
              if (!activo) {
                decir(rutina[indiceActual].detalle);
              }
              setActivo(!activo);
            }} 
            className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center shadow-[0_15px_60px_rgba(255,255,255,0.2)] active:scale-90 transition-all"
          >
            {activo ? <Pause size={48} fill="black"/> : <Play size={48} fill="black" className="ml-2"/>}
          </button>

          <button 
            onClick={saltarBloque} 
            className="p-3 text-[#00FBFF] hover:scale-110 transition-transform active:scale-95"
          >
            <SkipForward size={32} fill="currentColor"/>
          </button>

          <button 
            onClick={() => { setTipoAjuste('bajar'); setMostrarPopUp(true); }} 
            className="p-4 bg-zinc-900/50 rounded-full text-zinc-600 hover:text-white transition-colors border border-white/5 active:scale-90"
          >
            <ArrowDownCircle size={28}/>
          </button>
        </div>
      </main>

      {/* FOOTER FLOTANTE CON FILOSOFÍA */}
      {verFilosofia && boxeador && (
        <div className="fixed bottom-8 left-0 right-0 z-[50] flex justify-center animate-in slide-in-from-bottom duration-700">
          <div className="relative w-full max-w-sm mx-6 bg-[#00FBFF] text-black p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            
            <button 
              onClick={() => setVerFilosofia(false)}
              className="absolute top-4 right-4 w-7 h-7 bg-black/10 rounded-full flex items-center justify-center hover:bg-black/20 transition-colors"
            >
              <RotateCcw size={12} className="rotate-45" />
            </button>
            
            <div className="flex items-center gap-2 mb-2 opacity-70">
              <Quote size={12} fill="black" />
              <span className="font-black uppercase text-[8px] tracking-[0.2em]">
                Filosofía de {boxeador.nombre}
              </span>
            </div>
            
            <p className="text-xl font-black italic leading-tight tracking-tighter mb-4">
              "{boxeador.filosofia_vida || 'La disciplina es el puente entre metas y logros.'}"
            </p>
            
            <div className="bg-black/10 p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <Brain size={14} />
                <p className="text-[9px] font-black uppercase tracking-widest">
                  Consejo de Nivel {nivel}
                </p>
              </div>
              <p className="text-sm font-bold italic leading-snug">
                "{INFO_NIVEL[nivel].filosofia}"
              </p>
            </div>
            
          </div>
        </div>
      )}

      {/* POP-UP CAMBIO DE NIVEL */}
      {mostrarPopUp && (
        <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-8 backdrop-blur-2xl">
          <div className="text-center max-w-sm">
            <div className="flex justify-center mb-8">
              {tipoAjuste === 'subir' 
                ? <ArrowUpCircle size={64} className="text-[#00FBFF] animate-bounce"/> 
                : <ArrowDownCircle size={64} className="text-red-600 animate-pulse"/>
              }
            </div>
            <p className="text-2xl font-serif italic text-white/80 mb-12 leading-snug">
              {tipoAjuste === 'subir' 
                ? '¿Estás seguro? No te apresures; igual no hay problema, vuelve cuando quieras.' 
                : 'Sientes que no es el momento; no te preocupes, ya volverás.'}
            </p>
            <div className="flex flex-col gap-4">
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
                className="w-full bg-[#00FBFF] text-black py-5 rounded-3xl font-black uppercase italic text-xl shadow-[0_20px_40px_rgba(0,251,255,0.3)] active:scale-95 transition-all"
              >
                Confirmar Cambio
              </button>
              <button 
                onClick={() => setMostrarPopUp(false)} 
                className="text-zinc-600 font-bold uppercase tracking-widest text-[10px] py-4"
              >
                Cancelar y Seguir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PANTALLA DE VICTORIA */}
      {completado && (
        <div className="fixed inset-0 bg-[#00FBFF] z-[200] flex flex-col items-center justify-center p-12 text-black text-center">
          <div className="bg-black p-8 rounded-full mb-10 shadow-2xl animate-bounce">
            <Target size={80} className="text-[#00FBFF]" />
          </div>
          <h1 className="text-8xl font-black italic tracking-tighter leading-none mb-4">
            ¡KO TÉCNICO!
          </h1>
          <p className="font-black uppercase tracking-[0.4em] text-xs opacity-60 mb-8">
            Has completado la rutina de {boxeador.nombre}
          </p>
          <div className="bg-black/10 p-6 rounded-2xl mb-12">
            <p className="text-lg font-bold mb-2">Estadísticas de la sesión:</p>
            <p className="text-4xl font-black">{Math.floor(calorias)} KCAL</p>
            <p className="text-sm uppercase tracking-widest mt-2 opacity-70">Nivel: {nivel}</p>
          </div>
          <button 
            onClick={() => router.push('/entrenar')} 
            className="bg-black text-white px-16 py-6 rounded-3xl font-black uppercase italic text-2xl shadow-2xl active:scale-95 transition-all hover:bg-zinc-900"
          >
            Volver al Gimnasio
          </button>
        </div>
      )}
    </div>
  );
}