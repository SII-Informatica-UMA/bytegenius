import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HorarioEntrenadorComponent } from './horario-entrenador/horario-entrenador.component';
import { HorarioClienteComponent } from './horario-cliente/horario-cliente.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HorarioClienteComponent, HorarioEntrenadorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ByteGenius';
  user = 'Lui';
  isTrainer = true;
}
