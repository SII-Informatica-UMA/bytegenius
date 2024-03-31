import { Usuario } from "../Usuario";
import { Hora } from "../Hora";
import { Dia } from "../Dia";
import { HashMap } from "../HashMap";

export class UsuariosService {
    private usuarios: Usuario [] = [
        {id:1, nombre: 'Pablo', apellidos:'Muñoz', rol:'Entrenador'},
        {id:2, nombre: 'Victor', apellidos:'Rueda', rol:'Cliente'},
        {id:3, nombre: 'Jaime', apellidos: 'Garfia', rol:'Entrenador'}
    ];

    private horas: Hora[] = [
        {id:1,franjaHoraria:'9:00-10:00'},
        {id:2,franjaHoraria:'10:00-11:00'},
        {id:3,franjaHoraria:'17:00-18:00'}        
    ]

    private asignaciones: HashMap = {
      1: { 1: { idTrainer: 1 } },
      2: { 2: { idTrainer: 1 } },
      3: { 3: { idTrainer: 1 } }
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

    constructor() { }

    getUsuarios(): Usuario [] {
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
