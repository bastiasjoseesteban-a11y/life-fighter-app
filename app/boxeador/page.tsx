'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Boxeador } from '@/lib/types';
import { Search, Filter, Trophy, Target, Users } from 'lucide-react';

export default function GaleriaPage() {
  const [boxeadores, setBoxeadores] = useState<Boxeador[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    cargarBoxeadores();
  }, []);

  const cargarBoxeadores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('boxeadores')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setBoxeadores(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar boxeadores
  const boxeadoresFiltrados = boxeadores.filter(boxeador => {
    const matchSearch = boxeador.nombre.toLowerCase().includes(search.toLowerCase()) ||
                      boxeador.estilo?.toLowerCase().includes(search.toLowerCase()) ||
                      boxeador.nacionalidad?.toLowerCase().includes(search.toLowerCase());
    
    const matchFilter = filter === 'todos' || 
                       (filter === 'pesado' && boxeador.peso?.includes('Pesado')) ||
                       (filter === 'medio' && boxeador.peso?.includes('Medio'));
    
    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p>Cargando galería de leyendas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">
            <span className="text-yellow-500">GALERÍA</span> DE LEYENDAS
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Conoce a los campeones que han hecho historia en el boxeo mundial. 
            Cada uno con un estilo único y un legado imborrable.
          </p>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar boxeador por nombre, estilo o nacionalidad..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('todos')}
                className={`px-4 py-3 rounded-xl font-bold transition ${
                  filter === 'todos' 
                    ? 'bg-yellow-500 text-black' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                TODOS
              </button>
              <button
                onClick={() => setFilter('pesado')}
                className={`px-4 py-3 rounded-xl font-bold transition ${
                  filter === 'pesado' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                PESADO
              </button>
              <button
                onClick={() => setFilter('medio')}
                className={`px-4 py-3 rounded-xl font-bold transition ${
                  filter === 'medio' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                MEDIO
              </button>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/30 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm text-gray-400">LEYENDAS</div>
                  <div className="text-2xl font-bold">{boxeadores.length}</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-red-400" />
                <div>
                  <div className="text-sm text-gray-400">ESTILOS ÚNICOS</div>
                  <div className="text-2xl font-bold">
                    {new Set(boxeadores.map(b => b.estilo)).size}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-sm text-gray-400">PAÍSES</div>
                  <div className="text-2xl font-bold">
                    {new Set(boxeadores.map(b => b.nacionalidad)).size}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-sm text-gray-400">MOSTRANDO</div>
                  <div className="text-2xl font-bold">{boxeadoresFiltrados.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Boxeadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boxeadoresFiltrados.map((boxeador) => (
            <Link
              key={boxeador.id}
              href={`/boxeador/${boxeador.id}`}
              className="group block"
            >
              <div className="bg-gray-800/30 border-2 border-gray-700 rounded-2xl p-6 h-full transition-all group-hover:border-yellow-500 group-hover:scale-[1.02]">
                {/* Avatar */}
                <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="text-7xl z-10">🥊</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-yellow-500/90 text-black text-xs font-bold rounded-full">
                    {boxeador.peso || 'PESADO'}
                  </div>
                </div>

                {/* Información */}
                <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-500">
                  {boxeador.nombre}
                </h3>
                
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">
                    {boxeador.estilo || 'Estilo Clásico'}
                  </span>
                </div>

                {/* Detalles */}
                <div className="space-y-2 text-sm">
                  {boxeador.record && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Récord</span>
                      <span className="font-bold text-yellow-500">{boxeador.record}</span>
                    </div>
                  )}
                  {boxeador.nacionalidad && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Nacionalidad</span>
                      <span className="font-bold">{boxeador.nacionalidad}</span>
                    </div>
                  )}
                  {boxeador.titulos && (
                    <div className="pt-2 border-t border-gray-700">
                      <span className="text-gray-400 text-xs">{boxeador.titulos}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Si no hay resultados */}
        {boxeadoresFiltrados.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold mb-4">NO SE ENCONTRARON RESULTADOS</h3>
            <p className="text-gray-400 mb-8">
              No hay boxeadores que coincidan con tu búsqueda.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setFilter('todos');
              }}
              className="px-6 py-3 bg-yellow-600 text-black font-bold rounded-xl hover:bg-yellow-500"
            >
              VER TODAS LAS LEYENDAS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}