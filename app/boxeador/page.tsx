"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function GaleriaPage() {
  const [leyendas, setLeyendas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Estado para la página actual
  const [paginaActual, setPaginaActual] = useState(0);
  const itemsPorPagina = 4;

  useEffect(() => {
    async function getBoxes() {
      const { data } = await supabase.from('boxeadores_completo').select('*').order('id');
      if (data) setLeyendas(data);
      setLoading(false);
    }
    getBoxes();
  }, []);

  // Filtrado
  const filtrados = useMemo(() => {
    setPaginaActual(0); // Reiniciar a la página 1 cuando el usuario busca algo
    const q = busqueda.toLowerCase().trim();
    return leyendas.filter(b => 
      (b.nombre?.toLowerCase().includes(q)) ||
      (b.pais?.toLowerCase().includes(q)) ||
      (b.apodo?.toLowerCase().includes(q)) ||
      (b.categoria?.toLowerCase().includes(q))
    );
  }, [busqueda, leyendas]);

  // Cálculo de paginación
  const totalPaginas = Math.ceil(filtrados.length / itemsPorPagina);
  const itemsVisibles = filtrados.slice(paginaActual * itemsPorPagina, (paginaActual * itemsPorPagina) + itemsPorPagina);

  const fixImagePath = (path: string) => {
    if (!path) return "/placeholder-boxer.jpg";
    if (path.startsWith('http')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-[#00FBFF] font-black italic animate-pulse">CARGANDO...</div>;

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col p-6 overflow-hidden">
      
      {/* HEADER */}
      <header className="max-w-7xl mx-auto w-full mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 font-black uppercase text-[10px] mb-4 hover:text-[#00FBFF]">
          <ArrowLeft size={14} /> Volver
        </Link>
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 leading-none">
          Galería de <span className="text-[#00FBFF]">Leyendas</span>
        </h1>
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="text" 
            placeholder="BUSCAR POR PAÍS, CATEGORÍA O APODO..."
            className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-full py-4 pl-12 pr-6 font-bold focus:border-[#00FBFF] outline-none transition-all"
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </header>

      {/* GRILLA 2X2 FIJA */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {itemsVisibles.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-800 font-black italic text-2xl uppercase">Sin resultados</div>
        ) : (
          <div className="grid grid-cols-2 grid-rows-2 gap-4 md:gap-8 h-full pb-6">
            {itemsVisibles.map((b) => (
              <Link 
                key={b.id} 
                href={`/boxeador/${b.id}`}
                className="relative group overflow-hidden rounded-[2.5rem] border-2 border-zinc-900 hover:border-[#00FBFF] transition-all bg-[#111]"
              >
                <Image 
                  src={fixImagePath(b.foto_url)} 
                  alt={b.nombre} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-100"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[#00FBFF] font-black italic uppercase text-xl md:text-3xl tracking-tighter drop-shadow-xl">
                    "{b.apodo || 'The Champ'}"
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* BARRA DE NAVEGACIÓN (Paginación) */}
      <nav className="max-w-7xl mx-auto w-full flex items-center justify-center gap-4 py-4 bg-black/80 backdrop-blur-md">
        <button 
          onClick={() => setPaginaActual(p => Math.max(0, p - 1))}
          disabled={paginaActual === 0}
          className="p-3 bg-zinc-900 rounded-full disabled:opacity-20 hover:bg-[#00FBFF] hover:text-black transition-all"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPaginas }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPaginaActual(i)}
              className={`w-10 h-10 rounded-full font-black transition-all ${paginaActual === i ? 'bg-[#00FBFF] text-black scale-110 shadow-[0_0_15px_rgba(0,251,255,0.5)]' : 'bg-zinc-900 text-zinc-500 hover:text-white'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setPaginaActual(p => Math.min(totalPaginas - 1, p + 1))}
          disabled={paginaActual === totalPaginas - 1 || totalPaginas === 0}
          className="p-3 bg-zinc-900 rounded-full disabled:opacity-20 hover:bg-[#00FBFF] hover:text-black transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </nav>

    </div>
  );
}