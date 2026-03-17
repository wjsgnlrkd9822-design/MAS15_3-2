package com.aloha.project.handler;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.aloha.project.config.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;

    public OAuth2LoginSuccessHandler(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        log.info("========== OAuth2 로그인 성공 ==========");

        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();

        Long userNo = Long.valueOf(oauthUser.getAttribute("userNo").toString());
        String username = oauthUser.getAttribute("username");

        log.info("OAuth2 userNo: {}, username: {}", userNo, username);

        List<String> roles = Collections.singletonList("ROLE_USER");

        String token = jwtTokenProvider.createToken(userNo, username, roles);

        log.info("JWT 생성 완료: {}", token);

        response.sendRedirect("http://localhost:5173/oauth2/callback?token=" + token);
    }
}