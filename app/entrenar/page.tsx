"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Play, Pause, RotateCcw, Dumbbell, Apple, ScrollText, 
  BookOpen, History, Swords, Brain, Trophy, IdCard, ListChecks
} from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const FRASES_MOTIVACIONALES = [
  "Eres más fuerte de lo que crees. ¡No te detengas!",
  "La Vida pega fuerte, pero levántate y sigue entrenando.",
  "Tu mente es tu mejor golpe.",
  "¡Vamos! ¡Un round más!"
];

export default function EntrenarPage() {
  const [vista, setVista] = useState<'menu' | 'dashboard' | 'cronometro'>('menu');
  const [pestaña, setPestaña] = useState<'rutina' | 'detalles' | 'progreso'>('rutina');
  const [seccionDetalle, setSeccionDetalle] = useState<string>('biografia');
  const [nivel, setNivel] = useState<'principiante' | 'medio' | 'avanzado'>('medio');
  
  const [boxeadores, setBoxeadores] = useState<any[]>([]);
  const [boxeadorSeleccionado, setBoxeadorSeleccionado] = useState<any>(null);
  const [detallesBoxeador, setDetallesBoxeador] = useState<any>(null);
  const [planEntrenamiento, setPlanEntrenamiento] = useState<any[]>([]);
  
  const [xpTotal, setXpTotal] = useState(0);
  const [historialDB, setHistorialDB] = useState<any[]>([]);
  const [segundos, setSegundos] = useState(120);
  const [activo, setActivo] = useState(false);
  const [ejercicioActual, setEjercicioActual] = useState<any>(null);

  // 1. Cargar Datos Iniciales
  useEffect(() => {
    const initApp = async () => {
      const { data: b } = await supabase.from('boxeadores').select('*').order('id');
      if (b) setBoxeadores(b);
      cargarHistorial();
    };
    initApp();
  }, []);

  // 2. Cargar Historial y Calcular XP
  const cargarHistorial = async () => {
    const { data } = await supabase.from('progreso').select('*').order('created_at', { ascending: false });
    if (data) {
      setHistorialDB(data);
      setXpTotal(data.reduce((acc, curr) => acc + (curr.xp_ganado || 0), 0));
    }
  };

  // 3. Cargar Detalles y Rutinas al seleccionar un boxeador
  useEffect(() => {
    if (boxeadorSeleccionado) {
      const fetchData = async () => {
        const { data: rounds } = await supabase.from('rutinas').select('*').eq('boxeador_id', boxeadorSeleccionado.id).order('round');
        const { data: infoExtra } = await supabase.from('boxeadores_detalles').select('*').eq('id', boxeadorSeleccionado.id).single();

        if (rounds) {
          const tiempo = nivel === 'principiante' ? 60 : nivel === 'medio' ? 120 : 180;
          setPlanEntrenamiento(rounds.map(r => ({ ...r, duracion_segundos: tiempo })));
        }
        if (infoExtra) setDetallesBoxeador(infoExtra);
      };
      fetchData();
    }
  }, [boxeadorSeleccionado, nivel]);

  // 4. Voz (Optimizado Android/iOS)
  const hablar = (texto: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); 
      const ut = new SpeechSynthesisUtterance(texto);
      ut.lang = 'es-ES';
      window.speechSynthesis.speak(ut);
    }
  };

  // 5. Guardado en Supabase al terminar el cronómetro
  const guardarProgreso = async () => {
    const { error } = await supabase.from('progreso').insert([{
      boxeador_nombre: boxeadorSeleccionado.nombre,
      round_completado: ejercicioActual.round,
      xp_ganado: 50,
      nivel_dificultad: nivel
    }]);
    if (!error) cargarHistorial();
  };

  useEffect(() => {
    let timer: any;
    if (activo && segundos > 0) {
      timer = setInterval(() => setSegundos(s => s - 1), 1000);
    } else if (segundos === 0 && activo) {
      setActivo(false);
      guardarProgreso();
      hablar(FRASES_MOTIVACIONALES[Math.floor(Math.random() * FRASES_MOTIVACIONALES.length)]);
    }
    return () => clearInterval(timer);
  }, [activo, segundos]);

  // --- RENDERS ---

  if (vista === 'menu') return (
    <main className="min-h-screen bg-black text-white p-6">
       <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black italic text-yellow-500 uppercase">Boxing Lab</h1>
          <div className="bg-zinc-900 px-4 py-2 rounded-full border border-yellow-500/30 text-sm font-bold">{xpTotal} XP</div>
       </div>
       <div className="grid gap-6">
         {boxeadores.map(b => (
           <div key={b.id} onClick={() => {setBoxeadorSeleccionado(b); setVista('dashboard');}} 
                className="bg-zinc-900 p-8 rounded-[2.5rem] border-2 border-zinc-800 active:border-yellow-500">
             <h3 className="text-3xl font-black uppercase italic">{b.nombre}</h3>
             <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{b.nacionalidad}</p>
           </div>
         ))}
       </div>
    </main>
  );

  if (vista === 'dashboard') return (
    <main className="min-h-screen bg-black text-white p-6 pb-24">
      <button onClick={() => setVista('menu')} className="text-zinc-500 text-xs font-black mb-6 uppercase">← Volver</button>
      <h2 className="text-5xl font-black uppercase italic mb-8 text-yellow-500 leading-none">{boxeadorSeleccionado?.nombre}</h2>

      <div className="flex gap-6 border-b-2 border-zinc-900 mb-8 overflow-x-auto no-scrollbar">
        {['rutina', 'detalles', 'progreso'].map((tab) => (
          <button key={tab} onClick={() => setPestaña(tab as any)} 
            className={`pb-4 px-1 text-xs font-black uppercase tracking-widest ${pestaña === tab ? 'border-b-4 border-yellow-500 text-yellow-500' : 'text-zinc-600'}`}>
            {tab === 'rutina' ? 'Entrenar' : tab === 'detalles' ? 'Enciclopedia' : 'Progreso'}
          </button>
        ))}
      </div>

      {pestaña === 'detalles' && (
        <div className="animate-in slide-in-from-bottom-6">
          <div className="grid grid-cols-3 gap-3 mb-8">
            <DetalleBtn icon={<History size={24}/>} label="Bio" active={seccionDetalle === 'biografia'} onClick={() => setSeccionDetalle('biografia')} />
            <DetalleBtn icon={<Swords size={24}/>} label="Técnica" active={seccionDetalle === 'instruccion_tecnica'} onClick={() => setSeccionDetalle('instruccion_tecnica')} />
            <DetalleBtn icon={<ListChecks size={24}/>} label="Combos" active={seccionDetalle === 'combinaciones'} onClick={() => setSeccionDetalle('combinaciones')} />
            <DetalleBtn icon={<Dumbbell size={24}/>} label="Plan" active={seccionDetalle === 'entrenamiento'} onClick={() => setSeccionDetalle('entrenamiento')} />
            <DetalleBtn icon={<Apple size={24}/>} label="Dieta" active={seccionDetalle === 'alimentacion'} onClick={() => setSeccionDetalle('alimentacion')} />
            <DetalleBtn icon={<Brain size={24}/>} label="Mente" active={seccionDetalle === 'filosofia_vida'} onClick={() => setSeccionDetalle('filosofia_vida')} />
            <DetalleBtn icon={<BookOpen size={24}/>} label="Época" active={seccionDetalle === 'contexto_historico'} onClick={() => setSeccionDetalle('contexto_historico')} />
            <DetalleBtn icon={<Trophy size={24}/>} label="Legado" active={seccionDetalle === 'legado_historico'} onClick={() => setSeccionDetalle('legado_historico')} />
            <DetalleBtn icon={<IdCard size={24}/>} label="Ficha" active={seccionDetalle === 'ficha'} onClick={() => setSeccionDetalle('ficha')} />
          </div>

          <div className="bg-zinc-900 p-8 rounded-[3rem] border-2 border-zinc-800 min-h-[300px]">
             <h4 className="text-yellow-500 font-black uppercase italic text-xs mb-6 tracking-widest">{seccionDetalle.replace('_', ' ')}</h4>
             {seccionDetalle === 'ficha' ? (
                <div className="grid gap-6">
                   <FichaDato label="Récord" valor={boxeadorSeleccionado["record (V-D-E / KO)"]} />
                   <FichaDato label="Títulos" valor={boxeadorSeleccionado["títulos de campeón"]} />
                   <FichaDato label="Peso" valor={boxeadorSeleccionado["peso (kg/lbs)"]} />
                   <FichaDato label="Altura" valor={boxeadorSeleccionado["altura/alcance (cm)"]} />
                </div>
             ) : (
               <p className="text-2xl leading-relaxed text-zinc-200 font-medium italic">
                 {detallesBoxeador?.[seccionDetalle] || "Cargando..."}
               </p>
             )}
          </div>
        </div>
      )}
      {/* ... Resto de pestañas (Rutina y Progreso) idénticas al anterior ... */}
    </main>
  );

  // Vista del cronómetro (igual que antes)
  if (vista === 'cronometro') return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
       <h2 className="text-4xl font-black uppercase italic text-yellow-500 mb-4">{ejercicioActual?.ejercicio}</h2>
       <div className="text-[160px] font-black italic leading-none mb-12 tabular-nums">
         {Math.floor(segundos/60)}:{(segundos%60).toString().padStart(2,'0')}
       </div>
       <div className="flex gap-8">
          <button onClick={() => setActivo(!activo)} className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-black">
            {activo ? <Pause size={48} fill="black"/> : <Play size={48} fill="black" className="ml-2"/>}
          </button>
          <button onClick={() => setVista('dashboard')} className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-zinc-800">
            <RotateCcw size={32}/>
          </button>
       </div>
    </main>
  );

  return null;
}

// Botón de la grilla de Enciclopedia
function DetalleBtn({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-5 rounded-[2rem] border-2 transition-all ${active ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
      <div className="mb-2">{icon}</div>
      <span className="text-[10px] font-black uppercase leading-none">{label}</span>
    </button>
  );
}

// Datos de la Ficha Técnica con columnas especiales
function FichaDato({ label, valor }: any) {
  return (
    <div className="border-l-4 border-yellow-500 pl-4 py-1 bg-white/5 rounded-r-xl">
      <p className="text-zinc-500 text-[10px] font-black uppercase mb-1">{label}</p>
      <p className="text-xl font-black uppercase italic text-white leading-none">{valor || 'N/A'}</p>
    </div>
  );
}