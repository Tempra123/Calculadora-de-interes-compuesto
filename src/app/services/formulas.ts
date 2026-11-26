/**
 * Fórmulas de interés simple y compuesto (Valor del Dinero en el Tiempo).
 * Funciones puras: no dependen de Angular, así se pueden probar solas.
 *
 * Convención: i es la tasa por periodo en DECIMAL (8 % -> 0.08),
 * n es el número de periodos (años, si la tasa es anual).
 */

export type Modo = 'simple' | 'compuesto';

/** Un movimiento de dinero: monto en el tiempo t (0 = hoy). Negativo = egreso. */
export interface Flujo {
  t: number;
  monto: number;
}

export interface FilaTabla {
  n: number;
  capitalInicial: number;
  interes: number;
  saldoFinal: number;
}

/* ---------------------------------------------------------------
 * 1. PAGO ÚNICO
 * ------------------------------------------------------------- */

/** Factor que lleva 1 $ de hoy al periodo n. */
export function factorFuturo(i: number, n: number, modo: Modo): number {
  return modo === 'simple' ? 1 + i * n : Math.pow(1 + i, n);
}

/** F: valor futuro. Simple: P(1+in). Compuesto: P(1+i)^n */
export function valorFuturo(P: number, i: number, n: number, modo: Modo): number {
  return P * factorFuturo(i, n, modo);
}

/** P: valor presente. Simple: F/(1+in). Compuesto: F/(1+i)^n */
export function valorPresente(F: number, i: number, n: number, modo: Modo): number {
  return F / factorFuturo(i, n, modo);
}

/** I: interés total ganado. */
export function interesGanado(P: number, i: number, n: number, modo: Modo): number {
  return valorFuturo(P, i, n, modo) - P;
}

/** i: tasa por periodo necesaria para pasar de P a F en n periodos. */
export function tasaNecesaria(P: number, F: number, n: number, modo: Modo): number {
  return modo === 'simple' ? (F / P - 1) / n : Math.pow(F / P, 1 / n) - 1;
}

/** n: periodos necesarios para pasar de P a F con tasa i. */
export function periodosNecesarios(P: number, F: number, i: number, modo: Modo): number {
  return modo === 'simple' ? (F / P - 1) / i : Math.log(F / P) / Math.log(1 + i);
}

/** Años para multiplicar el capital k veces (k=2 duplicar, k=3 triplicar). */
export function periodosParaMultiplicar(k: number, i: number, modo: Modo): number {
  return periodosNecesarios(1, k, i, modo);
}

/** Regla del 72: años aproximados para duplicar con tasa en % (8 -> 9). */
export function reglaDel72(tasaPorcentaje: number): number {
  return 72 / tasaPorcentaje;
}

/* ---------------------------------------------------------------
 * 2. FLUJOS DE EFECTIVO IRREGULARES
 * ------------------------------------------------------------- */

/**
 * Valor de un conjunto de flujos en la "fecha focal" (por defecto 0 = hoy).
 * - fechaFocal = 0  -> valor presente
 * - fechaFocal = n  -> valor futuro en n
 *
 * En interés COMPUESTO el resultado de una equivalencia no depende de la
 * fecha focal. En interés SIMPLE sí depende, por eso es un parámetro.
 */
export function valorEnFecha(
  flujos: Flujo[],
  i: number,
  modo: Modo,
  fechaFocal = 0,
): number {
  return flujos.reduce((suma, { t, monto }) => {
    const d = t - fechaFocal; // >0: el flujo ocurre después de la fecha focal
    const factor = d >= 0 ? factorFuturo(i, d, modo) : 1 / factorFuturo(i, -d, modo);
    return suma + monto / factor;
  }, 0);
}

/**
 * Despeja la incógnita (X o B) de una equivalencia:
 *   Σ(flujos conocidos) + signo · X · Σ(factores en los tiempos de X) = 0
 *
 * Ejemplos:
 *  - "Calcule B para que positivos y negativos sean iguales":
 *      conocidos = los positivos, tiemposIncognita = donde está B, signo = -1
 *  - "Dos flujos equivalentes, hallar X":
 *      conocidos = flujo de la izquierda, tiemposIncognita = posición de las X, signo = -1
 */
export function resolverIncognita(
  conocidos: Flujo[],
  tiemposIncognita: number[],
  i: number,
  modo: Modo,
  fechaFocal = 0,
  signo: 1 | -1 = -1,
): number {
  const base = valorEnFecha(conocidos, i, modo, fechaFocal);
  const factores = valorEnFecha(
    tiemposIncognita.map((t) => ({ t, monto: 1 })),
    i,
    modo,
    fechaFocal,
  );
  return -base / (signo * factores);
}

