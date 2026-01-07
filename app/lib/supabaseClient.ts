import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Variables de entorno de Supabase faltantes');
  console.log('Por favor, configura en tu .env.local:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Función para verificar conexión
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('boxeadores')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    return { success: true, message: '✅ Conexión exitosa a Supabase' };
  } catch (error: any) {
    return { success: false, message: `❌ Error: ${error.message}` };
  }
};
