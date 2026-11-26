import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  abierto = input(false);
  titulo = input('');
  cerrar = output<void>();
}