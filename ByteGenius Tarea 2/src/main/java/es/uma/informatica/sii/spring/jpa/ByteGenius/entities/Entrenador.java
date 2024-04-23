package es.uma.informatica.sii.spring.jpa.ByteGenius.entities;

import java.sql.Date;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class Entrenador {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name="ID_USUARIO", nullable = false)
    private Integer idUsuario;

    @Column(name="TELEFONO")
    private String telefono;

    @Column(name="DIRECCION")
    private String direccion;

    @Column(name="DNI")
    private String dni;

    @Column(name="FECHA_NACIMIENTO")
    private Date fechaNacimiento;

    @Column(name="FECHA_ALTA")
    private Date fechaAlta;

    @Column(name="FECHA_BAJA")
    private Date fechaBaja;

    @Column(name="ESPECIALIDAD")
    private String especialidad;

    @Column(name="TITULACION")
    private String titulacion;

    @Column(name="EXPERIENCIA")
    private String experiencia;

    @Column(name="OBSERVACIONES")
    private String observaciones;

 


    public int getIdUsuario(){
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario){
        this.idUsuario = idUsuario;
    }

    public String getTelefono(){
        return telefono;
    }

    public void setTelefono(String telefono){
        this.telefono = telefono;
    }

    public String getDireccion(){
        return direccion;
    }

    public void setDireccion(String direccion){
        this.direccion = direccion;
    }

    public String getDni(){
        return dni;
    }

    public void setDni(String dni){
        this.dni = dni;
    }

    public Date getFechaNacimiento(){
        return fechaNacimiento;
    }

    public void setFechaNacimiento(Date fechaNacimiento){
        this.fechaNacimiento = fechaNacimiento;
    }

    public Date getFechaAlta(){
        return fechaAlta;
    }

    public void setFechaAlta(Date fechaAlta){
        this.fechaAlta = fechaAlta;
    }
    
    public Date getFechaBaja(){
        return fechaBaja;
    }

    public void setFechaBaja(Date fechaBaja){
        this.fechaBaja = fechaBaja;
    }

    public String getEspecialidad(){
        return especialidad;
    }

    public void setEspecialidad(String especialidad){
        this.especialidad = especialidad;
    }

    public String getTitulacion(){
        return titulacion;
    }

    public void setTitulacion(String titulacion){
        this.titulacion = titulacion;
    }

    public String getExperiencia(){
        return experiencia;
    }   

    public void setExperiencia(String experiencia){
        this.experiencia = experiencia;
    }

    public String getObservaciones(){
        return observaciones;
    }

    public void setObservaciones(String observaciones){
        this.observaciones = observaciones;
    }

    public int getId(){
        return id;
    }

    public void setId(int id){
        this.id = id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (!(obj instanceof Entrenador))
            return false;
        Entrenador other = (Entrenador) obj;
        return Objects.equals(id, other.id);
    }

    @Override 
    public String toString(){
        return "Entrenador [id=" + id + ", idUsuario=" + idUsuario + ", telefono=" + telefono + ", direccion=" + direccion + ", dni=" + dni + ", fechaNacimiento=" + fechaNacimiento + ", fechaAlta=" + fechaAlta + ", fechaBaja=" + fechaBaja + ", especialidad=" + especialidad + ", titulacion=" + titulacion + ", experiencia=" + experiencia + ", observaciones=" + observaciones + "]";
    }

}
