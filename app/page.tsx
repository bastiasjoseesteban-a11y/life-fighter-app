import Link from 'next/link';
import { Dumbbell, Trophy, Users, Zap, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

async function getDestacados() {
  try {
    const { data, error } = await supabase
      .from('boxeadores')
      .select('*')
      .limit(4)
      .order('nombre');

    return { data: data || [], error };
  } catch (error) {
    return { data: [], error };
  }
}

export default async function HomePage() {
  const { data: boxeadoresDestacados } = await getDestacados();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-full mb-6">
              <Dumbbell className="w-8 h-8 text-yellow-500" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6">
              <span className="text-yellow-500">ENTRENA</span> COMO UNA<br />
              <span className="text-white">LEYENDA</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Descubre las rutinas de los mayores campeones del boxeo y transforma tu entrenamiento.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/entrenar"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-black font-black text-lg rounded-xl transition-all transform hover:scale-105"
              >
                COMENZAR AHORA
                <ArrowRight className="ml-3 w-5 h-5" />
              </Link>
              
              <Link 
                href="/boxeador"
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all"
              >
                VER LEYENDAS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            ¿POR QUÉ <span className="text-yellow-500">LIFEFIGHTER</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/30 p-8 rounded-3xl border border-gray-700 card-hover">
              <div className="w-14 h-14 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-6">
                <Trophy className="w-7 h-7 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">Rutinas Auténticas</h3>
              <p className="text-gray-400">
                Entrena exactamente como lo hicieron los campeones, con rutinas verificadas y documentadas.
              </p>
            </div>
            
            <div className="bg-gray-800/30 p-8 rounded-3xl border border-gray-700 card-hover">
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">Seguimiento Inteligente</h3>
              <p className="text-gray-400">
                Monitorea tu progreso, calorías quemadas y mejora tu rendimiento con análisis detallados.
              </p>
            </div>
            
            <div className="bg-gray-800/30 p-8 rounded-3xl border border-gray-700 card-hover">
              <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">Comunidad Activa</h3>
              <p className="text-gray-400">
                Únete a miles de boxeadores que comparten consejos, logros y motivación diaria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leyendas Destacadas */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black">
                LEYENDAS <span className="text-yellow-500">DESTACADAS</span>
              </h2>
              <p className="text-gray-400 mt-2">Entrena con los mejores de la historia</p>
            </div>
            <Link 
              href="/boxeador"
              className="text-yellow-500 hover:text-yellow-400 font-bold flex items-center"
            >
              VER TODOS <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {boxeadoresDestacados.map((boxeador) => (
              <Link 
                key={boxeador.id}
                href={`/boxeador/${boxeador.id}`}
                className="block group"
              >
                <div className="bg-gray-800/30 border-2 border-gray-700 rounded-2xl p-6 transition-all group-hover:border-yellow-500 group-hover:scale-[1.02] h-full">
                  <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-6xl">🥊</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-500">
                    {boxeador.nombre}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{boxeador.estilo}</span>
                    <span className="text-sm font-bold text-yellow-500">{boxeador.record}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            ¿LISTO PARA <span className="text-yellow-500">TRANSFORMARTE</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Comienza tu viaje hoy y descubre el campeón que llevas dentro.
          </p>
          <Link 
            href="/entrenar"
            className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-black font-black text-xl rounded-2xl transition-all transform hover:scale-105"
          >
            <Dumbbell className="mr-3 w-6 h-6" />
            COMENZAR ENTRENAMIENTO GRATIS
          </Link>
        </div>
      </section>
    </div>
  );
}