
import { Component, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { UsuarioServiceCliente} from '../horario-cliente/horario-cliente.service'; 
import { Hora } from '../Hora';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HashMapReservas } from "../HashMapReservas";
import { Dia } from '../Dia';
import { Usuario } from "../entities/usuario";

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

   getDiasPorUsuario(idUsuario:number, reservas:HashMapReservas):Dia[]{
      return this.usuariosservice.obtenerDiasPorUsuario(idUsuario, reservas);
   }
  
  getHorasPorUsuario(idUsuario: number, idDia: number, reservas:HashMapReservas): Hora[]{
      return this.usuariosservice.obtenerHorasPorUsuario(idUsuario, idDia, reservas);
  }
  
  getEntrenadorPorUsuario(idUsuario: number, idDia: number, idHora: number, reservas: HashMapReservas) :Usuario[]{
    return this.usuariosservice.obtenerEntrenadoresPorUsuario(idUsuario, idDia, idHora, reservas);
  }

  

  cerrarModal(): void {
    this.modal.close('actualizar');
  }

  


}
