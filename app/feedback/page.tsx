"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MessageSquare, AlertTriangle, Star, ChevronLeft, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// CLIENTE DE SUPABASE: Conexión directa y rápida
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function FeedbackPage() {
  const [tipo, setTipo] = useState<'sugerencia' | 'error' | 'propuesta' | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const enviarFeedback = async () => {
    if (!tipo || !mensaje) return;
    setEnviando(true);

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{ 
          tipo: tipo, 
          mensaje: mensaje, 
          estado: 'pendiente' 
        }]);

      if (error) throw error;
      
      setEnviado(true);
      setMensaje('');
      setTipo(null);
    } catch (error) {
      console.error('Error enviando feedback:', error);
      alert('Error de conexión. Verifica tus variables de entorno.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-[9999] overflow-y-auto font-sans select-none">
      
      {/* HEADER FIJO */}
      <header className="sticky top-0 bg-black/80 backdrop-blur-md p-6 z-10 border-b border-white/5">
        <div className="flex justify-between items-center max-w-4xl mx-auto w-full">
          <Link href="/" className="p-3 bg-white/10 rounded-full active:scale-90 transition-all border border-white/10">
            <ChevronLeft className="text-white w-7 h-7" />
          </Link>
          <h2 className="text-[#D4AF37] font-black italic text-2xl md:text-3xl tracking-tighter drop-shadow-lg">
            CENTRO DE FEEDBACK
          </h2>
          <div className="w-12" />
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col max-w-4xl mx-auto w-full">
        {!enviado ? (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <p className="text-white/40 font-black uppercase text-xs tracking-[0.3em] text-center">
              Selecciona el tipo de reporte
            </p>
            
            {/* LAS 3 CATEGORÍAS TÉCNICAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* SUGERENCIAS */}
              <button 
                type="button"
                onClick={() => setTipo('sugerencia')}
                className={`group p-6 rounded-[2rem] border-2 flex flex-col items-center text-center gap-4 transition-all duration-300 ${tipo === 'sugerencia' ? 'border-[#00FBFF] bg-[#00FBFF]/10 shadow-[0_0_25px_rgba(0,251,255,0.2)]' : 'border-white/5 bg-[#0a0a0a]'}`}
              >
                <div className={`p-4 rounded-2xl ${tipo === 'sugerencia' ? 'bg-[#00FBFF] text-black' : 'bg-white/5 text-white'}`}>
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white font-black italic text-[13px] leading-tight">SUGERENCIAS Y<br/>CORRECCIONES</span>
                  <span className="text-white/30 text-[9px] font-bold uppercase leading-tight mt-1">Datos incorrectos o desactualizados</span>
                </div>
              </button>

              {/* REPORTE TÉCNICO */}
              <button 
                type="button"
                onClick={() => setTipo('error')}
                className={`group p-6 rounded-[2rem] border-2 flex flex-col items-center text-center gap-4 transition-all duration-300 ${tipo === 'error' ? 'border-red-500 bg-red-500/10 shadow-[0_0_25px_rgba(239,68,68,0.2)]' : 'border-white/5 bg-[#0a0a0a]'}`}
              >
                <div className={`p-4 rounded-2xl ${tipo === 'error' ? 'bg-red-500 text-white' : 'bg-white/5 text-white'}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white font-black italic text-[13px] leading-tight">REPORTE<br/>TÉCNICO</span>
                  <span className="text-white/30 text-[9px] font-bold uppercase leading-tight mt-1">Fallos, errores o mal funcionamiento</span>
                </div>
              </button>

              {/* PROPUESTA */}
              <button 
                type="button"
                onClick={() => setTipo('propuesta')}
                className={`group p-6 rounded-[2rem] border-2 flex flex-col items-center text-center gap-4 transition-all duration-300 ${tipo === 'propuesta' ? 'border-[#FFF000] bg-[#FFF000]/10 shadow-[0_0_25px_rgba(255,240,0,0.2)]' : 'border-white/5 bg-[#0a0a0a]'}`}
              >
                <div className={`p-4 rounded-2xl ${tipo === 'propuesta' ? 'bg-[#FFF000] text-black' : 'bg-white/5 text-white'}`}>
                  <Star className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white font-black italic text-[13px] leading-tight">PROPUESTA DE<br/>BOXEADOR</span>
                  <span className="text-white/30 text-[9px] font-bold uppercase leading-tight mt-1">Sugerir nuevas leyendas al catálogo</span>
                </div>
              </button>
            </div>

            {/* CAJA DE TEXTO */}
            <div className="relative group">
              <textarea 
                placeholder="Describe los detalles aquí..."
                className="w-full h-56 bg-[#0a0a0a] border-2 border-white/5 rounded-[2.5rem] p-8 text-white font-medium focus:border-[#00FBFF]/50 transition-all outline-none resize-none shadow-inner"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
              />
              <div className="absolute bottom-6 right-8 text-white/20 font-black italic text-xs uppercase tracking-widest">
                Life Fighter System
              </div>
            </div>

            {/* BOTÓN ACCIÓN */}
            <button 
              disabled={!tipo || !mensaje || enviando}
              onClick={enviarFeedback}
              className="group relative w-full py-7 bg-[#FF4D00] rounded-full overflow-hidden transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
            >
              <div className="relative z-10 flex items-center justify-center gap-4 text-white font-black italic text-2xl tracking-tighter">
                {enviando ? (
                  <span className="animate-pulse">PROCESANDO...</span>
                ) : (
                  <>
                    <Send className="w-7 h-7 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                    ENVIAR REPORTE
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        ) : (
          /* PANTALLA DE ÉXITO */
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 animate-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00FBFF] blur-[40px] opacity-20 animate-pulse" />
              <div className="relative w-32 h-32 bg-[#00FBFF] rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(0,251,255,0.4)]">
                <CheckCircle2 className="w-16 h-16 text-black" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-white text-6xl font-black italic tracking-tighter">¡RECIBIDO!</h3>
              <p className="text-[#D4AF37] font-black uppercase tracking-[0.2em] text-sm">Tu reporte ha sido procesado</p>
            </div>
            <button 
              onClick={() => setEnviado(false)} 
              className="mt-4 px-10 py-4 border-2 border-white/10 rounded-full text-white/40 font-black italic hover:text-white hover:border-white/40 transition-all"
            >
              ENVIAR OTRO REPORTE
            </button>
          </div>
        )}
      </main>

      {/* DECORACIÓN DE FONDO */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#FF4D00]/5 to-transparent pointer-events-none -z-10" />
    </div>
  );
}