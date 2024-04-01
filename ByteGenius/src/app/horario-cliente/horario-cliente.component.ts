import { Component, OnInit } from '@angular/core';
import {  EventSettingsModel, View, TimelineViewsService, ScheduleModule, DayService, } from '@syncfusion/ej2-angular-schedule';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { UsuariosService } from './horario-cliente.service'; 
import { Usuario } from "../Usuario";
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { startOfWeek, endOfWeek } from 'date-fns';


@Component({
  selector: 'app-horario-cliente',
  standalone: true,
  imports: [ScheduleModule, NgFor, CommonModule, DatePickerModule],
  providers: [DayService, UsuariosService, TimelineViewsService],
  templateUrl: './horario-cliente.component.html',
  styleUrls: ['./horario-cliente.component.css']
})

export class HorarioClienteComponent implements OnInit {
  currentDay: number = new Date().getDay(); 
  entrenadores: Usuario[] = [];
  public startDateOfWeek: Date = new Date();
  public endDateOfWeek: Date = new Date();
  mostrarTablaLunes = false;

  constructor(private UsuariosService:UsuariosService) { }
  ngOnInit(): void {
   
    this.entrenadores = this.UsuariosService.getUsuarios().filter(usuario => usuario.rol === true);
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

  mostrarTablaLunes() {
    this.mostrarTablaLunes = !this.mostrarTablaLunes;
  }

}
