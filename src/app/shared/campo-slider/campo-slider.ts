import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-campo-slider',
  templateUrl: './campo-slider.html',
  styleUrl: './campo-slider.scss',
})
export class CampoSlider {
  etiqueta = input.required<string>();
  min = input(0);
  max = input(100);
  paso = input(1);
  prefijo = input('');
  sufijo = input('');

  // model() permite enlazar con [(valor)] en ambos sentidos
  valor = model.required<number>();

  alCambiar(evento: Event) {
    const n = (evento.target as HTMLInputElement).valueAsNumber;
    if (!Number.isNaN(n)) this.valor.set(n);
  }
}