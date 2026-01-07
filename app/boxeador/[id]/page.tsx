'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';
import { Dumbbell, BookOpen, TrendingUp, Play, Pause, RotateCcw, Zap, Volume2 } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function DetalleBoxeador() {
  const params = useParams();
  const [boxeador, setBoxeador] = useState<any>(null);
  const [detalles, setDetalles] = useState<any>(null);
  const [rutinaCompleta, setRutinaCompleta] = useState<any[]>([]);
  const [rutinaFiltrada, setRutinaFiltrada] = useState<any[]>([]);
  
  const [tabActiva, setTabActiva] = useState('entrenar');
  const [nivel, setNivel] = useState('Principiante');
  const [loading, setLoading] = useState(true);

  // CRONÓMETRO
  const [corriendo, setCorriendo] = useState(false);
  const [tiempo, setTiempo] = useState(60); // Default principiante
  const [roundIdx, setRoundIdx] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!params.id) return;
      const [resB, resD, resR] = await Promise.all([
        supabase.from('boxeadores').select('*').eq('id', params.id).single(),
        supabase.from('boxeadores_detalles').select('*').eq('id', params.id).single(),
        supabase.from('rutinas').select('*').eq('boxeador_id', params.id).order('round')
      ]);
      setBoxeador(resB.data);
      setDetalles(resD.data);
      setRutinaCompleta(resR.data || []);
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  // LÓGICA DE TIEMPOS POR NIVEL
  useEffect(() => {
    const r = rutinaCompleta.filter(x => x.nivel === nivel);
    setRutinaFiltrada(r);
    
    // Ajuste de tiempo manual según tu regla
    let tiempoSegunNivel = 60;
    if (nivel === 'Medio') tiempoSegunNivel = 120;
    if (nivel === 'Avanzado') tiempoSegunNivel = 180;
    
    setTiempo(tiempoSegunNivel);
    setCorriendo(false);
    setRoundIdx(0);
  }, [nivel, rutinaCompleta]);

  useEffect(() => {
    let interval: any;
    if (corriendo && tiempo > 0) {
      interval = setInterval(() => setTiempo(t => t - 1), 1000);
    } else if (tiempo === 0) {
      setCorriendo(false);
      hablar("Round finalizado. Buen trabajo.");
    }
    return () => clearInterval(interval);
  }, [corriendo, tiempo]);

  const hablar = (texto: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Para que no se pisen las voces
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = 'es-ES';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const handlePlay = () => {
    if (!corriendo) {
      const r = rutinaFiltrada[roundIdx];
      if (r) hablar(`Iniciando ${r.ejercicio}. ${r.descripcion_ejercicio}`);
    }
    setCorriendo(!corriendo);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-500 font-black animate-pulse">SINCRONIZANDO RELOJ...</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-20 font-sans">
      <header className="p-10 bg-zinc-900 border-b border-zinc-800 text-center">
        <h1 className="text-5xl font-black uppercase italic text-yellow-500 tracking-tighter">{boxeador?.nombre}</h1>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">{boxeador?.apodo}</p>
      </header>

      {/* SELECTOR DE PESTAÑAS */}
      <div className="flex justify-center gap-2 p-4 sticky top-0 bg-black/90 backdrop-blur-md z-30 border-b border-zinc-900">
        {['enciclopedia', 'entrenar', 'progreso'].map(t => (
          <button key={t} onClick={() => setTabActiva(t)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${tabActiva === t ? 'bg-yellow-500 text-black' : 'bg-zinc-900 text-zinc-500'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="max-w-xl mx-auto p-6">
        {tabActiva === 'entrenar' && (
          <div className="space-y-6">
            {/* SELECTOR DE NIVEL */}
            <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
              {['Principiante', 'Medio', 'Avanzado'].map(n => (
                <button key={n} onClick={() => setNivel(n)} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${nivel === n ? 'bg-yellow-500 text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}>
                  {n}
                </button>
              ))}
            </div>

            {/* CRONÓMETRO PRO */}
            <div className="bg-zinc-900 rounded-[3.5rem] p-12 border border-zinc-800 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-6 left-0 right-0 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                Round {rutinaFiltrada[roundIdx]?.round || 1} • {nivel}
              </div>
              
              <div className="text-[120px] font-black italic leading-none my-6 tabular-nums tracking-tighter">
                {Math.floor(tiempo / 60)}:{(tiempo % 60).toString().padStart(2, '0')}
              </div>
              
              <h3 className="text-yellow-500 font-black uppercase italic text-xl mb-10 tracking-tight">
                {rutinaFiltrada[roundIdx]?.ejercicio || "Fin de la rutina"}
              </h3>

              <div className="flex justify-center gap-6">
                <button onClick={handlePlay} className="bg-white text-black w-24 h-24 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-all transform active:scale-95 shadow-xl">
                  {corriendo ? <Pause size={32} fill="black"/> : <Play size={32} fill="black" className="ml-1"/>}
                </button>
                <button onClick={() => {
                   setCorriendo(false); 
                   setTiempo(nivel === 'Principiante' ? 60 : nivel === 'Medio' ? 120 : 180);
                }} className="bg-zinc-800 text-white w-24 h-24 rounded-full flex items-center justify-center hover:bg-zinc-700 active:scale-95">
                  <RotateCcw size={32}/>
                </button>
              </div>
            </div>

            {/* TÉCNICA RÁPIDA */}
            <div className="bg-gradient-to-r from-zinc-900 to-black p-8 rounded-[2.5rem] border border-zinc-800">
                <p className="text-yellow-500 font-black uppercase text-[10px] mb-2 flex items-center gap-2">
                    <Zap size={14}/> Combinación sugerida
                </p>
                <p className="text-2xl font-black italic text-white">{detalles?.combinaciones}</p>
            </div>
          </div>
        )}

        {/* ... (Las otras pestañas se mantienen igual) ... */}
        {tabActiva === 'enciclopedia' && (
          <div className="space-y-4">
             <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800">
                <h3 className="text-yellow-500 font-black uppercase text-[10px] mb-4 tracking-widest text-center">Biografía Histórica</h3>
                <p className="text-zinc-300 leading-relaxed italic text-lg text-center font-medium">
                  "{detalles?.biografia || 'Sin datos.'}"
                </p>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}