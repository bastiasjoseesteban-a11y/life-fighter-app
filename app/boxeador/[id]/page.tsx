'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';

const supabase = createClient('TU_URL', 'TU_KEY');

export default function DetalleEntrenamiento() {
  const params = useParams();
  const [infoPremium, setInfoPremium] = useState<any>(null);
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [tabActiva, setTabActiva] = useState('rutina'); // Empezamos viendo la rutina
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!params.id) return;
      setLoading(true);

      // 1. Traemos la Bio, Dieta y Técnica
      const { data: detalles } = await supabase
        .from('boxeadores_detalles')
        .select('*')
        .eq('id', params.id)
        .single();

      // 2. Traemos los Rounds de la tabla 'rutinas'
      const { data: rounds } = await supabase
        .from('rutinas')
        .select('*')
        .eq('boxeador_id', params.id) // Importante: usamos boxeador_id
        .order('round', { ascending: true });

      setInfoPremium(detalles);
      setEjercicios(rounds || []);
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  if (loading) return <div className="p-20 text-yellow-500 text-center font-black animate-bounce">CARGANDO PLAN DE COMBATE...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Cabecera */}
      <div className="p-8 bg-zinc-900 border-b border-zinc-800 text-center">
        <h1 className="text-4xl font-black uppercase italic text-yellow-500 italic">{infoPremium?.nombre || 'Boxeador'}</h1>
        <p className="text-zinc-500 uppercase tracking-widest text-xs mt-2">Plan de Entrenamiento Profesional</p>
      </div>

      {/* Navegación de Secciones */}
      <div className="flex overflow-x-auto gap-2 p-4 bg-zinc-950 sticky top-0 z-10 border-b border-zinc-900">
        {[
          { id: 'rutina', label: '🥊 Plan de Rounds' },
          { id: 'biografia', label: '📖 Historia' },
          { id: 'alimentacion', label: '🥩 Dieta' },
          { id: 'combinaciones', label: '⚡ Técnica' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTabActiva(tab.id)}
            className={`flex-none px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${
              tabActiva === tab.id ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* VISTA DE RUTINA (Basada en tu CSV de rutinas) */}
        {tabActiva === 'rutina' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black uppercase mb-6 text-zinc-400">Rounds de Entrenamiento</h2>
            {ejercicios.length > 0 ? ejercicios.map((r) => (
              <div key={r.id} className="bg-zinc-900 border-l-4 border-yellow-500 p-5 rounded-r-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-yellow-500 font-black italic text-lg">ROUND {r.round}</span>
                  <span className="bg-zinc-800 text-zinc-400 text-[10px] px-2 py-1 rounded">{r.duracion_segundos / 60} MIN</span>
                </div>
                <h3 className="text-white font-bold uppercase mb-1">{r.ejercicio}</h3>
                <p className="text-zinc-400 text-sm leading-snug">{r.descripcion_ejercicio}</p>
              </div>
            )) : <p className="text-zinc-600 italic">No hay ejercicios cargados para este boxeador aún.</p>}
          </div>
        )}

        {/* VISTA DE INFORMACIÓN (Basada en boxeadores_detalles) */}
        {tabActiva !== 'rutina' && (
          <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
            <h2 className="text-yellow-500 font-black uppercase mb-4">{tabActiva}</h2>
            <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
              {infoPremium ? infoPremium[tabActiva] : 'Cargando información...'}
            </div>
          </div>
        )}

        <button className="w-full mt-12 bg-white text-black py-5 rounded-2xl font-black uppercase tracking-tighter text-xl hover:bg-yellow-500 transition-transform active:scale-95">
          Comenzar Entrenamiento
        </button>
      </div>
    </div>
  );
}