package com.drawspace.auth.dto;

import lombok.Builder;

@Builder
public record AuthResponse(String accessToken, String tokenType, long expiresInSeconds) {
    public AuthResponse(String accessToken, long expiresInSeconds) {
        this(accessToken, "Bearer", expiresInSeconds);
    }
}