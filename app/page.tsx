'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Info, ShoppingCart, RefreshCcw, Crown, Home
} from 'lucide-react';

// Silueta que preferiste
const BoxerSilhouette = ({ className }: { className?: string }) => (
  <svg fill="currentColor" viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12,2A3,3 0 0,1 15,5C15,6.66 13.66,8 12,8C10.34,8 9,6.66 9,5A3,3 0 0,1 12,2M19,9.9C18.46,9.68 17.88,9.86 17.55,10.33C16.69,11.58 15.69,12.53 14.5,13.17L15.83,17.89C17.04,17.45 17.9,16.5 18.35,15.33C18.81,14.18 20.03,10.43 19,9.9M5,9.9C3.97,10.43 5.19,14.18 5.65,15.33C6.1,16.5 6.96,17.45 8.17,17.89L9.5,13.17C8.31,12.53 7.31,11.58 6.45,10.33C6.12,9.86 5.54,9.68 5,9.9M12,9C10,9 8.19,9.78 6.86,11.08C7.88,12.77 9.25,14.12 10.91,14.95L9.5,20H11.5L13,15H11L12.5,20H14.5L13.09,14.95C14.75,14.12 16.12,12.77 17.14,11.08C15.81,9.78 14,9 12,9Z" />
  </svg>
);

