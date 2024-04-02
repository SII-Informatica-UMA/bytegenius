import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HorarioEntrenadorComponent } from './horario-entrenador/horario-entrenador.component';
import { HorarioClienteComponent } from './horario-cliente/horario-cliente.component';
import { AppComponentService } from './app.component.service';
import { Usuario } from './Usuario';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HorarioClienteComponent, HorarioEntrenadorComponent,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  usuarios: Usuario[] = []
  usuario?: Usuario;
  isTrainer?: boolean;
  id1: number = 1;



  constructor(private usuariosservice: AppComponentService) { }

  ngOnInit(): void{
    this.usuarios = this.usuariosservice.getUsuarios();
    this.elegirContacto(1);
    this.isTrainer = this.usuario?.rol;

  }

  elegirContacto(id: number): void {
    this.usuario = this.usuarios.at(id-1);
    this.isTrainer = this.usuario?.rol;

  }

}
