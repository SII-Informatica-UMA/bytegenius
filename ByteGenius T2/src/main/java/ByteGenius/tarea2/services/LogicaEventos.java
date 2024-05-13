package ByteGenius.tarea2.services;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import ByteGenius.tarea2.entities.Evento;
import ByteGenius.tarea2.exceptions.ElementoNoExisteException;
import ByteGenius.tarea2.exceptions.ElementoYaExistenteException;
import ByteGenius.tarea2.repositories.EventoRepository;

import java.sql.Date;
import java.util.List;

@Service
@Transactional
public class LogicaEventos {
    private EventoRepository eventoRepository;

    public LogicaEventos(EventoRepository repo) {
        this.eventoRepository = repo;
    }

    public List<Evento> getEventos() {
        return eventoRepository.findAll();
    }

    // get /calendario/idEntrenador/idElemento
    public Evento getEvento(Integer idEntrenador, Integer idEvento) {
        var evento = eventoRepository.findByIdEntrenadorIdElemento(idEntrenador, idEvento);

        if (evento.isEmpty()) {
            throw new ElementoNoExisteException("Evento no existente");

        } else {
            return evento.get();
        }
    }

    // Post /calendario/idEntrenador
    public Evento addEvento(Evento evento, Integer idEntrenador) {
        evento.setId(null);
        evento.setIdEntrenador(idEntrenador);

        eventoRepository.findByIdEntrenadorIdElemento(idEntrenador, evento.getId()).ifPresent(n -> {
            throw new ElementoYaExistenteException("Evento ya existente");
        });

        return eventoRepository.save(evento);
    }

    // Put /calendario/idEntrenador/idElemento
    public void updateEvento(int idEntrenador, int idEvento, Evento cambio) {
        eventoRepository.actualizarEvento(idEvento, cambio.getNombre(), cambio.getDescripción(), cambio.getLugar(),
                cambio.getDuracionMinutos(), (Date) cambio.getInicio(),
                idEntrenador, cambio.getReglaRecurrencia());

    }

    // Delete /calendario/idEntrenador/idElemento
    public void eliminarEvento(int idEntrenador, int idEvento) {
        var evento = eventoRepository.findByIdEntrenadorIdElemento(null, idEvento);
        if (evento.isPresent()) {
            eventoRepository.deleteById(idEvento);
        } else {
            throw new ElementoNoExisteException("Evento no existente");
        }
    }

    // DUDA -> NO SE ENTIENDE EXACTAMENTE QUE HACER CUANDO DICE
    // "EN LAS FRANJAS YA OCUPADAS SE INCLUYE EL ID del usuario cuando quien lo
    // consulta es el entrenador o el propio usuario que tiene la franaja ocupada"
    // El problema es que no se sabe si tenemos que introducir el id del usuario
    // cuando la franja es ocupada en el idCliente aunque sea un entrenador o en el
    // id normal.
    public void getDisponibilidad(int idEntrenador) {
        List<Evento> dispoEntrenador = eventoRepository.findByidEntrenadorAndDisponibilidad(idEntrenador);
        List<Evento> ocuEntrenador = eventoRepository.findByidEntrenadorAndCita(idEntrenador);

    }

}
