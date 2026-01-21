import { createClient } from '@supabase/supabase-js';

// ============================================
// CONFIGURACIÓN GLOBAL - SINGLE SOURCE OF TRUTH
// ============================================
export const BOXEADORES_GRATIS = [1, 2]; // Ali y Tyson - ÚNICO LUGAR
export const PRECIO_PREMIUM_USD = 4.00;
export const SKU_PREMIUM = 'premium_boxer_monthly';
export const SUBSCRIPTION_DAYS = 30;

// Cliente Supabase centralizado
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================
// INTERFACES
// ============================================
export interface PremiumData {
  purchaseToken: string;
  orderId: string;
  expiryDate: number;
  productId: string;
  unlockedAt: number;
}

export interface PurchaseResult {
  success: boolean;
  purchaseToken: string;
  orderId: string;
  productId: string;
  error?: string;
}

// ============================================
// PREMIUM MANAGER - EL CEREBRO CENTRAL
// ============================================
export class PremiumManager {
  private static getStorageKey(boxerId: number): string {
    return `lf_premium_v2_${boxerId}`; // v2 para futuras migraciones
  }

  /**
   * Verifica acceso premium de forma híbrida (local + nube)
   */
  static async hasAccess(boxerId: number): Promise<boolean> {
    // 1. ¿Es boxeador gratis? - DECISIÓN ÚNICA
    if (BOXEADORES_GRATIS.includes(boxerId)) {
      return true;
    }

    // 2. Verificar caché local (instantáneo)
    const cachedAccess = this.checkLocalCache(boxerId);
    if (cachedAccess.valid) return true;

    // 3. Verificar nube (fuente de verdad)
    return await this.checkCloudAccess(boxerId);
  }

  /**
   * Otorga acceso premium tras compra exitosa
   */
  static async grantAccess(
    boxerId: number, 
    purchaseData: {
      purchaseToken: string;
      orderId: string;
      productId?: string;
    }
  ): Promise<void> {
    const expiryDate = Date.now() + (SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000);
    const premiumData: PremiumData = {
      purchaseToken: purchaseData.purchaseToken,
      orderId: purchaseData.orderId,
      expiryDate,
      productId: purchaseData.productId || SKU_PREMIUM,
      unlockedAt: Date.now()
    };

    // 1. Cache local (para acceso inmediato)
    this.saveToLocalCache(boxerId, premiumData);

    // 2. Persistir en nube (para sincronización)
    await this.saveToCloud(boxerId, premiumData);
  }

  /**
   * Obtiene información detallada del acceso
   */
  static async getAccessInfo(boxerId: number): Promise<{
    hasAccess: boolean;
    isFree: boolean;
    expiryDate?: number;
    daysLeft?: number;
  }> {
    const isFree = BOXEADORES_GRATIS.includes(boxerId);
    
    if (isFree) {
      return {
        hasAccess: true,
        isFree: true
      };
    }

    // Verificar acceso premium
    const hasAccess = await this.hasAccess(boxerId);
    
    if (!hasAccess) {
      return { hasAccess: false, isFree: false };
    }

    // Obtener fecha de expiración
    const cachedData = this.getLocalCache(boxerId);
    if (cachedData) {
      const daysLeft = Math.ceil((cachedData.expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
      return {
        hasAccess: true,
        isFree: false,
        expiryDate: cachedData.expiryDate,
        daysLeft
      };
    }

    return { hasAccess: true, isFree: false };
  }

  // ========== MÉTODOS PRIVADOS ==========

  private static checkLocalCache(boxerId: number): { valid: boolean; data?: PremiumData } {
    if (typeof window === 'undefined') return { valid: false };

    const key = this.getStorageKey(boxerId);
    const stored = localStorage.getItem(key);
    
    if (!stored) return { valid: false };

    try {
      const data: PremiumData = JSON.parse(stored);
      
      // Verificar expiración
      if (data.expiryDate && data.expiryDate > Date.now()) {
        return { valid: true, data };
      }
      
      // Eliminar caché expirado
      localStorage.removeItem(key);
      return { valid: false };
    } catch {
      localStorage.removeItem(key);
      return { valid: false };
    }
  }

  private static getLocalCache(boxerId: number): PremiumData | null {
    const result = this.checkLocalCache(boxerId);
    return result.data || null;
  }

  private static saveToLocalCache(boxerId: number, data: PremiumData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.getStorageKey(boxerId), JSON.stringify(data));
  }

  private static async checkCloudAccess(boxerId: number): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) return false;

