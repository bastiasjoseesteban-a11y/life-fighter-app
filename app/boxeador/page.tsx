'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Search, ChevronLeft, Trophy, MapPin, 
  X, Loader2, ArrowRight, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = 'https://rptbzoytslnfmofksvhk.supabase.co';
const supabaseAnonKey = 'sb_publishable_iBUkBcONFKZNiqp-ALlvcA_KVZTZeqL';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Boxeador {
  id: string;
  nombre: string;
  pais: string;
  categoria: string;
  seccion: string;
  imagen_url: string;
  bio: string;
  record: string;
}

export default function GaleriaLeyendas() {
  const [boxeadores, setBoxeadores] = useState<Boxeador[]>([]);
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(true);
  const [boxeadorSeleccionado, setBoxeadorSeleccionado] = useState<Boxeador | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBoxeadores();
  }, []);

  async function fetchBoxeadores() {
    setCargando(true);
    const { data, error } = await supabase.from('boxeadores').select('*');
    if (!error) setBoxeadores(data || []);
    setCargando(false);
  }

  // Navegación por flechas
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const boxeadoresFiltrados = boxeadores.filter(b => {
    const term = filtro.toLowerCase();
    return (b.nombre || '').toLowerCase().includes(term) || 
           (b.pais || '').toLowerCase().includes(term) ||
           (b.seccion || '').toLowerCase().includes(term);
  });

  return (
    <div className="h-screen bg-black text-white font-sans overflow-hidden flex flex-col">
      
      {/* HEADER */}
      <header className="p-6 border-b border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 hover:text-orange-500 transition-all">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              GALERÍA <span className="text-orange-500">LEYENDAS</span>
            </h1>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text"
              placeholder="Buscar..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-500 transition-all"
            />
          </div>
        </div>
      </header>

      {/* CONTENEDOR 2x2 CON SCROLL HORIZONTAL */}
      <main className="flex-1 relative overflow-hidden flex flex-col justify-center">
        {cargando ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={40} />
            <p className="text-zinc-500 text-xs font-black uppercase">Cargando gimnasio...</p>
          </div>
        ) : (
          <>
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full items-center"
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* Agrupamos de a 4 para crear "páginas" */}
              {Array.from({ length: Math.ceil(boxeadoresFiltrados.length / 4) }).map((_, pageIndex) => (
                <div 
                  key={pageIndex}
                  className="min-w-full h-full grid grid-cols-2 grid-rows-2 gap-4 p-6 snap-center"
                >
                  {boxeadoresFiltrados.slice(pageIndex * 4, pageIndex * 4 + 4).map((box) => (
                    <div 
                      key={box.id}
                      onClick={() => setBoxeadorSeleccionado(box)}
                      className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 group cursor-pointer active:scale-95 transition-all"
                    >
                      <img 
                        src={box.imagen_url || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874'} 
                        className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                        alt={box.nombre}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <span className="text-[8px] bg-orange-600 px-2 py-0.5 rounded-full font-black uppercase mb-1 inline-block">
                          {box.seccion}
                        </span>
                        <h3 className="text-xl md:text-3xl font-black italic uppercase leading-none truncate">
                          {box.nombre}
                        </h3>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest truncate">
                          {box.pais}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* CONTROLES INFERIORES */}
            <div className="p-6 flex justify-center items-center gap-10 bg-black/50 backdrop-blur-sm">
              <button 
                onClick={() => scroll('left')}
                className="bg-zinc-900 p-4 rounded-full border border-zinc-800 hover:bg-orange-600 transition-all active:scale-90"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="h-1 w-20 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-1/3" />
              </div>
              <button 
                onClick={() => scroll('right')}
                className="bg-zinc-900 p-4 rounded-full border border-zinc-800 hover:bg-orange-600 transition-all active:scale-90"
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </>
        )}
      </main>

      {/* MODAL (Sin cambios, es funcional) */}
      {boxeadorSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-zinc-900 w-full max-w-4xl rounded-[2.5rem] overflow-hidden relative flex flex-col md:flex-row border border-zinc-800">
            <button 
              onClick={() => setBoxeadorSeleccionado(null)}
              className="absolute top-6 right-6 z-20 bg-white text-black p-3 rounded-full hover:bg-orange-500 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
            <div className="md:w-1/2 h-64 md:h-auto">
              <img src={boxeadorSeleccionado.imagen_url} className="w-full h-full object-cover" alt={boxeadorSeleccionado.nombre} />
            </div>
            <div className="md:w-1/2 p-10">
              <h2 className="text-4xl font-black italic uppercase text-orange-500 mb-4">{boxeadorSeleccionado.nombre}</h2>
              <div className="flex gap-4 mb-6 text-xs font-black uppercase text-zinc-500">
                <span className="flex items-center gap-1"><MapPin size={12}/> {boxeadorSeleccionado.pais}</span>
                <span className="flex items-center gap-1"><Trophy size={12}/> {boxeadorSeleccionado.record}</span>
              </div>
              <p className="text-zinc-400 italic text-sm leading-relaxed mb-8">{boxeadorSeleccionado.bio}</p>
              <div className="p-4 bg-black rounded-2xl border border-zinc-800">
                <p className="text-[10px] font-black text-orange-500 uppercase mb-1 tracking-widest">Categoría</p>
                <p className="font-black italic uppercase">{boxeadorSeleccionado.categoria}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}