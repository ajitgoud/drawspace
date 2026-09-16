package com.drawspace.canvas.controller;


import com.drawspace.canvas.dto.CanvasDetailResponse;
import com.drawspace.canvas.service.CanvasService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/public")
public class PublicCanvasController {

    private final CanvasService service;

    @GetMapping("/{slug}")
    public CanvasDetailResponse getPublic(@PathVariable("slug") String slug) {
        return service.getPublic(slug);
    }
}
