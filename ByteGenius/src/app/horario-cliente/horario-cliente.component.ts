import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { UsuarioService } from './horario-cliente.service'; 
import { Usuario } from "../Usuario";
import { Hora } from '../Hora';
import { FormsModule } from '@angular/forms';
import { startOfWeek, endOfWeek } from 'date-fns';
import { ReservasComponent } from '../Reservas/Reservas.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-horario-cliente',
  standalone: true,
  imports: [ NgFor, CommonModule, FormsModule, ReservasComponent],
  providers: [ UsuarioService],
  templateUrl: './horario-cliente.component.html',
  styleUrl: './horario-cliente.component.css'
})

export class HorarioClienteComponent implements OnInit {
  currentDay: number = new Date().getDay();
  mostrarCalendarioFlag: boolean = false;
  entrenadores: Usuario[] = [];
  diaElegido: number = 0;
  entrenadoresPorDia: Usuario[]=[];
  horarioEntrenadoresPorDia: Hora[]=[];
  mostrarReservas: boolean = false;


  
  public startDateOfWeek: Date = new Date();
  public endDateOfWeek: Date = new Date();
  horas:Hora[]=[];
  constructor(private usuariosservice: UsuarioService, private modalService: NgbModal) { 
    this.horas = this.usuariosservice.getHoras();
    this.entrenadores = this.usuariosservice.getUsuarios().filter(usuario => usuario.rol === true);
    
  }
  ngOnInit(): void {
   
    this.entrenadores = this.usuariosservice.getUsuarios().filter(usuario => usuario.rol === true);
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

horarioEntrenadoresPD(idEntrenador:number):Hora[]{
  return this.horarioEntrenadoresPorDia=this.usuariosservice.getHorasPorEntrenador(idEntrenador);
}


updateDates(): void {
    this.startDateOfWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    this.endDateOfWeek = endOfWeek(new Date(), { weekStartsOn: 1 });
}


toggleCalendario(day: number): void {
  this.mostrarCalendarioFlag = !this.mostrarCalendarioFlag;
}

MostrarReservas(): void {
  let ref = this.modalService.open(ReservasComponent);
}


}


function extend(arg0: never[], arg1: any, arg2: null, arg3: boolean): Record<string, any>[] {
  throw new Error('Function not implemented.');
}






