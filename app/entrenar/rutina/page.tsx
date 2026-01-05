"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ChevronLeft, Play, Pause, RotateCcw, 
  User, Clock, Zap, Dumbbell, Award, Target
} from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EntrenarPage() {
  const [vista, setVista] = useState<'menu' | 'lista_ejercicios' | 'cronometro'>('menu');
  const [boxeadores, setBoxeadores] = useState<any[]>([]);
  const [boxeadorSeleccionado, setBoxeadorSeleccionado] = useState<any>(null);
  const [planEntrenamiento, setPlanEntrenamiento] = useState<any[]>([]);
  
  const [segundos, setSegundos] = useState(180);
  const [activo, setActivo] = useState(false);
  const [ejercicioActual, setEjercicioActual] = useState("");

  // 1. CARGAR BOXEADORES (Quitamos el filtro es_premium si no existe la columna)
  useEffect(() => {
    const fetchBoxers = async () => {
      const { data } = await supabase
        .from('boxeadores')
        .select('id, nombre, apodo, nacionalidad') // Traemos solo lo necesario
        .order('nombre');
      if (data) setBoxeadores(data);
    };
    fetchBoxers();
  }, []);

  // 2. CARGAR RUTINA REAL DESDE LA TABLA 'RUTINAS'
  useEffect(() => {
    if (boxeadorSeleccionado) {
      const fetchRutina = async () => {
        // Buscamos todos los rounds en la tabla rutinas
        const { data: rounds } = await supabase
          .from('rutinas')
          .select('*')
          .eq('boxeador_id', boxeadorSeleccionado.id)
          .order('round', { ascending: true });

        if (rounds && rounds.length > 0) {
          // Convertimos los rounds de la DB al formato del plan
          const planDesdeDB = rounds.map(r => ({
            id: r.id,
            t: r.ejercicio,
            d: r.descripcion_ejercicio,
            s: r.duracion_segundos || 180,
            icon: r.round === 1 ? <Zap /> : <Dumbbell />
          }));
          setPlanEntrenamiento(planDesdeDB);
        } else {
          // Plan de respaldo si no hay rutinas cargadas
          setPlanEntrenamiento([{ 
            id: 'default', t: "Sombra Libre", d: "Calentamiento general", s: 180, icon: <User /> 
          }]);
        }
      };
      fetchRutina();
    }
  }, [boxeadorSeleccionado]);

  // --- FUNCIONES DE AUDIO ---
  const sonarCampana = () => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(context.destination);
      osc.start(); osc.stop(context.currentTime + 1.5);
    } catch (e) { console.error("Audio block", e); }
  };

  const hablar = (texto: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- CRONÓMETRO ---
  useEffect(() => {
    let intervalo: any = null;
    if (activo && segundos > 0) {
      intervalo = setInterval(() => setSegundos(s => s - 1), 1000);
    } else if (segundos === 0 && activo) {
      setActivo(false);
      sonarCampana();
      hablar("Tiempo. Round completado.");
    }
    return () => clearInterval(intervalo);
  }, [activo, segundos]);

  const iniciarEjercicio = (ejercicio: any) => {
    setEjercicioActual(ejercicio.t);
    setSegundos(ejercicio.s);
    setVista('cronometro');
    setActivo(true);
    sonarCampana();
    hablar(`Iniciando: ${ejercicio.t}`);
  };

  // --- VISTA: SELECCIÓN ---
  if (vista === 'menu') {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <header className="flex items-center gap-4 mb-10 max-w-6xl mx-auto">
          <Link href="/" className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800"><ChevronLeft size={24}/></Link>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">ENTRENAR <span className="text-yellow-500">AHORA</span></h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {boxeadores.map(b => (
            <div key={b.id} onClick={() => { setBoxeadorSeleccionado(b); setVista('lista_ejercicios'); }}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] cursor-pointer hover:border-yellow-500 transition-all group">
              <User className="text-yellow-500 mb-4" size={32} />
              <h3 className="text-2xl font-black uppercase italic leading-none">{b.nombre}</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase mt-2 tracking-widest">{b.nacionalidad}</p>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // --- VISTA: LISTA DE ROUNDS ---
  if (vista === 'lista_ejercicios') {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <button onClick={() => setVista('menu')} className="mb-8 text-zinc-500 font-bold uppercase text-[10px]">← Volver</button>
        <div className="flex items-center gap-4 mb-10 max-w-2xl">
          <Award className="text-yellow-500" size={40} />
          <div>
             <p className="text-yellow-500 text-[10px] font-black uppercase tracking-widest italic">Plan de Entrenamiento</p>
             <h2 className="text-4xl font-black italic uppercase leading-none">{boxeadorSeleccionado?.nombre}</h2>
          </div>
        </div>
        <div className="space-y-4 max-w-2xl">
          {planEntrenamiento.map((item, index) => (
            <div key={index} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[1.5rem] flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="text-yellow-500">{item.icon}</div>
                <div>
                  <h4 className="font-black uppercase italic text-lg leading-none">{item.t}</h4>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mt-1">{item.d}</p>
                </div>
              </div>
              <button onClick={() => iniciarEjercicio(item)} className="bg-yellow-500 p-4 rounded-2xl text-black">
                <Play fill="currentColor" size={20} />
              </button>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // --- VISTA: CRONÓMETRO ---
  if (vista === 'cronometro') {
    return (
      <main className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
        <p className="text-yellow-500 font-black uppercase text-xs italic mb-2">{ejercicioActual}</p>
        <h1 className="text-5xl font-black italic uppercase mb-16 text-center">{boxeadorSeleccionado?.nombre}</h1>
        <div className="text-9xl font-black italic tabular-nums mb-16">
          {Math.floor(segundos / 60)}:{(segundos % 60).toString().padStart(2, '0')}
        </div>
        <div className="flex gap-8 mb-12">
          <button onClick={() => setActivo(!activo)} className="p-10 bg-yellow-500 rounded-full text-black">
            {activo ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" />}
          </button>
          <button onClick={() => {setActivo(false); setSegundos(180);}} className="p-10 bg-zinc-900 rounded-full">
            <RotateCcw size={40} />
          </button>
        </div>
        <button onClick={() => setVista('lista_ejercicios')} className="text-zinc-500 font-black uppercase text-[10px] border-b border-zinc-800 pb-1">
          Finalizar
        </button>
      </main>
    );
  }

  return null;
}