export default function HomePage() {
  const [showTienda, setShowTienda] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  const handleButtonPress = (buttonName: string) => {
    setPressedButton(buttonName);
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
    setTimeout(() => setPressedButton(null), 150);
  };

  // VISTA: TIENDA EN CONSTRUCCIÓN
  if (showTienda) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="relative w-[414px] h-[736px] bg-[#0A0F14] rounded-[30px] border border-gray-900 flex flex-col">
          {/* Header Tienda con Logo Cian y Casita */}
          <div className="p-8">
            <button 
              onClick={() => setShowTienda(false)} 
              className="flex items-center gap-3 active:scale-95 transition-transform"
            >
              <div className="flex flex-col text-left leading-[0.8] font-black italic text-[#00FBFF] text-xl tracking-tighter">
                <span>LIFE</span>
                <span>FIGHTER</span>
              </div>
              <Home className="w-10 h-10 text-[#00FBFF]" strokeWidth={2.5} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
             <ShoppingCart className="w-24 h-24 text-gray-800 mb-6 opacity-20" />
             <h2 className="text-3xl font-black text-white italic tracking-widest uppercase">
               Tienda en Construcción
             </h2>
             <div className="w-16 h-1 bg-[#00FBFF] mt-6 shadow-[0_0_10px_#00FBFF]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black font-sans select-none flex items-center justify-center">
      
      <div className="relative w-[414px] h-[736px] bg-[#0A0F14] overflow-hidden shadow-2xl border border-gray-900 rounded-[30px]">
        
        {/* HEADER */}
        <div className="h-[110px] flex items-center justify-between px-5 border-b border-gray-900/80 bg-black/40 backdrop-blur-md">
          <Link href="/informacion" className="p-2 active:scale-95 transition-transform">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00FBFF] rounded-lg blur-md opacity-30"></div>
              <Info className="w-6 h-6 text-[#00FBFF] relative z-10" strokeWidth={2.5} />
            </div>
          </Link>

          <div className="flex flex-col items-center justify-center -mt-1">
            <h1 className="text-3xl font-black tracking-[0.2em] italic drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] text-center">
              {/* CAMBIO AQUÍ: Gradiente más anaranjado intenso */}
              <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                LIFE FIGHTER
              </span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#78866B] mt-1 border-t border-[#78866B]/30 pt-1">
              ENTRENA COMO UN CAMPEÓN
            </p>
          </div>

          <Link href="/feedback" className="p-2 active:scale-95 transition-transform">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00FF88] rounded-lg blur-md opacity-30"></div>
              <RefreshCcw className="w-6 h-6 text-[#00FF88] relative z-10" strokeWidth={2.5} />
            </div>
          </Link>
        </div>

        {/* MAIN MENU */}
        <div className="h-[552px] flex flex-col p-5 gap-5">
          
          {/* BOTÓN 1: GALERÍA DE LEYENDAS */}
          <Link
            href="/boxeador"
            className={`flex-1 relative rounded-3xl overflow-hidden transition-all duration-200 border-2 border-[#4AD5E7]/30 ${
              pressedButton === 'leyendas' ? 'scale-[0.98] brightness-125' : 'active:scale-[0.98]'
            }`}
            onTouchStart={() => handleButtonPress('leyendas')}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1A3A4A] via-[#0F1A25] to-[#050A0F]"></div>
            
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="relative h-20 w-full flex items-center justify-center">
                 <div className="relative w-64 h-16 flex items-center justify-center">
                    {/* Cuerpo ensanchado al centro */}
                    <div className="absolute w-full h-8 bg-gradient-to-r from-[#2A5A6A] via-[#4AD5E7] to-[#2A5A6A] opacity-80" 
                         style={{ clipPath: 'polygon(0 35%, 50% 0, 100% 35%, 100% 65%, 50% 100%, 0 65%)' }}>
                    </div>
                    {/* Extremos pequeños */}
                    <div className="absolute left-2 w-7 h-5 bg-[#0F1A25] border border-[#4AD5E7] rounded-sm flex items-center justify-center shadow-lg shadow-cyan-500/20">
                      <div className="w-3 h-3 border border-[#4AD5E7]/50 rounded-full"></div>
                    </div>
                    <div className="absolute right-2 w-10 h-6 flex items-center justify-around px-1">
                       <div className="w-1.5 h-1.5 bg-[#4AD5E7] rounded-full shadow-[0_0_5px_cyan]"></div>
                       <div className="w-1.5 h-1.5 bg-[#4AD5E7] rounded-full opacity-60"></div>
                       <div className="w-1.5 h-1.5 bg-[#4AD5E7] rounded-full opacity-30"></div>
                    </div>
                    {/* Hebilla Central */}
                    <div className="relative z-20 w-20 h-20 bg-[#0F1A25] rounded-full border-[3px] border-[#4AD5E7] flex items-center justify-center shadow-2xl">
                       <Crown className="w-10 h-10 text-[#E57300] fill-[#E57300]" />
                    </div>
                 </div>
              </div>

              <h2 className="text-[34px] font-black text-[#4AD5E7] text-center tracking-tight leading-[0.9] uppercase italic drop-shadow-[0_0_15px_rgba(74,213,231,0.7)]">
                GALERÍA DE<br />LEYENDAS
              </h2>
            </div>
          </Link>

          {/* BOTÓN 2: A ENTRENAR */}
          <Link
            href="/entrenar"
            className={`flex-1 relative rounded-3xl overflow-hidden transition-all duration-200 border-2 border-[#C83E2D]/40 ${
              pressedButton === 'entrenar' ? 'scale-[0.98] brightness-125' : 'active:scale-[0.98]'
            }`}
            onTouchStart={() => handleButtonPress('entrenar')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D84E3D] via-[#B63F32] to-[#8A2F26]"></div>
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center mt-1">
              <div className="relative mb-1">
                <BoxerSilhouette className="w-24 h-24 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] relative z-10" />
                <div className="absolute inset-0 bg-white/30 blur-xl rounded-full transform scale-75"></div>
              </div>
              <div className="text-center relative z-20 -mt-2">
                <p className="text-xl font-bold text-white/90 leading-none mb-1 drop-shadow-md">A</p>
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.85] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  ENTRENAR
                </h2>
              </div>
            </div>
            <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-3xl"></div>
          </Link>
        </div>

        {/* FOOTER: Botón de Tienda */}
        <div className="h-[74px] flex items-center justify-center border-t border-gray-900/80 bg-black/40 backdrop-blur-sm">
          <button 
            onClick={() => {
              handleButtonPress('tienda');
              setShowTienda(true);
            }} 
            className="relative active:scale-90 transition-transform group p-3"
          >
            <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(255,165,0,0.4)] border border-[#FFD700]/50">
              <ShoppingCart className="w-6 h-6 text-gray-900" strokeWidth={2.5} />
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}