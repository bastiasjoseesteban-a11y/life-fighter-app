"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Settings, UserX, ChevronLeft, AlertTriangle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ConfiguracionPage() {
  const router = useRouter();
  const [eliminando, setEliminando] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const eliminarCuenta = async () => {
    setEliminando(true);

    try {
      // Obtener sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('No hay sesión activa');
        return;
      }

      // Llamar a la Edge Function
      const { data, error } = await supabase.functions.invoke('delete-user-account', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        console.error('Error:', error);
        alert('Error al eliminar cuenta: ' + error.message);
        return;
      }

      // Cerrar sesión local
      await supabase.auth.signOut();
      
      // Redirigir a home
      alert('Tu cuenta ha sido eliminada exitosamente');
      router.push('/');

    } catch (error) {
      console.error('Error general:', error);
      alert('Error inesperado. Intenta nuevamente.');
    } finally {
      setEliminando(false);
      setMostrarConfirmacion(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-[9999] overflow-y-auto font-sans select-none">
      
      {/* HEADER */}
      <header className="sticky top-0 bg-black/80 backdrop-blur-md p-6 z-10 border-b border-white/5">
        <div className="flex justify-between items-center max-w-4xl mx-auto w-full">
          <Link href="/" className="p-3 bg-white/10 rounded-full active:scale-90 transition-all border border-white/10">
            <ChevronLeft className="text-white w-7 h-7" />
          </Link>
          <h2 className="text-[#D4AF37] font-black italic text-2xl md:text-3xl tracking-tighter drop-shadow-lg">
            CONFIGURACIÓN
          </h2>
          <div className="w-12" />
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col max-w-4xl mx-auto w-full gap-8">
        
        {/* SECCIÓN DE CUENTA */}
        <div className="bg-[#0a0a0a] border-2 border-white/5 rounded-[2rem] p-8 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/5 rounded-2xl">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-black italic text-xl">TU CUENTA</h3>
              <p className="text-white/40 text-sm font-bold">Gestiona tu información personal</p>
            </div>
          </div>
        </div>

        {/* ZONA PELIGROSA */}
        <div className="bg-red-500/5 border-2 border-red-500/20 rounded-[2rem] p-8 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-red-500/10 rounded-2xl">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-red-400 font-black italic text-xl">ZONA PELIGROSA</h3>
              <p className="text-white/40 text-sm font-bold">Acciones irreversibles</p>
            </div>
          </div>

          <div className="h-px bg-red-500/20" />

          {/* BOTÓN ELIMINAR CUENTA */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <UserX className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-white font-bold text-sm mb-1">Eliminar mi cuenta</h4>
                <p className="text-white/60 text-xs leading-relaxed">
                  Se borrarán permanentemente todos tus datos de entrenamiento, progreso, 
                  estadísticas y configuraciones. Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            {!mostrarConfirmacion ? (
              <button
                onClick={() => setMostrarConfirmacion(true)}
                className="w-full py-4 bg-red-500/10 border-2 border-red-500/30 rounded-2xl text-red-400 font-black italic text-sm hover:bg-red-500/20 hover:border-red-500/50 transition-all active:scale-95"
              >
                ELIMINAR MI CUENTA
              </button>
            ) : (
              <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <p className="text-red-300 font-bold text-sm">
                    ¿Estás completamente seguro?
                  </p>
                </div>
                <p className="text-white/70 text-xs leading-relaxed">
                  Esta acción es <strong className="text-red-400">permanente e irreversible</strong>. 
                  Perderás todo tu progreso, estadísticas, y no podrás recuperar tu cuenta.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setMostrarConfirmacion(false)}
                    disabled={eliminando}
                    className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 font-bold text-sm hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={eliminarCuenta}
                    disabled={eliminando}
                    className="flex-1 py-3 bg-red-500 border border-red-600 rounded-xl text-white font-black italic text-sm hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {eliminando ? (
                      <span className="animate-pulse">ELIMINANDO...</span>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        SÍ, ELIMINAR TODO
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* DECORACIÓN */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-500/5 to-transparent pointer-events-none -z-10" />
    </div>
  );
}