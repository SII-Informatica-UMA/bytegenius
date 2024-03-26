import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import {UsuarioService } from './horario-entrenador.service';
import { Dia } from '../Dia';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { Hora } from '../Hora';

@Component({
  selector: 'app-horario-entrenador',
  standalone: true,
  imports: [CommonModule,NgFor],
  templateUrl: './horario-entrenador.component.html',
  styleUrl: './horario-entrenador.component.css'
})
export class HorarioEntrenadorComponent {
  dias: Dia [] = [];
  horas: Hora [] = [];

  constructor(private usuariosservice: UsuarioService) { }


  ngOnInit(): void {
    this.dias = this.usuariosservice.getDias();
  }



}
