"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Esto lee directamente de las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default function GaleriaPage() {
  const [leyendas, setLeyendas] = useState<any[]>([]);
  const [estado, setEstado] = useState<'cargando' | 'error' | 'vacio' | 'listo'>('cargando');
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    // Verificación de llaves
    if (!supabaseUrl || !supabaseAnonKey) {
      setEstado('error');
      setMensajeError('Faltan las llaves de configuración (Variables de Entorno).');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const fetchLeyendas = async () => {
      try {
        const { data, error } = await supabase.from('boxeadores').select('*').order('id');
        
        if (error) {
          setEstado('error');
          setMensajeError(error.message);
        } else if (!data || data.length === 0) {
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

  if (estado === 'cargando') return <div className="min-h-screen bg-black text-yellow-500 flex items-center justify-center font-black">ENTRANDO AL GIMNASIO...</div>;
  
  if (estado === 'error') return (
    <div className="min-h-screen bg-black text-red-500 p-10 flex flex-col items-center justify-center text-center">
      <h2 className="text-4xl font-black mb-4">ERROR DE CONEXIÓN</h2>
      <p className="text-zinc-400 max-w-md">{mensajeError}</p>
    </div>
  );

  if (estado === 'vacio') return <div className="min-h-screen bg-black text-white flex items-center justify-center">No hay boxeadores en la base de datos.</div>;

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-black italic mb-10 text-yellow-500 uppercase tracking-tighter">Galería de Leyendas</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {leyendas.map((b) => (
          <div key={b.id} className="bg-zinc-900 border-2 border-zinc-800 p-6 rounded-[2.5rem]">
            <h3 className="text-2xl font-black uppercase italic text-yellow-500 leading-none mb-2">{b.nombre}</h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">{b["record (V-D-E / KO)"]}</p>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-zinc-300 italic">"{b["títulos de campeón"]}"</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}