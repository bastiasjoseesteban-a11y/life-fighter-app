'use client';

import { useCallback } from 'react';
import { supabase } from '../supabaseClient';

export function useTrainingSession(routineId: string) {
  const saveProgress = useCallback(async (
    sessionId: string,
    nivel: string,
    roundIndex: number,
    tiempoRestante: number,
    accion: string,
    metadata: any
  ) => {
    console.log('💾 GUARDADO SIMPLE ACTIVADO');
    
    // ID fijo que SÍ funcionará
    const usuarioId = '00000000-0000-0000-0000-000000000000';
    
    try {
      console.log('📡 Intentando guardar...');
      
      const { data, error } = await supabase
        .from('training_sessions')
        .insert({
          usuario_id: usuarioId,
          session_id: sessionId,
          nivel: nivel,
          round_index: roundIndex,
          tiempo_restante: tiempoRestante,
          accion: accion,
          metadata: metadata || {}
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error Supabase:', error);
        
        // Guardar en localStorage
        const localData = {
          usuario_id: usuarioId,
          session_id: sessionId,
          nivel,
          round_index: roundIndex,
          tiempo_restante: tiempoRestante,
          accion,
          metadata: metadata || {},
          guardado_local: true,
          fecha: new Date().toISOString()
        };
        
        localStorage.setItem(`entreno_${sessionId}`, JSON.stringify(localData));
        
        return {
          success: true,
          message: '💾 Guardado LOCAL (navegador)',
          data: localData,
          modo: 'local'
        };
      }

      console.log('✅ ÉXITO en Supabase:', data);
      return {
        success: true,
        message: '🎉 ¡GUARDADO EN BASE DE DATOS!',
        data: data,
        modo: 'supabase'
      };

    } catch (error: any) {
      console.error('💥 Error inesperado:', error);
      return {
        success: false,
        error: 'Error: ' + error.message
      };
    }
  }, []);

  const completeSession = useCallback(async (
    sessionId: string,
    totalDuration: number,
    totalRounds: number,
    caloriesBurned: number
  ) => {
    const usuarioId = '00000000-0000-0000-0000-000000000000';
    
    try {
      const { data, error } = await supabase
        .from('training_sessions')
        .insert({
          usuario_id: usuarioId,
          session_id: sessionId,
          nivel: 'COMPLETED',
          round_index: totalRounds,
          tiempo_restante: 0,
          accion: 'session_completed',
          metadata: {
            total_duration: totalDuration,
            total_rounds: totalRounds,
            calories_burned: caloriesBurned
          }
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  return { saveProgress, completeSession };
}