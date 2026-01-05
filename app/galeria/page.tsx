"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function GaleriaPage() {
  const [leyendas, setLeyendas] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeyendas = async () => {
      const { data } = await supabase.from('boxeadores').select('*').order('nombre');
      if (data) setLeyendas(data);
    };
    fetchLeyendas();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-5xl font-black italic mb-12 text-yellow-500 uppercase tracking-tighter">Galería de Leyendas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {leyendas.map((b) => (
          <div key={b.id} className="bg-zinc-900 border-2 border-zinc-800 p-8 rounded-[3rem] hover:border-yellow-500 transition-all">
            <h3 className="text-3xl font-black uppercase italic mb-1 leading-none">{b.nombre}</h3>
            <p className="text-yellow-500/60 text-xs font-black uppercase mb-6 italic tracking-widest">
              {b.apodo ? `"${b.apodo}"` : b.nacionalidad}
            </p>
            
            <div className="space-y-4">
              <FilaFicha label="Récord" valor={b["record (V-D-E / KO)"]} />
              <FilaFicha label="Títulos" valor={b["títulos de campeón"]} />
              <FilaFicha label="Peso" valor={b["peso (kg/lbs)"]} />
              <FilaFicha label="Altura" valor={b["altura/alcance (cm)"]} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function FilaFicha({ label, valor }: any) {
  return (
    <div className="border-l-2 border-yellow-500/30 pl-4">
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
      <p className="text-lg font-bold text-white italic leading-tight">{valor || '---'}</p>
    </div>
  );
}