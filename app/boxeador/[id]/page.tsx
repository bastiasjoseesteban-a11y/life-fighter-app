"use client";
import React, { useEffect, useState, Suspense } from 'react'; // ✅ Añadido: Suspense
import { createClient } from '@supabase/supabase-js';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Home, ArrowLeft, Trophy, Ruler, Weight, Activity, Globe, Award, Lock, Crown, Check, X } from 'lucide-react';
import Image from 'next/image';

// ✅ Importamos el servicio premium centralizado
import {
  PremiumManager,
  GooglePlayBilling,
  BOXEADORES_GRATIS,
  PRECIO_PREMIUM_USD,
  formatCurrency
} from '@/lib/premium-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================
// INTERFAZ BOXEADOR
// ============================================
interface Boxeador {
  id: number;
  nombre: string;
  apodo: string;
  pais: string;
  nacionalidad: string;
  categoria: string;
  peso_detalle: string;
  altura_alcance: string;
  record: string;
  titulos: string;
  foto_url: string;
  biografia?: string;
  estilo?: string;
}

// ============================================
// MODAL DE PAGO PREMIUM
// ============================================
function ModalPremium({
  boxeador,
  onClose,
  onSuccess
}: {
  boxeador: Boxeador;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<'info' | 'processing' | 'success' | 'error'>('info');
  const [error, setError] = useState('');

  const handlePurchase = async () => {
    try {
      setStep('processing');
      setError('');

      // 1. Inicializar Google Play Billing
      const billingReady = await GooglePlayBilling.initialize();
      if (!billingReady) throw new Error('Sistema de pagos no disponible');

      // 2. Ejecutar compra
      const purchase = await GooglePlayBilling.purchase();
      if (!purchase.success) throw new Error(purchase.error || 'Compra cancelada');

      // 3. Verificar compra con backend
      const verification = await GooglePlayBilling.verifyPurchase(purchase.purchaseToken);
      if (!verification.valid) throw new Error(verification.error || 'Compra no válida');

      // 4. Otorgar acceso premium
      await PremiumManager.grantAccess(boxeador.id, {
        purchaseToken: purchase.purchaseToken,
        orderId: purchase.orderId,
        productId: purchase.productId
      });

      setStep('success');

      // Redirigir después de éxito
      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (err: any) {
      console.error('❌ Error en compra:', err);
      setError(err.message || 'Error al procesar el pago');
      setStep('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#00FBFF]/30 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">

        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        {step === 'info' && (
          <>
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00FBFF] to-[#0088FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown size={40} className="text-black" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">ACCESO PREMIUM</h2>
              <p className="text-zinc-400 text-sm">Desbloquea el entrenamiento completo de</p>
              <p className="text-[#00FBFF] font-bold text-xl mt-2">{boxeador.nombre}</p>
            </div>

            <div className="bg-black/50 rounded-2xl p-4 mb-6 border border-zinc-800">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Check size={18} className="text-[#00FBFF]" />
                Incluye acceso a:
              </h3>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#00FBFF]">•</span>
                  <span>Rutinas de entrenamiento completas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00FBFF]">•</span>
                  <span>Plan de alimentación personalizado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00FBFF]">•</span>
                  <span>Combinaciones y técnicas exclusivas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00FBFF]">•</span>
                  <span>Videos técnicos y tutoriales</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00FBFF]">•</span>
                  <span>Acceso durante 30 días</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-[#00FBFF]/20 to-[#0088FF]/20 border border-[#00FBFF]/30 rounded-xl p-4 mb-6 text-center">
              <p className="text-zinc-400 text-xs mb-1">Precio por boxeador</p>
              <p className="text-4xl font-black text-white">
                ${PRECIO_PREMIUM_USD.toFixed(2)}
                <span className="text-lg text-zinc-400 font-normal">/mes</span>
              </p>
            </div>

            <button
              onClick={handlePurchase}
              className="w-full bg-gradient-to-r from-[#00FBFF] to-[#0088FF] text-black font-black py-4 rounded-xl text-lg hover:scale-105 transition-transform shadow-lg"
            >
              🔓 DESBLOQUEAR AHORA
            </button>

            <p className="text-zinc-500 text-xs text-center mt-4">
              Pago seguro procesado por Google Play Store
            </p>
          </>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="w-20 h-20 border-4 border-[#00FBFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">Procesando pago...</h3>
            <p className="text-zinc-400 text-sm">Completa el pago en la ventana de Google Play</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">¡Pago exitoso! 🎉</h3>
            <p className="text-zinc-400 text-sm mb-4">Ya tienes acceso premium a {boxeador.nombre}</p>
            <p className="text-[#00FBFF] text-sm">Redirigiendo al entrenamiento...</p>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Error en el pago</h3>
            <p className="text-zinc-400 text-sm mb-6">{error}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setStep('info')}
                className="flex-1 bg-[#00FBFF] text-black font-bold py-3 rounded-xl"
              >
                Reintentar
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-zinc-800 text-white font-bold py-3 rounded-xl"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE INFOBOX
// ============================================
function InfoBox({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-zinc-900/40 border border-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl flex items-start gap-3 md:gap-4">
      <div className="text-[#00FBFF] mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.1em] mb-1">{label}</p>
        <p className="font-bold text-base md:text-lg uppercase leading-tight line-clamp-2">
          {value || "---"}
        </p>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE HIJO CON LA LÓGICA (ahora puede usar useSearchParams)
// ============================================
function DetalleBoxeadorContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ Ahora este hook está seguro dentro de un componente que se renderiza en el cliente

  const page = searchParams.get('page') || '0';
  const search = searchParams.get('search') || '';

  const [boxeador, setBoxeador] = useState<Boxeador | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessInfo, setAccessInfo] = useState<{
    hasAccess: boolean;
    isFree: boolean;
    daysLeft?: number;
  } | null>(null);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const { data } = await supabase
        .from('boxeadores_completo')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setBoxeador(data);

        // ✅ Obtener información de acceso premium
        const info = await PremiumManager.getAccessInfo(Number(id));
        setAccessInfo(info);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToGallery = () => {
    const params = new URLSearchParams();
    if (parseInt(page) > 0) params.set('page', page);
    if (search) params.set('search', search);
    const queryString = params.toString();
    router.push(queryString ? `/boxeador?${queryString}` : '/boxeador');
  };

  const handleGoHome = () => router.push('/');

  const handleEmpezarEntrenamiento = async () => {
    if (!boxeador || !accessInfo) return;

    // ✅ Verificar acceso premium
    if (accessInfo.hasAccess) {
      router.push(`/entrenar/${boxeador.id}`);
    } else {
      setShowModal(true);
    }
  };

  const handlePurchaseSuccess = () => {
    setShowModal(false);
    // Recargar información de acceso
    loadData();

    // Redirigir después de 500ms
    setTimeout(() => {
      router.push(`/entrenar/${boxeador!.id}`);
    }, 500);
  };

  const fixImagePath = (path: string) => {
    if (!path) return "/placeholder-boxer.jpg";
    if (path.startsWith('http')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00FBFF] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#00FBFF] font-bold text-lg">CARGANDO...</p>
      </div>
    );
  }

  if (!boxeador) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🥊</div>
        <h1 className="text-2xl font-bold mb-4">Boxeador no encontrado</h1>
        <button
          onClick={handleBackToGallery}
          className="px-6 py-3 bg-[#00FBFF] text-black font-bold rounded-full hover:scale-105 transition-transform"
        >
          VOLVER A LA GALERÍA
        </button>
      </div>
    );
  }

  const esPremium = !BOXEADORES_GRATIS.includes(Number(boxeador.id));
  const tieneAcceso = accessInfo?.hasAccess || !esPremium;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-3 group mb-4 md:mb-0 self-start"
          >
            <div className="bg-[#00FBFF] text-black p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Home size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter">
                LIFE <span className="text-[#00FBFF]">FIGHTER</span>
              </h1>
              <p className="text-xs text-zinc-500">Toca para volver al inicio</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {esPremium && tieneAcceso && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2 rounded-full">
                <Crown size={18} className="text-black" />
                <span className="text-black font-bold text-sm">PREMIUM</span>
              </div>
            )}

            <button
              onClick={handleBackToGallery}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-900 rounded-full text-[#00FBFF] font-bold uppercase text-sm hover:bg-[#00FBFF] hover:text-black transition-colors"
            >
              <ArrowLeft size={18} /> VOLVER A LA GALERÍA
              {parseInt(page) > 0 && (
                <span className="text-xs bg-[#00FBFF] text-black px-2 py-1 rounded ml-2">
                  Pág {parseInt(page) + 1}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">

          {/* IMAGEN */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl md:rounded-[3.5rem] overflow-hidden border-2 border-[#00FBFF]/20 shadow-[0_0_50px_rgba(0,251,255,0.1)]">
            <Image
              src={fixImagePath(boxeador.foto_url)}
              alt={boxeador.nombre}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

            {esPremium && !tieneAcceso && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <Lock size={60} className="text-[#00FBFF] mx-auto mb-4" />
                  <p className="text-2xl font-bold text-white">Contenido Premium</p>
                  <p className="text-zinc-400 mt-2">Desbloquea para acceder</p>
                </div>
              </div>
            )}
          </div>

          {/* DATOS TÉCNICOS */}
          <div className="flex flex-col">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-none mb-2">
              {boxeador.nombre}
            </h1>
            <p className="text-[#00FBFF] text-2xl sm:text-3xl md:text-4xl font-black italic mb-6 md:mb-10 uppercase tracking-tight">
              "{boxeador.apodo || boxeador.nombre}"
            </p>

            {/* INFO BOXES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              <InfoBox icon={<Globe size={20} />} label="País" value={boxeador.pais || boxeador.nacionalidad} />
              <InfoBox icon={<Activity size={20} />} label="Categoría" value={boxeador.categoria} />
              <InfoBox icon={<Weight size={20} />} label="Peso" value={boxeador.peso_detalle} />
              <InfoBox icon={<Ruler size={20} />} label="Altura / Alcance" value={boxeador.altura_alcance} />
              <InfoBox icon={<Trophy size={20} />} label="Récord Profesional" value={boxeador.record} />
              <InfoBox icon={<Award size={20} />} label="Títulos" value={boxeador.titulos} />
            </div>

            {/* BIOGRAFÍA */}
            {(boxeador.biografia || boxeador.estilo) && (
              <div className="mb-6 md:mb-8">
                {boxeador.biografia && (
                  <div className="mb-4">
                    <h3 className="text-[#00FBFF] font-bold text-sm uppercase mb-2">BIOGRAFÍA</h3>
                    <p className="text-zinc-300 text-sm leading-relaxed">{boxeador.biografia}</p>
                  </div>
                )}
                {boxeador.estilo && (
                  <div>
                    <h3 className="text-[#00FBFF] font-bold text-sm uppercase mb-2">ESTILO DE BOXEO</h3>
                    <p className="text-zinc-300 text-sm leading-relaxed">{boxeador.estilo}</p>
                  </div>
                )}
              </div>
            )}

            {/* BOTÓN DE ACCIÓN - PUNTO DE CONEXIÓN */}
            <div className="mt-4 md:mt-6">
              <button
                onClick={handleEmpezarEntrenamiento}
                className="w-full bg-gradient-to-r from-[#00FBFF] to-[#00ccff] text-black py-5 md:py-6 rounded-2xl md:rounded-[2rem] font-black uppercase italic text-lg md:text-xl shadow-[0_0_30px_rgba(0,251,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {esPremium && !tieneAcceso ? (
                    <>
                      <Lock size={24} />
                      DESBLOQUEAR - {formatCurrency(PRECIO_PREMIUM_USD)}/mes
                    </>
                  ) : (
                    <>
                      🎯 EMPEZAR ENTRENAMIENTO
                      {esPremium && tieneAcceso && <Crown size={20} />}
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00FBFF] to-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>

              {!esPremium ? (
                <p className="text-center text-green-400 text-xs mt-3 font-bold">
                  ✅ Boxeador GRATUITO - Acceso completo incluido
                </p>
              ) : tieneAcceso ? (
                <p className="text-center text-amber-400 text-xs mt-3 font-bold">
                  ⭐ PREMIUM ACTIVO - Tienes acceso completo
                </p>
              ) : (
                <p className="text-center text-zinc-600 text-xs mt-3">
                  🔒 {formatCurrency(PRECIO_PREMIUM_USD)}/mes - Acceso por 30 días
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE PAGO PREMIUM */}
      {showModal && boxeador && (
        <ModalPremium
          boxeador={boxeador}
          onClose={() => setShowModal(false)}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL (envuelve el contenido en Suspense)
// ============================================
export default function DetalleBoxeador() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00FBFF] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#00FBFF] font-bold text-lg">CARGANDO...</p>
      </div>
    }>
      <DetalleBoxeadorContent />
    </Suspense>
  );
}