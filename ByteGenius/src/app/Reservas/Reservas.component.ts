
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { UsuarioService } from '../horario-cliente/horario-cliente.service'; 
import { Usuario } from "../Usuario";
import { Hora } from '../Hora';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  diasPorUsuario:number[] = [];
  horaPorUsuario:number[] = [];
  entrenadorPorUsuario:number[] = [];

  constructor(private usuariosservice: UsuarioService, public modal: NgbActiveModal) { 
    this.horas = this.usuariosservice.getHoras();
    this.entrenadores = this.usuariosservice.getUsuarios().filter(usuario => usuario.rol === true);
    
  }

  ngOnInit(): void {
    this.entrenadores = this.usuariosservice.getUsuarios().filter(usuario => usuario.rol === true);

   }

   getdiasPorUsuario(idUsuario:number): number[]{
      return this.usuariosservice.obtenerIdDias(idUsuario);
   };

   getHorasPorUsuario(idUsuario:number, idDia:number): number[]{
     return this.usuariosservice.obtenerIdHoras(idUsuario, idDia);
   }

    getEntrenadorPorUsuario(idUsuario:number, idDia:number, idHora:number): number[]{
        return this.usuariosservice.obtenerIdEntrenadores(idUsuario, idDia, idHora);
    }

}
