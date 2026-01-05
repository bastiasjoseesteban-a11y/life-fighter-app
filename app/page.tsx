'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Dumbbell, 
  Info, 
  MessageSquare, 
  ShoppingCart, 
  X, 
  History, 
  AlertTriangle, 
  Trophy, 
  Send, 
  CheckCircle2 
} from 'lucide-react';

export default function Portada() {
  // Estados para controlar los modales
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  
  // Estados para el flujo de Feedback
  const [pasoFeedback, setPasoFeedback] = useState<'menu' | 'formulario' | 'exito'>('menu');
  const [tipoFeedback, setTipoFeedback] = useState('');

  const categoriasFeedback = [
    { 
      id: 'historico', 
      icon: <History size={28} />, 
      titulo: 'Sugerencias y Correcciones', 
      sub: 'Datos incorrectos o desactualizados' 
    },
    { 
      id: 'tecnico', 
      icon: <AlertTriangle size={28} />, 
      titulo: 'Reporte Técnico', 
      sub: 'Fallos, errores o mal funcionamiento' 
    },
    { 
      id: 'propuesta', 
      icon: <Trophy size={28} />, 
      titulo: 'Propuesta de Boxeador', 
      sub: 'Sugerí nuevas leyendas al catálogo' 
    },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-black overflow-hidden font-sans relative text-white">
      
      {/* --- HEADER PROFESIONAL --- */}
      <header className="h-32 border-b border-zinc-900 flex items-center justify-between px-10 bg-black z-10">
        <button 
          onClick={() => setMostrarInfo(true)}
          className="text-zinc-600 hover:text-orange-500 transition-colors flex flex-col items-center"
        >
          <Info size={40} />
          <span className="text-[10px] font-black uppercase mt-1 text-zinc-500 tracking-tighter">Info</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-orange-500 font-black text-6xl italic tracking-tighter leading-none">
            LIFE FIGHTER
          </h1>
          <p className="text-sm text-zinc-400 font-bold tracking-[0.3em] uppercase mt-2">
            Entrena como una leyenda
          </p>
        </div>

        <button 
          onClick={() => { setMostrarFeedback(true); setPasoFeedback('menu'); }}
          className="text-zinc-600 hover:text-orange-500 transition-colors flex flex-col items-center"
        >
          <MessageSquare size={40} />
          <span className="text-[10px] font-black uppercase mt-1 text-zinc-500 tracking-tighter">Feedback</span>
        </button>
      </header>

      {/* --- CUERPO PRINCIPAL 50/50 --- */}
      <div className="flex-1 flex w-full relative">
        
        {/* LEYENDAS */}
        <Link 
          href="/boxeador" 
          className="w-1/2 h-full bg-zinc-950 border-r border-zinc-900 flex flex-col justify-center items-center gap-8 hover:bg-zinc-900 transition-all p-6 text-center group"
        >
          <div className="bg-zinc-900 p-10 rounded-full border-2 border-orange-500/10 group-hover:border-orange-500 transition-all shadow-2xl">
            <BookOpen size={90} className="text-orange-500" />
          </div>
          <h2 className="text-5xl font-black uppercase italic text-white leading-none">
            Galería de<br/><span className="text-orange-500">Leyendas</span>
          </h2>
        </Link>

        {/* A ENTRENAR */}
        <Link 
          href="/entrenar" 
          className="w-1/2 h-full bg-orange-600 flex flex-col justify-center items-center gap-8 hover:bg-orange-700 transition-all p-6 text-center shadow-[inset_20px_0px_50px_rgba(0,0,0,0.2)]"
        >
          <div className="bg-white/10 p-10 rounded-full border-2 border-white/20 shadow-2xl">
            <Dumbbell size={90} className="text-white" />
          </div>
          <h2 className="text-5xl font-black uppercase italic text-white leading-none">
            A<br/>Entrenar
          </h2>
        </Link>

        {/* CARRITO ABAJO A LA IZQUIERDA */}
        <div className="absolute bottom-4 left-4 z-20">
          <button className="bg-zinc-900 text-orange-500 p-3 rounded-xl border border-zinc-800 hover:border-orange-500 transition-all flex flex-col items-center group shadow-xl">
            <ShoppingCart size={28} className="group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white mt-1">Tienda</span>
          </button>
        </div>
      </div>

      {/* --- MODAL DE INFORMACIÓN (BRÚJULA) --- */}
      {mostrarInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border-2 border-zinc-800 w-full max-w-xl rounded-[3rem] p-10 relative shadow-2xl">
            <button onClick={() => setMostrarInfo(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
              <X size={35} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-500/10 p-5 rounded-full mb-8">
                <Info size={45} className="text-orange-500" />
              </div>
              <h2 className="text-white font-black text-3xl italic uppercase mb-8 tracking-tighter">Información <span className="text-orange-500">Importante</span></h2>
              <div className="space-y-6">
                <p className="text-xl text-white font-bold leading-tight italic">"El deseo de LIFE FIGHTER es buscar la iniciativa para la práctica del boxeo y promover el bienestar físico y mental."</p>
                <p className="text-zinc-400 italic text-md border-l-2 border-orange-500 px-6 py-2 bg-white/5">Es un indicativo, una dirección como marca la brújula; no es un entrenamiento, alimentación ni filosofía de vida definitiva.</p>
                <div className="pt-4 space-y-4 text-sm text-zinc-300">
                  <p>Esta aplicación <span className="text-white font-bold">no reemplaza</span> el entrenamiento profesional, la planificación personalizada ni el asesoramiento médico o nutricional.</p>
                  <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">Contenidos orientativos e informativos</p>
                </div>
                <div className="pt-6 border-t border-zinc-800">
                  <p className="text-white text-lg">Siempre entrená bajo la supervisión de tu <span className="text-orange-500 font-black italic">entrenador</span> y profesionales de la salud.</p>
                  <p className="font-black italic text-2xl text-white mt-2 uppercase tracking-tighter">Nadie te conoce mejor que ellos.</p>
                </div>
              </div>
              <button onClick={() => setMostrarInfo(false)} className="mt-10 bg-orange-600 text-white font-black py-4 px-12 rounded-2xl uppercase transition-all shadow-lg">Entendido</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE FEEDBACK (CENTRO COLABORATIVO) --- */}
      {mostrarFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in zoom-in duration-200">
          <div className="bg-zinc-900 border-2 border-zinc-800 w-full max-w-2xl rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
            <button onClick={() => setMostrarFeedback(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"><X size={35}/></button>

            {/* PASO 1: MENÚ DE CATEGORÍAS */}
            {pasoFeedback === 'menu' && (
              <div className="animate-in slide-in-from-bottom-4 duration-300">
                <div className="text-center mb-8">
                  <h2 className="text-white font-black text-3xl uppercase italic tracking-tighter">Participación de la <span className="text-orange-500">Comunidad</span></h2>
                  <p className="text-zinc-500 text-sm mt-3 font-medium">Life Fighter es un proyecto colaborativo. Tu participación ayuda a mejorar la calidad de la información para todos.</p>
                </div>
                <div className="grid gap-4">
                  {categoriasFeedback.map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => { setTipoFeedback(cat.titulo); setPasoFeedback('formulario'); }}
                      className="flex items-center gap-6 p-6 bg-black/40 border border-zinc-800 rounded-2xl hover:border-orange-500 transition-all group text-left"
                    >
                      <div className="text-orange-500 group-hover:scale-110 transition-transform">{cat.icon}</div>
                      <div>
                        <h4 className="font-black uppercase italic text-lg text-white">{cat.titulo}</h4>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.15em]">{cat.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 2: FORMULARIO */}
            {pasoFeedback === 'formulario' && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-orange-500 font-black text-xl uppercase italic mb-6">Enviando: {tipoFeedback}</h3>
                <textarea 
                  placeholder="Describí tu aporte aquí... Nuestro equipo revisará la información enviada antes de realizar cualquier modificación."
                  className="w-full h-48 bg-black border border-zinc-800 rounded-2xl p-6 text-white outline-none focus:border-orange-500 transition-all font-medium mb-6 resize-none"
                />
                <div className="flex gap-4">
                  <button onClick={() => setPasoFeedback('menu')} className="flex-1 py-4 bg-zinc-800 rounded-xl font-black text-xs uppercase text-zinc-400">Atrás</button>
                  <button onClick={() => setPasoFeedback('exito')} className="flex-[2] py-4 bg-orange-600 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20">
                    <Send size={16}/> Enviar Información
                  </button>
                </div>
                <p className="text-[10px] text-zinc-600 mt-6 text-center uppercase font-bold tracking-widest border-t border-zinc-800 pt-4 italic">
                  Life Fighter es una aplicación informativa y educativa.
                </p>
              </div>
            )}

            {/* PASO 3: ÉXITO - AGRADECIMIENTO FINAL */}
            {pasoFeedback === 'exito' && (
              <div className="text-center py-10 animate-in zoom-in duration-500">
                <div className="flex justify-center mb-8">
                  <div className="bg-orange-500/10 p-6 rounded-full">
                    <CheckCircle2 size={90} className="text-orange-500 animate-pulse" />
                  </div>
                </div>
                <h2 className="text-4xl font-black uppercase italic mb-4 text-white tracking-tighter">
                  ¡Gracias por tu <span className="text-orange-500">colaboración</span>!
                </h2>
                <div className="max-w-sm mx-auto space-y-4">
                  <p className="text-zinc-400 font-medium leading-relaxed">
                    Tu participación ayuda a mejorar la calidad de la información y la experiencia de uso para toda la comunidad.
                  </p>
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest pt-4 border-t border-zinc-800">
                    Gracias por contribuir al crecimiento de Life Fighter y al desarrollo de una comunidad respetuosa del boxeo.
                  </p>
                </div>
                <button 
                  onClick={() => setMostrarFeedback(false)} 
                  className="mt-10 bg-white text-black font-black px-14 py-4 rounded-2xl uppercase tracking-tighter hover:bg-orange-500 hover:text-white transition-all shadow-xl"
                >
                  Regresar al Inicio
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}