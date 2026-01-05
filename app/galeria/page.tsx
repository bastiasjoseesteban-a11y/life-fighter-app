"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function GaleriaPage() {
  const [leyendas, setLeyendas] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeyendas = async () => {
      const { data, error } = await supabase.from('boxeadores').select('*').order('id');
      if (!error && data) setLeyendas(data);
    };
    fetchLeyendas();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-black italic mb-10 text-yellow-500 uppercase">Galería de Leyendas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leyendas.map((b) => (
          <div key={b.id} className="bg-zinc-900 border-2 border-zinc-800 p-6 rounded-[2.5rem]">
            <h3 className="text-2xl font-black uppercase italic leading-none mb-1">{b.nombre}</h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-6 italic">
              {b.apodo ? `"${b.apodo}"` : b.nacionalidad}
            </p>
            
            <div className="space-y-4">
              {/* Usamos corchetes para que Vercel no de error con los nombres del CSV */}
              <FichaFila label="Récord" valor={b["record (V-D-E / KO)"]} />
              <FichaFila label="Títulos" valor={b["títulos de campeón"]} />
              <FichaFila label="Peso" valor={b["peso (kg/lbs)"]} />
              <FichaFila label="Altura" valor={b["altura/alcance (cm)"]} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function FichaFila({ label, valor }: { label: string, valor: string }) {
  return (
    <div className="border-l-2 border-yellow-500/30 pl-4">
      <p className="text-[9px] font-black text-zinc-600 uppercase">{label}</p>
      <p className="text-sm font-bold text-zinc-200">{valor || '---'}</p>
    </div>
  );
}