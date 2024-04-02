
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { UsuarioService } from '../horario-cliente/horario-cliente.service'; 
import { Usuario } from "../Usuario";
import { Hora } from '../Hora';
import { FormsModule } from '@angular/forms';
import { startOfWeek, endOfWeek } from 'date-fns';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule, 
  ],

  providers: [ UsuarioService],
  templateUrl: './Reservas.component.html',
  styleUrl: './Reservas.component.css',
})
export class ReservasComponent implements OnInit {
  entrenadores: Usuario[] = [];
  horas:Hora[]=[];

  constructor(private usuariosservice: UsuarioService) { 
    this.horas = this.usuariosservice.getHoras();
    this.entrenadores = this.usuariosservice.getUsuarios().filter(usuario => usuario.rol === true);
  }
  ngOnInit(): void {
    this.entrenadores = this.usuariosservice.getUsuarios().filter(usuario => usuario.rol === true);

   }

}
