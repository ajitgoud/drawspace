package com.drawspace.canvas.exception;

public class CanvasNotFoundException extends RuntimeException {
    public CanvasNotFoundException(String id) {
        super("Project not found: " + id);
    }
}