package es.uma.informatica.sii.spring.jpa.ByteGenius.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import es.uma.informatica.sii.spring.jpa.ByteGenius.entities.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{

     // Buscar usuarios por nombre
     List<Usuario> findByNombre(String nombre);

     // Buscar usuarios por primer apellido
     List<Usuario> findByApellido1(String apellido1);
 
     // Buscar usuarios por segundo apellido
     List<Usuario> findByApellido2(String apellido2);
 
     // Buscar usuarios por email
     List<Usuario> findByEmail(String email);
 
     // Buscar usuarios por estado de administrador
     List<Usuario> findByAdministrador(boolean administrador);

     // Buscar usuarios por nombre y primer apellido
    @Query("SELECT u FROM Usuario u WHERE u.nombre = :nombre AND u.apellido1 = :apellido1")
    List<Usuario> findByNombreAndApellido1(@Param("nombre") String nombre, @Param("apellido1") String apellido1);

    // Buscar usuarios por nombre, primer apellido y segundo apellido
    @Query("SELECT u FROM Usuario u WHERE u.nombre = :nombre AND u.apellido1 = :apellido1 AND u.apellido2 = :apellido2")
    List<Usuario> findByNombreAndApellido1AndApellido2(@Param("nombre") String nombre, @Param("apellido1") String apellido1, @Param("apellido2") String apellido2);

    // Buscar usuarios por email y estado de administrador
    @Query("SELECT u FROM Usuario u WHERE u.email = :email AND u.administrador = :administrador")
    List<Usuario> findByEmailAndAdministrador(@Param("email") String email, @Param("administrador") boolean administrador);

    // Buscar usuarios por nombre y estado de administrador
    @Query("SELECT u FROM Usuario u WHERE u.nombre = :nombre AND u.administrador = :administrador")
    List<Usuario> findByNombreAndAdministrador(@Param("nombre") String apellido2, @Param("administrador") boolean administrador);
}