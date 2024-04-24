package ByteGenius.tarea2.repositories;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ByteGenius.tarea2.entities.Evento;
import ByteGenius.tarea2.entities.Tipo;

public interface EventoRepository extends JpaRepository<Evento, Integer> {
      // Buscar eventos por nombre
      List<Evento> findByNombre(String nombre);

      // Buscar eventos por descripción
      List<Evento> findByDescripcion(String descripcion);

      // Buscar eventos por lugar
      List<Evento> findByLugar(String lugar);

      // Buscar eventos por duración en minutos
      List<Evento> findByDuracionMinutos(Integer duracionMinutos);

      // Buscar eventos por fecha de inicio
      List<Evento> findByInicio(Date inicio);

      // Buscar eventos por id de cliente
      List<Evento> findByIdCliente(Integer idCliente);

      // Buscar eventos por tipo
      List<Evento> findByTipo(Tipo tipo);

      // Buscar eventos por nombre y fecha de inicio
      @Query("SELECT e FROM Evento e WHERE e.nombre = :nombre AND e.inicio = :inicio")
      List<Evento> findByNameAndDate(@Param("nombre") String nombre, @Param("inicio") Date inicio);

      // Buscar eventos por nombre, descripción y lugar
      @Query("SELECT e FROM Evento e WHERE e.nombre = :nombre AND e.descripcion = :descripcion AND e.lugar = :lugar")
      List<Evento> findByNameAndDescripcionAndLugar(@Param("nombre") String nombre,
                  @Param("descripcion") String descripcion, @Param("lugar") String lugar);

      // Buscar eventos por id de cliente y fecha de inicio
      @Query("SELECT e FROM Evento e WHERE e.idCliente = :idCliente AND e.inicio = :inicio")
      List<Evento> findByIdClienteAndInicio(@Param("idCliente") Integer idCliente, @Param("inicio") Date inicio);
}
