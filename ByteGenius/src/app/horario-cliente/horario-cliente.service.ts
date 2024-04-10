import { Usuario } from "../entities/usuario";
import { Hora } from "../Hora";
import { Dia } from "../Dia";
import { HashMapReservas } from "../HashMapReservas";
import { HashMap } from "../HashMap";
import { AppComponentService } from "../app.component.service";
import { Injectable, OnInit } from "@angular/core";
import { BackendFakeService } from "../services/backend.fake.service";
import { NgbCalendar, NgbDate, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceCliente {
  private usuarios: Usuario[]= [];
  today:NgbDate;
  private asignaciones: HashMap = {}
  private reservasRealizadas: HashMapReservas ={};
    
  

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

    private dias: Dia [] = [
      {id:1, nombre:'Lunes'},
      {id:2, nombre:'Martes'},
      {id:3, nombre:'Miercoles'},
      {id:4, nombre:'Jueves'},
      {id:5, nombre:'Viernes'},
      {id:6, nombre:'Sabado'},
      {id:7, nombre:'Domingo'}
      ]
  constructor(private usuario: AppComponentService, private backendService:BackendFakeService, calendar:NgbCalendar) {
      this.backendService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;});
      this.today=calendar.getToday();
      this.cargarDatos();
   }

   cargarDatos(): void {
    const datosGuardados = localStorage.getItem('horarioEntrenadoresPD');
    console.log('datitos: '+datosGuardados);
    if (datosGuardados) {
      this.asignaciones = JSON.parse(datosGuardados);
    }

  }


      getUsuarios(): Usuario[] {
        return this.usuarios;
      }
  
      getasignaciones(): HashMap {
        return this.asignaciones;
      }

      

      getEntrenadoresPorDia(dia: number, mes: number): Usuario[] {
        const entrenadoresPorDia: Usuario[] = [];
        // Verificar si el mes especificado existe en las asignaciones
        if (mes in this.asignaciones) {
          const asignacionesDelMes = this.asignaciones[mes];
      
          // Verificar si el día especificado existe en las asignaciones del mes
          if (dia in asignacionesDelMes) {
            const asignacionesParaDia = asignacionesDelMes[dia];
      
            // Iterar sobre cada asignación para el día y obtener los IDs de los entrenadores
            for (let key in asignacionesParaDia) {
              const idTrainers = asignacionesParaDia[key].idTrainers;
      
              // Iterar sobre cada ID de entrenador en la lista y encontrar el entrenador correspondiente
              idTrainers.forEach(id => {
                const entrenador = this.usuarios.find(u => u.id === id);
                if (entrenador && !entrenadoresPorDia.includes(entrenador)) {
                  entrenadoresPorDia.push(entrenador);
                }
              });
            }
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
      
      
    
      obtenerHorasPorUsuario(idUsuario: number, idMes: number, idDia: number, reservasComp: HashMapReservas): Hora[] {
        const usuarioReservas = reservasComp[idUsuario];
        if (!usuarioReservas || !usuarioReservas[idMes] || !usuarioReservas[idMes][idDia]) {
          return [];
        }
      
        const horas: Hora[] = [];
        const reservasDia = usuarioReservas[idMes][idDia];
      
        for (const idHoraStr in reservasDia) {
          if (reservasDia.hasOwnProperty(idHoraStr)) {
            const idHora = parseInt(idHoraStr);
            const hora = this.horas.find(h => h.id === idHora);
            if (hora) {
              horas.push(hora);
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


      existeReserva(idUsuario: number, idDia: number, idHora: number, idMes: number): boolean {
        this.actualizarReservas();
        return !!(
          this.reservasRealizadas[idUsuario] &&
          this.reservasRealizadas[idUsuario][idMes] &&
          this.reservasRealizadas[idUsuario][idMes][idDia] &&
          this.reservasRealizadas[idUsuario][idMes][idDia][idHora]
        );
      }
      
    
      

      getReservasUsuarios():HashMapReservas{
        return this.reservasRealizadas;
      }

      setReservas(reservas: HashMapReservas): void {
        this.reservasRealizadas = reservas;
      }

      obtenerLunesMasCercano(date: NgbDateStruct): NgbDateStruct {
        // Convertir la fecha NgbDateStruct a un objeto Date de JavaScript
        const jsDate = new Date(date.year, date.month - 1, date.day);
      
        // Iterar hacia atrás desde la fecha dada hasta encontrar un lunes
        while (jsDate.getDay() !== 1) { // 1 representa el lunes en JavaScript
          jsDate.setDate(jsDate.getDate() - 1); // Restar un día
        }
      
        // Convertir el resultado de vuelta a NgbDateStruct
      
      
        const lunesMasCercano = new NgbDate(jsDate.getFullYear(),jsDate.getMonth()+1,jsDate.getDate());
        return lunesMasCercano;
      }
      obtenerCantidadDiasMes(year: number, month: number): number {
        // Obtener el último día del mes
        const ultimoDiaMes = new Date(year, month, 0).getDate();
      
        return ultimoDiaMes;
      }
      
      obtenerSemana(date:NgbDate):NgbDateStruct[]{
        let primerLunes = this.obtenerLunesMasCercano(this.today);
        let lista = [];
        var diaAct = primerLunes;
        lista.push(primerLunes);
        let cont = 0;
        let cambio = false;
        let cont2 = 0;
        while(cont < 6){
          if(this.obtenerCantidadDiasMes(diaAct.year,diaAct.month) > diaAct.day){
            if(!cambio)lista.push(new NgbDate(diaAct.year,diaAct.month,diaAct.day+1));
            else lista.push(new NgbDate(diaAct.year,diaAct.month,diaAct.day+1));
          }else{
            if(diaAct.month <= 12){
              lista.push(new NgbDate(diaAct.year,diaAct.month+1,1));
              cambio = true;
            }else{
              lista.push(new NgbDate(diaAct.year+1,1,1));
              cambio = true;
            }
          }
          cont = cont+1;
          if(cambio) cont2 = cont2+1;
          diaAct = lista[lista.length-1];
        }
        return lista;
      }



      
    
}
export { Hora, Usuario};

