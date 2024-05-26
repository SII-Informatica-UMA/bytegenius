package ByteGenius.tarea2.exceptions;

import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ElementoNoExisteException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public void handleElementoNoExisteException(ElementoNoExisteException ex) {
        // Aquí puedes agregar lógica adicional, como logging, si es necesario
    }

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public void handleBadRequestException(BadRequestException ex) {
        // Aquí puedes agregar lógica adicional, como logging, si es necesario
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public void handleIllegalArgumentException(IllegalArgumentException ex) {
        // Aquí puedes agregar lógica adicional, como logging, si es necesario
    }

    @ExceptionHandler(HaySolapamientoException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public void handleHaySolapamientoException(HaySolapamientoException ex) {
        // Aquí puedes agregar lógica adicional, como logging, si es necesario
    }

    @ExceptionHandler(NoDisponibleException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public void handleNoDisponibleException(NoDisponibleException ex) {
        // Aquí puedes agregar lógica adicional, como logging, si es necesario
    }
}