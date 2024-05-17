package ByteGenius.tarea2.dtos;

import java.util.Date;

import ByteGenius.tarea2.entities.Tipo;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventoNuevoDTO {
    private String nombre;
    private String descripción;
    private String observaciones;
    private String lugar;
    private Integer duracionMinutos;
    private Date inicio;
    private String reglaRecurrencia;
    private Long idCliente;
    private Tipo tipo;
}