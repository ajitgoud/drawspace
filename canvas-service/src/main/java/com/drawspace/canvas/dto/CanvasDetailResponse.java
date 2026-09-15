package com.drawspace.canvas.dto;

import java.time.Instant;
import java.util.UUID;

public record CanvasDetailResponse(
        UUID id, String title, String canvasJson,
        boolean isPublic, String publicSlug, Instant updatedAt
) {
}