package com.drawspace.canvas.service;

import com.drawspace.canvas.dto.CanvasDetailResponse;
import com.drawspace.canvas.dto.CanvasSummaryResponse;
import com.drawspace.canvas.dto.CreateCanvasRequest;
import com.drawspace.canvas.dto.SaveCanvasRequest;
import com.drawspace.canvas.entity.Canvas;
import com.drawspace.canvas.exception.CanvasNotFoundException;
import com.drawspace.canvas.exception.ForbiddenException;
import com.drawspace.canvas.repository.CanvasRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CanvasService {

    private final CanvasRepository repository;


    public CanvasDetailResponse create(UUID ownerId, CreateCanvasRequest request) {
        Canvas project = Canvas.builder()
                .ownerId(ownerId)
                .title(request.title())
                .canvasJson("{\"objects\":[]}")
                .build();
        repository.save(project);
        return toDetail(project);
    }

    public List<CanvasSummaryResponse> listMine(UUID ownerId) {
        return repository.findByOwnerId(ownerId).stream()
                .map(p -> new CanvasSummaryResponse(p.getId(), p.getTitle(), p.isPublic(), p.getUpdatedAt()))
                .toList();
    }

    public CanvasDetailResponse get(UUID ownerId, UUID projectId) {
        Canvas project = findOwned(ownerId, projectId);
        return toDetail(project);
    }

    public CanvasDetailResponse save(UUID ownerId, UUID projectId, SaveCanvasRequest request) {
        Canvas project = findOwned(ownerId, projectId);
        project.setTitle(request.title());
        project.setCanvasJson(request.canvasJson());
        project.touch();
        repository.save(project);
        return toDetail(project);
    }

    public void delete(UUID ownerId, UUID projectId) {
        Canvas project = findOwned(ownerId, projectId);
        repository.delete(project);
    }

    public String enableSharing(UUID ownerId, UUID projectId) {
        Canvas project = findOwned(ownerId, projectId);
        if (project.getPublicSlug() == null) {
            project.setPublicSlug(UUID.randomUUID().toString());
        }
        project.setPublic(true);
        repository.save(project);
        return project.getPublicSlug();
    }

    public void disableSharing(UUID ownerId, UUID projectId) {
        Canvas project = findOwned(ownerId, projectId);
        project.setPublic(false);
        repository.save(project);
    }

    public CanvasDetailResponse getPublic(String slug) {
        Canvas project = repository.findByPublicSlugAndIsPublicTrue(slug)
                .orElseThrow(() -> new CanvasNotFoundException(slug));
        return toDetail(project);
    }

    private Canvas findOwned(UUID ownerId, UUID projectId) {
        Canvas project = repository.findById(projectId)
                .orElseThrow(() -> new CanvasNotFoundException(projectId.toString()));
        if (!project.getOwnerId().equals(ownerId)) {
            throw new ForbiddenException();
        }
        return project;
    }

    private CanvasDetailResponse toDetail(Canvas p) {
        return new CanvasDetailResponse(p.getId(), p.getTitle(), p.getCanvasJson(),
                p.isPublic(), p.getPublicSlug(), p.getUpdatedAt());
    }
}