'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import EntrenamientoCompleto from '../components/EntrenamientoCompleto';

interface Boxeador {
  id: number;
  nombre: string;
  apodo: string;
  pais: string;
  categoria: string;
  peso_detalle: string;
  altura_alcance: string;
  record: string;
  titulos: string;
  foto_url: string;
  combinaciones: string;
  entrenamiento: string;
  alimentacion: string;
  biografia: string;
  instruccion_tecnica: string;
  filosofia_vida: string;
  contexto_historico: string;
  legado_historico: string;
  video_tecnico: string;
}

export default function BoxeadorDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [boxeador, setBoxeador] = useState<Boxeador | null>(null);
  const [activeSection, setActiveSection] = useState<'conocer' | 'rutina'>('conocer');
  const [activeTab, setActiveTab] = useState<string>('biografia');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchBoxeador();
    }
  }, [params.id]);

  const fetchBoxeador = async () => {
    try {
      const { data, error } = await supabase
        .from('boxeadores_completo')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setBoxeador(data);
    } catch (error) {
      console.error('Error fetching boxeador:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
      </div>
    );
  }

  if (!boxeador) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Boxeador no encontrado</h2>
          <button
            onClick={() => router.push('/entrenar')}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header con foto y datos básicos */}
        <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-800">
          <button
            onClick={() => router.push('/entrenar')}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Volver al equipo
          </button>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Foto */}
            <div className="w-full md:w-64 h-64 bg-gray-800 rounded-xl overflow-hidden">
              {boxeador.foto_url ? (
                <img
                  src={boxeador.foto_url}
                  alt={boxeador.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  🥊
                </div>
              )}
            </div>

            {/* Info básica */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                {boxeador.nombre}
              </h1>
              <p className="text-2xl text-red-400 font-semibold mb-4">
                "{boxeador.apodo}"
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">País</p>
                  <p className="text-white font-semibold">🌍 {boxeador.pais}</p>
                </div>
                <div>
                  <p className="text-gray-400">Categoría</p>
                  <p className="text-white font-semibold">{boxeador.categoria}</p>
                </div>
                <div>
                  <p className="text-gray-400">Peso</p>
                  <p className="text-white font-semibold">⚖️ {boxeador.peso_detalle}</p>
                </div>
                <div>
                  <p className="text-gray-400">Altura / Alcance</p>
                  <p className="text-white font-semibold">📏 {boxeador.altura_alcance}</p>
                </div>
                <div>
                  <p className="text-gray-400">Récord</p>
                  <p className="text-white font-semibold">🥊 {boxeador.record}</p>
                </div>
                <div>
                  <p className="text-gray-400">Títulos</p>
                  <p className="text-white font-semibold">🏆 {boxeador.titulos}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Sección Principal */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveSection('conocer')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
              activeSection === 'conocer'
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/50 scale-105'
                : 'bg-black/50 text-gray-400 hover:bg-gray-800 backdrop-blur-sm'
            }`}
          >
            📖 Conocer al Luchador
          </button>
          <button
            onClick={() => setActiveSection('rutina')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
              activeSection === 'rutina'
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/50 scale-105'
                : 'bg-black/50 text-gray-400 hover:bg-gray-800 backdrop-blur-sm'
            }`}
          >
            🥊 Rutina de Hoy
          </button>
        </div>

        {/* Contenido según sección activa */}
        {activeSection === 'conocer' ? (
          <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            {/* Tabs de contenido */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'biografia', label: '📜 Biografía', icon: '📜' },
                { id: 'tecnica', label: '🥋 Técnica', icon: '🥋' },
                { id: 'entrenamiento', label: '💪 Entrenamiento', icon: '💪' },
                { id: 'alimentacion', label: '🍎 Alimentación', icon: '🍎' },
                { id: 'combinaciones', label: '🥊 Combinaciones', icon: '🥊' },
                { id: 'filosofia', label: '🧠 Filosofía', icon: '🧠' },
                { id: 'contexto', label: '📅 Contexto', icon: '📅' },
                { id: 'legado', label: '👑 Legado', icon: '👑' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {tab.icon} {tab.label.split(' ')[1]}
                </button>
              ))}
            </div>

            {/* Contenido del tab */}
            <div className="bg-gray-900/50 rounded-lg p-6 min-h-96">
              {activeTab === 'biografia' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">📜 Biografía</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {boxeador.biografia || 'No hay información disponible.'}
                  </p>
                </div>
              )}

              {activeTab === 'tecnica' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">🥋 Instrucción Técnica</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {boxeador.instruccion_tecnica || 'No hay información disponible.'}
                  </p>
                  
                  {boxeador.video_tecnico && (
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-white mb-3">🎥 Video Técnico</h3>
                      <a
                        href={boxeador.video_tecnico}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                      >
                        ▶️ Ver Video en YouTube
                      </a>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'entrenamiento' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">💪 Entrenamiento</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {boxeador.entrenamiento || 'No hay información disponible.'}
                  </p>
                </div>
              )}

              {activeTab === 'alimentacion' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">🍎 Alimentación</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {boxeador.alimentacion || 'No hay información disponible.'}
                  </p>
                </div>
              )}

              {activeTab === 'combinaciones' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">🥊 Combinaciones</h2>
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-4">
                    <p className="text-red-300 font-mono text-lg">
                      {boxeador.combinaciones || 'No hay información disponible.'}
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm">
                    * Estas son las combinaciones características de {boxeador.nombre}
                  </p>
                </div>
              )}

              {activeTab === 'filosofia' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">🧠 Filosofía de Vida</h2>
                  <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700 rounded-lg p-6 mb-4">
                    <p className="text-purple-200 text-xl italic leading-relaxed">
                      "{boxeador.filosofia_vida || 'No hay información disponible.'}"
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'contexto' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">📅 Contexto Histórico</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {boxeador.contexto_historico || 'No hay información disponible.'}
                  </p>
                </div>
              )}

              {activeTab === 'legado' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">👑 Legado Histórico</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {boxeador.legado_historico || 'No hay información disponible.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <EntrenamientoCompleto boxeadorId={Number(params.id)} />
        )}
      </div>
    </div>
  );
}