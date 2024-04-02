import { Component, OnInit } from '@angular/core';
import {  EventSettingsModel, View, TimelineViewsService, ScheduleModule, DayService, MonthAgendaService, MonthService, WeekService, WorkWeekService} from '@syncfusion/ej2-angular-schedule';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { UsuarioService } from './horario-cliente.service'; 
import { Usuario } from "../Usuario";
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { startOfWeek, endOfWeek } from 'date-fns';


@Component({
  selector: 'app-horario-cliente',
  standalone: true,
  imports: [ScheduleModule, NgFor, CommonModule, DatePickerModule],
  providers: [DayService, UsuariosService, TimelineViewsService],
  templateUrl: './horario-cliente.component.html',
  styleUrl: './horario-cliente.component.css'
})

export class HorarioClienteComponent implements OnInit {
  currentDay: number = new Date().getDay(); // Obtener el día actual
  mostrarCalendarioFlag: boolean = false;
  entrenadores: Usuario[] = [];
  public startDateOfWeek: Date = new Date();
  public endDateOfWeek: Date = new Date();
  constructor(private usuariosservice: UsuarioService) { }
  ngOnInit(): void {
   
    this.entrenadores = this.UsuarioService.getUsuarios().filter(usuario => usuario.rol === true);
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

