package ByteGenius.tarea2.services;


import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import ByteGenius.tarea2.entities.Evento;
import ByteGenius.tarea2.repositories.EventoRepository;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LogicaEventos {
    private EventoRepository eventoRepository;

    public LogicaEventos(EventoRepository repo) {
        this.eventoRepository = repo;
    }

    public List<Evento> getNiveles() {
        return eventoRepository.findAll();
    }

    public Nivel addNivel(Evento evento) {
        evento.setId(null);
        nivel.setGrupos(Collections.EMPTY_LIST);
        nivelRepo.findByNombre(nivel.getNombre()).ifPresent(n -> {
            throw new ElementoYaExistenteException("Nivel ya existe");
        });
        return nivelRepo.save(nivel);
    }

    public Nivel getNivel(Long id) {
        var nivel = eventoRepository.findByNombre(id);
        if (nivel.isEmpty()) {
            throw new ElementoNoExisteException("Nivel no encontrado");
        } else {
            return nivel.get();
        }
    }

    public Nivel updateNivel(Nivel nivel) {
        if (nivelRepo.existsById(nivel.getId())) {
            var opNivel = nivelRepo.findByNombre(nivel.getNombre());
            if (opNivel.isPresent() && opNivel.get().getId() != nivel.getId()) {
                throw new ElementoYaExistenteException("Nivel ya existe");
            }
            opNivel = nivelRepo.findById(nivel.getId());
            opNivel.ifPresent(n -> {
                n.setNombre(nivel.getNombre());
            });
            return nivelRepo.save(opNivel.get());
        } else {
            throw new ElementoNoExisteException("Nivel no encontrado");
        }
    }

    public void deleteNivel(Long id) {
        var nivel = nivelRepo.findById(id);
        if (nivel.isPresent()) {
            if (!nivel.get().getGrupos().isEmpty()) {
                throw new NivelNoVacioException("Nivel no vacío");
            }
            nivelRepo.deleteById(id);
        } else {
            throw new ElementoNoExisteException("Nivel no encontrado");
        }
    }

    
}
