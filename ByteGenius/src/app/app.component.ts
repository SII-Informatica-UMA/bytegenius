import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HorarioEntrenadorComponent } from './horario-entrenador/horario-entrenador.component';
import { HorarioClienteComponent } from './horario-cliente/horario-cliente.component';
import { AppComponentService } from './app.component.service';
import { Usuario } from './Usuario';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HorarioClienteComponent, HorarioEntrenadorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  usuarios: Usuario[] = []
  usuario?: Usuario;

  title = 'ByteGenius';
  user = 'Lui';
  isTrainer = true;

  constructor(private usuariosservice: AppComponentService) { }

  ngOnInit(): void{
    this.usuarios = this.usuariosservice.getUsuarios();
  }

  elegirContacto(id: number): void {
    this.usuario = this.usuarios.at(id-1);
  }

}
