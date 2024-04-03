import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsuarioService } from './horario-entrenador.service';
import { Dia } from '../Dia';
import { Hora } from '../Hora';
import { HashMap } from '../HashMap';
import { Usuario } from '../Usuario';
import { AppComponent } from '../app.component';

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
  usuarios: Usuario [] = [];
  id:number = 1;

  constructor(private usuariosservice: UsuarioService) {
    this.id = this.usuariosservice.getId();
   }

  ngOnInit(): void {
    this.dias = this.usuariosservice.getDias();
    this.horas = this.usuariosservice.getHoras();
    this.asignaciones = this.usuariosservice.getasignaciones();
    this.usuarios = this.usuariosservice.getUsuarios();

  }

  obtenerIdTrainer(hashMap: HashMap, idDia: number, idHora: number): number[] {
    if (hashMap[idDia] && hashMap[idDia][idHora] && hashMap[idDia][idHora].idTrainers) {
        return hashMap[idDia][idHora].idTrainers;
    } else {
        return [];
    }
}

obtenerNombres(ids: number[]): string[] {
  return ids.map(id => {
      const usuario = this.usuarios.find(u => u.id === id);
      return usuario ? usuario.nombre : '';
  });
}

estaId(ids:number[],id:number){
  return ids.includes(id);
}

eliminarHora(dia: number, hora: number): void {
  const index = this.asignaciones[dia][hora].idTrainers.indexOf(this.id);
  if (index !== -1) {
    this.asignaciones[dia][hora].idTrainers.splice(index, 1);
  }
}
agregarHora(dia: number, hora: number): void {
  if (!this.asignaciones[dia]) {
    this.asignaciones[dia] = {};
  }
  if (!this.asignaciones[dia][hora]) {
    this.asignaciones[dia][hora] = { idTrainers: [] };
  }
  this.asignaciones[dia][hora].idTrainers.push(this.id);
}



}
