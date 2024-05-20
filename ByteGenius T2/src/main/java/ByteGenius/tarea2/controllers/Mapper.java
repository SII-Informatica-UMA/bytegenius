package ByteGenius.tarea2.controllers;

import ByteGenius.tarea2.dtos.EventoDTO;
import ByteGenius.tarea2.dtos.EventoNuevoDTO;
import ByteGenius.tarea2.entities.Evento;

public class Mapper {

    public static EventoDTO toEventoDTO(Evento evento) {
        return EventoDTO.builder()
                .id(evento.getId())
                .duracionMinutos(evento.getDuracionMinutos())
                .inicio(evento.getInicio())
                .lugar(evento.getLugar())
                .nombre(evento.getNombre())
                .observaciones(evento.getObservaciones())
                .reglaRecurrencia(evento.getReglaRecurrencia())
                .tipo(evento.getTipo())
                .build();
    }

    public static Evento toEvento(EventoNuevoDTO eventoNuevoDTO) {
        Evento evento = new Evento();
        evento.setNombre(eventoNuevoDTO.getNombre());
        evento.setObservaciones(eventoNuevoDTO.getObservaciones());
        evento.setLugar(eventoNuevoDTO.getLugar());
        evento.setDuracionMinutos(eventoNuevoDTO.getDuracionMinutos());
        evento.setInicio(eventoNuevoDTO.getInicio());
        evento.setReglaRecurrencia(eventoNuevoDTO.getReglaRecurrencia());
        evento.setIdCliente(eventoNuevoDTO.getIdCliente());
        evento.setTipo(eventoNuevoDTO.getTipo());
        return evento;
    }

    public static Evento toEventoId(EventoDTO evento) {
        Evento nuevoEvento = new Evento();
        nuevoEvento.setId(evento.getId());
        nuevoEvento.setNombre(evento.getNombre());
        nuevoEvento.setLugar(evento.getLugar());
        nuevoEvento.setDuracionMinutos(evento.getDuracionMinutos());
        nuevoEvento.setInicio(evento.getInicio());
        nuevoEvento.setReglaRecurrencia(evento.getReglaRecurrencia());
        return nuevoEvento;
    }
}
