package es.uma.informatica.sii.spring.jpa.ByteGenius.repositories;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import es.uma.informatica.sii.spring.jpa.ByteGenius.entities.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Integer>{

    // Buscar clientes por id de usuario
    List<Cliente> findByIdUsuario(Integer idUsuario);

    // Buscar clientes por teléfono
    List<Cliente> findByTelefono(String telefono);


    // Buscar clientes por DNI
    List<Cliente> findByDni(String dni);

    // Buscar clientes por fecha de nacimiento
    List<Cliente> findByFechaNacimiento(Date fechaNacimiento);

    // Buscar clientes por DNI y fecha de nacimiento
    @Query("SELECT c FROM Cliente c WHERE c.dni = :dni AND c.fechaNacimiento = :fechaNacimiento")
    List<Cliente> findByDniAndFechaNacimiento(@Param("dni") String dni, @Param("fechaNacimiento") Date fechaNacimiento);

    
}
