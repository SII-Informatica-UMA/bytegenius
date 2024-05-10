package es.uma.informatica.sii.nivelesinstituto.exceptions;

public class NivelNoVacioException extends RuntimeException {
    public NivelNoVacioException(String message) {
        super(message);
    }

    public NivelNoVacioException() {
        super();
    }
}
