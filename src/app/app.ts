import { Component } from '@angular/core';
import { Calculadora } from './components/calculadora/calculadora';

@Component({
  selector: 'app-root',
  imports: [Calculadora],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}