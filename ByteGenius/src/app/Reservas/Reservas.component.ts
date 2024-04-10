
import { Component, EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { UsuarioServiceCliente} from '../horario-cliente/horario-cliente.service'; 
import { Hora } from '../Hora';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { HashMapReservas } from "../HashMapReservas";
import { Dia } from '../Dia';
import { Usuario } from "../entities/usuario";
import { UsuariosService } from '../services/usuarios.service';


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
  today:NgbDate;
  diasDeLaSemana:NgbDateStruct[]=[];
  @Output() reservaCancelada = new EventEmitter<{idUsuario: number,idMes:number, idDia: number, idHora: number}>();
  id: number = 0;

  constructor(private usuariosservice: UsuarioServiceCliente, public modal: NgbActiveModal, private usuariosServiceLogin:UsuariosService, calendar:NgbCalendar) { 
    this.horas = this.usuariosservice.getHoras();
    this.id = usuariosServiceLogin.getSesionID() as number;
    this.today= calendar.getToday();
    this.diasDeLaSemana=usuariosservice.obtenerSemana(this.today);
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
  
  getHorasPorUsuario(idUsuario: number,idMes:number, idDia: number, reservas:HashMapReservas): Hora[]{
      return this.usuariosservice.obtenerHorasPorUsuario(idUsuario,idMes, idDia, reservas);
  }
  
  getEntrenadorPorUsuario(idUsuario: number, idMes: number, idDia: number, idHora: number, reservas: HashMapReservas) :Usuario[]{
    return this.usuariosservice.obtenerEntrenadoresPorUsuario(idUsuario,idMes, idDia, idHora, reservas);
  }

  cancelarReserva(idUsuario: number,  idMes: number, idDia: number, idHora: number) {
    if (this.reservas[idUsuario] && this.reservas[idUsuario][idMes] && this.reservas[idUsuario][idMes][idDia] && this.reservas[idUsuario][idMes][idDia][idHora]) {
        // Eliminar la reserva del HashMap
        delete this.reservas[idUsuario][idMes][idDia][idHora];
        // Verificar si ya no hay horas reservadas para ese día
        if (Object.keys(this.reservas[idUsuario][idMes][idDia]).length === 0) {
            // Si no hay más horas reservadas para ese día, eliminar el día del HashMap
            delete this.reservas[idUsuario][idMes][idDia];
        }
        // Verificar si ya no hay días reservados para ese mes
        if (Object.keys(this.reservas[idUsuario][idMes]).length === 0) {
            // Si no hay más días reservados para ese mes, eliminar el mes del HashMap
            delete this.reservas[idUsuario][idMes];
        }
        // Guardar los cambios en el almacenamiento local (opcional)
        localStorage.setItem('reservasRealizadas', JSON.stringify(this.reservas));
    }
}

  
   
  
  getIdSesion(){
    return this.id;
  }

  cerrarModal(): void {
    this.modal.close('actualizar');
  }

  

  


}
