"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Ruler, Weight, Activity, Globe, Award } from 'lucide-react';
import Image from 'next/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DetalleBoxeador() {
  const { id } = useParams();
  const router = useRouter();
  const [b, setBoxeador] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDetail() {
      const { data, error } = await supabase
        .from('boxeadores_completo')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setBoxeador(data);
      setLoading(false);
    }
    getDetail();
  }, [id]);

  // Función para corregir las rutas de las imágenes (igual que en la galería)
  const fixImagePath = (path: string) => {
    if (!path) return "/placeholder-boxer.jpg";
    if (path.startsWith('http')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center text-[#00FBFF] font-black italic animate-pulse">
      CARGANDO FICHA TÉCNICA...
    </div>
  );

  if (!b) return <div className="h-screen bg-black text-white flex items-center justify-center">Boxeador no encontrado</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* BOTÓN VOLVER */}
        <button 
          onClick={() => router.back()} 
          className="mb-8 flex items-center gap-2 text-[#00FBFF] font-black uppercase text-xs hover:opacity-70 transition-all"
        >
          <ArrowLeft size={18} /> Volver a la Galería
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* COLUMNA IZQUIERDA: IMÁGEN GRANDE */}
          <div className="relative h-[400px] md:h-[600px] rounded-[3.5rem] overflow-hidden border-2 border-[#00FBFF]/20 shadow-[0_0_50px_rgba(0,251,255,0.1)]">
            <Image 
              src={fixImagePath(b.foto_url)} 
              alt={b.nombre} 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </div>

          {/* COLUMNA DERECHA: DATOS TÉCNICOS */}
          <div className="flex flex-col">
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-2">
              {b.nombre}
            </h1>
            <p className="text-[#00FBFF] text-3xl font-black italic mb-10 uppercase tracking-tight">
              "{b.apodo}"
            </p>

            {/* GRILLA DE INFORMACIÓN EXTRAÍDA DE TU CSV */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoBox icon={<Globe size={20}/>} label="País" value={b.pais || b.nacionalidad} />
              <InfoBox icon={<Activity size={20}/>} label="Categoría" value={b.categoria} />
              <InfoBox icon={<Weight size={20}/>} label="Peso Detalle" value={b.peso_detalle} />
              <InfoBox icon={<Ruler size={20}/>} label="Altura / Alcance" value={b.altura_alcance} />
              <InfoBox icon={<Trophy size={20}/>} label="Récord Profesional" value={b.record} />
              <InfoBox icon={<Award size={20}/>} label="Títulos" value={b.titulos} />
            </div>

            {/* BOTÓN DE ACCIÓN FINAL */}
            <button className="mt-10 w-full bg-[#00FBFF] text-black py-6 rounded-[2rem] font-black uppercase italic text-xl shadow-[0_0_30px_rgba(0,251,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all">
              EMPEZAR ENTRENAMIENTO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente pequeño para las filas de información
function InfoBox({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-zinc-900/40 border border-white/5 p-5 rounded-[2rem] flex items-center gap-4">
      <div className="text-[#00FBFF]">{icon}</div>
      <div>
        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">{label}</p>
        <p className="font-bold text-lg uppercase leading-tight">{value || "---"}</p>
      </div>
    </div>
  );
}