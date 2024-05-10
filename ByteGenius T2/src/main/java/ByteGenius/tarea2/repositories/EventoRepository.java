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

      // Buscar eventos por idEntrenador
      List<Evento> findByNombre(int idEntrenador);

      // Buscar eventos por id entrenador e id 
      @Query("SELECT e FROM Evento e WHERE e.idEntrenador = :idEntrenador AND e.id = :id")
      List<Evento> findByIdClienteAndInicio(@Param("idEntrenador") Integer idEntrenador, @Param("id") Integer id);


      @Query("INSERT INTO Evento(e.nombre, e.descripcion, e.lugar, e.duracionMinutos, e.inicio, e.idCliente, e.tipo, e.idEntrenador, e.reglaRecurrencia) " +
      "VALUES (:nombre, :descripcion, :lugar, :duracionMinutos, :inicio, :idCliente, :tipo, :idEntrenador,:reglaRecurrencia)")
      void crearEventoParaEntrenador(@Param("nombre") String nombre, 
                              @Param("descripcion") String descripcion, 
                              @Param("lugar") String lugar, 
                              @Param("duracionMinutos") Integer duracionMinutos, 
                              @Param("inicio") Date inicio, 
                              @Param("idCliente") Integer idCliente, 
                              @Param("tipo") Tipo tipo, 
                              @Param("idEntrenador") Integer idEntrenador,
                              @Param("reglaRecurrencia") String reglaRecurrencia);
                              

    // Método personalizado para actualizar un evento
    @Query("UPDATE Evento e SET e.nombre = :nombre, e.descripción = :descripcion, e.lugar = :lugar, e.duracionMinutos = :duracionMinutos, e.inicio = :inicio WHERE e.id = :id AND e.idEntrenador = :idEntrenador,:reglaRecurrencia")
    void actualizarEvento(@Param("id") Integer id, 
                          @Param("nombre") String nombre, 
                          @Param("descripcion") String descripcion, 
                          @Param("lugar") String lugar, 
                          @Param("duracionMinutos") Integer duracionMinutos, 
                          @Param("inicio") Date inicio, 
                          @Param("idEntrenador") Integer idEntrenador,
                          @Param("reglaRecurrencia") String reglaRecurrencia);


    // Método personalizado para eliminar un evento
    @Query("DELETE FROM Evento e WHERE e.id = :idEvento AND e.idEntrenador = :idEntrenador")
    void eliminarEventoPorIdEntrenadorYIdEvento(@Param("idEvento") Integer idEvento, @Param("idEntrenador") Integer idEntrenador);


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

      // Buscar eventos por idEntrenador y con el tipo = "Disponibilidad"
      @Query("SELECT e FROM Evento e WHERE e.idEntrenador = :idEntrenador AND e.tipo = 'DISPONIBILIDAD'")
      List<Evento> findByidEntrenadorAndDisponibilidad(@Param("idEntrenador") int idEntrenador);

      // Buscar eventos por idEntrenador y con el tipo = "Disponibilidad"
      @Query("SELECT e FROM Evento e WHERE e.idEntrenador = :idEntrenador AND e.tipo = 'CITA'")
      List<Evento> findByidEntrenadorAndCita(@Param("idEntrenador") int idEntrenador);

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
