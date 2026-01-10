import Link from 'next/link';
import { Info, X, ShieldAlert, Dumbbell } from 'lucide-react';

export default function InformacionPage() {
  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm">
      
      {/* CONTENEDOR PRINCIPAL - ESTILO CARD MODAL */}
      <div className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in zoom-in duration-300">
        
        {/* BOTÓN CERRAR */}
        <Link href="/" className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
          <X className="w-8 h-8" />
        </Link>

        <div className="flex flex-col items-center text-center gap-6">
          
          {/* ICONO SUPERIOR */}
          <div className="w-16 h-16 rounded-full bg-[#FF4D00]/20 flex items-center justify-center border border-[#FF4D00]/40">
            <Info className="w-8 h-8 text-[#FF4D00]" />
          </div>

          <h2 className="text-white font-black italic text-3xl md:text-4xl tracking-tighter">
            INFORMACIÓN <span className="text-[#FF4D00]">IMPORTANTE</span>
          </h2>

          {/* CUERPO DE TEXTO */}
          <div className="space-y-6 text-balance">
            <p className="text-white text-lg font-bold leading-tight italic">
              "El deseo de LIFE FIGHTER es buscar la iniciativa para la práctica del boxeo y promover el bienestar físico y mental."
            </p>

            <div className="bg-white/5 border-l-4 border-[#FF4D00] p-4 rounded-r-xl">
              <p className="text-white/60 text-sm font-medium italic">
                Es un indicativo informativo; no constituye un entrenamiento, plan de alimentación ni filosofía de vida definitiva.
              </p>
            </div>

            <div className="flex flex-col gap-4 text-white/80">
              <div className="flex items-start gap-3 text-left">
                <ShieldAlert className="w-5 h-5 text-[#FF4D00] shrink-0 mt-1" />
                <p className="text-sm font-semibold">
                  Esta aplicación <span className="text-white underline underline-offset-4">no reemplaza</span> el entrenamiento profesional, la planificación personalizada ni el asesoramiento médico.
                </p>
              </div>

              <div className="flex items-start gap-3 text-left">
                <Dumbbell className="w-5 h-5 text-[#00FBFF] shrink-0 mt-1" />
                <p className="text-sm font-semibold">
                  Siempre entrená bajo la supervisión de tu <span className="text-[#FF4D00]">entrenador</span> y profesionales de la salud.
                </p>
              </div>
            </div>

            <p className="text-white font-black text-xl italic tracking-tight mt-4 uppercase">
              Nadie te conoce mejor que ellos.
            </p>
          </div>

          {/* BOTÓN DE CIERRE/ENTENDIDO */}
          <Link 
            href="/" 
            className="w-full py-5 bg-[#FF4D00] rounded-full text-white font-black italic text-xl shadow-[0_0_20px_rgba(255,77,0,0.3)] active:scale-95 transition-all mt-4"
          >
            ENTENDIDO
          </Link>
        </div>
      </div>
    </div>
  );
}