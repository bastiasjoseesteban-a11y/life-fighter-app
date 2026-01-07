'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export function useUserStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.log('👤 No user, returning null');
        setStats(null);
        setLoading(false);
        return;
      }

      console.log('📡 Llamando RPC get_user_stats_simple...');
      
      const { data, error: supabaseError } = await supabase
        .rpc('get_user_stats_simple', {
          p_usuario_id: user.user.id
        });

      if (supabaseError) {
        console.warn('⚠️ RPC warning:', supabaseError.message);
        setStats({
          stats: {
            total_sessions: 0,
            total_minutos: 0,
            streak_dias: 0
          },
          level_progress: {
            current_level: 'PRINCIPIANTE',
            progress_percentage: 0
          }
        });
      } else {
        console.log('✅ Stats loaded:', data);
        setStats(data);
      }
    } catch (err: any) {
      console.error('❌ Error fetching stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    
    // Escuchar cambios de auth
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          fetchStats();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}