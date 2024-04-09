
import { Component, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { UsuarioServiceCliente} from '../horario-cliente/horario-cliente.service'; 
import { Usuario } from "../Usuario";
import { Hora } from '../Hora';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HashMapReservas } from "../HashMapReservas";
import { Dia } from '../Dia';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [ CommonModule],
  providers: [ UsuarioServiceCliente],
  templateUrl: './Reservas.component.html',
  styleUrl: './Reservas.component.css',
})

export class ReservasComponent implements OnInit { 
  entrenadores: Usuario[] = [];
  horas:Hora[]=[];
  dias:Dia[]=[];
  reservas:HashMapReservas={};

  constructor(private usuariosservice: UsuarioServiceCliente, public modal: NgbActiveModal) { 
    this.horas = this.usuariosservice.getHoras();
    
  }

  ngOnInit(): void {
    this.cargarDatos();
   }


   cargarDatos(): void {
    const datosGuardadosReservas = localStorage.getItem('reservasRealizadas');
    if (datosGuardadosReservas) {
      this.reservas = JSON.parse(datosGuardadosReservas);
    }
  }

   getDiasPorUsuario(idUsuario:number):Dia[]{
      return this.usuariosservice.obtenerDiasPorUsuario(idUsuario);
   }
  
  getHorasPorUsuario(idUsuario: number, idDia: number): Hora[]{
      return this.usuariosservice.obtenerHorasPorUsuario(idUsuario, idDia);
  }
  
  // getEntrenadorPorUsuario(idUsuario: number, idDia: number, idHora: number) :Usuario[]{
  //   return this.usuariosservice.obtenerEntrenadoresPorUsuario(idUsuario, idDia, idHora);
  // }

  

  cerrarModal(): void {
    this.modal.close('actualizar');
  }

  


}
