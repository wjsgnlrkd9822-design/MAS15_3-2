package com.aloha.project.filter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.aloha.project.config.JwtTokenProvider;
import com.aloha.project.config.SecurityConstants;
import com.aloha.project.dto.CustomUser;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        // /login 경로로 필터 동작
        setFilterProcessesUrl(SecurityConstants.AUTH_LOGIN_URL);
    }

    // 🔐 인증 시도
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {

        String username = request.getParameter("username");
        String password = request.getParameter("password");

        log.info("username : " + username);
        log.info("password : " + password);

        Authentication authentication = new UsernamePasswordAuthenticationToken(username, password);
        authentication = authenticationManager.authenticate(authentication);

        log.info("인증 여부 : " + authentication.isAuthenticated());

        if (!authentication.isAuthenticated()) {
            log.info("인증 실패 : 아이디와 비밀번호가 일치하지 않습니다.");
            response.setStatus(401);
        }

        return authentication;
    }

    // ⭕ 인증 성공 → JWT 발급
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
            Authentication authentication) throws IOException, ServletException {

        log.info("인증 성공 !");

        CustomUser user = (CustomUser) authentication.getPrincipal();
        Long userNo = user.getNo();
        String username = user.getUsername();

        List<String> roles = user.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // JWT 발급
        String token = jwtTokenProvider.createToken(userNo, username, roles);

        // 응답 헤더에 토큰 담기
        // { Authorization : Bearer {jwt} }
        response.addHeader(SecurityConstants.TOKEN_HEADER, SecurityConstants.TOKEN_PREFIX + token);
        response.setStatus(200);
    }
}