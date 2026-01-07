// Sistema de audio y texto-a-voz para la aplicación de entrenamiento
// Archivo: app/lib/utils/audio.ts

// Estado global para controlar si se está reproduciendo audio
let isSpeaking = false;
let audioContext: AudioContext | null = null;

/**
 * Reproduce texto usando síntesis de voz (TTS)
 * @param text - Texto a pronunciar
 * @param onEnd - Callback opcional que se ejecuta al terminar
 * @param priority - Prioridad de la frase ('low' no interrumpe, 'high' sí)
 */
export function speak(
  text: string, 
  onEnd?: () => void, 
  priority: 'low' | 'high' = 'low'
): void {
  // Verificar si el navegador soporta speechSynthesis
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.log("[TTS - Fallback]:", text);
    if (onEnd) setTimeout(onEnd, 1000);
    return;
  }

  // Si ya está hablando y es baja prioridad, no interrumpir
  if (isSpeaking && priority === 'low') {
    console.log("[TTS]: Ya hay una frase en curso, omitiendo:", text.substring(0, 30) + "...");
    return;
  }

  // Si es alta prioridad, cancelar lo que esté sonando
  if (priority === 'high') {
    window.speechSynthesis.cancel();
    isSpeaking = false;
  }

  isSpeaking = true;
  
  try {
    // Crear el utterance (frase para TTS)
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configurar propiedades de voz
    utterance.lang = 'es-ES';
    utterance.rate = 0.9; // Velocidad ligeramente reducida para claridad
    utterance.volume = 1.0;
    utterance.pitch = 1.0;
    
    // Intentar seleccionar una voz masculina en español
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(voice => 
      voice.lang.startsWith('es') && 
      (voice.name.includes('Masculino') || 
       voice.name.includes('Male') || 
       !voice.name.includes('Femenino'))
    );
    
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    
    // Manejar eventos de la reproducción
    utterance.onstart = () => {
      console.log("[TTS]: Comenzando:", text.substring(0, 50) + "...");
    };
    
    utterance.onend = () => {
      console.log("[TTS]: Finalizado");
      isSpeaking = false;
      if (onEnd) onEnd();
    };
    
    utterance.onerror = (event) => {
      console.warn("[TTS Error]:", event.error, "Texto:", text.substring(0, 50) + "...");
      isSpeaking = false;
      if (onEnd) onEnd();
    };
    
    // Reproducir la frase
    window.speechSynthesis.speak(utterance);
    
  } catch (error) {
    console.error("[TTS Error crítico]:", error);
    isSpeaking = false;
    if (onEnd) onEnd();
  }
}

/**
 * Detiene cualquier reproducción de voz en curso
 */
export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    console.log("[TTS]: Reproducción detenida");
  }
}

/**
 * Reproduce un sonido de campana (inicio/fin de round)
 * @param type - Tipo de campana ('start', 'end', 'warning')
 */
export function playBell(type: 'start' | 'end' | 'warning' = 'end'): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Inicializar AudioContext si no existe
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const context = audioContext;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    // Configurar según el tipo de campana
    switch (type) {
      case 'start':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, context.currentTime); // Do
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.8);
        break;
        
      case 'end':
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(440, context.currentTime); // La
        gainNode.gain.setValueAtTime(0.4, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.5);
        break;
        
      case 'warning':
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(349.23, context.currentTime); // Fa
        gainNode.gain.setValueAtTime(0.2, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.2);
        break;
    }
    
    // Conectar y reproducir
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start();
    oscillator.stop(context.currentTime + (type === 'end' ? 1.5 : 1.0));
    
    console.log(`[Audio]: Campana de ${type} reproducida`);
    
  } catch (error) {
    console.warn("[Audio Error]: No se pudo reproducir campana, usando fallback", error);
    playBellFallback(type);
  }
}

/**
 * Fallback para campana usando archivos de audio o console.log
 */
function playBellFallback(type: 'start' | 'end' | 'warning'): void {
  try {
    // Intentar cargar archivo de audio si existe
    const audio = new Audio(`/sounds/bell-${type}.mp3`);
    audio.play().catch(() => {
      // Si falla, usar console.log como último recurso
      switch (type) {
        case 'start': console.log("🔔 [INICIO]"); break;
        case 'end': console.log("🔔🔔 [FIN]"); break;
        case 'warning': console.log("⚠️ [ADVERTENCIA]"); break;
      }
    });
  } catch (error) {
    console.log(`🔔 [${type.toUpperCase()}]`);
  }
}

/**
 * Verifica si el navegador soporta las funciones de audio
 * @returns Objeto con las capacidades de audio detectadas
 */
export function checkAudioCapabilities() {
  return {
    speechSynthesis: typeof window !== 'undefined' && 'speechSynthesis' in window,
    audioContext: typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window),
    isCurrentlySpeaking: isSpeaking
  };
}

/**
 * Reinicia el sistema de audio (útil después de pausas largas)
 */
export function resetAudioSystem(): void {
  stopSpeaking();
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close();
  }
  audioContext = null;
  isSpeaking = false;
  console.log("[Audio]: Sistema reiniciado");
}