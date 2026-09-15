package com.drawspace.asset.exception;

public class ForbiddenException extends RuntimeException {
    public ForbiddenException() { super("You do not own this asset"); }
}