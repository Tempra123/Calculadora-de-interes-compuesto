import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.html',
  styleUrl: './tarjeta.scss',
})
export class Tarjeta {
  titulo = input.required<string>();
  texto = input('');
}