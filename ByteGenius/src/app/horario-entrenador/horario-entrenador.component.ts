import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import {UsuarioService } from './horario-entrenador.service';
import { Dia } from '../Dia';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-horario-entrenador',
  standalone: true,
  imports: [CommonModule,NgFor],
  templateUrl: './horario-entrenador.component.html',
  styleUrl: './horario-entrenador.component.css'
})
export class HorarioEntrenadorComponent {
  dias: Dia [] = [];

  constructor(private usuariosService:UsuarioService) { }


  ngOnInit(): void {
    this.dias = this.usuariosService.getDias();
  }



}