      const { data: access } = await supabase
        .from('premium_access')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('boxer_id', boxerId)
        .single();

      if (!access) return false;

      const expiryDate = new Date(access.expiry_date).getTime();
      const hasAccess = expiryDate > Date.now();

      // Si tiene acceso en la nube, sincronizar localmente
      if (hasAccess) {
        this.saveToLocalCache(boxerId, {
          purchaseToken: access.purchase_token,
          orderId: access.order_id,
          expiryDate,
          productId: access.product_id || SKU_PREMIUM,
          unlockedAt: new Date(access.unlocked_at).getTime()
        });
      }

      return hasAccess;
    } catch (error) {
      console.warn('⚠️ Error verificando acceso en nube:', error);
      return false;
    }
  }

  private static async saveToCloud(
    boxerId: number, 
    premiumData: PremiumData
  ): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) {
        throw new Error('Usuario no autenticado para guardar en nube');
      }

      await supabase.from('premium_access').upsert({
        user_id: user.user.id,
        boxer_id: boxerId,
        purchase_token: premiumData.purchaseToken,
        order_id: premiumData.orderId,
        product_id: premiumData.productId,
        expiry_date: new Date(premiumData.expiryDate).toISOString(),
        unlocked_at: new Date(premiumData.unlockedAt).toISOString()
      });

      console.log('✅ Acceso premium sincronizado con nube');
    } catch (error) {
      console.error('❌ Error guardando en nube:', error);
      throw error;
    }
  }
}

// ============================================
// GOOGLE PLAY BILLING - PUENTE PARA PRODUCCIÓN
// ============================================
export class GooglePlayBilling {
  /**
   * Inicializa Google Play Billing
   */
  static async initialize(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // MODO PRODUCCIÓN: Integración real
    if ((window as any).AndroidBilling) {
      try {
        await (window as any).AndroidBilling.initialize();
        return true;
      } catch (error) {
        console.error('❌ Error inicializando Google Play Billing:', error);
        return false;
      }
    }

    // MODO DESARROLLO: Simulación
    console.warn('⚠️ Google Play Billing no disponible - Modo desarrollo');
    return true;
  }

  /**
   * Ejecuta flujo de compra
   */
  static async purchase(): Promise<PurchaseResult> {
    // MODO PRODUCCIÓN
    if ((window as any).AndroidBilling) {
      try {
        const result = await (window as any).AndroidBilling.purchase(SKU_PREMIUM);
        
        if (!result.success) {
          return {
            success: false,
            purchaseToken: '',
            orderId: '',
            productId: SKU_PREMIUM,
            error: result.error || 'Compra cancelada'
          };
        }

        return {
          success: true,
          purchaseToken: result.purchaseToken,
          orderId: result.orderId,
          productId: result.productId || SKU_PREMIUM
        };
      } catch (error: any) {
        return {
          success: false,
          purchaseToken: '',
          orderId: '',
          productId: SKU_PREMIUM,
          error: error.message || 'Error en compra'
        };
      }
    }

    // MODO DESARROLLO: Simulación
    console.log('🛒 Simulando compra en Google Play...');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          purchaseToken: `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          orderId: `GPA.${Date.now()}.${Math.random().toString(36).substr(2, 9)}`,
          productId: SKU_PREMIUM
        });
      }, 2000);
    });
  }

  /**
   * Verifica compra con backend propio
   */
  static async verifyPurchase(purchaseToken: string): Promise<{
    valid: boolean;
    expiryDate?: number;
    error?: string;
  }> {
    try {
      const response = await fetch('/api/verify-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseToken })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error verificando compra:', error);
      
      // En desarrollo, simular verificación exitosa
      if (process.env.NODE_ENV === 'development') {
        return {
          valid: true,
          expiryDate: Date.now() + (SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000)
        };
      }
      
      return {
        valid: false,
        error: 'No se pudo verificar la compra'
      };
    }
  }
}

// ============================================
// HELPERS PARA LA UI
// ============================================
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function formatExpiryDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}