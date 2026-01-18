'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Search, Star, StarOff, Filter, X, MapPin, Trophy, Zap } from 'lucide-react';
import Image from 'next/image';

interface Boxeador {
  id: number;
  nombre: string;
  apodo: string;
  pais: string;
  categoria: string;
  foto_url: string;
  record: string;
  titulos?: string;
  isFavorito?: boolean;
  isPremium?: boolean;
}

export default function EquipoTab() {
  const router = useRouter();
  const [boxeadores, setBoxeadores] = useState<Boxeador[]>([]);
  const [filteredBoxeadores, setFilteredBoxeadores] = useState<Boxeador[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBoxeadores();
  }, []);

  useEffect(() => {
    filterBoxeadores();
  }, [searchTerm, boxeadores, showFavoritesOnly, selectedCategories]);

  const fetchBoxeadores = async () => {
    try {
      const { data, error } = await supabase
        .from('boxeadores_completo')
        .select('id, nombre, apodo, pais, categoria, foto_url, record, titulos')
        .order('nombre');

      if (error) throw error;

      const uniqueCategories = Array.from(
        new Set(data.map((b: any) => b.categoria))
      ) as string[];
      setCategories(uniqueCategories);

      const boxeadoresConEstado = data.map((b: any) => ({
        ...b,
        isFavorito: b.id <= 10,
        isPremium: b.id > 50
      }));

      setBoxeadores(boxeadoresConEstado);
    } catch (error) {
      console.error('Error fetching boxeadores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBoxeadores = () => {
    let filtered = [...boxeadores];

    if (showFavoritesOnly) {
      filtered = filtered.filter(b => b.isFavorito);
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(b => 
        selectedCategories.includes(b.categoria)
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.nombre.toLowerCase().includes(term) ||
        b.apodo.toLowerCase().includes(term) ||
        b.pais.toLowerCase().includes(term) ||
        b.categoria.toLowerCase().includes(term)
      );
    }

    setFilteredBoxeadores(filtered);
  };

  const toggleFavorite = (id: number) => {
    setBoxeadores(prev =>
      prev.map(b => b.id === id ? { ...b, isFavorito: !b.isFavorito } : b)
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setShowFavoritesOnly(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="relative">
          <div className="w-20 h-20 border-3 border-[#00FBFF] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap size={24} className="text-[#00FBFF]" />
          </div>
        </div>
        <p className="text-[#00FBFF] font-bold text-sm mt-4">CARGANDO LEYENDAS...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[414px] mx-auto space-y-4">
      {/* HEADER Y FILTROS */}
      <div className="space-y-3">
        {/* BUSCADOR */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar por nombre, apodo o país..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/80 backdrop-blur-sm text-white px-10 py-2.5 rounded-xl border border-zinc-800 focus:border-[#00FBFF] focus:outline-none text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* FILTROS RÁPIDOS */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium transition-all ${
              showFavoritesOnly
                ? 'bg-[#FF4D00] text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {showFavoritesOnly ? <Star size={12} fill="currentColor" /> : <StarOff size={12} />}
            {showFavoritesOnly ? 'Favoritos' : 'Todos'}
          </button>

          {categories.slice(0, 3).map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategories.includes(category)
                  ? 'bg-[#00FBFF] text-black'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* CONTADOR DE RESULTADOS */}
      <div className="flex justify-between items-center text-sm px-1">
        <span className="text-zinc-400">
          Mostrando <span className="text-white font-bold">{filteredBoxeadores.length}</span> de {boxeadores.length}
        </span>
        {filteredBoxeadores.length > 0 && (
          <span className="text-[10px] text-zinc-500">
            Ordenado por: <span className="text-[#00FBFF]">Nombre</span>
          </span>
        )}
      </div>

      {/* LISTA DE BOXEADORES - DISEÑO VERTICAL */}
      {filteredBoxeadores.length === 0 ? (
        <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-zinc-800 min-h-[200px] flex flex-col items-center justify-center">
          <div className="text-5xl mb-4">🥊</div>
          <h3 className="text-white font-bold text-base mb-2">
            {searchTerm ? 'No se encontraron resultados' : 'Sin boxeadores'}
          </h3>
          <p className="text-zinc-500 text-sm mb-6">
            {searchTerm 
              ? 'Intenta con otro nombre o apodo'
              : showFavoritesOnly 
                ? 'Agrega boxeadores a favoritos primero'
                : 'No hay boxeadores disponibles'}
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 bg-gradient-to-r from-[#00FBFF] to-[#0088FF] text-black font-bold rounded-full text-sm hover:opacity-90 transition-opacity"
          >
            VER TODOS LOS BOXEADORES
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredBoxeadores.map((boxeador) => (
            <div
              key={boxeador.id}
              className="group relative bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-sm rounded-xl overflow-hidden border border-zinc-800 hover:border-[#00FBFF]/60 transition-all duration-300"
            >
              {/* IMAGEN LIMPIA */}
              <div 
                className="relative aspect-square w-full cursor-pointer"
                onClick={() => router.push(`/entrenar/${boxeador.id}`)}
              >
                {boxeador.foto_url ? (
                  <Image
                    src={`${boxeador.foto_url}?width=200&height=200&quality=90&format=webp`}
                    alt={boxeador.nombre}
                    fill
                    sizes="(max-width: 414px) 50vw, 25vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
                    <span className="text-4xl">🥊</span>
                  </div>
                )}
              </div>
              
              {/* CONTENIDO DEBAJO DE LA IMAGEN */}
              <div className="p-2">
                {/* NOMBRE Y ESTRELLA */}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-bold text-sm truncate">
                    {boxeador.nombre}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(boxeador.id);
                    }}
                    className="w-5 h-5 flex items-center justify-center"
                  >
                    <Star 
                      size={10} 
                      className={boxeador.isFavorito ? "text-[#FF4D00]" : "text-zinc-400"} 
                      fill={boxeador.isFavorito ? "currentColor" : "none"} 
                    />
                  </button>
                </div>
                
                {/* APODO */}
                <p className="text-[#00FBFF] italic text-xs font-bold truncate mb-1.5">
                  "{boxeador.apodo}"
                </p>
                
                {/* DETALLES */}
                <div className="flex justify-between items-center text-[10px]">
                  <div className="flex items-center gap-1">
                    <MapPin size={8} className="text-zinc-500" />
                    <span className="text-zinc-400">{boxeador.pais}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy size={8} className="text-amber-400" />
                    <span className="text-white font-bold">{boxeador.record}</span>
                  </div>
                </div>
                
                {/* CATEGORÍA */}
                <div className="text-center mt-1">
                  <span className="text-zinc-400 text-[10px]">{boxeador.categoria}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PIE DE PÁGINA */}
      {filteredBoxeadores.length > 0 && (
        <div className="pt-3 border-t border-zinc-800">
          <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-[#00FBFF] rounded-full"></div>
              <span>Total: {filteredBoxeadores.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-[#FF4D00] rounded-full"></div>
              <span>Favoritos: {filteredBoxeadores.filter(b => b.isFavorito).length}</span>
            </div>
          </div>
          
          <p className="text-center text-[10px] text-zinc-600 mt-2">
            💡 Toca en cualquier boxeador para ver su entrenamiento
          </p>
        </div>
      )}
    </div>
  );
}