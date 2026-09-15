package com.drawspace.asset.exception;

public class AssetNotFoundException extends RuntimeException {
    public AssetNotFoundException(String id) { super("Asset not found: " + id); }
}