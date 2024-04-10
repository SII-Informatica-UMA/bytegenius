import { Usuario } from "../entities/usuario";
import { Hora } from "../Hora";
import { Dia } from "../Dia";
import { HashMapReservas } from "../HashMapReservas";
import { HashMap } from "../HashMap";
import { AppComponentService } from "../app.component.service";
import { Injectable, OnInit } from "@angular/core";
import { BackendFakeService } from "../services/backend.fake.service";

@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceCliente {
  private usuarios: Usuario[]= [];

  private reservasRealizadas: HashMapReservas ={
    // 5: { // idUsuario
    //     1: { // idDia
    //         1: { // idHora
    //             idEntrenador: 6
    //         },
    //         2: {
    //             idEntrenador: 6
    //         }
    //     },
    //     3: {
    //         3: {
    //             idEntrenador: 6
    //         }
    //     }
    // },
    // 2: {
    //     1: {
    //         4: {
    //             idEntrenador: 1
    //         }
    //     }
    // }
};
    
  

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

    // private ReservasUsuarios: HashMapReservas = {
    //   1: { // idUsuario
    //     2: { // idDia
    //       1: { // idHora
    //         idEntrenador: 5
    //       },
    //     },
    //     3: { // otro idDia
    //       1: { // idHora
    //         idEntrenador: 3
    //       }
    //     }
    //   },

    //   6: { // otro idUsuario
    //     1: { // idDia
    //       1: { // idHora
    //         idEntrenador: 4
    //       }
    //     }
    //   }
    // };

// Declaración de la variable asignaciones, utilizando la interfaz HashMap para especificar su tipo
private asignaciones: HashMap = {
  // Mes 1
  1: {
    // Día 1 del mes 1
    1: {
      // Hora 1 del día 1 del mes 1
      1: { idTrainers: [4, 5, 6, 7, 8] }, // Entrenadores asignados para la hora 1 del día 1 del mes 1
      // Hora 10 del día 1 del mes 1
      10: { idTrainers: [3] } // Entrenadores asignados para la hora 10 del día 1 del mes 1
    },
  },
  // Mes 2
  2: {
    // Día 1 del mes 2
    1: {
      // Hora 1 del día 1 del mes 2
      1: { idTrainers: [3, 5, 6] } // Entrenadores asignados para la hora 1 del día 1 del mes 2
    },
  },
  // Mes 3
  3: {
    // Día 2 del mes 3
    2: {
      // Hora 2 del día 2 del mes 3
      2: { idTrainers: [2, 4] } // Entrenadores asignados para la hora 2 del día 2 del mes 3
    },
  },
  // Mes 4
  4: {
    // Día 3 del mes 4
    3: {
      // Hora 3 del día 3 del mes 4
      3: { idTrainers: [3, 2] } // Entrenadores asignados para la hora 3 del día 3 del mes 4
    },
  },
  // Mes 5
  5: {
    // Día 4 del mes 5
    4: {
      // Hora 4 del día 4 del mes 5
      4: { idTrainers: [3, 4] }, // Entrenadores asignados para la hora 4 del día 4 del mes 5
      // Hora 5 del día 4 del mes 5
      5: { idTrainers: [6, 5] } // Entrenadores asignados para la hora 5 del día 4 del mes 5
    },
  },
  // Mes 6
  6: {
    // Día 2 del mes 6
    2: {
      // Hora 2 del día 2 del mes 6
      2: { idTrainers: [2, 3] } // Entrenadores asignados para la hora 2 del día 2 del mes 6
    },
    // Día 7 del mes 6
    7: {
      // Hora 7 del día 7 del mes 6
      7: { idTrainers: [4, 6] } // Entrenadores asignados para la hora 7 del día 7 del mes 6
    },
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
  constructor(private usuario: AppComponentService, private backendService:BackendFakeService) {
      this.backendService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;});
   }



      getUsuarios(): Usuario[] {
        return this.usuarios;
      }
  
      getasignaciones(): HashMap {
        return this.asignaciones;
      }

      

      getEntrenadoresPorDia(dia: number, mes: number): Usuario[] {
        const entrenadoresPorDia: Usuario[] = [];
        const asignacionesParaDia = this.asignaciones[mes] ? this.asignaciones[mes][dia] : null;
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
      

      getHorasPorEntrenador(idEntrenador: number, idDia: number, idMes: number): Hora[] {
        const horasEntrenador: Hora[] = [];
        
        // Verificar si el mes y el día especificados existen en las asignaciones
        if (this.asignaciones[idMes] && this.asignaciones[idMes][idDia]) {
          // Iterar sobre todas las horas de ese día
          for (const hora in this.asignaciones[idMes][idDia]) {
            // Verificar si el entrenador está asignado a esta hora
            if (this.asignaciones[idMes][idDia][hora].idTrainers.includes(idEntrenador)) {
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

      obtenerDiasPorUsuario(idUsuario: number, reservasComp: HashMapReservas): Dia[] {
        const usuario = reservasComp[idUsuario];
        const dias: Dia[] = [];
        if (usuario) {
          for (const idDia in usuario) {
            if (usuario.hasOwnProperty(idDia)) {
              const diaId = parseInt(idDia);
              const dia = this.dias.find(d => d.id === diaId);
              if (dia) {
                dias.push(dia);
              }
            }
          }
        }
        return dias;
      }
      
      
    
      obtenerHorasPorUsuario(idUsuario: number, idDia: number, reservasComp: HashMapReservas): Hora[] {
        const dia = reservasComp[idUsuario] ? reservasComp[idUsuario][idDia] : null;
        const horas: Hora[] = [];
        if (dia) {
          for (const idHora in dia) {
            if (dia.hasOwnProperty(idHora)) {
              const horaId = parseInt(idHora);
              const hora = this.horas.find(h => h.id === horaId);
              if (hora) {
                horas.push(hora);
              }
            }
          }
        }
        return horas;
      }
      
      
    
      obtenerEntrenadoresPorUsuario(idUsuario: number, idMes: number, idDia: number, idHora: number, reservasComp: HashMapReservas): Usuario[] {
        // Verificar si el usuario tiene reservas para el día, mes y hora especificados
        const reserva = reservasComp[idUsuario] && reservasComp[idUsuario][idMes] && reservasComp[idUsuario][idMes][idDia] && reservasComp[idUsuario][idMes][idDia][idHora];
        const entrenadores: Usuario[] = [];
        
        if (reserva && reserva.idEntrenador) {
          // Obtener el entrenador correspondiente a la reserva
          const entrenador = this.usuarios.find(usuario => usuario.id === reserva.idEntrenador);
          if (entrenador) {
            entrenadores.push(entrenador);
          }
        }
        
        return entrenadores;
      }
      
      
      
      

      aniadirReserva(usuario: number, mes: number, dia: number, hora: number, entrenador: number): void {
        // Inicializa la entrada del usuario si no existe
        if (!(usuario in this.reservasRealizadas)) {
          this.reservasRealizadas[usuario] = {};
        }
        
        // Inicializa la entrada del mes si no existe
        if (!(mes in this.reservasRealizadas[usuario])) {
          this.reservasRealizadas[usuario][mes] = {};
        }
        
        // Inicializa la entrada del día si no existe
        if (!(dia in this.reservasRealizadas[usuario][mes])) {
          this.reservasRealizadas[usuario][mes][dia] = {};
        }
        
        // Agrega la información de la reserva
        this.reservasRealizadas[usuario][mes][dia][hora] = { idEntrenador: entrenador };
      }
      

      actualizarReservas(): void {
        const reservasGuardadas = localStorage.getItem('reservasRealizadas');
        if (reservasGuardadas) {
          this.reservasRealizadas = JSON.parse(reservasGuardadas);
        }
      }


      existeReserva(idUsuario: number, idDia: number, idHora: number): boolean {
        this.actualizarReservas();
        return !!(this.reservasRealizadas[idUsuario] && this.reservasRealizadas[idUsuario][idDia] && this.reservasRealizadas[idUsuario][idDia][idHora]);
      }
    
      

      getReservasUsuarios():HashMapReservas{
        return this.reservasRealizadas;
      }

      setReservas(reservas: HashMapReservas): void {
        this.reservasRealizadas = reservas;
      }



      
    
}
export { Hora, Usuario};

