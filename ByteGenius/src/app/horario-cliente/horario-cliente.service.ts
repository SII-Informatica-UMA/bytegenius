import { Usuario } from "../Usuario";
import { Hora } from "../Hora";
import { Dia } from "../Dia";
import { HashMapReservas } from "../HashMapReservas";
import { HashMap } from "../HashMap";
import { AppComponentService } from "../app.component.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
    
  private usuarios: Usuario[]= [
    {id:5, nombre:'Jaime', apellidos:'Garfia', rol: true},
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

    private ReservasUsuarios: HashMapReservas = {
      1: { // idUsuario
        1: { // idDia
          1: { // idHora
            idEntrenador: 5
          },
        },
        2: { // otro idDia
          1: { // idHora
            idEntrenador: 3
          }
        }
      },

      6: { // otro idUsuario
        1: { // idDia
          1: { // idHora
            idEntrenador: 4
          }
        }
      }
    };

    private asignaciones: HashMap = {
      1: {
          1: { idTrainers: [1, 2 ,3] }, 
          2: {idTrainers: [4]}
      },
      4: {
          1: { idTrainers: [3] }
      },
      2: {
          2: { idTrainers: [2, 4] }
      },
      3: {
          3: { idTrainers: [1, 3, 2] }
      }

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
            const idTrainers = asignacionesParaDia[key].idTrainers; // Ahora es un array de IDs
            // Itera sobre cada ID de entrenador en la lista
            idTrainers.forEach(id => {
              const entrenador = this.usuarios.find(u => u.id === id);
              if (entrenador) {
                entrenadoresPorDia.push(entrenador);
              }
            });
          }
        }
        return entrenadoresPorDia;
      }

      getHorasPorEntrenador(idEntrenador: number): Hora[] {
        const horasEntrenador: Hora[] = [];
        // Iterar sobre todas las asignaciones
        for (const dia in this.asignaciones) {
          for (const hora in this.asignaciones[dia]) {
            // Verificar si el entrenador está asignado a esta hora
            if (this.asignaciones[dia][hora].idTrainers.includes(idEntrenador)) {
              // Obtener la hora correspondiente y agregarla al array
              const horaObj = this.horas.find(h => h.id === parseInt(hora));
              if (horaObj) {
                horasEntrenador.push(horaObj);
              }
            }
          }
        }
        return horasEntrenador;
      }

      
      getHoras(): Hora []{
        return this.horas;
      }
  
      getDias(): Dia  []{
        return this.dias;
      }

      obtenerIdDias(idUsuario: number): number[] {
        const usuario = this.ReservasUsuarios[idUsuario];
        return usuario ? Object.keys(usuario).map(Number) : [];
      }
    
      obtenerIdHoras(idUsuario: number, idDia: number): number[] {
        const dia = this.ReservasUsuarios[idUsuario] ? this.ReservasUsuarios[idUsuario][idDia] : null;
        return dia ? Object.keys(dia).map(Number) : [];
      }
    
      obtenerIdEntrenadores(idUsuario: number, idDia: number, idHora: number): number[] {
        const hora = this.ReservasUsuarios[idUsuario] && this.ReservasUsuarios[idUsuario][idDia] ? this.ReservasUsuarios[idUsuario][idDia][idHora] : null;
        return hora ? [hora.idEntrenador] : [];
      }

      getReservasUsuarios():HashMapReservas{
        return this.ReservasUsuarios;
      }
    
}
export { Hora, Usuario };

