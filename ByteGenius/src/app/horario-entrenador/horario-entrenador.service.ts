import { Usuario } from "../entities/usuario";
import { Hora } from "../Hora";
import { Dia } from "../Dia";
import { HashMap } from "../HashMap";
import { Injectable } from '@angular/core';
import { AppComponentService } from "../app.component.service";
import { FormsModule } from "@angular/forms";
import { BackendFakeService } from "../services/backend.fake.service";

@Injectable({
  providedIn: 'root'
})

export class UsuarioServiceEntrenador {
  
  
  private usuarios: Usuario[]= [];
  constructor(private usuario: AppComponentService, private backendService:BackendFakeService) {
      this.backendService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;});
   }

    private horas: Hora[] = [
        {id:1,franjaHoraria:'9:00'},
        {id:2,franjaHoraria:'10:00'},
        {id:3,franjaHoraria:'11:00'},
        {id:4,franjaHoraria:'12:00'},
        {id:5,franjaHoraria:'13:00'},
        {id:6,franjaHoraria:'14:00'},
        {id:7,franjaHoraria:'15:00'},
        {id:8,franjaHoraria:'16:00'},
        {id:9,franjaHoraria:'17:00'},
        {id:10,franjaHoraria:'18:00'},
        {id:11,franjaHoraria:'19:00'},
        {id:12,franjaHoraria:'20:00'},
        {id:13,franjaHoraria:'21:00'},        
    ]

    private asignaciones: HashMap = {
  };

    private dias: Dia [] = [
      {id:1, nombre:'Lunes'},
      {id:2, nombre:'Martes'},
      {id:3, nombre:'Miercoles'},
      {id:4, nombre:'Jueves'},
      {id:5, nombre:'Viernes'},
      {id:6, nombre:'Sabado'},
      {id:7, nombre:'Domingo'}
      ]

      getUsuarios(): Usuario[] {
        return this.usuarios;
      }

    getasignaciones(): HashMap {
      return this.asignaciones;
    }
    
    getHoras(): Hora []{
      return this.horas;
    }

    getDias(): Dia  []{
      return this.dias;
    }

    
}
