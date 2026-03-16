package com.aloha.project.handler;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.aloha.project.config.JwtTokenProvider;
import com.aloha.project.dto.CustomUser;
import com.aloha.project.dto.User;
import com.aloha.project.dto.UserSocial;
import com.aloha.project.service.UserSocialService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserSocialService userSocialService;
    private final JwtTokenProvider jwtTokenProvider;

    // 생성자 주입
    public OAuth2LoginSuccessHandler(UserSocialService userSocialService, JwtTokenProvider jwtTokenProvider) {
        this.userSocialService = userSocialService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        log.info("========== OAuth2 로그인 성공 ==========");

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
    String provider = oauthToken.getAuthorizedClientRegistrationId(); // "kakao" 또는 "google"

    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    String socialId;
    if ("google".equals(provider)) {
        socialId = oAuth2User.getAttribute("sub").toString();
    } else {
        socialId = oAuth2User.getAttribute("id").toString();
    }

        User user;

        try {
            UserSocial social = new UserSocial();
            social.setProvider(provider);
            social.setSocialId(socialId);

            user = userSocialService.selectBySocial(social);

        } catch (Exception e) {
            log.error("소셜 사용자 조회 실패", e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // CustomUser로 감싸기
        CustomUser customUser = new CustomUser(user);

        List<String> roles = customUser.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        String token = jwtTokenProvider.createToken(user.getNo(), user.getUsername(), roles);

       response.sendRedirect("http://localhost:5173/oauth2/callback?token=Bearer " + token);

    }
}