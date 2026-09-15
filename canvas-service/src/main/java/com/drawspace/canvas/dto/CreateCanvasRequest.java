package com.drawspace.canvas.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCanvasRequest(
        @NotBlank
        String title
) {
}
