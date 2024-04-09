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
  }
  ngOnInit(): void {
    
    this.updateDates();
    setInterval(() => {
      this.updateDates();
    }, 60000); // Actualizar la fecha cada minuto
  }

  public selectedDate: Date = new Date;

elegirDia(dia: number): void {
    this.diaElegido = dia;
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
  this.usuariosservice.aniadirReserva(usuario, dia, hora, entrenador); 
  const nuevasReservas = this.usuariosservice.getReservasUsuarios();
  this.usuariosservice.setReservas(nuevasReservas);
}


getIdSesion(){
  return this.id;
}

existeReserva(idUsuario: number, idDia: number, idHora: number): boolean {
  return this.usuariosservice.existeReserva(idUsuario, idDia, idHora); 
}

onBotonPulsado() {
  this.botonPulsado = true;
}

getDiasPorUsuario(idUsuario:number):Dia[]{
  return this.usuariosservice.obtenerDiasPorUsuario(idUsuario);
}

getHorasPorUsuario(idUsuario:number, idDia:number){
  return this.usuariosservice.obtenerHorasPorUsuario(idUsuario,idDia);
}

getEntrenadoresPorUsuario(idUsuario:number, idDia:number, idHora:number){
  return this.usuariosservice.obtenerEntrenadoresPorUsuario(idUsuario, idDia, idHora);
}





}

function extend(arg0: never[], arg1: any, arg2: null, arg3: boolean): Record<string, any>[] {
  throw new Error('Function not implemented.');
}






