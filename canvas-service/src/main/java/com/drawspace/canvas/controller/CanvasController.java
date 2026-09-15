package com.drawspace.canvas.controller;

import com.drawspace.canvas.dto.CanvasDetailResponse;
import com.drawspace.canvas.dto.CanvasSummaryResponse;
import com.drawspace.canvas.dto.CreateCanvasRequest;
import com.drawspace.canvas.dto.SaveCanvasRequest;
import com.drawspace.canvas.service.CanvasService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/canvas")
public class CanvasController {

    private final CanvasService service;

    @PostMapping
    public ResponseEntity<CanvasDetailResponse> create(
            @RequestAttribute("userId") String userId, @Valid @RequestBody CreateCanvasRequest request) {
        return ResponseEntity.status(201).body(service.create(UUID.fromString(userId), request));
    }

    @GetMapping
    public List<CanvasSummaryResponse> listMine(@RequestAttribute("userId") String userId) {
        return service.listMine(UUID.fromString(userId));
    }

    @GetMapping("/{id}")
    public CanvasDetailResponse get(@RequestAttribute("userId") String userId, @PathVariable("id") UUID id) {
        return service.get(UUID.fromString(userId), id);
    }

    @PutMapping("/{id}")
    public CanvasDetailResponse save(
            @RequestAttribute("userId") String userId, @PathVariable("id") UUID id,
            @Valid @RequestBody SaveCanvasRequest request) {
        return service.save(UUID.fromString(userId), id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestAttribute("userId") String userId, @PathVariable("id") UUID id) {
        service.delete(UUID.fromString(userId), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/share")
    public Map<String, String> share(@RequestAttribute("userId") String userId, @PathVariable("id") UUID id) {
        return Map.of("publicSlug", service.enableSharing(UUID.fromString(userId), id));
    }

    @DeleteMapping("/{id}/share")
    public ResponseEntity<Void> unshare(@RequestAttribute("userId") String userId, @PathVariable("id") UUID id) {
        service.disableSharing(UUID.fromString(userId), id);
        return ResponseEntity.noContent().build();
    }
}