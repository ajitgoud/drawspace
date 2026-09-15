package com.drawspace.auth.service;

import com.drawspace.auth.dto.*;
import com.drawspace.auth.entity.User;
import com.drawspace.auth.exception.EmailAlreadyExistsException;
import com.drawspace.auth.exception.InvalidCredentialsException;
import com.drawspace.auth.repository.UserRepository;
import com.drawspace.auth.security.JwtService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }
        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .build();
        userRepository.save(user);
        String token = jwtService.generateToken(user.getId().toString(), user.getEmail());
        return new AuthResponse(token, jwtService.expirationSeconds());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(InvalidCredentialsException::new);
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }
        String token = jwtService.generateToken(user.getId().toString(), user.getEmail());
        return new AuthResponse(token, jwtService.expirationSeconds());
    }
}