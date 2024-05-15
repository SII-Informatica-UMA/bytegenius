package ByteGenius.tarea2.entities;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Evento {
	@Id
	@GeneratedValue
	@Column(name = "ID_EVENTO")
	private Integer id;

	@Column(name = "ID_ENTRENADOR")
	private Integer IdEntrenador;

	@Column(name = "ID_CLIENTE")
	private Integer idCliente;

	@Column(nullable = false, name = "NOMBRE")
	private String nombre;

	@Column(name = "DESCRIPCION")
	private String descripción;

	@Column(name = "OBSERVACIONES")
	private String observaciones;

	@Column(name = "LUGAR")
	private String lugar;

	@Column(name = "DURACION_MINUTOS")
	private Integer duracionMinutos;

	@Column(name = "INICIO")
	@Temporal(TemporalType.TIMESTAMP)
	private Date inicio;

	@Column(name = "REGLA_RECURRENCIA")
	private String reglaRecurrencia;

	@Column(name = "TIPO")
	@Enumerated(EnumType.STRING)
	private Tipo tipo;

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Evento other = (Evento) obj;
		return Objects.equals(id, other.id);
	}

	@Override
	public String toString() {
		return "Evento [id=" + id + ", IdEntrenador=" + IdEntrenador + ", idCliente=" + idCliente + ", nombre=" + nombre
				+ ", descripción=" + descripción + ", observaciones=" + observaciones + ", lugar=" + lugar
				+ ", duracionMinutos=" + duracionMinutos + ", inicio=" + inicio + ", reglaRecurrencia="
				+ reglaRecurrencia + ", tipo=" + tipo + "]";
	}

	public static boolean solapar(Evento disponibilidad, List<Evento> lista, Evento cita) {
		// Comprueba si la cita comienza antes del inicio de la disponibilidad
		if(lista == null) return false;
		if (cita.getInicio().before(disponibilidad.getInicio())) return false;
	
		// Calcula los tiempos de finalización de la disponibilidad
		long endDisponibilidadMillis = disponibilidad.getInicio().getTime() + disponibilidad.getDuracionMinutos() * 60 * 1000;
	
		// Comprueba si la cita comienza después del final de la disponibilidad
		if (cita.getInicio().after(new Date(endDisponibilidadMillis))) return false;
	
		// Comprueba si la cita se solapa con algún evento en la lista
		for (Evento evento : lista) {
			// Calcula los tiempos de finalización de los eventos en la lista
			long endEventoMillis = evento.getInicio().getTime() + evento.getDuracionMinutos() * 60 * 1000;
			
			// Comprueba si la cita se solapa con el evento actual de la lista
			if (cita.getInicio().before(new Date(endEventoMillis)) && new Date(endDisponibilidadMillis).after(evento.getInicio())) {
				return false; // Hay solapamiento
			}
		}
	
		// No hay solapamiento con ningún evento de la lista
		return true;
	}

	public static boolean solaparUpdate(Evento disponibilidad, List<Evento> lista, Evento cita) {
		// Comprueba si la cita comienza antes del inicio de la disponibilidad
		if(lista == null) return false;
		if (cita.getInicio().before(disponibilidad.getInicio())) return false;
	
		// Calcula los tiempos de finalización de la disponibilidad
		long endDisponibilidadMillis = disponibilidad.getInicio().getTime() + disponibilidad.getDuracionMinutos() * 60 * 1000;
	
		// Comprueba si la cita comienza después del final de la disponibilidad
		if (cita.getInicio().after(new Date(endDisponibilidadMillis))) return false;
	
		// Comprueba si la cita se solapa con algún evento en la lista
		for (Evento evento : lista) {
			// Calcula los tiempos de finalización de los eventos en la lista
			if(evento.getId() != cita.getId()){
				long endEventoMillis = evento.getInicio().getTime() + evento.getDuracionMinutos() * 60 * 1000;
			
				// Comprueba si la cita se solapa con el evento actual de la lista
				if (cita.getInicio().before(new Date(endEventoMillis)) && new Date(endDisponibilidadMillis).after(evento.getInicio())) {
					return false; // Hay solapamiento
				}
			}

		}
	
		// No hay solapamiento con ningún evento de la lista
		return true;
	}

	public static Evento FranjaDisponible(List<Evento> lista,Date inicio,Integer duracionMinutos){
		 Evento e = null;
		for(Evento evento : lista){
			if(evento.getTipo().equals(Tipo.DISPONIBILIDAD)){
				long endEventoMillis = evento.getInicio().getTime() + evento.getDuracionMinutos() * 60 * 1000;
				if(new Date(inicio.getTime() + duracionMinutos*60*1000).before(new Date(endEventoMillis))) e = evento;
			}
	}
	return e;
	}

	public static List<Evento> listaCitasEnFranja(Evento disponibilidad,List<Evento> lista){
		List<Evento> citas = new ArrayList<>();
		for(Evento v: lista){
			if(v.getTipo().equals(Tipo.CITA)){
				long endEventoMillis = v.getInicio().getTime() + v.getDuracionMinutos() * 60 * 1000;
				if(new Date(endEventoMillis).before(new Date(disponibilidad.getInicio().getTime()+disponibilidad.getDuracionMinutos()*60*1000)) 
				&& v.getInicio().after(disponibilidad.getInicio())){
					citas.add(v);
				}
			}
		}
		return citas;
	}
	

}
