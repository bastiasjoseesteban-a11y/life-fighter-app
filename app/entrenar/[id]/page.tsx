'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import EntrenamientoCompleto from '../components/EntrenamientoCompleto';
import Link from 'next/link';
import { ArrowLeft, MapPin, Scale, Weight, Trophy, Award } from 'lucide-react';
import Image from 'next/image';

// ✅ Importamos el PremiumManager centralizado
import { PremiumManager } from '@/lib/premium-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    if (params.id) {
      verifyAndLoad();
    }
  }, [params.id]);

  const verifyAndLoad = async () => {
    const boxerId = Number(params.id);
    
    try {
      // ✅ VERIFICACIÓN DE ACCESO PREMIUM (misma lógica que en la página anterior)
      const hasAccess = await PremiumManager.hasAccess(boxerId);
      
      if (!hasAccess) {
        // Si no tiene acceso, redirigir a la página de pago
        router.replace(`/boxeador/${boxerId}`);
        return;
      }
      
      // Acceso concedido - continuar con la carga
      setAccessGranted(true);
      
      const { data, error } = await supabase
        .from('boxeadores_completo')
        .select('*')
        .eq('id', boxerId)
        .single();

      if (error) throw error;
      setBoxeador(data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando boxeador:', error);
      // En caso de error, redirigir también
      router.replace(`/boxeador/${boxerId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 border-3 border-[#00FBFF] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#00FBFF] font-bold text-sm">
            {accessGranted ? 'CARGANDO ENTRENAMIENTO...' : 'VERIFICANDO ACCESO...'}
          </p>
        </div>
      </div>
    );
  }

  if (!boxeador) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center px-4">
        <div className="text-center text-white max-w-[414px] mx-auto">
          <h2 className="text-2xl font-bold mb-4">Boxeador no encontrado</h2>
          <button
            onClick={() => router.push('/entrenar')}
            className="bg-[#FF4D00] hover:bg-[#FF8A00] px-6 py-3 rounded-lg font-bold"
          >
            Volver al equipo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black">
      {/* HEADER - CENTRADO */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800 p-3">
        <div className="flex items-center justify-between max-w-[414px] mx-auto">
          <Link href="/entrenar" className="flex items-center gap-2 group">
            <div className="bg-[#00FBFF] text-black p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <ArrowLeft size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black italic tracking-tighter leading-none">
                LIFE <span className="text-[#00FBFF]">FIGHTER</span>
              </h1>
              <p className="text-[10px] text-zinc-500 leading-none">Entrenamiento Premium</p>
            </div>
          </Link>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL - CENTRADO */}
      <main className="px-3 pb-4 max-w-[414px] mx-auto">
        {/* IMAGEN DEL BOXEADOR */}
        <div className="relative mt-4 mb-6">
          <div className="relative w-full aspect-[3/4] max-w-[320px] mx-auto rounded-2xl overflow-hidden border-4 border-zinc-800 shadow-2xl bg-zinc-900">
            {boxeador.foto_url ? (
              <Image
                src={`${boxeador.foto_url}?width=600&height=800&quality=90&format=webp`}
                alt={boxeador.nombre}
                fill
                sizes="(max-width: 414px) 320px, 400px"
                className="object-cover object-top"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
                <span className="text-6xl">🥊</span>
              </div>
            )}
            
            {/* OVERLAY CON NOMBRE Y APODO */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4">
              <h1 className="text-2xl font-bold text-white text-center mb-1">
                {boxeador.nombre}
              </h1>
              <p className="text-[#00FBFF] italic font-bold text-lg text-center">
                "{boxeador.apodo}"
              </p>
            </div>
          </div>
        </div>

        {/* INFORMACIÓN BÁSICA - CENTRADA */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-zinc-800 mb-6">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-zinc-900/50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <MapPin size={14} className="text-[#00FBFF]" />
                <span className="text-white text-sm font-bold">País</span>
              </div>
              <p className="text-zinc-300 text-sm">{boxeador.pais}</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy size={14} className="text-amber-400" />
                <span className="text-white text-sm font-bold">Récord</span>
              </div>
              <p className="text-zinc-300 text-sm font-bold">{boxeador.record}</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Scale size={14} className="text-[#FF4D00]" />
                <span className="text-white text-sm font-bold">Categoría</span>
              </div>
              <p className="text-zinc-300 text-sm">{boxeador.categoria}</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Weight size={14} className="text-emerald-400" />
                <span className="text-white text-sm font-bold">Peso</span>
              </div>
              <p className="text-zinc-300 text-sm">{boxeador.peso_detalle}</p>
            </div>
          </div>
          
          {/* TÍTULOS */}
          {boxeador.titulos && (
            <div className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 rounded-xl p-3 border border-amber-800/50">
              <div className="flex items-center gap-2 mb-1">
                <Award size={14} className="text-amber-400" />
                <span className="text-white text-sm font-bold">Títulos Obtenidos</span>
              </div>
              <p className="text-amber-300 text-sm text-center">{boxeador.titulos}</p>
            </div>
          )}
        </div>

        {/* TABS DE SECCIÓN PRINCIPAL - CENTRADOS */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveSection('conocer')}
            className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all ${
              activeSection === 'conocer'
                ? 'bg-[#FF4D00] text-white shadow-lg shadow-[#FF4D00]/50'
                : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 backdrop-blur-sm'
            }`}
          >
            <span className="block text-lg">📚</span>
            <span className="text-xs">Conocer</span>
          </button>
          <button
            onClick={() => setActiveSection('rutina')}
            className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all ${
              activeSection === 'rutina'
                ? 'bg-[#FF4D00] text-white shadow-lg shadow-[#FF4D00]/50'
                : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 backdrop-blur-sm'
            }`}
          >
            <span className="block text-lg">💪</span>
            <span className="text-xs">Rutina</span>
          </button>
        </div>

        {/* CONTENIDO SEGÚN SECCIÓN ACTIVA */}
        {activeSection === 'conocer' ? (
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-zinc-800">
            {/* TABS DE CONTENIDO - SCROLL HORIZONTAL */}
            <div className="flex overflow-x-auto pb-2 mb-4 gap-2 no-scrollbar">
              {[
                { id: 'biografia', label: '📖 Biografía', icon: '📖' },
                { id: 'tecnica', label: '🥊 Técnica', icon: '🥊' },
                { id: 'entrenamiento', label: '🏋️ Entrenamiento', icon: '🏋️' },
                { id: 'alimentacion', label: '🍎 Alimentación', icon: '🍎' },
                { id: 'combinaciones', label: '🎯 Combos', icon: '🎯' },
                { id: 'filosofia', label: '🧠 Filosofía', icon: '🧠' },
                { id: 'contexto', label: '🌍 Contexto', icon: '🌍' },
                { id: 'legado', label: '🏆 Legado', icon: '🏆' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-[#00FBFF] text-black'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* CONTENIDO DEL TAB */}
            <div className="bg-zinc-900/30 rounded-xl p-4 min-h-[300px]">
              {activeTab === 'biografia' && (
                <div>
                  <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">📖</span> Biografía
                  </h2>
                  <p className="text-zinc-300 leading-relaxed text-sm">
                    {boxeador.biografia || 'No hay información disponible.'}
                  </p>
                </div>
              )}

              {activeTab === 'tecnica' && (
                <div>
                  <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">🥊</span> Instrucción Técnica
                  </h2>
                  <p className="text-zinc-300 leading-relaxed text-sm">
                    {boxeador.instruccion_tecnica || 'No hay información disponible.'}
                  </p>
                  
                  {boxeador.video_tecnico && (
                    <div className="mt-6 text-center">
                      <a
                        href={boxeador.video_tecnico}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF4D00] to-[#FF8A00] text-white px-6 py-3 rounded-xl font-bold transition-all hover:opacity-90"
                      >
                        <span className="text-lg">🎬</span> Ver Video Técnico
                      </a>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'entrenamiento' && (
                <div>
                  <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">🏋️</span> Entrenamiento
                  </h2>
                  <p className="text-zinc-300 leading-relaxed text-sm">
                    {boxeador.entrenamiento || 'No hay información disponible.'}
                  </p>
                </div>
              )}

              {activeTab === 'alimentacion' && (
                <div>
                  <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">🍎</span> Alimentación
                  </h2>
                  <p className="text-zinc-300 leading-relaxed text-sm">
                    {boxeador.alimentacion || 'No hay información disponible.'}
                  </p>
                </div>
              )}

              {activeTab === 'combinaciones' && (
                <div>
                  <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">🎯</span> Combinaciones
                  </h2>
                  <div className="bg-gradient-to-r from-[#FF4D00]/20 to-[#FF8A00]/20 border border-[#FF4D00]/30 rounded-xl p-4 mb-3">
                    <p className="text-white font-mono text-base font-bold text-center">
                      {boxeador.combinaciones || 'No hay información disponible.'}
                    </p>
                  </div>
                  <p className="text-zinc-400 text-xs text-center">
                    * Combinaciones características de {boxeador.nombre}
                  </p>
                </div>
              )}

              {activeTab === 'filosofia' && (
                <div>
                  <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">🧠</span> Filosofía de Vida
                  </h2>
                  <div className="bg-gradient-to-r from-[#00FBFF]/10 to-cyan-900/10 border border-[#00FBFF]/20 rounded-xl p-4 mb-3">
                    <p className="text-[#00FBFF] text-base italic leading-relaxed">
                      "{boxeador.filosofia_vida || 'No hay información disponible.'}"
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'contexto' && (
                <div>
                  <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">🌍</span> Contexto Histórico
                  </h2>
                  <p className="text-zinc-300 leading-relaxed text-sm">
                    {boxeador.contexto_historico || 'No hay información disponible.'}
                  </p>
                </div>
              )}

              {activeTab === 'legado' && (
                <div>
                  <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">🏆</span> Legado Histórico
                  </h2>
                  <p className="text-zinc-300 leading-relaxed text-sm">
                    {boxeador.legado_historico || 'No hay información disponible.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <EntrenamientoCompleto boxeadorId={Number(params.id)} />
        )}
      </main>

      {/* FOOTER */}
      <footer className="sticky bottom-0 bg-black/95 backdrop-blur-md border-t border-zinc-800 p-3">
        <div className="max-w-[414px] mx-auto">
          <div className="flex gap-2">
            <Link 
              href="/" 
              className="flex-1 bg-gradient-to-r from-[#00FBFF] to-[#0088FF] text-black font-bold py-3 rounded-xl text-sm text-center"
            >
              🏠 Inicio
            </Link>
            <Link 
              href="/entrenar" 
              className="flex-1 bg-zinc-800 text-white font-bold py-3 rounded-xl text-sm text-center border border-zinc-700"
            >
              🥊 Mi Equipo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}