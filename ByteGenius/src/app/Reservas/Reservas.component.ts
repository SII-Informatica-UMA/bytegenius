
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { UsuarioService } from '../horario-cliente/horario-cliente.service'; 
import { Usuario } from "../Usuario";
import { Hora } from '../Hora';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HashMapReservas } from "../HashMapReservas";
import { Dia } from '../Dia';

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

export class ReservasComponent implements OnInit { entrenadores: Usuario[] = [];
  horas:Hora[]=[];
  dias:Dia[]=[];
  reservas:HashMapReservas={};
  constructor(private usuariosservice: UsuarioService, public modal: NgbActiveModal) { 
    this.horas = this.usuariosservice.getHoras();
    this.reservas = this.usuariosservice.getReservasUsuarios();
  }

  ngOnInit(): void {
    this.entrenadores = this.usuariosservice.getUsuarios().filter(usuario => usuario.rol === true);
    this.reservas = this.usuariosservice.getReservasUsuarios();
   }

   getDiasPorUsuario(idUsuario:number):Dia[]{
      return this.usuariosservice.obtenerDiasPorUsuario(idUsuario);
   }
  
  getHorasPorUsuario(idUsuario: number, idDia: number): Hora[]{
      return this.usuariosservice.obtenerHorasPorUsuario(idUsuario, idDia);
  }
  
  getEntrenadorPorUsuario(idUsuario: number, idDia: number, idHora: number) :Usuario[]{
    return this.usuariosservice.obtenerEntrenadoresPorUsuario(idUsuario, idDia, idHora);
  }

}
