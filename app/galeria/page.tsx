// Componente para cada boxeador en la Galería
function TarjetaLeyenda({ boxeador }: { boxeador: any }) {
  return (
    <div className="bg-zinc-900 rounded-[2.5rem] border-2 border-zinc-800 overflow-hidden p-6 hover:border-yellow-500 transition-all group">
      {/* Encabezado: Nombre y Apodo */}
      <div className="mb-4">
        <h3 className="text-2xl font-black uppercase italic text-white group-hover:text-yellow-500 transition-colors">
          {boxeador.nombre}
        </h3>
        {boxeador.apodo && (
          <p className="text-yellow-500/60 text-xs font-bold uppercase tracking-widest">
            "{boxeador.apodo}"
          </p>
        )}
      </div>

      {/* Mini Ficha Técnica Rápida */}
      <div className="space-y-3">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
          <span className="text-[10px] text-zinc-500 font-black uppercase">Récord</span>
          <span className="text-sm font-bold text-zinc-200">
            {boxeador["record (V-D-E / KO)"]}
          </span>
        </div>

        <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
          <span className="text-[10px] text-zinc-500 font-black uppercase">Categoría</span>
          <span className="text-sm font-bold text-zinc-200">
            {boxeador["peso (kg/lbs)"]}
          </span>
        </div>

        <div className="flex justify-between items-end">
          <span className="text-[10px] text-zinc-500 font-black uppercase">Alcance</span>
          <span className="text-sm font-bold text-zinc-200">
            {boxeador["altura/alcance (cm)"]}
          </span>
        </div>
      </div>

      {/* Títulos en la parte inferior */}
      <div className="mt-4 pt-4 border-t-2 border-yellow-500/20">
        <p className="text-[9px] text-zinc-500 font-black uppercase mb-1">Palmarés</p>
        <p className="text-xs text-zinc-300 italic line-clamp-2">
          {boxeador["títulos de campeón"]}
        </p>
      </div>
    </div>
  );
}