"use client";
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChevronLeft, Search } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function GaleriaFinal() {
  const [boxeadores, setBoxeadores] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    async function cargar() {
      // Cambio a la tabla completa
      const { data } = await supabase.from('boxeadores_completo').select('*').order('id');
      if (data) setBoxeadores(data);
      setLoading(false);
    }
    cargar();
  }, []);

  const startDragging = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const stopDragging = () => setIsDragging(false);

  const moveMouse = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; 
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const filtrados = boxeadores.filter(b => {
    const term = search.toLowerCase();
    return (
      b.nombre?.toLowerCase().includes(term) || 
      b.apodo?.toLowerCase().includes(term) || // Buscamos también por apodo
      b.nacionalidad?.toLowerCase().includes(term) || 
      b.categoria?.toLowerCase().includes(term)
    );
  });

  const paginas = [];
  for (let i = 0; i < filtrados.length; i += 4) {
    paginas.push(filtrados.slice(i, i + 4));
  }

  if (loading) return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[999]">
      <div className="text-[#00FBFF] font-black italic animate-pulse text-2xl uppercase">CARGANDO LEYENDAS...</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col overflow-hidden font-sans z-[100] select-none">
      
      <header className="pt-12 pb-4 px-6 flex flex-col gap-5 bg-black/95 shrink-0 border-b border-white/5">
        <div className="flex justify-between items-center">
          <Link href="/" className="p-3 bg-white/5 rounded-full border border-white/10 active:scale-90"><ChevronLeft size={24} /></Link>
          <div className="text-center">
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none m-0">
              GALERÍA DE <br/> <span className="text-[#00FBFF] text-2xl">LEYENDAS</span>
            </h1>
          </div>
          <div className="p-4 opacity-0">ADM</div>
        </div>

        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#00FBFF] opacity-50" size={18} />
          <input 
            type="text" 
            placeholder="BUSCAR APODO, PAÍS..." 
            value={search}
            className="w-full bg-[#111] border-2 border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:border-[#00FBFF] outline-none transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <main 
        ref={scrollRef}
        onMouseDown={startDragging} onMouseLeave={stopDragging} onMouseUp={stopDragging} onMouseMove={moveMouse}
        className={`flex-1 flex overflow-x-auto snap-x snap-mandatory no-scrollbar flex-nowrap ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {paginas.map((grupo, idx) => (
          <div key={idx} className="flex-none w-screen h-full snap-start grid grid-cols-2 grid-rows-2 gap-4 p-5 box-border">
            {grupo.map((box) => (
              <Link 
                href={`/boxeador/${box.id}`}
                key={box.id} 
                draggable="false"
                className="relative aspect-square bg-[#0c0c0c] rounded-[2.5rem] overflow-hidden border-2 border-white/5 active:scale-95 transition-all group shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img src={box.foto_url} alt={box.apodo} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
                
                {/* SOLO APODO - ESTILO IMPACTANTE */}
                <div className="relative z-10 p-4 h-full flex flex-col justify-end items-center text-center">
                  <h3 className="text-lg font-black italic uppercase text-[#00FBFF] tracking-tighter leading-tight drop-shadow-md">
                    {box.apodo}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </main>

      <footer className="py-6 bg-black border-t border-white/5 flex flex-col items-center gap-2">
        <p className="text-[#00FBFF]/30 text-[8px] font-black uppercase tracking-[0.4em]">
          {isDragging ? 'EXPLORANDO...' : 'DESLIZA PARA VER LEYENDAS'}
        </p>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}