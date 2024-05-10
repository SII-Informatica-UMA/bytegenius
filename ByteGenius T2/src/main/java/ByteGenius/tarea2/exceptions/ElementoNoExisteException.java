package es.uma.informatica.sii.nivelesinstituto.exceptions;

public class ElementoNoExisteException extends RuntimeException {
    public ElementoNoExisteException(String message) {
        super(message);
    }

    public ElementoNoExisteException() {
        super();
    }
}
