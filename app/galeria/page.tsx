"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Trophy, Globe, Activity, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function GaleriaPage() {
  const [leyendas, setLeyendas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState<'cargando' | 'error' | 'vacio' | 'listo'>('cargando');
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setEstado('error');
      setMensajeError('Faltan las llaves de configuración.');
      return;
    }

    const fetchLeyendas = async () => {
      try {
        // Usamos la tabla 'boxeadores_completo' que es la que tiene todos los datos
        const { data, error } = await supabase
          .from('boxeadores_completo')
          .select('*')
          .order('id');
        
        if (error) throw error;

        if (!data || data.length === 0) {
          setEstado('vacio');
        } else {
          setLeyendas(data);
          setEstado('listo');
        }
      } catch (err: any) {
        setEstado('error');
        setMensajeError(err.message);
      }
    };

    fetchLeyendas();
  }, []);

  // --- LÓGICA DE FILTRADO INTELIGENTE (ARG, MEX, ETC) ---
  const filtrados = leyendas.filter(b => {
    const q = busqueda.toLowerCase().trim();
    const nombre = b.nombre?.toLowerCase() || "";
    const apodo = b.apodo?.toLowerCase() || "";
    const nacionalidad = b.nacionalidad?.toLowerCase() || "";

    return (
      nombre.includes(q) || 
      apodo.includes(q) || 
      nacionalidad.includes(q) ||
      (q === 'arg' && nacionalidad.includes('argentina')) ||
      (q === 'mex' && nacionalidad.includes('méxico')) ||
      (q === 'usa' && nacionalidad.includes('estadounidense'))
    );
  });

  if (estado === 'cargando') return (
    <div className="min-h-screen bg-black text-[#00FBFF] flex items-center justify-center font-black animate-pulse uppercase tracking-[0.3em]">
      Entrando al Gimnasio...
    </div>
  );
  
  if (estado === 'error') return (
    <div className="min-h-screen bg-black text-red-500 p-10 flex flex-col items-center justify-center text-center">
      <h2 className="text-4xl font-black mb-4 uppercase italic">Error de Conexión</h2>
      <p className="text-zinc-400 max-w-md font-bold">{mensajeError}</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24">
      {/* HEADER & BUSCADOR */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-6xl font-black italic mb-2 text-white uppercase tracking-tighter">
          Galería de <span className="text-[#00FBFF]">Leyendas</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.3em] mb-8">
          Elige a tu maestro para entrenar
        </p>

        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="text"
            placeholder="Busca por nombre o país (ej: ARG)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder:text-zinc-600 focus:outline-none focus:border-[#00FBFF] transition-all"
          />
        </div>
      </div>

      {/* GRILLA DE BOXEADORES */}
      {filtrados.length === 0 ? (
        <div className="text-center py-20 text-zinc-700 font-black uppercase italic text-2xl">
          No se encontraron boxeadores
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((b) => (
            <div 
              key={b.id} 
              className="group bg-zinc-900 border-2 border-zinc-800 p-8 rounded-[3rem] hover:border-[#00FBFF] transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-zinc-800 px-3 py-1 rounded-full text-[10px] font-black uppercase text-zinc-400">
                    {b.categoria}
                  </div>
                  <Globe className="text-zinc-700 group-hover:text-[#00FBFF] transition-colors" size={18} />
                </div>

                <h3 className="text-3xl font-black uppercase italic text-white leading-none mb-1 group-hover:text-[#00FBFF] transition-colors">
                  {b.nombre}
                </h3>
                <p className="text-[#00FBFF] text-[10px] font-black uppercase tracking-widest mb-6">
                  "{b.apodo || 'The Warrior'}"
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Activity size={16} className="text-zinc-600" />
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Record: {b.record}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Trophy size={16} className="text-zinc-600 mt-1" />
                    <span className="text-[11px] font-medium text-zinc-500 italic leading-snug">
                      {b.titulos}
                    </span>
                  </div>
                </div>
              </div>

              <Link 
                href={`/entrenar/${b.id}`}
                className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase italic flex items-center justify-center gap-2 group-hover:bg-[#00FBFF] transition-all active:scale-95"
              >
                Entrenar con él <ChevronRight size={20} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}