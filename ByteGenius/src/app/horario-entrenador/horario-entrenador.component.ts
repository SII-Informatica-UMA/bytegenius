import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsuarioService } from './horario-entrenador.service';
import { Dia } from '../Dia';
import { Hora } from '../Hora';
import { HashMap } from '../HashMap';

@Component({
  selector: 'app-horario-entrenador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horario-entrenador.component.html',
  styleUrl: './horario-entrenador.component.css'
})

export class HorarioEntrenadorComponent {
  dias: Dia [] = [];
  horas: Hora [] = [];
  asignaciones: HashMap = [];

  constructor(private usuariosservice: UsuarioService) { }

  ngOnInit(): void {
    this.dias = this.usuariosservice.getDias();
    this.horas = this.usuariosservice.getHoras();
    this.asignaciones = this.usuariosservice.getasignaciones();
  }

  obtenerIdTrainer(hashMap: HashMap, idDia: number, idHora: number): number {
    if (hashMap[idDia] && hashMap[idDia][idHora]) {
      return hashMap[idDia][idHora].idTrainer;
    } else {
      return 0;
    }
  }
}
