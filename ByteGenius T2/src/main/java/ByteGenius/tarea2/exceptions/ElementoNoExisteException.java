package ByteGenius.tarea2.exceptions;


public class ElementoNoExisteException extends RuntimeException {
    public ElementoNoExisteException(String message) {
        super(message);
    }

    public ElementoNoExisteException() {
        super();
    }
}
