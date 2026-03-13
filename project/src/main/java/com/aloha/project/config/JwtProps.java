package com.aloha.project.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties("com.aloha.project")
public class JwtProps {

    private String secretKey;
    
}
