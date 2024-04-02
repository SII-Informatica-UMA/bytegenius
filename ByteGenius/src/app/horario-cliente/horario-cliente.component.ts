import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { UsuarioService } from './horario-cliente.service'; 
import { Usuario } from "../Usuario";
import { Hora } from '../Hora';
import { startOfWeek, endOfWeek } from 'date-fns';


@Component({
  selector: 'app-horario-cliente',
  standalone: true,
  imports: [ NgFor, CommonModule],
  providers: [ UsuarioService],
  templateUrl: './horario-cliente.component.html',
  styleUrl: './horario-cliente.component.css'
})

export class HorarioClienteComponent implements OnInit {
  currentDay: number = new Date().getDay(); // Obtener el día actual
  mostrarCalendarioFlag: boolean = false;
  entrenadores: Usuario[] = [];
  public startDateOfWeek: Date = new Date();
  public endDateOfWeek: Date = new Date();
  horas:Hora[]=[];
  constructor(private usuariosservice: UsuarioService) { 
    this.horas = this.usuariosservice.getHoras();
    
  }
  ngOnInit(): void {
   
    this.entrenadores = this.usuariosservice.getUsuarios().filter(usuario => usuario.rol === true);
    this.updateDates();
    setInterval(() => {
      this.updateDates();
    }, 60000); // Actualizar la fecha cada minuto
  }

  public selectedDate: Date = new Date;


updateDates(): void {
    this.startDateOfWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    this.endDateOfWeek = endOfWeek(new Date(), { weekStartsOn: 1 });
}


toggleCalendario(day: number): void {
  this.mostrarCalendarioFlag = !this.mostrarCalendarioFlag;
}


}
function extend(arg0: never[], arg1: any, arg2: null, arg3: boolean): Record<string, any>[] {
  throw new Error('Function not implemented.');
}

