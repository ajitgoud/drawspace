package com.drawspace.asset.controller;

import com.drawspace.asset.entity.Asset;
import com.drawspace.asset.event.AssetEventProducer;
import com.drawspace.asset.event.AssetUploadedEvent;
import com.drawspace.asset.exception.AssetNotFoundException;
import com.drawspace.asset.exception.ForbiddenException;
import com.drawspace.asset.exception.InvalidFileException;
import com.drawspace.asset.repository.AssetRepository;
import com.drawspace.asset.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/assets")
public class AssetController {

    private static final Set<String> ALLOWED_TYPES = Set.of("image/png", "image/jpeg", "image/webp");

    private final AssetRepository repository;
    private final StorageService storageService;
    private final AssetEventProducer eventProducer;

    @PostMapping
    public Map<String, Object> upload(@RequestAttribute("userId") String userId, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty() || !ALLOWED_TYPES.contains(file.getContentType())) {
            throw new InvalidFileException("File must be a non-empty PNG, JPEG, or WEBP image");
        }

        UUID ownerId = UUID.fromString(userId);
        String key = ownerId + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

        String url;
        try {
            url = storageService.uploadOriginal(key, file.getInputStream(), file.getSize(), file.getContentType());
        } catch (Exception e) {
            throw new RuntimeException("Upload failed", e);
        }

        Asset asset = Asset.builder()
                .ownerId(ownerId)
                .s3Key(key)
                .url(url)
                .build();
        repository.save(asset);

        eventProducer.publish(new AssetUploadedEvent(asset.getId(), key, file.getContentType()));

        return Map.of("id", asset.getId(), "url", asset.getUrl(), "status", asset.getStatus());
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@RequestAttribute("userId") String userId, @PathVariable("id") UUID id) {
        Asset asset = repository.findById(id).orElseThrow(() -> new AssetNotFoundException(id.toString()));
        if (!asset.getOwnerId().equals(UUID.fromString(userId))) {
            throw new ForbiddenException();
        }
        return Map.of(
                "id", asset.getId(), "url", asset.getUrl(),
                "thumbnailUrl", asset.getThumbnailUrl() == null ? "" : asset.getThumbnailUrl(),
                "status", asset.getStatus()
        );
    }
}