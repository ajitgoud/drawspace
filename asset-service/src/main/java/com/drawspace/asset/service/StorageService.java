package com.drawspace.asset.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.InputStream;

@Service
public class StorageService {

    private final S3Client s3Client;
    private final String endpoint;
    private final String bucketOriginals;
    private final String bucketThumbnails;

    public StorageService(S3Client s3Client,
                          @Value("${drawspace.s3.endpoint}") String endpoint,
                          @Value("${drawspace.s3.bucket-originals}") String bucketOriginals,
                          @Value("${drawspace.s3.bucket-thumbnails}") String bucketThumbnails) {
        this.s3Client = s3Client;
        this.endpoint = endpoint;
        this.bucketOriginals = bucketOriginals;
        this.bucketThumbnails = bucketThumbnails;
    }

    public String uploadOriginal(String key, InputStream data, long contentLength, String contentType) {
        s3Client.putObject(PutObjectRequest.builder()
                        .bucket(bucketOriginals).key(key).contentType(contentType).build(),
                RequestBody.fromInputStream(data, contentLength));
        return endpoint + "/" + bucketOriginals + "/" + key;
    }

    public String uploadThumbnail(String key, byte[] data, String contentType) {
        s3Client.putObject(PutObjectRequest.builder()
                        .bucket(bucketThumbnails).key(key).contentType(contentType).build(),
                RequestBody.fromBytes(data));
        return endpoint + "/" + bucketThumbnails + "/" + key;
    }

    public InputStream downloadOriginal(String key) {
        return s3Client.getObject(GetObjectRequest.builder()
                .bucket(bucketOriginals).key(key).build());
    }
}