/* ---------------------------------------------------------------
 * 3. SERIES UNIFORMES (ANUALIDADES VENCIDAS)
 * ------------------------------------------------------------- */

/** F de una serie de n pagos iguales A (el último coincide con el depósito n). */
export function valorFuturoSerie(A: number, i: number, n: number): number {
  return i === 0 ? A * n : (A * (Math.pow(1 + i, n) - 1)) / i;
}

/** P de una serie de n pagos iguales A (primer pago al final del periodo 1). */
export function valorPresenteSerie(A: number, i: number, n: number): number {
  return i === 0 ? A * n : (A * (1 - Math.pow(1 + i, -n))) / i;
}

/** A: cuota igual para pagar un valor presente P en n pagos. */
export function cuotaDesdePresente(P: number, i: number, n: number): number {
  return i === 0 ? P / n : (P * i) / (1 - Math.pow(1 + i, -n));
}

/** A: cuota igual necesaria para acumular un valor futuro F en n pagos. */
export function cuotaDesdeFuturo(F: number, i: number, n: number): number {
  return i === 0 ? F / n : (F * i) / (Math.pow(1 + i, n) - 1);
}

/* ---------------------------------------------------------------
 * 4. TABLA PERIODO A PERIODO (la de los ejemplos 5 y 6 del libro)
 * ------------------------------------------------------------- */

export function tablaCrecimiento(P: number, i: number, n: number, modo: Modo): FilaTabla[] {
  const filas: FilaTabla[] = [];
  let saldo = P;
  for (let k = 1; k <= n; k++) {
    // Simple: el interés siempre se calcula sobre el capital original.
    const base = modo === 'simple' ? P : saldo;
    const interes = base * i;
    filas.push({ n: k, capitalInicial: saldo, interes, saldoFinal: saldo + interes });
    saldo += interes;
  }
  return filas;
}

/* ---------------------------------------------------------------
 * 5. PROYECTOR (la calculadora del diseño: capital + aporte mensual)
 * ------------------------------------------------------------- */

export interface PuntoTrayectoria {
  anio: number;
  saldo: number;
  capitalInvertido: number;
  interesAcumulado: number;
}

export interface Proyeccion {
  saldoFinal: number;
  capitalInvertido: number;
  interesGenerado: number;
  multiplicador: number;
  porcentajeInteres: number;
  anioInflexion: number | null;
  trayectoria: PuntoTrayectoria[];
}

/**
 * @param capital         depósito inicial
 * @param aporteMensual   dinero que se agrega cada mes
 * @param tasaAnualPct    tasa nominal anual en % (8.5)
 * @param anios           horizonte en años
 * @param capitalizaciones veces por año que se capitaliza (365, 12, 4, 1)
 */
export function proyectar(
  capital: number,
  aporteMensual: number,
  tasaAnualPct: number,
  anios: number,
  capitalizaciones: number,
): Proyeccion {
  const r = tasaAnualPct / 100;
  // Tasa efectiva mensual equivalente a capitalizar `capitalizaciones` veces al año.
  const im = Math.pow(1 + r / capitalizaciones, capitalizaciones / 12) - 1;

  const saldoEnMes = (meses: number) =>
    capital * Math.pow(1 + im, meses) + valorFuturoSerie(aporteMensual, im, meses);

  const trayectoria: PuntoTrayectoria[] = [];
  let anioInflexion: number | null = null;
  let saldoPrevio = capital;

  for (let a = 1; a <= anios; a++) {
    const saldo = saldoEnMes(a * 12);
    const invertido = capital + aporteMensual * 12 * a;
    const interesDelAnio = saldo - saldoPrevio - aporteMensual * 12;
    if (anioInflexion === null && aporteMensual > 0 && interesDelAnio > aporteMensual * 12) {
      anioInflexion = a;
    }
    trayectoria.push({
      anio: a,
      saldo,
      capitalInvertido: invertido,
      interesAcumulado: saldo - invertido,
    });
    saldoPrevio = saldo;
  }

  const saldoFinal = saldoEnMes(anios * 12);
  const capitalInvertido = capital + aporteMensual * 12 * anios;
  return {
    saldoFinal,
    capitalInvertido,
    interesGenerado: saldoFinal - capitalInvertido,
    multiplicador: capitalInvertido > 0 ? saldoFinal / capitalInvertido : 0,
    porcentajeInteres: saldoFinal > 0 ? ((saldoFinal - capitalInvertido) / saldoFinal) * 100 : 0,
    anioInflexion,
    trayectoria,
  };
}
