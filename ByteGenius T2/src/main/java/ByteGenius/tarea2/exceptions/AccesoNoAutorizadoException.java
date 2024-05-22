package ByteGenius.tarea2.exceptions;

public class AccesoNoAutorizadoException extends RuntimeException{
    public AccesoNoAutorizadoException(String message) {
        super(message);
    }

    public AccesoNoAutorizadoException() {
        super();
    }
}
