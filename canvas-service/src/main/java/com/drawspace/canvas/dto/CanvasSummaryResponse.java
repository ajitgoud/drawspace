package com.drawspace.canvas.dto;

import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record CanvasSummaryResponse(UUID id, String title, boolean isPublic, Instant updatedAt) {
}