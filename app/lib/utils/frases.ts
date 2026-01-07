// Sistema de frases motivacionales CON FUNCIONES SÍNCRONAS
// Archivo: app/lib/utils/frases.ts

export type MomentoMotivacion = 'inicio' | 'medio' | 'final' | 'fin' | 'aleatoria';

// FRASES LOCALES COMO FALLBACK (SÍNCRONAS)
const FRASES_LOCALES = {
  inicio: [
    "¡Vamos, tú puedes con esto! El camino empieza aquí.",
    "Empieza fuerte, termina más fuerte. Confía en tu entrenamiento.",
    "El primer paso es siempre el más importante. ¡Da ese paso!",
    "Prepárate para dar lo mejor de ti. Tu mente está lista."
  ],
  
  medio: [
    "¡Eres más fuerte de lo que crees! ¡No te detengas ahora!",
    "No te compares con otros, compárate con quien eras ayer entrenando.",
    "La mitad del camino ya está recorrida, ¡sigue así campeón!",
    "Cada gota de sudor cuenta, cada segundo de esfuerzo vale."
  ],
  
  final: [
    "¡Último esfuerzo! ¡Dale con todo lo que tienes!",
    "¡No pares ahora, casi llegas! La victoria está cerca.",
    "Estos son los segundos que marcan la diferencia. ¡A por ellos!",
    "¡Un round más y serás más fuerte! ¡Un segundo más y serás mejor!"
  ],
  
  fin: [
    "¡Excelente trabajo! Eres un verdadero campeón. Así se entrena.",
    "Round completado. Tu disciplina te hará invencible. ¡Bravo!",
    "Así se entrena un futuro campeón. Cada día, mejor que ayer.",
    "Hoy venciste a tu peor enemigo: la pereza. ¡Felicidades!"
  ],
  
  aleatoria: [
    "Eres un Luchador de la Vida. ¡Arriba, siempre arriba!",
    "La Vida pega fuerte, pero levántate y sigue entrenando, ya sabes cómo se hace. ¡Vamos!",
    "Arriba, ¡por esa gente que te quiere y por la persona en la que te convertirás!",
    "Supera al que fuiste entrenando ayer. Ese es el único rival que importa.",
    "Tu mente es tu mejor golpe. Entrénala tanto como tus puños.",
    "Plata y miedo nunca tuve. ¡Dale! ¡Dale! ¡Dale con el corazón!"
  ]
};

/**
 * Obtiene una frase motivacional SÍNCRONA según el momento
 * @param momento - Momento del entrenamiento
 * @returns Frase motivacional aleatoria para ese momento (síncrona)
 */
export function obtenerFraseSync(momento: MomentoMotivacion = 'aleatoria'): string {
  const frases = FRASES_LOCALES[momento] || FRASES_LOCALES.aleatoria;
  
  if (frases.length === 0) {
    return "¡Vamos, tú puedes!";
  }
  
  const indiceAleatorio = Math.floor(Math.random() * frases.length);
  return frases[indiceAleatorio];
}

/**
 * Obtiene una frase motivacional SÍNCRONA basada en los segundos restantes
 * @param segundosRestantes - Segundos que faltan para terminar el round
 * @returns Frase motivacional apropiada para ese momento (síncrona)
 */
export function obtenerFrasePorSegundosSync(segundosRestantes: number): string {
  if (segundosRestantes >= 45) {
    return obtenerFraseSync('inicio');
  } else if (segundosRestantes >= 15) {
    return obtenerFraseSync('medio');
  } else if (segundosRestantes >= 1) {
    return obtenerFraseSync('final');
  } else {
    return obtenerFraseSync('fin');
  }
}

// NOTA: Las funciones async se mantienen para uso futuro con Supabase
// pero el timer usa las versiones síncronas

/**
 * Obtiene una frase motivacional ASÍNCRONA (para uso futuro con Supabase)
 * @param momento - Momento del entrenamiento
 * @returns Promise con frase motivacional
 */
export async function obtenerFrase(momento: MomentoMotivacion = 'aleatoria'): Promise<string> {
  // Por ahora retorna la versión síncrona
  return obtenerFraseSync(momento);
}

/**
 * Obtiene una frase motivacional ASÍNCRONA basada en segundos
 * @param segundosRestantes - Segundos restantes
 * @returns Promise con frase motivacional
 */
export async function obtenerFrasePorSegundos(segundosRestantes: number): Promise<string> {
  // Por ahora retorna la versión síncrona
  return obtenerFrasePorSegundosSync(segundosRestantes);
}

/**
 * Obtiene todas las frases de un momento específico (para debugging)
 */
export function obtenerTodasLasFrases(momento: MomentoMotivacion): string[] {
  return [...(FRASES_LOCALES[momento] || [])];
}

/**
 * Estadísticas de frases disponibles
 */
export function obtenerEstadisticasFrases() {
  return {
    inicio: FRASES_LOCALES.inicio.length,
    medio: FRASES_LOCALES.medio.length,
    final: FRASES_LOCALES.final.length,
    fin: FRASES_LOCALES.fin.length,
    aleatoria: FRASES_LOCALES.aleatoria.length,
    total: Object.values(FRASES_LOCALES).reduce((acc, frases) => acc + frases.length, 0)
  };
}