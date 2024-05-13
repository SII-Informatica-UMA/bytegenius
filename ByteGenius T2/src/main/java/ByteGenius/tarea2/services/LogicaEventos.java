package ByteGenius.tarea2.services;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import ByteGenius.tarea2.entities.Evento;
import ByteGenius.tarea2.exceptions.ElementoNoExisteException;
import ByteGenius.tarea2.exceptions.ElementoYaExistenteException;
import ByteGenius.tarea2.exceptions.FranjaOcupadaSinIdClienteException;
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

    //Comprobar si esta manera va bien, si no hacerlo a través de una clase que se obtengan ambas listas con dos get diferentes aunque las listas sean mutables.    
    public List<List<Evento>> getDisponibilidad(int idEntrenador) {
        List<Evento> dispoEntrenador = eventoRepository.findByidEntrenadorAndDisponibilidad(idEntrenador);
        List<Evento> franjasOcupadas = eventoRepository.findByidEntrenadorAndCita(idEntrenador);

        for (Evento frOcu : franjasOcupadas) {
            if(frOcu.getIdCliente() == null){
                throw new FranjaOcupadaSinIdClienteException("Franja ocupada sin Id del cliente");
            }
        }

        return List.of(dispoEntrenador, franjasOcupadas); //Listas obtenidas inmutables -> solo puede observarse los datos, no modificarlos.
    }

}
