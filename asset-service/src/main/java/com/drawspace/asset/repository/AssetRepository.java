package com.drawspace.asset.repository;

import com.drawspace.asset.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AssetRepository extends JpaRepository<Asset, UUID> {}