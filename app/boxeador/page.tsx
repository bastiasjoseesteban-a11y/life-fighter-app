"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function GaleriaPage() {
  const [boxeadores, setBoxeadores] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(0);
  const itemsPorPagina = 4;

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase.from('boxeadores').select('*').order('id');
      if (data) setBoxeadores(data);
    };
    cargar();
  }, []);

  const filtrados = useMemo(() => {
    return boxeadores.filter(b => {
      const t = busqueda.toLowerCase();
      return (
        b.nombre?.toLowerCase().includes(t) || 
        b.nacionalidad?.toLowerCase().includes(t) || 
        b.categoria?.toLowerCase().includes(t) || // Busca por la nueva columna
        b.apodo?.toLowerCase().includes(t)        // Busca por apodo
      );
    });
  }, [boxeadores, busqueda]);

  const totalPaginas = Math.ceil(filtrados.length / itemsPorPagina);
  const actuales = filtrados.slice(pagina * itemsPorPagina, (pagina + 1) * itemsPorPagina);

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-6xl md:text-8xl font-black italic text-yellow-500 uppercase tracking-tighter">Hall of Fame</h1>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.5em]">Edición de Leyendas</p>
        </header>

        <div className="relative mb-12 max-w-2xl mx-auto w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-500" size={24} />
          <input 
            type="text"
            placeholder="Nombre, País, Apodo o Categoría..."
            className="w-full bg-zinc-900/50 border-2 border-zinc-800 rounded-2xl py-5 pl-14 pr-6 text-lg focus:border-yellow-500 outline-none font-bold"
            onChange={(e) => { setBusqueda(e.target.value); setPagina(0); }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-10">
          {actuales.map((b) => (
            <div key={b.id} className="bg-zinc-900 border-2 border-zinc-800 rounded-[3rem] overflow-hidden flex flex-col hover:border-yellow-500 transition-all group">
              <div className="h-56 md:h-80 bg-zinc-800 relative">
                <img src={b.foto_url || "/api/placeholder/600/400"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={b.nombre} />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                <div className="absolute bottom-6 left-8">
                    <h3 className="text-3xl md:text-5xl font-black uppercase italic leading-[0.7]">{b.nombre}</h3>
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <p className="text-yellow-500 font-black italic uppercase tracking-widest text-sm">
                        {b.apodo ? `"${b.apodo}"` : "---"}
                    </p>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{b.nacionalidad}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-6">
                    <Dato label="Récord" valor={b.record} />
                    <Dato label="Categoría" valor={b.categoria} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CONTROLES */}
        <div className="mt-12 flex justify-center items-center gap-8">
            <button onClick={() => setPagina(p => Math.max(0, p-1))} className="p-4 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black transition-all">
                <ChevronLeft size={30} />
            </button>
            <span className="font-black text-xl italic text-zinc-700">{pagina + 1} / {totalPaginas || 1}</span>
            <button onClick={() => setPagina(p => Math.min(totalPaginas - 1, p+1))} className="p-4 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black transition-all">
                <ChevronRight size={30} />
            </button>
        </div>
      </div>
    </main>
  );
}

function Dato({ label, valor }: any) {
  return (
    <div>
      <p className="text-[10px] font-black text-zinc-500 uppercase mb-1 tracking-tighter">{label}</p>
      <p className="text-lg font-bold text-white italic leading-tight">{valor || '---'}</p>
    </div>
  );
}