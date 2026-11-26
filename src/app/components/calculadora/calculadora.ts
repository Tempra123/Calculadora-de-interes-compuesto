import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CalculoInteres, Modo } from '../../services/calculo-interes';
import { CampoSlider } from '../../shared/campo-slider/campo-slider';
import { Tarjeta } from '../../shared/tarjeta/tarjeta';
import { Modal } from '../../shared/modal/modal';
import { Opcion, SelectorOpciones } from '../../shared/selector-opciones/selector-opciones';

@Component({
  selector: 'app-calculadora',
  imports: [CurrencyPipe, CampoSlider, Tarjeta, Modal, SelectorOpciones],
  templateUrl: './calculadora.html',
  styleUrl: './calculadora.scss',
})
export class Calculadora {
  private calculo = inject(CalculoInteres);

  // Opciones de los selectores (solo datos, escritos una vez)
  readonly tipos: Opcion[] = [
    { valor: 'proyector', etiqueta: 'Proyector' },
    { valor: 'pago-unico', etiqueta: 'Pago único' },
  ];
  readonly modos: Opcion[] = [
    { valor: 'compuesto', etiqueta: 'Interés compuesto' },
    { valor: 'simple', etiqueta: 'Interés simple' },
  ];
  readonly buscables: Opcion[] = [
    { valor: 'presente', etiqueta: 'Valor presente (P)' },
    { valor: 'futuro', etiqueta: 'Valor futuro (F)' },
    { valor: 'tasa', etiqueta: 'Tasa (i)' },
    { valor: 'periodos', etiqueta: 'Años (n)' },
  ];
  readonly frecuencias: Opcion[] = [
    { valor: '365', etiqueta: 'Diario' },
    { valor: '12', etiqueta: 'Mensual' },
    { valor: '4', etiqueta: 'Trimestral' },
    { valor: '1', etiqueta: 'Anual' },
  ];

  // Estado
  tipo = signal('proyector');
  modo = signal('compuesto');
  buscar = signal('presente');
  frecuencia = signal('12');
  verDetalle = signal(false);

  // Proyector
  capital = signal(25000);
  aporte = signal(500);
  tasa = signal(8.5);
  anios = signal(25);

  // Pago único
  P = signal(1000);
  F = signal(3000);
  i = signal(8);
  n = signal(5);

  // La lógica vive en el servicio; aquí solo se llama.
  proyeccion = computed(() =>
    this.calculo.proyectar(
      this.capital(), this.aporte(), this.tasa(), this.anios(), Number(this.frecuencia()),
    ),
  );

  respuesta = computed(() => {
    const m = this.modo() as Modo;
    const tasa = this.i() / 100;
    switch (this.buscar()) {
      case 'presente': return { valor: this.calculo.valorPresente(this.F(), tasa, this.n(), m), unidad: '$' };
      case 'futuro':   return { valor: this.calculo.valorFuturo(this.P(), tasa, this.n(), m), unidad: '$' };
      case 'tasa':     return { valor: this.calculo.tasaNecesaria(this.P(), this.F(), this.n(), m) * 100, unidad: '%' };
      default:         return { valor: this.calculo.periodosNecesarios(this.P(), this.F(), tasa, m), unidad: 'años' };
    }
  });

  textoRespuesta = computed(() => {
    const { valor, unidad } = this.respuesta();
    if (!Number.isFinite(valor)) return '—';
    const t = valor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return unidad === '$' ? `$${t}` : unidad === '%' ? `${t} %` : `${t} años`;
  });
}