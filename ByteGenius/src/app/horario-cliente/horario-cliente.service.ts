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

  private reservasRealizadas: HashMapReservas = {};
    
  

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

    private asignaciones: HashMap = {
      1: {
          1: { idTrainers: [4, 5, 6, 7 , 8] },
          10: {idTrainers: [3]}
      },
      2: {
          1: { idTrainers: [3,5,6] }
      },
      3: {
          2: { idTrainers: [2, 4] }
      },
      4: {
          3: { idTrainers: [3, 2] }
      },
      5: {
        4:{idTrainers: [3, 4]},
        5:{idTrainers: [6, 5]}
      },
      6:{
        2:{idTrainers:[2,3]},
        7:{idTrainers:[4,6]}
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

      getHorasPorEntrenador(idEntrenador: number, idDia: number): Hora[] {
        const horasEntrenador: Hora[] = [];
        
        // Verificar si el día especificado existe en las asignaciones
        if (this.asignaciones[idDia]) {
          // Iterar sobre todas las horas de ese día
          for (const hora in this.asignaciones[idDia]) {
            // Verificar si el entrenador está asignado a esta hora
            if (this.asignaciones[idDia][hora].idTrainers.includes(idEntrenador)) {
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

      obtenerDiasPorUsuario(idUsuario: number): Dia[] {
        const usuario = this.reservasRealizadas[idUsuario];
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
      
    
      obtenerHorasPorUsuario(idUsuario: number, idDia: number): Hora[] {
        const dia = this.reservasRealizadas[idUsuario] ? this.reservasRealizadas[idUsuario][idDia] : null;
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
      
    
      obtenerEntrenadoresPorUsuario(idUsuario: number, idDia: number, idHora: number): Usuario[] {
        const hora = this.reservasRealizadas[idUsuario] && this.reservasRealizadas[idUsuario][idDia] ? this.reservasRealizadas[idUsuario][idDia][idHora] : null;
        const entrenadores: Usuario[] = [];
        if (hora && hora.idEntrenador) {
          const entrenador = this.usuarios.find(usuario => usuario.id === hora.idEntrenador);
          if (entrenador) {
            entrenadores.push(entrenador);
          }
        }
        return entrenadores;
      }

      aniadirReserva(usuario: number, dia: number, hora: number, entrenador: number): void {
        // Inicializa la entrada del usuario si no existe
        if (!(usuario in this.reservasRealizadas)) {
          this.reservasRealizadas[usuario] = {};
         
        }
        // Inicializa la entrada del día si no existe
        if (!(dia in this.reservasRealizadas[usuario])) {
          this.reservasRealizadas[usuario][dia] = {};
          
        }
        // Agrega la información de la reserva
        this.reservasRealizadas[usuario][dia][hora] = { idEntrenador: entrenador };
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

