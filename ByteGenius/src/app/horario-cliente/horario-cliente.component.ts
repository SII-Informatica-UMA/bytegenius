import { Component, OnInit } from '@angular/core';
import {  EventSettingsModel, View, TimelineViewsService, ScheduleModule, DayService, MonthAgendaService, MonthService, WeekService, WorkWeekService} from '@syncfusion/ej2-angular-schedule';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { UsuariosService } from './horario-cliente.service'; 
import { Usuario } from "../Usuario";
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';


@Component({
  selector: 'app-horario-cliente',
  standalone: true,
  imports: [ScheduleModule, NgFor, CommonModule, DatePickerModule],
  providers: [DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService, UsuariosService, TimelineViewsService],
  templateUrl: './horario-cliente.component.html',
  styleUrl: './horario-cliente.component.css'
})

export class HorarioClienteComponent implements OnInit {
  currentDay: number = new Date().getDay(); // Obtener el día actual
  mostrarCalendarioFlag: boolean = false;
  entrenadores: Usuario[] = [];

  constructor(private UsuariosService:UsuariosService) { }
  ngOnInit(): void {
    const currentDate = new Date();
    this.currentDay = currentDate.getDay();
    this.entrenadores = this.UsuariosService.getUsuarios().filter(usuario => usuario.rol === 'Entrenador');
    
  }

  //SyncFussion
  public selectedDate: Date = new Date;
  public currentView: View = 'TimelineDay';
  public workDays: number[] = [0, 1, 2, 3, 4, 5];


getCurrentDay(): number {
  return (this.currentDay === 0) ? 7 : this.currentDay;
}

getDayClass(dayNumber: number): string {
  const currentDayOfWeek = new Date().getDay(); // 0 (Domingo) a 6 (Sábado)
  let targetDay = currentDayOfWeek + dayNumber;
  if (targetDay > 7) {
    targetDay -= 7;
  }
  return targetDay.toString();
}

toggleCalendario(day: number): void {
  this.mostrarCalendarioFlag = !this.mostrarCalendarioFlag;
}





}
function extend(arg0: never[], arg1: any, arg2: null, arg3: boolean): Record<string, any>[] {
  throw new Error('Function not implemented.');
}

