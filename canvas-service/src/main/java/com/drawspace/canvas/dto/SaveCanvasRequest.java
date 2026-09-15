package com.drawspace.canvas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record SaveCanvasRequest(
        @NotBlank String title,
        @NotBlank @Size(max = 5_000_000) String canvasJson
) {
}
