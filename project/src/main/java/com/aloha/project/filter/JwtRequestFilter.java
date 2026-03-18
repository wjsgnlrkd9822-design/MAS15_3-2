package com.aloha.project.filter;

import java.io.IOException;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.aloha.project.config.JwtTokenProvider;
import com.aloha.project.config.SecurityConstants;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtRequestFilter extends OncePerRequestFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public JwtRequestFilter(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader(SecurityConstants.TOKEN_HEADER);
        log.info("authorization : " + header);

        if (header == null || header.length() == 0 || !header.startsWith(SecurityConstants.TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = header.replace(SecurityConstants.TOKEN_PREFIX, "");

        if (jwtTokenProvider.validateToken(jwt)) {
            log.info("유효한 JWT 토큰입니다.");

            Authentication authentication = jwtTokenProvider.getAuthentication(jwt);

            if (authentication != null) {
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                log.warn("Authentication 생성 실패");
            }
        }

        filterChain.doFilter(request, response);
    }
}