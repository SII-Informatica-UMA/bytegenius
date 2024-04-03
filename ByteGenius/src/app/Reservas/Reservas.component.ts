
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { UsuarioService } from '../horario-cliente/horario-cliente.service'; 
import { Usuario } from "../Usuario";
import { Hora } from '../Hora';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HashMapReservas } from "../HashMapReservas";

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
  reservas:HashMapReservas={};
  constructor(private usuariosservice: UsuarioService, public modal: NgbActiveModal) { 
    this.horas = this.usuariosservice.getHoras();
    this.entrenadores = this.usuariosservice.getUsuarios().filter(usuario => usuario.rol === true);
    this.reservas = this.usuariosservice.getReservasUsuarios();
  }

  ngOnInit(): void {
    this.entrenadores = this.usuariosservice.getUsuarios().filter(usuario => usuario.rol === true);

   }

   getdiasPorUsuario(idUsuario: number): number[] {
    const usuario = this.reservas[idUsuario];
    return usuario ? Object.keys(usuario).map(Number) : [];
  }
  
  getHorasPorUsuario(idUsuario: number, idDia: number): number[] {
    const dia = this.reservas[idUsuario] ? this.reservas[idUsuario][idDia] : null;
    return dia ? Object.keys(dia).map(Number) : [];
  }
  
  getEntrenadorPorUsuario(idUsuario: number, idDia: number, idHora: number): number[] {
    const hora = this.reservas[idUsuario] && this.reservas[idUsuario][idDia] ? this.reservas[idUsuario][idDia][idHora] : null;
    return hora ? [hora.idEntrenador] : [];
  }

}
