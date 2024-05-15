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
import java.util.Optional;

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
    public Optional<Evento> getEvento(Integer idEntrenador, Integer idEvento) {
        return eventoRepository.findByIdEntrenadorIdElemento(idEntrenador, idEvento);

    }

    // Post /calendario/idEntrenador
    public Evento addEvento(Evento evento, Integer idEntrenador) {
        List<Evento> eventos = eventoRepository.findByNombre(idEntrenador);
        Evento disponibilidad = Evento.FranjaDisponible(eventos, evento.getInicio(), evento.getDuracionMinutos());
        if(disponibilidad == null) throw new FranjaOcupadaSinIdClienteException("No existe franja disponible");
        List<Evento> franjasCitas = Evento.listaCitasEnFranja(disponibilidad,eventos);
        if(!Evento.solapar(disponibilidad, franjasCitas,evento)) throw new FranjaOcupadaSinIdClienteException("No existe franja disponible");
        
        evento.setId(null);
        
        evento.setIdEntrenador(idEntrenador);

        return eventoRepository.save(evento);
    }

    // Put /calendario/idEntrenador/idElemento
    public Evento updateEvento(int idEntrenador, int idEvento, Evento cambio) {

        List<Evento> eventos = eventoRepository.findByNombre(idEntrenador);
        Evento disponibilidad = Evento.FranjaDisponible(eventos, cambio.getInicio(), cambio.getDuracionMinutos());
        if(disponibilidad == null) throw new FranjaOcupadaSinIdClienteException("No existe franja disponible");
        List<Evento> franjasCitas = Evento.listaCitasEnFranja(disponibilidad,eventos);
        if(!Evento.solaparUpdate(disponibilidad, franjasCitas,cambio)) throw new FranjaOcupadaSinIdClienteException("No existe franja disponible");


        if (eventoRepository.existsById(idEvento)) {
            var opEvento = eventoRepository.findByIdEntrenadorIdElemento(idEntrenador, idEvento);
            if (opEvento.isPresent() && opEvento.get().getId() != idEvento) {
                throw new ElementoYaExistenteException("Evento ya existe");
            }

        

            opEvento = eventoRepository.findById(idEvento);
            opEvento.ifPresent(e -> {
                e.setNombre(cambio.getNombre());
                e.setDescripción(cambio.getDescripción());
                e.setLugar(cambio.getLugar());
                e.setDuracionMinutos(cambio.getDuracionMinutos());
                e.setInicio(cambio.getInicio());
                e.setIdEntrenador(cambio.getIdEntrenador());
                e.setReglaRecurrencia(cambio.getReglaRecurrencia());
            });
            return eventoRepository.save(opEvento.get());
        } else {
            throw new ElementoNoExisteException("Evento no encontrado");
        }
    }

    // Delete /calendario/idEntrenador/idElemento
    public void eliminarEvento(int idEntrenador, int idEvento) {
        var evento = eventoRepository.findByIdEntrenadorIdElemento(idEntrenador, idEvento);
        if (evento.isPresent()) {
            eventoRepository.deleteById(idEvento);
        } else {
            throw new ElementoNoExisteException("Evento no existente");
        }
    }

    // Comprobar si esta manera va bien, si no hacerlo a través de una clase que se
    // obtengan ambas listas con dos get diferentes aunque las listas sean mutables.
    public Optional<List<Evento>> getDisponibilidad(int idEntrenador) {
        return eventoRepository.findByIdEntrenador(idEntrenador);
    }

}
