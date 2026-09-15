package com.drawspace.canvas.exception;

public class ForbiddenException extends RuntimeException {
    public ForbiddenException() {
        super("You do not own this project");
    }
}