'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';  // CORREGIDO

interface Boxeador {
  id: number;
  nombre: string;
  apodo: string;
  pais: string;
  categoria: string;
  foto_url: string;
  record: string;
  isFavorito?: boolean;
  isPremium?: boolean;
}

export default function EquipoTab() {
  const router = useRouter();
  const [boxeadores, setBoxeadores] = useState<Boxeador[]>([]);
  const [filteredBoxeadores, setFilteredBoxeadores] = useState<Boxeador[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(true);

  useEffect(() => {
    fetchBoxeadores();
  }, []);

  useEffect(() => {
    filterBoxeadores();
  }, [searchTerm, boxeadores, showFavoritesOnly]);

  const fetchBoxeadores = async () => {
    try {
      const { data, error } = await supabase
        .from('boxeadores_completo')
        .select('id, nombre, apodo, pais, categoria, foto_url, record')
        .order('nombre');

      if (error) throw error;

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
    let filtered = boxeadores;

    if (showFavoritesOnly) {
      filtered = filtered.filter(b => b.isFavorito);
    }

    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.apodo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.pais.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBoxeadores(filtered);
  };

  const toggleFavorite = (id: number) => {
    setBoxeadores(prev =>
      prev.map(b => b.id === id ? { ...b, isFavorito: !b.isFavorito } : b)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Buscador y Filtros */}
      <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Buscador */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar boxeador por nombre, apodo o país..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-3 pl-12 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>

          {/* Toggle Favoritos */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              showFavoritesOnly
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            {showFavoritesOnly ? '⭐ Solo Favoritos' : '📋 Todos'}
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Mostrando {filteredBoxeadores.length} de {boxeadores.length} boxeadores
        </div>
      </div>

      {/* Grid de Boxeadores */}
      {filteredBoxeadores.length === 0 ? (
        <div className="bg-black/50 backdrop-blur-sm rounded-xl p-12 text-center">
          <p className="text-gray-400 text-xl">
            {searchTerm
              ? '❌ No se encontraron boxeadores con ese criterio'
              : '⭐ No tienes favoritos aún. Explora todos los boxeadores para agregar.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBoxeadores.map((boxeador) => (
            <div
              key={boxeador.id}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden hover:border-red-600 transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              {/* Imagen */}
              <div className="relative h-48 bg-gray-800 overflow-hidden">
                {boxeador.foto_url ? (
                  <img
                    src={boxeador.foto_url}
                    alt={boxeador.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🥊
                  </div>
                )}
                
                {/* Badge Premium */}
                {boxeador.isPremium && !boxeador.isFavorito && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                    👑 PREMIUM
                  </div>
                )}

                {/* Botón Favorito */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(boxeador.id);
                  }}
                  className="absolute top-2 left-2 bg-black/70 hover:bg-black p-2 rounded-full transition-all"
                >
                  <span className="text-2xl">
                    {boxeador.isFavorito ? '⭐' : '☆'}
                  </span>
                </button>
              </div>

              {/* Info */}
              <div
                onClick={() => router.push(`/entrenar/${boxeador.id}`)}
                className="p-4"
              >
                <h3 className="text-xl font-bold text-white mb-1 truncate">
                  {boxeador.nombre}
                </h3>
                <p className="text-red-400 font-semibold mb-2 truncate">
                  "{boxeador.apodo}"
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <span>🌍 {boxeador.pais}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{boxeador.categoria}</span>
                  <span className="text-gray-500">{boxeador.record}</span>
                </div>
                
                <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-all">
                  Ver Detalles →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}