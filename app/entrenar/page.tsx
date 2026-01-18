'use client';

import { useState } from 'react';
import EquipoTab from './components/EquipoTab';
import MisLogrosTab from './components/MisLogrosTab';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function EntrenarPage() {
  const [activeTab, setActiveTab] = useState<'equipo' | 'logros'>('equipo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black">
      {/* HEADER FIXED - Mismo estilo que Home y Galería */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800 p-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-[#00FBFF] text-black p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Home size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black italic tracking-tighter leading-none">
                LIFE <span className="text-[#00FBFF]">FIGHTER</span>
              </h1>
              <p className="text-[10px] text-zinc-500 leading-none">Modo Entrenamiento</p>
            </div>
          </Link>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="px-3 pb-4">
        {/* Título centrado */}
        <div className="text-center my-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            🥊 <span className="text-[#FF4D00]">ENTRENAR</span>
          </h1>
          <p className="text-gray-300 text-sm">Prepárate como los grandes campeones</p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-6 bg-black/50 p-1 rounded-xl backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('equipo')}
            className={`flex-1 py-3 px-2 rounded-lg font-bold text-sm transition-all duration-300 ${
              activeTab === 'equipo'
                ? 'bg-[#FF4D00] text-white shadow-lg shadow-[#FF4D00]/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span className="block">👤</span>
            <span className="text-xs">Mi Equipo</span>
          </button>
          <button
            onClick={() => setActiveTab('logros')}
            className={`flex-1 py-3 px-2 rounded-lg font-bold text-sm transition-all duration-300 ${
              activeTab === 'logros'
                ? 'bg-[#FF4D00] text-white shadow-lg shadow-[#FF4D00]/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span className="block">🏆</span>
            <span className="text-xs">Mis Logros</span>
          </button>
        </div>

        {/* Área de Contenido */}
        <div className="animate-fadeIn">
          {activeTab === 'equipo' ? <EquipoTab /> : <MisLogrosTab />}
        </div>
      </main>
    </div>
  );
}