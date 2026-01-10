"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Globe, Target, Trophy, Ruler, Scale } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FichaBoxeador() {
  const { id } = useParams();
  const router = useRouter();
  const [boxeador, setBoxeador] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDetalle() {
      const { data, error } = await supabase
        .from('boxeadores_completo')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setBoxeador(data);
      setLoading(false);
    }
    if (id) cargarDetalle();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-[#00FBFF] font-black animate-pulse">CARGANDO EXPEDIENTE...</div>
    </div>
  );

  if (!boxeador) return <div className="text-white">Boxeador no encontrado</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-10">
      {/* Header / Imagen Superior */}
      <div className="relative h-[40vh] w-full">
        <button 
          onClick={() => router.back()}
          className="absolute top-12 left-6 z-20 p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/10"
        >
          <ChevronLeft size={24} />
        </button>
        
        <img 
          src={boxeador.foto_url} 
          alt={boxeador.nombre}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Contenido de la Ficha */}
      <div className="px-6 -mt-12 relative z-10 flex flex-col gap-6">
        
        {/* Títulos Principales */}
        <div className="border-l-4 border-[#00FBFF] pl-4">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
            {boxeador.nombre}
          </h1>
          <p className="text-[#00FBFF] font-black text-lg tracking-[0.2em] mt-1">
            {boxeador.apodo}
          </p>
        </div>

        {/* Grid de Stats Técnicos */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#111] p-4 rounded-3xl border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Globe size={14} className="text-[#00FBFF] opacity-50"/>
              <span className="text-[10px] text-white/40 font-black uppercase">Origen</span>
            </div>
            <div className="text-sm font-bold">{boxeador.nacionalidad}</div>
          </div>

          <div className="bg-[#111] p-4 rounded-3xl border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Target size={14} className="text-[#00FBFF] opacity-50"/>
              <span className="text-[10px] text-white/40 font-black uppercase">División</span>
            </div>
            <div className="text-sm font-bold uppercase">{boxeador.categoria}</div>
          </div>

          <div className="bg-[#111] p-4 rounded-3xl border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Scale size={14} className="text-[#00FBFF] opacity-50"/>
              <span className="text-[10px] text-white/40 font-black uppercase">Peso</span>
            </div>
            <div className="text-sm font-bold italic">{boxeador.peso_detalle}</div>
          </div>

          <div className="bg-[#111] p-4 rounded-3xl border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Ruler size={14} className="text-[#00FBFF] opacity-50"/>
              <span className="text-[10px] text-white/40 font-black uppercase">Alcance</span>
            </div>
            <div className="text-sm font-bold italic">{boxeador.altura_alcance}</div>
          </div>
        </div>

        {/* Récord Destacado */}
        <div className="bg-[#00FBFF] p-6 rounded-[2rem] text-black shadow-[0_10px_30px_rgba(0,251,255,0.2)]">
          <span className="text-[11px] font-black uppercase block mb-1 opacity-70 tracking-widest">Récord Profesional</span>
          <div className="text-4xl font-black italic leading-none">{boxeador.record}</div>
        </div>

        {/* Palmarés / Títulos */}
        <div className="bg-[#111] p-5 rounded-[2rem] border border-white/5">
          <div className="flex items-center gap-2 mb-3 text-[#00FBFF]">
            <Trophy size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Campeonatos y Logros</span>
          </div>
          <p className="text-sm font-medium leading-relaxed text-white/80">
            {boxeador.titulos}
          </p>
        </div>

      </div>
    </div>
  );
}