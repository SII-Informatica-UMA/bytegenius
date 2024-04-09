
import { Component, EventEmitter, Injectable, OnInit, Output } from '@angular/core';
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
  @Output() reservaCancelada = new EventEmitter<{idUsuario: number, idDia: number, idHora: number}>();

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

  cancelarReserva(idUsuario: number, idDia: number, idHora: number) {
    if (this.reservas[idUsuario] && this.reservas[idUsuario][idDia] && this.reservas[idUsuario][idDia][idHora]) {
      // Eliminar la reserva del HashMap
      delete this.reservas[idUsuario][idDia][idHora];
      // Verificar si ya no hay horas reservadas para ese día
      if (Object.keys(this.reservas[idUsuario][idDia]).length === 0) {
        // Si no hay más horas reservadas para ese día, eliminar el día del HashMap
        delete this.reservas[idUsuario][idDia];
      }
      // Guardar los cambios en el almacenamiento local (opcional)
      localStorage.setItem('reservasRealizadas', JSON.stringify(this.reservas));
    }
  }
  
   
  

  cerrarModal(): void {
    this.modal.close('actualizar');
  }

  

  


}
