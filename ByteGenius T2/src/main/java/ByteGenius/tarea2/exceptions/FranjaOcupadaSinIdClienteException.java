package ByteGenius.tarea2.exceptions;

public class FranjaOcupadaSinIdClienteException extends RuntimeException{
    public FranjaOcupadaSinIdClienteException(String message) {
        super(message);
    }

    public FranjaOcupadaSinIdClienteException() {
        super();
    }
}
