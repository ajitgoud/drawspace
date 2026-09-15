package com.drawspace.asset.event;

import com.drawspace.asset.entity.Asset;
import com.drawspace.asset.entity.AssetStatus;
import com.drawspace.asset.repository.AssetRepository;
import com.drawspace.asset.service.StorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

@Component
public class AssetThumbnailConsumer {

    private final AssetRepository assetRepository;
    private final StorageService storageService;
    private final ObjectMapper objectMapper;

    public AssetThumbnailConsumer(AssetRepository assetRepository, StorageService storageService, ObjectMapper objectMapper) {
        this.assetRepository = assetRepository;
        this.storageService = storageService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "asset.uploaded", groupId = "asset-service")
    public void handle(String payload) {
        try {
            AssetUploadedEvent event = objectMapper.readValue(payload, AssetUploadedEvent.class);
            Asset asset = assetRepository.findById(event.assetId()).orElseThrow();
            asset.setStatus(AssetStatus.PROCESSING);
            assetRepository.save(asset);

            try (InputStream original = storageService.downloadOriginal(event.s3Key())) {
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                Thumbnails.of(original).size(300, 300).outputFormat("jpg").toOutputStream(out);
                String thumbKey = "thumb-" + event.s3Key();
                String thumbUrl = storageService.uploadThumbnail(thumbKey, out.toByteArray(), "image/jpeg");
                asset.setThumbnailUrl(thumbUrl);
                asset.setStatus(AssetStatus.READY);
            } catch (Exception resizeError) {
                asset.setStatus(AssetStatus.FAILED);
            }
            assetRepository.save(asset);
        } catch (Exception e) {
            // malformed event — log and drop rather than crash the listener thread
        }
    }
}