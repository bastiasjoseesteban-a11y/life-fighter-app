import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ✅ Genera rutas estáticas para todos los boxeadores
export async function generateStaticParams() {
  try {
    const { data: boxeadores } = await supabase
      .from('boxeadores_completo')
      .select('id');

    if (!boxeadores) return [];

    return boxeadores.map((boxeador) => ({
      id: boxeador.id.toString(),
    }));
  } catch (error) {
    console.error('Error generando rutas estáticas:', error);
    // Fallback manual si falla Supabase
    return [
      { id: '1' },
      { id: '2' },
      { id: '3' },
      { id: '4' },
      { id: '5' },
    ];
  }
}

export default function EntrenarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
