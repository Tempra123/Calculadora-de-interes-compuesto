import { Injectable } from '@angular/core';
import * as f from './formulas';

export * from './formulas';

/**
 * Servicio Angular: expone las fórmulas para inyectarlas en los componentes.
 * Uso en un componente:  private calculo = inject(CalculoInteres);
 */
@Injectable({ providedIn: 'root' })
export class CalculoInteres {
  valorFuturo = f.valorFuturo;
  valorPresente = f.valorPresente;
  interesGanado = f.interesGanado;
  tasaNecesaria = f.tasaNecesaria;
  periodosNecesarios = f.periodosNecesarios;
  periodosParaMultiplicar = f.periodosParaMultiplicar;
  reglaDel72 = f.reglaDel72;
  valorEnFecha = f.valorEnFecha;
  resolverIncognita = f.resolverIncognita;
  valorFuturoSerie = f.valorFuturoSerie;
  valorPresenteSerie = f.valorPresenteSerie;
  cuotaDesdePresente = f.cuotaDesdePresente;
  cuotaDesdeFuturo = f.cuotaDesdeFuturo;
  tablaCrecimiento = f.tablaCrecimiento;
  proyectar = f.proyectar;
}
