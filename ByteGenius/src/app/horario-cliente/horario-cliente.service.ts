import { Usuario } from "../Usuario";
import { Hora } from "../Hora";
import { Dia } from "../Dia";
import { HashMap } from "../HashMap";
import { AppComponentService } from "../app.component.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
    
  private usuarios: Usuario[]= [
    {id:1, nombre:'Jaime', apellidos:'Garfia', rol: true},
    {id:2, nombre:'Victor', apellidos:'Rueda', rol: true},
    {id:3, nombre:'Pablo', apellidos:'Muñoz', rol: true},
    {id:4, nombre:'Juan Diego', apellidos:'Alba', rol: true}

  ]

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
      1: { 1: { idTrainer: 1 } },
      4: { 1: { idTrainer: 3 } },
      2: { 2: { idTrainer: 2 } },
      3: { 3: { idTrainer: 4 } },
    };

      //Dia - Hora - Entrenador

    private dias: Dia [] = [
      {id:1, nombre:'Lunes'},
      {id:2, nombre:'Martes'},
      {id:3, nombre:'Miercoles'},
      {id:4, nombre:'Jueves'},
      {id:5, nombre:'Viernes'},
      {id:6, nombre:'Sabado'},
      {id:7, nombre:'Domingo'}
      ]


    

      constructor(private usuario: AppComponentService) { }

      getUsuarios(): Usuario[] {
        return this.usuarios;
      }
  
      getasignaciones(): HashMap {
        return this.asignaciones;
      }

      getEntrenadoresPorDia(dia: number): Usuario[] {
        const entrenadoresPorDia: Usuario[] = [];
        const asignacionesParaDia = this.asignaciones[dia];
        if (asignacionesParaDia) {
          for (let key in asignacionesParaDia) {
            const idTrainer = asignacionesParaDia[key].idTrainer;
            const entrenador = this.usuarios.find(u => u.id === idTrainer);
            if (entrenador) {
              entrenadoresPorDia.push(entrenador);
            }
          }
        }
        return entrenadoresPorDia;
      }
    
      
      getHoras(): Hora []{
        return this.horas;
      }
  
      getDias(): Dia  []{
        return this.dias;
      }
    
}
export { Hora, Usuario };

