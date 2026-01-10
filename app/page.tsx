import Link from 'next/link';
import Image from 'next/image';
import { Info, ShoppingCart, RefreshCcw } from 'lucide-react';

export default function HomePage() {
  return (
    /* Layout bloqueado para evitar scroll innecesario */
    <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col bg-black font-sans select-none z-[9999] p-4">
      
      {/* HEADER: MÁXIMO CONTRASTE */}
      <header className="relative w-full max-w-7xl mx-auto pt-6 pb-4 z-20">
        <div className="w-full flex justify-between items-center bg-[#111]/90 backdrop-blur-xl rounded-full px-8 py-5 border border-white/10 shadow-2xl">
          
          <Link href="/informacion" className="p-3 bg-[#00FBFF] rounded-full shadow-[0_0_20px_rgba(0,251,255,0.8)] active:scale-90 transition-all">
            <Info className="w-9 h-9 text-black stroke-[3.5]" />
          </Link>

          <div className="flex flex-col items-center">
            <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter leading-none text-center">
              <span className="bg-gradient-to-b from-[#FFF000] via-[#FF8A00] to-[#FF2D00] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,45,0,0.5)]">
                LIFE FIGHTER
              </span>
            </h1>
          </div>

          {/* FEEDBACK: Vuelve a ser un link directo a su página propia */}
          <Link href="/feedback" className="p-3 bg-[#FF4D00] rounded-full shadow-[0_0_20px_rgba(255,77,0,0.8)] active:scale-90 transition-all">
            <RefreshCcw className="w-9 h-9 text-white stroke-[3]" />
          </Link>
        </div>
      </header>

      {/* MAIN: IMÁGENES CON BRILLO FULL (VIBRANTES) */}
      <main className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto h-full gap-4 pb-4">
        
        {/* BOTÓN LEYENDAS - BRILLO TOTAL */}
        <Link 
          href="/boxeador" 
          className="flex-1 relative flex flex-col items-center justify-center bg-black rounded-[3.5rem] border-2 border-[#00FBFF]/60 group overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(0,251,255,0.15)]"
        >
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://rptbzoytslnfmofksvhk.supabase.co/storage/v1/object/public/assets_app/galeria_de_leyendas.webp" 
              alt="Galería de Leyendas"
              fill
              className="object-cover opacity-100 group-hover:scale-105 transition-all duration-700"
              priority
            />
            {/* Overlay eliminado/minimizado para no opacar el diseño original */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </Link>

        {/* BOTÓN A ENTRENAR - BRILLO TOTAL */}
        <Link 
          href="/entrenar" 
          className="flex-1 relative flex flex-col items-center justify-center bg-black rounded-[3.5rem] border-2 border-white/30 group overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://rptbzoytslnfmofksvhk.supabase.co/storage/v1/object/public/assets_app/a_entrenar.webp" 
              alt="A Entrenar"
              fill
              className="object-cover opacity-100 group-hover:scale-105 transition-all duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </Link>
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-7xl mx-auto h-24 flex justify-start items-center relative z-30">
        <Link href="/tienda" className="active:scale-95 transition-all">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#EAD8B1] to-[#D4AF37] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] border-4 border-white/20">
            <ShoppingCart className="w-12 h-12 text-black stroke-[3]" />
          </div>
        </Link>
      </footer>
    </div>
  );
}