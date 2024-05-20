package ByteGenius.tarea2.entities;

import java.util.Date;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID_EVENTO")
	private Long id;

	@Column(name = "ID_ENTRENADOR")
	private Long idEntrenador;

	@Column(name = "ID_CLIENTE")
	private Long idCliente;

	@Column(nullable = false, name = "NOMBRE")
	private String nombre;

	@Column(name = "DESCRIPCION")
	private String descripcion;

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
		return "Evento [id=" + id + ", idEntrenador=" + idEntrenador + ", idCliente=" + idCliente + ", nombre=" + nombre
				+ ", descripcion=" + descripcion + ", observaciones=" + observaciones + ", lugar=" + lugar
				+ ", duracionMinutos=" + duracionMinutos + ", inicio=" + inicio + ", reglaRecurrencia="
				+ reglaRecurrencia + ", tipo=" + tipo + "]";
	}

	public Tipo getTipo() {
		return this.tipo;
	}

	public boolean solapa(Evento otroEvento) {
		return false;
	}

	public boolean contiene(Evento otroEvento) {
		return false;
	}
}
