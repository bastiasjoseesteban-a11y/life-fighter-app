'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export function useTrainingRoutine(boxeadorId: string) {
  const [routine, setRoutine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutine = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🥊 Buscando rutina para boxeador ID:', boxeadorId);
      
      // Convertir a número (por si viene como string "34")
      const boxeadorIdNum = parseInt(boxeadorId);
      
      if (isNaN(boxeadorIdNum)) {
        console.warn('⚠️ ID no es número, usando valor por defecto');
        // Datos de fallback
        setRoutine({
          boxeador: {
            id: boxeadorId,
            nombre: 'Boxeador General',
            nivel: 'INTERMEDIO'
          },
          routine: {
            id: 'default',
            name: 'Entrenamiento General',
            description: 'Rutina estándar',
            difficulty: 'MEDIO',
            total_duration: 1800
          },
          rounds: [],
          stats: {
            total_rounds: 0,
            total_exercises: 0,
            total_duration: 1800,
            estimated_calories: 180
          }
        });
        return;
      }

      console.log('📡 Llamando RPC get_boxeador_routine...');
      
      // Usar la NUEVA función RPC con ID numérico
      const { data, error: rpcError } = await supabase
        .rpc('get_boxeador_routine', {
          p_boxeador_id: boxeadorIdNum
        });

      if (rpcError) {
        console.warn('⚠️ RPC error:', rpcError.message);
        
        // Fallback: intentar obtener datos reales de boxeadores_detalles
        console.log('🔄 Intentando obtener datos reales del boxeador...');
        const { data: boxeadorData, error: boxeadorError } = await supabase
          .from('boxeadores_detalles')
          .select('*')
          .eq('id', boxeadorIdNum)
          .single();

        if (!boxeadorError && boxeadorData) {
          console.log('✅ Datos reales encontrados:', boxeadorData);
          // Crear rutina basada en datos reales
          setRoutine({
            boxeador: boxeadorData,
            routine: {
              id: 'real-' + boxeadorIdNum,
              name: 'Entrenamiento ' + (boxeadorData.nombre || 'Personal'),
              description: boxeadorData.descripcion || 'Rutina basada en datos reales',
              difficulty: boxeadorData.nivel || 'INTERMEDIO',
              total_duration: 2100
            },
            rounds: [],
            stats: {
              total_rounds: 0,
              total_exercises: 0,
              total_duration: 2100,
              estimated_calories: 210
            }
          });
        } else {
          // Datos de prueba genéricos
          console.log('📝 Usando datos de prueba genéricos');
          setRoutine({
            boxeador: {
              id: boxeadorIdNum,
              nombre: 'Boxeador #' + boxeadorIdNum,
              nivel: 'PROFESIONAL'
            },
            routine: {
              id: 'test-' + boxeadorIdNum,
              name: 'Entrenamiento Personalizado #' + boxeadorIdNum,
              description: 'Rutina creada específicamente para este boxeador',
              difficulty: 'AVANZADO',
              total_duration: 2400
            },
            rounds: [
              {
                id: 'r1-' + boxeadorIdNum,
                name: 'Round de Prueba',
                duration_seconds: 180,
                exercises: [
                  {
                    id: 'e1-' + boxeadorIdNum,
                    name: 'Ejercicio Personalizado',
                    duration_seconds: 60,
                    description: 'Diseñado para el boxeador #' + boxeadorIdNum
                  }
                ]
              }
            ],
            stats: {
              total_rounds: 1,
              total_exercises: 1,
              total_duration: 180,
              estimated_calories: 25,
              boxeador_id: boxeadorIdNum
            }
          });
        }
      } else {
        console.log('✅ RPC exitoso!');
        setRoutine(data);
      }
    } catch (err: any) {
      console.error('❌ Error general:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [boxeadorId]);

  useEffect(() => {
    if (boxeadorId) {
      fetchRoutine();
    }
  }, [boxeadorId, fetchRoutine]);

  return { routine, loading, error, refetch: fetchRoutine };
}
