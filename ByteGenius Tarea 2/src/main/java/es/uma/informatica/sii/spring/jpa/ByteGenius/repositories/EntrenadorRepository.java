package es.uma.informatica.sii.spring.jpa.ByteGenius.repositories;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import es.uma.informatica.sii.spring.jpa.ByteGenius.entities.Entrenador;

public interface EntrenadorRepository  extends JpaRepository<Entrenador, Integer>{
    // Buscar entrenadores por id de usuario
    List<Entrenador> findByIdUsuario(Integer idUsuario);

    // Buscar entrenadores por DNI
    List<Entrenador> findByDni(String dni);

    // Buscar entrenadores por fecha de alta
    List<Entrenador> findByFechaAlta(Date fechaAlta);

    // Buscar entrenadores por fecha de baja
    List<Entrenador> findByFechaBaja(Date fechaBaja);

    // Buscar entrenadores por especialidad
    List<Entrenador> findByEspecialidad(String especialidad);

    // Buscar entrenadores por titulación
    List<Entrenador> findByTitulacion(String titulacion);

    // Buscar entrenadores por DNI y fecha de alta
    @Query("SELECT e FROM Entrenador e WHERE e.dni = :dni AND e.fechaAlta = :fechaAlta")
    List<Entrenador> findByDniAndFechaAlta(@Param("dni") String dni, @Param("fechaAlta") Date fechaAlta);

 
}
