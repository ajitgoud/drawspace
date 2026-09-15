package com.drawspace.asset.event;

import java.util.UUID;

public record AssetUploadedEvent(UUID assetId, String s3Key, String contentType) {}