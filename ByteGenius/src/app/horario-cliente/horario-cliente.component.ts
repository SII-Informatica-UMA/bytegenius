import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { UsuarioServiceCliente } from './horario-cliente.service'; 
import { Usuario } from '../entities/usuario';
import { Hora } from '../Hora';
import { FormsModule } from '@angular/forms';
import { startOfWeek, endOfWeek } from 'date-fns';
import { ReservasComponent } from '../Reservas/Reservas.component';
import {NgbCalendar, NgbDate, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { HashMapReservas } from '../HashMapReservas';
import { Dia } from '../Dia';
import { UsuariosService } from '../services/usuarios.service';
import { HashMap } from '../HashMap';



@Component({
  selector: 'app-horario-cliente',
  standalone: true,
  imports: [ NgFor, CommonModule, FormsModule, ReservasComponent],
  providers: [ UsuarioServiceCliente],
  templateUrl: './horario-cliente.component.html',
  styleUrl: './horario-cliente.component.css'
})

export class HorarioClienteComponent implements OnInit {

  currentDay: number = new Date().getDay();
  diaElegido: number = 0;
  entrenadoresPorDia: Usuario[]=[];
  horarioEntrenadoresPorDia: Hora[]=[];
  mostrarReservas: boolean = false;
  public startDateOfWeek: Date = new Date();
  public endDateOfWeek: Date = new Date();
  horas:Hora[]=[];
  dias:Dia[]=[];
  entrenadores:Usuario[]=[];
  reservas:HashMapReservas={};
  id: number = 0;
  botonPulsado:boolean=false;
  today:NgbDate;
  diasDeLaSemana:NgbDateStruct[]=[];


  constructor(private usuariosservice: UsuarioServiceCliente, private modalService: NgbModal, private usuariosServiceLogin:UsuariosService, private calendar:NgbCalendar) { 
    this.horas = this.usuariosservice.getHoras();
    this.entrenadores = this.usuariosServiceLogin.getArrayEntrenadores();
    this.reservas = this.usuariosservice.getReservasUsuarios();
    this.id = usuariosServiceLogin.getSesionID() as number;
    this.today=this.calendar.getToday();
    this.diasDeLaSemana=usuariosservice.obtenerSemana(this.today);
    
    this.actualizarReservas();
  }

  ngOnInit(): void {
    this.actualizarReservas();
    this.cargarDatos();
    this.updateDates();
    setInterval(() => {
      this.updateDates();
    }, 60000); // Actualizar la fecha cada minuto
  }

  public selectedDate: Date = new Date;

  cargarDatos(): void {
    const datosGuardadosReservas = localStorage.getItem('reservasRealizadas');
    if (datosGuardadosReservas) {
      this.reservas = JSON.parse(datosGuardadosReservas);
    }

  }
  
  guardarDatos(): void {
    localStorage.setItem('reservasRealizadas', JSON.stringify(this.reservas)) ;
  }


elegirDia(dia: number): void {
    this.diaElegido = dia;
    this.actualizarReservas();
}  

entrenadoresPD(dia: number, mes: number): Usuario[] {
  return this.entrenadoresPorDia = this.usuariosservice.getEntrenadoresPorDia(dia, mes);
}


horarioEntrenadoresPD(idEntrenador: number, idDia: number, idMes: number): Hora[] {
  return this.horarioEntrenadoresPorDia = this.usuariosservice.getHorasPorEntrenador(idEntrenador, idDia, idMes);
}



updateDates(): void {
    this.startDateOfWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    this.endDateOfWeek = endOfWeek(new Date(), { weekStartsOn: 1 });
}


MostrarReservas(): void {
  let ref = this.modalService.open(ReservasComponent);
}

aniadirReserva(usuario: number, mes: number, dia: number, hora: number, entrenador: number): void {
  // Inicializa la entrada del usuario si no existe
  if (!(usuario in this.reservas)) {
    this.reservas[usuario] = {};
  }
  
  // Inicializa la entrada del mes si no existe
  if (!(mes in this.reservas[usuario])) {
    this.reservas[usuario][mes] = {};
  }
  
  // Inicializa la entrada del día si no existe
  if (!(dia in this.reservas[usuario][mes])) {
    this.reservas[usuario][mes][dia] = {};
  }
  
  // Agrega la información de la reserva
  this.reservas[usuario][mes][dia][hora] = { idEntrenador: entrenador };
  this.guardarDatos();
  this.actualizarReservas();
}



getIdSesion(){
  return this.id;
}

actualizarReservas(): void {
  const reservasGuardadas = localStorage.getItem('reservasRealizadas');
  if (reservasGuardadas) {
    this.reservas = JSON.parse(reservasGuardadas);
  }
}

existeReserva(idUsuario: number, idDia: number, idHora: number, idMes:number): boolean { 
  this.actualizarReservas();
  return this.usuariosservice.existeReserva(idUsuario, idDia, idHora, idMes); 
}

onBotonPulsado() {
  this.botonPulsado = true;
}

getDiasPorUsuario(idUsuario:number, reservas:HashMapReservas):Dia[]{
  return this.usuariosservice.obtenerDiasPorUsuario(idUsuario, reservas);
}

getHorasPorUsuario(idUsuario:number,idMes:number, idDia:number, reservas:HashMapReservas){
  return this.usuariosservice.obtenerHorasPorUsuario(idUsuario,idMes, idDia, reservas);
}

getEntrenadoresPorUsuario(idUsuario: number, idMes: number, idDia: number, idHora: number, reservas: HashMapReservas) {
  return this.usuariosservice.obtenerEntrenadoresPorUsuario(idUsuario, idMes, idDia, idHora, reservas);
}

onReservaCancelada(eventData: {idUsuario: number, idMes: number, idDia: number, idHora: number}) {
  // Actualizar el HashMapReservas del componente HorarioClienteComponent
  this.cancelarReserva(eventData.idUsuario, eventData.idDia, eventData.idHora, eventData.idMes);
}

cancelarReserva(idUsuario: number,idMes:number, idDia: number, idHora: number) {
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





//comentario


}

function extend(arg0: never[], arg1: any, arg2: null, arg3: boolean): Record<string, any>[] {
  throw new Error('Function not implemented.');
}






