'use client'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LifeFighter() {
  const [boxeadores, setBoxeadores] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    async function traerDatos() {
      const { data, error } = await supabase.from('boxeadores').select('*')
      if (error) console.error("Error al traer datos:", error)
      if (data) setBoxeadores(data)
    }
    traerDatos()
  }, [])

  const filtrados = boxeadores.filter(b => 
    b.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <main className="min-h-screen p-8 bg-black text-white font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-2 text-center text-yellow-500 italic uppercase">
          Life Fighter
        </h1>
        <p className="text-center text-gray-400 mb-10 tracking-widest uppercase text-sm">Enciclopedia de Campeones</p>
        
        {/* BUSCADOR */}
        <div className="max-w-md mx-auto mb-12 relative">
          <input 
            type="text"
            placeholder="Buscar por nombre (ej: Tyson, Acuña...)"
            className="w-full p-4 pl-6 rounded-full bg-gray-900 border-2 border-yellow-600 focus:border-yellow-400 focus:outline-none transition-all text-lg shadow-[0_0_15px_rgba(202,138,4,0.3)]"
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <span className="absolute right-6 top-4 opacity-50 text-xl">🔍</span>
        </div>

        {/* GRILLA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtrados.map(box => (
            <div key={box.id} className="group p-6 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-yellow-500 transition-all duration-300 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                 <h2 className="text-2xl font-black text-white group-hover:text-yellow-500 transition-colors uppercase">{box.nombre}</h2>
                 <span className="text-[10px] bg-yellow-600 px-2 py-1 rounded-full text-black font-bold uppercase tracking-tighter">
                   {box.seccion}
                 </span>
              </div>
              <p className="text-gray-400 italic mb-6 text-sm leading-relaxed leading-snug">
                "{box.biografia}"
              </p>
              <div className="border-t border-zinc-800 pt-4">
                 <span className="text-yellow-600 text-[10px] font-black uppercase tracking-[0.2em]">Régimen Nutricional:</span>
                 <p className="text-xs text-gray-500 mt-2 italic">{box.dieta}</p>
              </div>
            </div>
          ))}
        </div>

        {filtrados.length === 0 && boxeadores.length > 0 && (
          <p className="text-center text-gray-500 mt-10">No se encontró ningún guerrero con ese nombre...</p>
        )}
      </div>
    </main>
  )
}