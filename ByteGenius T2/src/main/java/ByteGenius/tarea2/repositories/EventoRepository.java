package ByteGenius.tarea2.repositories;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ByteGenius.tarea2.entities.Evento;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
      Optional<List<Evento>> findAllByIdEntrenador(Long paramLong);

      List<Evento> findAllByNombre(String nombre);

}