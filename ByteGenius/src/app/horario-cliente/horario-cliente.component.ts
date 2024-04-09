import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { UsuarioServiceCliente } from './horario-cliente.service'; 
import { Usuario } from '../entities/usuario';
import { Hora } from '../Hora';
import { FormsModule } from '@angular/forms';
import { startOfWeek, endOfWeek } from 'date-fns';
import { ReservasComponent } from '../Reservas/Reservas.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { HashMapReservas } from '../HashMapReservas';
import { Dia } from '../Dia';
import { UsuariosService } from '../services/usuarios.service';



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


  constructor(private usuariosservice: UsuarioServiceCliente, private modalService: NgbModal, private usuariosServiceLogin:UsuariosService) { 
    this.horas = this.usuariosservice.getHoras();
    this.entrenadores = this.usuariosServiceLogin.getArrayEntrenadores();
    this.reservas = this.usuariosservice.getReservasUsuarios();
    this.id = usuariosServiceLogin.getSesionID() as number;

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
    const datosGuardados = localStorage.getItem('horarioEntrenadores');
    if (datosGuardados) {
      this.horarioEntrenadoresPD = JSON.parse(datosGuardados);
    }
    const datosGuardadosReservas = localStorage.getItem('reservasRealizadas');
    if (datosGuardadosReservas) {
      this.reservas = JSON.parse(datosGuardadosReservas);
    }
  }
  
  guardarDatos(): void {
    localStorage.setItem('horarioEntrenadoresPD', JSON.stringify(this.horarioEntrenadoresPD));
    localStorage.setItem('reservasRealizadas', JSON.stringify(this.reservas)) ;
  }


elegirDia(dia: number): void {
    this.diaElegido = dia;
    this.actualizarReservas();
}  

entrenadoresPD(dia:number):Usuario[]{
  return this.entrenadoresPorDia=this.usuariosservice.getEntrenadoresPorDia(dia);
}

horarioEntrenadoresPD(idEntrenador:number, idDia:number):Hora[]{
  return this.horarioEntrenadoresPorDia=this.usuariosservice.getHorasPorEntrenador(idEntrenador, idDia);
}


updateDates(): void {
    this.startDateOfWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    this.endDateOfWeek = endOfWeek(new Date(), { weekStartsOn: 1 });
}


MostrarReservas(): void {
  let ref = this.modalService.open(ReservasComponent);
}

aniadirReserva(usuario: number, dia: number, hora: number, entrenador: number): void {
  // Inicializa la entrada del usuario si no existe
  if (!(usuario in this.reservas)) {
    this.reservas[usuario] = {};
    this.guardarDatos();
  }
  // Inicializa la entrada del día si no existe
  if (!(dia in this.reservas[usuario])) {
    this.reservas[usuario][dia] = {};
    this.guardarDatos();
  }
  // Agrega la información de la reserva
  this.reservas[usuario][dia][hora] = { idEntrenador: entrenador };
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

existeReserva(idUsuario: number, idDia: number, idHora: number): boolean { 
  this.actualizarReservas();
  return this.usuariosservice.existeReserva(idUsuario, idDia, idHora); 
}

onBotonPulsado() {
  this.botonPulsado = true;
}

getDiasPorUsuario(idUsuario:number, reservas:HashMapReservas):Dia[]{
  return this.usuariosservice.obtenerDiasPorUsuario(idUsuario, reservas);
}

getHorasPorUsuario(idUsuario:number, idDia:number, reservas:HashMapReservas){
  return this.usuariosservice.obtenerHorasPorUsuario(idUsuario,idDia, reservas);
}

getEntrenadoresPorUsuario(idUsuario:number, idDia:number, idHora:number, reservas:HashMapReservas){
  return this.usuariosservice.obtenerEntrenadoresPorUsuario(idUsuario, idDia, idHora, reservas);
}





}

function extend(arg0: never[], arg1: any, arg2: null, arg3: boolean): Record<string, any>[] {
  throw new Error('Function not implemented.');
}






