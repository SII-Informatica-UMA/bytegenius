package es.uma.informatica.sii.spring.jpa.ByteGenius.entities;

import java.sql.Date;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;



@Entity
public class Evento {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	@Column(nullable = false, name="NOMBRE")
	private String nombre;

	@Column(name="DESCRIPCION")
	private String descripción;

	@Column(name="OBSERVACIONES")
	private String observaciones;

	@Column(name="LUGAR")
	private String lugar;

	@Column(name="DURACION_MINUTOS")
	private Integer duracionMinutos;

	@Column(name="INICIO")
	private Date inicio;

	@Column(name="REGLA_RECURRENCIA")
	private String reglaRecurrencia;

	@Column(name="ID_CLIENTE")
	private Integer idCliente;

	@Column(name="TIPO")
	@Enumerated(EnumType.STRING)
	private Tipo tipo;

	@ManyToOne
	private Entrenador entrenador;

	@ManyToOne
	private Cliente cliente;


	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getDescripción() {
		return descripción;
	}

	public void setDescripción(String descripción) {
		this.descripción = descripción;
	}

	public String getObservaciones() {
		return observaciones;
	}

	public void setObservaciones(String observaciones) {
		this.observaciones = observaciones;
	}

	public String getLugar() {
		return lugar;
	}

	public void setLugar(String lugar) {
		this.lugar = lugar;
	}

	public Integer getDuracionMinutos() {
		return duracionMinutos;
	}

	public void setDuracionMinutos(Integer duracionMinutos) {
		this.duracionMinutos = duracionMinutos;
	}

	public Date getInicio() {
		return inicio;
	}

	public void setInicio(Date inicio) {
		this.inicio = inicio;
	}

	public String getReglaRecurrencia() {
		return reglaRecurrencia;
	}

	public void setReglaRecurrencia(String reglaRecurrencia) {
		this.reglaRecurrencia = reglaRecurrencia;
	}

	public Integer getIdCliente() {
		return idCliente;
	}

	public void setIdCliente(Integer idCliente) {
		this.idCliente = idCliente;
	}

	public Tipo getTipo() {
		return tipo;
	}

	public void setTipo(Tipo tipo) {
		this.tipo = tipo;
	}

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
		return "Evento [id=" + id + ", nombre=" + nombre + ", descripcion=" + descripción + " , observaciones="
				+ observaciones + ", lugar=" + lugar + ", duracionMinutos=" + duracionMinutos + ", inicio=" + inicio
				+ ", reglaRecurrencia=" + reglaRecurrencia + ", idCliente=" + idCliente + ", tipo=" + tipo + "]";
	}

}
