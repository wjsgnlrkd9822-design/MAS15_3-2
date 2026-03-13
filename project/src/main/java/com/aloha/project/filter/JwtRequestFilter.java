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

        // HTTP 헤더에서 토큰 가져옴
        String header = request.getHeader(SecurityConstants.TOKEN_HEADER);
        log.info("authorization : " + header);

        // Bearer + {jwt} 체크
        // 헤더가 없거나 형식이 올바르지 않으면 다음 필터로 진행
        if (header == null || header.length() == 0 || !header.startsWith(SecurityConstants.TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Bearer 제거 → jwt 추출
        String jwt = header.replace(SecurityConstants.TOKEN_PREFIX, "");

        // 토큰 유효성 검사
        if (jwtTokenProvider.validateToken(jwt)) {
            log.info("유효한 JWT 토큰입니다.");

            // Authentication 객체 생성
            Authentication authentication = jwtTokenProvider.getAuthentication(jwt);

            // SecurityContextHolder에 인증 정보 저장
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 다음 필터로 진행
        filterChain.doFilter(request, response);
    }
}