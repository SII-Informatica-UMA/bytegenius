package ByteGenius.tarea2.exceptions;

public class HttpError extends RuntimeException{
    public HttpError(String message) {
        super(message);
    }

    public HttpError() {
        super();
    }
}
