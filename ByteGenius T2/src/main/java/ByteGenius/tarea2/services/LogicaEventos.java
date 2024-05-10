package ByteGenius.tarea2.services;


import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import ByteGenius.tarea2.entities.Evento;
import ByteGenius.tarea2.exceptions.ElementoNoExisteException;
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

    public Evento addEvento(Evento evento) {
        return eventoRepository.save(evento);
    }



    public Evento getEvento(int idEntrenador, int idEvento) {
        var Listevento = eventoRepository.findByNombre(idEntrenador);
        boolean esta = false;
        int i = 0;
        Evento evento = null;
        while(i < Listevento.size() && !esta){
            if(Listevento.get(i).getId() == idEvento){
                evento = Listevento.get(i);
                esta = true;
            }
        }
        if (!esta) {
            throw new ElementoNoExisteException("Evento no encontrado");
        } else {
            return evento;
        }
    }

    public void updateEvento(int idEntrenador,int idEvento,Evento cambio) {
        eventoRepository.actualizarEvento(idEvento, cambio.getNombre(), cambio.getDescripción(), cambio.getLugar(),
         cambio.getDuracionMinutos(), (Date) cambio.getInicio(), 
         idEntrenador, cambio.getReglaRecurrencia());
        /*
         var ListEvento = eventoRepository.findByNombre(idEntrenador);
        if(ListEvento != null){
            boolean esta = false;
            int i = 0;
            Evento evento = null;
            while(i < ListEvento.size() && !esta){
                if(ListEvento.get(i).getId() == idEvento){
                    evento = ListEvento.get(i);
                    esta = true;
                }
            }
            if(!esta){
                throw new ElementoNoExisteException("Evento no encontrado");
            }else{
                evento.setNombre(cambio.getNombre());
                evento.setDescripción(cambio.getDescripción());
                evento.setDuracionMinutos(cambio.getDuracionMinutos());
                evento.setIdEntrenador(cambio.getIdEntrenador());
                evento.setIdCliente(cambio.getIdCliente()); 
                evento.setLugar(cambio.getLugar());
                return evento;
            }
        }else{
            throw new ElementoNoExisteException("Evento no encontrado");
        }
         */
    }

    public void deleteNivel(int idEntrenador,int idEvento) {
       eventoRepository.eliminarEventoPorIdEntrenadorYIdEvento(idEvento, idEntrenador);
    }
}
