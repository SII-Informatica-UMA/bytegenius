package es.uma.informatica.sii.spring.jpa.ByteGenius.entities;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "NOMBRE", nullable = false)
    private String nombre;

    @Column(name = "APELLIDO1")
    private String apellido1;

    @Column(name = "APELLIDO2")
    private String apellido2;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "ADMINISTRADOR")
    private boolean administrador;

    

    public String getNombre(){
        return nombre;
    }

    public void setNombre(String nombre){
        this.nombre = nombre;
    }

    public String getApellido1(){
        return apellido1;
    }

    public void setApellido1(String apellido1){
        this.apellido1 = apellido1;
    }

    public String getApellido2(){
        return apellido2;
    }

    public void setApellido2(String apellido2){
        this.apellido2 = apellido2;
    }

    public String getEmail(){
        return email;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public String getPassword(){
        return password;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public boolean getAdministrador(){
        return administrador;
    }

    public void setAdministrador(boolean administrador){
        this.administrador = administrador;
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
        if(this == obj){
            return true;
        }
        if(obj == null || getClass() != obj.getClass()){
            return false;
        }
        Usuario other = (Usuario) obj;
        return id == other.id;
    }

    @Override
    public String toString(){
        return "Usuario{" +
                "nombre='" + nombre + '\'' +
                ", apellido1='" + apellido1 + '\'' +
                ", apellido2='" + apellido2 + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", administrador=" + administrador +
                ", id=" + id +
                '}';
    }
}
