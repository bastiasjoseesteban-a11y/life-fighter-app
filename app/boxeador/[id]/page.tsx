"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Home, ArrowLeft, Trophy, Ruler, Weight, Activity, Globe, Award } from 'lucide-react';
import Image from 'next/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DetalleBoxeador() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Obtener parámetros de la galería
  const page = searchParams.get('page') || '0';
  const search = searchParams.get('search') || '';
  
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

  // Función para volver a la galería MANTENIENDO la página y búsqueda
  const handleBackToGallery = () => {
    const params = new URLSearchParams();
    
    // Si hay página guardada
    if (parseInt(page) > 0) {
      params.set('page', page);
    }
    
    // Si hay búsqueda guardada
    if (search) {
      params.set('search', search);
    }
    
    // Construir la URL con parámetros
    const queryString = params.toString();
    const galleryUrl = queryString ? `/boxeador?${queryString}` : '/boxeador';
    
    router.push(galleryUrl);
  };

  // Función para volver al inicio
  const handleGoHome = () => {
    router.push('/');
  };

  const fixImagePath = (path: string) => {
    if (!path) return "/placeholder-boxer.jpg";
    if (path.startsWith('http')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#00FBFF] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[#00FBFF] font-bold text-lg">CARGANDO FICHA TÉCNICA...</p>
    </div>
  );

  if (!b) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="text-6xl mb-4">🥊</div>
      <h1 className="text-2xl font-bold mb-4">Boxeador no encontrado</h1>
      <button 
        onClick={handleBackToGallery}
        className="px-6 py-3 bg-[#00FBFF] text-black font-bold rounded-full hover:scale-105 transition-transform"
      >
        VOLVER A LA GALERÍA
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          {/* Logo Life Fighter */}
          <button 
            onClick={handleGoHome}
            className="flex items-center gap-3 group mb-4 md:mb-0 self-start"
            title="Volver al inicio"
          >
            <div className="bg-[#00FBFF] text-black p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Home size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter">
                LIFE <span className="text-[#00FBFF]">FIGHTER</span>
              </h1>
              <p className="text-xs text-zinc-500">Toca para volver al inicio</p>
            </div>
          </button>

          {/* Botón Volver a Galería - AHORA CON PARÁMETROS */}
          <button 
            onClick={handleBackToGallery}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 rounded-full text-[#00FBFF] font-bold uppercase text-sm hover:bg-[#00FBFF] hover:text-black transition-colors self-start md:self-auto"
          >
            <ArrowLeft size={18} /> VOLVER A LA GALERÍA
            {parseInt(page) > 0 && (
              <span className="text-xs bg-[#00FBFF] text-black px-2 py-1 rounded ml-2">
                Pág {parseInt(page) + 1}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          
          {/* IMAGEN */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl md:rounded-[3.5rem] overflow-hidden border-2 border-[#00FBFF]/20 shadow-[0_0_50px_rgba(0,251,255,0.1)]">
            <Image 
              src={fixImagePath(b.foto_url)} 
              alt={b.nombre} 
              fill 
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </div>

          {/* DATOS TÉCNICOS */}
          <div className="flex flex-col">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-none mb-2">
              {b.nombre}
            </h1>
            <p className="text-[#00FBFF] text-2xl sm:text-3xl md:text-4xl font-black italic mb-6 md:mb-10 uppercase tracking-tight">
              "{b.apodo || b.nombre}"
            </p>

            {/* GRILLA DE INFORMACIÓN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              <InfoBox icon={<Globe size={20}/>} label="País" value={b.pais || b.nacionalidad} />
              <InfoBox icon={<Activity size={20}/>} label="Categoría" value={b.categoria} />
              <InfoBox icon={<Weight size={20}/>} label="Peso" value={b.peso_detalle} />
              <InfoBox icon={<Ruler size={20}/>} label="Altura / Alcance" value={b.altura_alcance} />
              <InfoBox icon={<Trophy size={20}/>} label="Récord Profesional" value={b.record} />
              <InfoBox icon={<Award size={20}/>} label="Títulos" value={b.titulos} />
            </div>

            {/* INFORMACIÓN ADICIONAL */}
            {(b.biografia || b.estilo) && (
              <div className="mb-6 md:mb-8">
                {b.biografia && (
                  <div className="mb-4">
                    <h3 className="text-[#00FBFF] font-bold text-sm uppercase mb-2">BIOGRAFÍA</h3>
                    <p className="text-zinc-300 text-sm leading-relaxed">{b.biografia}</p>
                  </div>
                )}
                {b.estilo && (
                  <div>
                    <h3 className="text-[#00FBFF] font-bold text-sm uppercase mb-2">ESTILO DE BOXEO</h3>
                    <p className="text-zinc-300 text-sm leading-relaxed">{b.estilo}</p>
                  </div>
                )}
              </div>
            )}

            {/* BOTÓN DE ACCIÓN */}
            <div className="mt-4 md:mt-6">
              <button className="w-full bg-gradient-to-r from-[#00FBFF] to-[#00ccff] text-black py-5 md:py-6 rounded-2xl md:rounded-[2rem] font-black uppercase italic text-lg md:text-xl shadow-[0_0_30px_rgba(0,251,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group">
                <span className="relative z-10">🎯 EMPEZAR ENTRENAMIENTO</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00FBFF] to-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
              
              <p className="text-center text-zinc-600 text-xs mt-3">
                ⚡ Función disponible próximamente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente InfoBox
function InfoBox({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-zinc-900/40 border border-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl flex items-start gap-3 md:gap-4">
      <div className="text-[#00FBFF] mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.1em] mb-1">{label}</p>
        <p className="font-bold text-base md:text-lg uppercase leading-tight line-clamp-2">
          {value || "---"}
        </p>
      </div>
    </div>
  );
}