package ByteGenius.tarea2.dtos;
import ByteGenius.tarea2.entities.Tipo;
import lombok.*;

@Getter
@Setter
public class EntrenadorDTO {
    private Long idUsuario;
    private String telefono;
    private String direccion;
    private String dni;
    private String fechaNacimiento;
    private String fechaAlta;
    private String fechaBaja;
    private String especialidad;
    private String titulacion;
    private String experiencia;
    private String observaciones;
    private Long id; 
    public EntrenadorDTO(long idUsuario){
        this.idUsuario = idUsuario;
    }
}
