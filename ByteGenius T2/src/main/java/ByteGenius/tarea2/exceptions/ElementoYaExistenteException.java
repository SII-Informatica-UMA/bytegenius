package ByteGenius.tarea2.exceptions;

public class ElementoYaExistenteException extends RuntimeException {
    public ElementoYaExistenteException(String message) {
        super(message);
    }

    public ElementoYaExistenteException() {
        super();
    }
}
