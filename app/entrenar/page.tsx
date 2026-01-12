'use client';

import { useState } from 'react';
import EquipoTab from './components/EquipoTab';
import MisLogrosTab from './components/MisLogrosTab';

export default function EntrenarPage() {
  const [activeTab, setActiveTab] = useState<'equipo' | 'logros'>('equipo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🥊 Entrenar
          </h1>
          <p className="text-gray-300">Prepárate como los grandes campeones</p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-8 bg-black/50 p-2 rounded-xl backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('equipo')}
            className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 ${
              activeTab === 'equipo'
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/50 scale-105'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            👤 Mi Equipo
          </button>
          <button
            onClick={() => setActiveTab('logros')}
            className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 ${
              activeTab === 'logros'
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/50 scale-105'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🏆 Mis Logros
          </button>
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {activeTab === 'equipo' ? <EquipoTab /> : <MisLogrosTab />}
        </div>
      </div>
    </div>
  );
}