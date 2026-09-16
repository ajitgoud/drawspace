package com.drawspace.canvas.repository;

import com.drawspace.canvas.entity.Canvas;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CanvasRepository extends JpaRepository<Canvas, UUID> {
    List<Canvas> findByOwnerId(UUID ownerId);
    List<Canvas> findByOwnerIdOrderByUpdatedAtDesc(UUID ownerId);
    Optional<Canvas> findByPublicSlugAndIsPublicTrue(String publicSlug);
}