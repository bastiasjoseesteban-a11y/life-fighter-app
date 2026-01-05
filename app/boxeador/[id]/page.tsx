'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';
import { Dumbbell, BookOpen, TrendingUp, Zap, Target } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function DetalleEntrenamiento() {
  const params = useParams();
  const [boxeador, setBoxeador] = useState<any>(null);
  const [detalles, setDetalles] = useState<any>(null);
  const [rutina, setRutina] = useState<any[]>([]);
  const [tabActiva, setTabActiva] = useState('enciclopedia'); // Por defecto la ficha
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarTodo() {
      if (!params.id) return;
      setLoading(true);

      // Traemos info de las 3 tablas en paralelo para máxima velocidad
      const [resBox, resDet, resRut] = await Promise.all([
        supabase.from('boxeadores').select('*').eq('id', params.id).single(),
        supabase.from('boxeadores_detalles').select('*').eq('id', params.id).single(),
        supabase.from('rutinas').select('*').eq('boxeador_id', params.id).order('round')
      ]);

      setBoxeador(resBox.data);
      setDetalles(resDet.data);
      setRutina(resRut.data || []);
      setLoading(false);
    }
    cargarTodo();
  }, [params.id]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-500 font-black animate-pulse">PREPARANDO EL RING...</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-10">
      {/* Header con Nombre y Apodo */}
      <header className="p-10 bg-zinc-900 border-b border-zinc-800 text-center">
        <h1 className="text-5xl font-black uppercase italic text-yellow-500 tracking-tighter">
          {boxeador?.nombre}
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
          {boxeador?.apodo ? `"${boxeador.apodo}"` : "Leyenda del Boxeo"}
        </p>
      </header>

      {/* Selector de Opciones (Tabs) */}
      <div className="flex justify-center gap-2 p-4 bg-black sticky top-0 z-20 border-b border-zinc-900">
        {[
          { id: 'entrenar', label: 'Entrenar', icon: <Dumbbell size={16}/> },
          { id: 'enciclopedia', label: 'Enciclopedia', icon: <BookOpen size={16}/> },
          { id: 'progreso', label: 'Progreso', icon: <TrendingUp size={16}/> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTabActiva(tab.id)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${
              tabActiva === tab.id ? 'bg-yellow-500 text-black' : 'bg-zinc-900 text-zinc-500'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto p-6">
        
        {/* SECCIÓN: ENCICLOPEDIA (La Ficha que se había perdido) */}
        {tabActiva === 'enciclopedia' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 gap-4">
              <FichaCard label="Categoría" valor={boxeador?.categoria} />
              <FichaCard label="Récord" valor={boxeador?.record} />
              <FichaCard label="Peso" valor={boxeador?.peso_detalle} />
              <FichaCard label="Alcance" valor={boxeador?.altura_alcance} />
            </div>
            <div className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800">
                <h3 className="text-yellow-500 font-black uppercase text-xs mb-4 flex items-center gap-2">
                    <Target size={16}/> Técnica y Combinaciones
                </h3>
                <p className="text-2xl font-black italic text-white mb-4 leading-tight">{detalles?.combinaciones}</p>
                <p className="text-zinc-400 text-sm leading-relaxed">{detalles?.instruccion_tecnica}</p>
            </div>
          </div>
        )}

        {/* SECCIÓN: ENTRENAR (Listado de Rounds) */}
        {tabActiva === 'entrenar' && (
          <div className="space-y-4 animate-in slide-in-from-right duration-500">
            {rutina.length > 0 ? rutina.map((r) => (
              <div key={r.id} className="bg-zinc-900 border-l-4 border-yellow-500 p-6 rounded-r-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-yellow-500 font-black italic text-xl uppercase">Round {r.round}</span>
                  <span className="text-zinc-500 text-[10px] font-bold">{r.duracion_segundos / 60} MIN</span>
                </div>
                <h4 className="text-white font-black uppercase text-lg">{r.ejercicio}</h4>
                <p className="text-zinc-400 text-sm mt-1">{r.descripcion_ejercicio}</p>
              </div>
            )) : (
              <div className="text-center py-20 bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-zinc-800">
                <p className="text-zinc-600 font-black uppercase tracking-widest">Cargando rutina de combate...</p>
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN: PROGRESO */}
        {tabActiva === 'progreso' && (
          <div className="text-center py-20 animate-in zoom-in duration-500">
            <TrendingUp size={48} className="mx-auto text-zinc-800 mb-4" />
            <h2 className="text-xl font-black text-zinc-500 uppercase italic">Módulo de Seguimiento</h2>
            <p className="text-zinc-700 text-xs mt-2 max-w-xs mx-auto">Próximamente: Registra tus tiempos y calorías quemadas entrenando como {boxeador?.nombre}.</p>
          </div>
        )}

      </div>
    </div>
  );
}

function FichaCard({ label, valor }: any) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-[2rem]">
      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg font-bold italic text-zinc-200">{valor || '---'}</p>
    </div>
  );
}