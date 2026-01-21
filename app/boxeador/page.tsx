"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback, Suspense } from 'react'; // ✅ Añade Suspense aquí
import { createClient } from '@supabase/supabase-js';
import { Search, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// ============================================
// COMPONENTE HIJO CON LA LÓGICA (usa useSearchParams)
// ============================================
function GaleriaContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ Ahora seguro dentro del cliente
  
  // Obtener parámetros de la URL
  const urlPage = searchParams.get('page');
  const urlSearch = searchParams.get('search');
  
  const [leyendas, setLeyendas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState(urlSearch || "");
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(urlPage ? parseInt(urlPage) : 0);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0, time: 0 });
  const [isSwiping, setIsSwiping] = useState(false);
  
  const itemsPorPagina = 4;
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  // Actualizar URL cuando cambien la página o búsqueda
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (paginaActual > 0) {
      params.set('page', paginaActual.toString());
    }
    
    if (busqueda) {
      params.set('search', busqueda);
    }
    
    // Actualizar URL sin recargar la página
    const queryString = params.toString();
    const newUrl = queryString ? `/boxeador?${queryString}` : '/boxeador';
    
    // Usar replace para no añadir al historial
    window.history.replaceState(null, '', newUrl);
  }, [paginaActual, busqueda]);

  // Carga de datos
  useEffect(() => {
    const fetchData = async () => {
      const cached = sessionStorage.getItem('boxeadores_cache');
      const timestamp = sessionStorage.getItem('boxeadores_timestamp');
      
      if (cached && timestamp && (Date.now() - parseInt(timestamp)) < 10 * 60 * 1000) {
        setLeyendas(JSON.parse(cached));
        setLoading(false);
        return;
      }
      
      try {
        const { data } = await supabase
          .from('boxeadores_completo')
          .select('id, nombre, apodo, foto_url, pais, categoria')
          .order('id')
          .limit(100);
          
        if (data) {
          setLeyendas(data);
          sessionStorage.setItem('boxeadores_cache', JSON.stringify(data));
          sessionStorage.setItem('boxeadores_timestamp', Date.now().toString());
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filtrados = useMemo(() => {
    if (!busqueda.trim()) return leyendas;
    
    const q = busqueda.toLowerCase();
    return leyendas.filter(b => 
      b.nombre?.toLowerCase().includes(q) || 
      b.apodo?.toLowerCase().includes(q) ||
      b.pais?.toLowerCase().includes(q) ||
      b.categoria?.toLowerCase().includes(q)
    );
  }, [busqueda, leyendas]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / itemsPorPagina));
  const startIndex = paginaActual * itemsPorPagina;
  const endIndex = startIndex + itemsPorPagina;
  const itemsVisibles = filtrados.slice(startIndex, endIndex);

  // SWIPE
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startData = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    setTouchStart(startData);
    touchStartRef.current = startData;
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current.x) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    if (deltaX > 30 && deltaX > deltaY * 2) {
      setIsSwiping(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current.x || !isSwiping) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const timeDelta = Date.now() - touchStartRef.current.time;
    
    const minSwipeDistance = 80;
    const maxSwipeTime = 500;
    const maxVerticalDrift = 100;
    
    if (Math.abs(deltaX) > minSwipeDistance && 
        timeDelta < maxSwipeTime && 
        Math.abs(deltaY) < maxVerticalDrift &&
        Math.abs(deltaX) > Math.abs(deltaY)) {
      
      e.preventDefault();
      
      if (deltaX < 0) {
        setPaginaActual(p => Math.min(totalPaginas - 1, p + 1));
      } else {
        setPaginaActual(p => Math.max(0, p - 1));
      }
    }
    
    setTouchStart({ x: 0, y: 0, time: 0 });
    touchStartRef.current = { x: 0, y: 0, time: 0 };
    setIsSwiping(false);
  };

  // Mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };
    setIsSwiping(false);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!touchStartRef.current.x) return;
    
    const deltaX = e.clientX - touchStartRef.current.x;
    const deltaY = e.clientY - touchStartRef.current.y;
    const timeDelta = Date.now() - touchStartRef.current.time;
    
    const minSwipeDistance = 100;
    const maxSwipeTime = 600;
    
    if (Math.abs(deltaX) > minSwipeDistance && 
        timeDelta < maxSwipeTime &&
        Math.abs(deltaX) > Math.abs(deltaY) * 2) {
      
      if (deltaX < 0) {
        setPaginaActual(p => Math.min(totalPaginas - 1, p + 1));
      } else {
        setPaginaActual(p => Math.max(0, p - 1));
      }
    }
    
    touchStartRef.current = { x: 0, y: 0, time: 0 };
    setIsSwiping(false);
  };

  // Wheel scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 3) {
        e.preventDefault();
        if (e.deltaX > 50 && paginaActual < totalPaginas - 1) {
          setPaginaActual(p => p + 1);
        } else if (e.deltaX < -50 && paginaActual > 0) {
          setPaginaActual(p => p - 1);
        }
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [paginaActual, totalPaginas]);

  // Clear search
  const handleClearSearch = () => {
    setBusqueda('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-3 border-[#00FBFF] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-[#00FBFF] font-bold text-sm">CARGANDO...</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-black text-white flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800 p-3 md:p-4">
        <div className="flex items-center justify-between mb-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-[#00FBFF] text-black p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Home size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black italic tracking-tighter leading-none">
                LIFE <span className="text-[#00FBFF]">FIGHTER</span>
              </h1>
              <p className="text-[10px] text-zinc-500 leading-none">Galería de Leyendas</p>
            </div>
          </Link>

          <div className="text-right">
            <p className="text-xs text-zinc-500">
              {filtrados.length} {filtrados.length === 1 ? 'leyenda' : 'leyendas'}
            </p>
            {busqueda && (
              <button 
                onClick={handleClearSearch}
                className="text-[10px] text-[#00FBFF] hover:underline mt-1"
              >
                [limpiar búsqueda]
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            placeholder="Buscar boxeador..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm focus:border-[#00FBFF] focus:outline-none"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </header>

      {/* GALERÍA */}
      <main className="flex-1 p-2 md:p-4">
        {filtrados.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="text-4xl mb-3">🥊</div>
            <h2 className="text-base font-bold text-zinc-700 mb-1">Sin resultados</h2>
            <button 
              onClick={handleClearSearch}
              className="px-4 py-2 bg-[#00FBFF] text-black font-bold rounded-full text-xs mt-2"
            >
              VER TODAS
            </button>
          </div>
        ) : (
          <div className="h-full grid grid-cols-2 gap-2 md:gap-3">
            {itemsVisibles.map((boxer) => (
              <Link
                key={boxer.id}
                href={`/boxeador/${boxer.id}?page=${paginaActual}&search=${encodeURIComponent(busqueda)}`}
                className="group relative overflow-hidden rounded-lg md:rounded-xl border border-zinc-800 hover:border-[#00FBFF] transition-colors bg-zinc-900"
                style={{ aspectRatio: '3/4' }}
                onClick={(e) => {
                  if (isSwiping && Math.abs(touchStartRef.current.x) > 80) {
                    e.preventDefault();
                  }
                }}
              >
                <Image
                  src={`${boxer.foto_url}?width=400&height=533&quality=75&format=webp`}
                  alt={boxer.nombre}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2">
                  <p className="text-[#00FBFF] font-black italic text-xs md:text-sm truncate">
                    "{boxer.apodo || boxer.nombre.split(' ')[0]}"
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div className="sticky bottom-0 bg-black/95 backdrop-blur-md border-t border-zinc-800 p-2">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setPaginaActual(p => Math.max(0, p - 1))}
                disabled={paginaActual === 0}
                className="p-2 bg-zinc-900 rounded-full disabled:opacity-20 hover:bg-[#00FBFF] hover:text-black transition-colors flex-shrink-0"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex-1 text-center">
                <div className="inline-flex items-center justify-center bg-zinc-900 px-4 py-1.5 rounded-full">
                  <span className="text-[#00FBFF] font-bold text-base md:text-lg">
                    {paginaActual + 1}
                  </span>
                  <span className="text-zinc-500 mx-2">/</span>
                  <span className="text-white font-bold text-base md:text-lg">
                    {totalPaginas}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-600 mt-0.5">
                  Desliza <strong>más de 8cm</strong> para cambiar
                </p>
              </div>

              <button
                onClick={() => setPaginaActual(p => Math.min(totalPaginas - 1, p + 1))}
                disabled={paginaActual === totalPaginas - 1}
                className="p-2 bg-zinc-900 rounded-full disabled:opacity-20 hover:bg-[#00FBFF] hover:text-black transition-colors flex-shrink-0"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL (envuelve el contenido en Suspense)
// ============================================
export default function GaleriaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-3 border-[#00FBFF] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-[#00FBFF] font-bold text-sm">CARGANDO...</p>
      </div>
    }>
      <GaleriaContent />
    </Suspense>
  );
}