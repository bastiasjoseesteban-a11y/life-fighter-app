import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Boxeador } from '@/lib/types';
import { Target, Trophy, Clock, Flame } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Selecciona tu Leyenda - LifeFighter',
  description: 'Elige un boxeador legendario y entrena con su estilo único',
};

async function getBoxeadores(): Promise<Boxeador[]> {
  try {
    const { data, error } = await supabase
      .from('boxeadores')
      .select('*')
      .order('nombre');

    if (error) {
      console.error('Error obteniendo boxeadores:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export default async function EntrenarPage() {
  const boxeadores = await getBoxeadores();

  // Estadísticas
  const stats = [
    { icon: Target, label: 'Boxeadores', value: boxeadores.length, color: 'text-red-500' },
    { icon: Trophy, label: 'Estilos Únicos', value: new Set(boxeadores.map(b => b.estilo)).size, color: 'text-yellow-500' },
    { icon: Clock, label: 'Horas de Entrenamiento', value: '150+', color: 'text-blue-500' },
    { icon: Flame, label: 'Niveles', value: '3', color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">
            <span className="text-yellow-500">ELIGE</span> TU LEYENDA
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Selecciona un campeón legendario y descubre su rutina de entrenamiento personalizada.
            Cada boxeador tiene un estilo único que puedes aprender y adaptar.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${stat.color.replace('text-', 'bg-')}/20`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-gray-400">{stat.label}</span>
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Grid de Boxeadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boxeadores.map((boxeador) => (
            <Link
              key={boxeador.id}
              href={`/entrenar/${boxeador.id}`}
              className="group block"
            >
              <div className="bg-gray-800/30 border-2 border-gray-700 rounded-3xl p-6 h-full transition-all duration-300 group-hover:border-yellow-500 group-hover:scale-[1.02] card-hover">
                {/* Avatar del boxeador */}
                <div className="w-full h-56 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                  <div className="text-8xl z-10">🥊</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Información */}
                <h3 className="text-2xl font-black uppercase mb-2 group-hover:text-yellow-500 transition-colors">
                  {boxeador.nombre}
                </h3>
                
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-bold rounded-full">
                    {boxeador.estilo || 'Estilo Clásico'}
                  </span>
                </div>

                {/* Detalles */}
                <div className="space-y-2 text-sm text-gray-400 mb-6">
                  {boxeador.record && (
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 mr-2" />
                      <span>{boxeador.record}</span>
                    </div>
                  )}
                  {boxeador.nacionalidad && (
                    <div className="flex items-center">
                      <span>🌍 {boxeador.nacionalidad}</span>
                    </div>
                  )}
                </div>

                {/* Botón */}
                <div className="mt-auto">
                  <div className="w-full py-3 bg-gradient-to-r from-gray-700 to-gray-800 group-hover:from-yellow-600 group-hover:to-orange-600 text-white font-bold rounded-xl text-center transition-all">
                    ENTRENAR CON {boxeador.nombre.split(' ')[0].toUpperCase()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Si no hay boxeadores */}
        {boxeadores.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🥊</div>
            <h3 className="text-2xl font-bold mb-4 text-yellow-500">BASE DE DATOS VACÍA</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              No se encontraron boxeadores en la base de datos. 
              Añade algunos desde el panel de administración para comenzar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/admin"
                className="px-6 py-3 bg-yellow-600 text-black font-bold rounded-xl hover:bg-yellow-500 transition"
              >
                IR AL PANEL ADMIN
              </Link>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition"
              >
                VER SUPABASE
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}