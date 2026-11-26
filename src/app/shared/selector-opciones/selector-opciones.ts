import { Component, input, model } from '@angular/core';

export interface Opcion {
  valor: string;
  etiqueta: string;
}

@Component({
  selector: 'app-selector-opciones',
  templateUrl: './selector-opciones.html',
  styleUrl: './selector-opciones.scss',
})
export class SelectorOpciones {
  opciones = input.required<Opcion[]>();
  valor = model.required<string>();
}