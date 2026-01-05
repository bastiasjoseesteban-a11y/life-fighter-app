'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  History, 
  Trophy, 
  RefreshCw,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

// USA LAS MISMAS LLAVES QUE EN LA HOME
const supabaseUrl = 'https://tu-proyecto.supabase.co';
const supabaseAnonKey = 'tu-llave-anon-aqui';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Feedback {
  id: string;
  created_at: string;
  tipo: string;
  mensaje: string;
  estado: string;
}

export default function AdminPanel() {
  const [mensajes, setMensajes] = useState<Feedback[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarFeedback = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setMensajes(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarFeedback();
  }, []);

  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    const { error } = await supabase
      .from('feedback')
      .update({ estado: nuevoEstado })
      .eq('id', id);
    
    if (!error) cargarFeedback();
  };

  const eliminarFeedback = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este reporte?')) return;
    const { error } = await supabase.from('feedback').delete().eq('id', id);
    if (!error) cargarFeedback();
  };

  const getIcono = (tipo: string) => {
    if (tipo.includes('Técnico')) return <AlertTriangle className="text-red-500" />;
    if (tipo.includes('Sugerencia')) return <History className="text-blue-500" />;
    return <Trophy className="text-orange-500" />;
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      {/* HEADER ADMIN */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-zinc-500 hover:text-white transition-colors">
            <ChevronLeft size={32} />
          </Link>
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
              Panel <span className="text-orange-500">Admin</span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Gestión de comunidad</p>
          </div>
        </div>
        
        <button 
          onClick={cargarFeedback}
          className="bg-zinc-900 hover:bg-zinc-800 p-3 rounded-full transition-all"
        >
          <RefreshCw size={24} className={cargando ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* LISTADO DE MENSAJES */}
      <div className="max-w-6xl mx-auto grid gap-4">
        {mensajes.length === 0 && !cargando && (
          <div className="text-center py-20 bg-zinc-950 rounded-3xl border border-dashed border-zinc-800">
            <p className="text-zinc-500 font-bold uppercase">No hay mensajes pendientes</p>
          </div>
        )}

        {mensajes.map((m) => (
          <div 
            key={m.id} 
            className={`p-6 rounded-3xl border transition-all ${
              m.estado === 'resuelto' ? 'bg-zinc-950 border-zinc-900 opacity-60' : 'bg-zinc-900 border-zinc-800 shadow-xl'
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-4">
                <div className="bg-black p-3 rounded-2xl h-fit">
                  {getIcono(m.tipo)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
                      {m.tipo}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold">
                      {new Date(m.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-zinc-200 font-medium leading-relaxed mt-2 text-lg">
                    {m.mensaje}
                  </p>
                </div>
              </div>

              {/* ACCIONES */}
              <div className="flex gap-2">
                <button 
                  onClick={() => actualizarEstado(m.id, m.estado === 'resuelto' ? 'pendiente' : 'resuelto')}
                  className={`p-3 rounded-xl transition-all ${
                    m.estado === 'resuelto' ? 'bg-green-500/20 text-green-500' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                  title="Marcar como resuelto"
                >
                  {m.estado === 'resuelto' ? <CheckCircle size={20} /> : <Clock size={20} />}
                </button>
                <button 
                  onClick={() => eliminarFeedback(m.id)}
                  className="p-3 bg-zinc-800 text-zinc-400 hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-all"
                  title="Eliminar mensaje"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}