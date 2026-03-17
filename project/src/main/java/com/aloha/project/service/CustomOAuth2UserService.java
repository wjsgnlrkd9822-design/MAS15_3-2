package com.aloha.project.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha.project.dto.OAuthAttributes;
import com.aloha.project.dto.User;
import com.aloha.project.dto.UserSocial;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserSocialService userSocialService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public CustomOAuth2UserService(
            UserSocialService userSocialService,
            @Lazy UserService userService,
            @Lazy PasswordEncoder passwordEncoder) {
        this.userSocialService = userSocialService;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails()
                .getUserInfoEndpoint()
                .getUserNameAttributeName();

        OAuthAttributes attributes = OAuthAttributes.of(
                registrationId,
                userNameAttributeName,
                oAuth2User.getAttributes());

        UserSocial userSocial = saveOrUpdate(attributes);

        Map<String, Object> modifiedAttributes = new HashMap<>(attributes.getAttributes());
        modifiedAttributes.put("userNo", userSocial.getUserNo());
        modifiedAttributes.put("username", userSocial.getUsername());

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                modifiedAttributes,
                attributes.getNameAttributeKey());
    }

    private UserSocial saveOrUpdate(OAuthAttributes attributes) {
        UserSocial userSocial = null;

        try {
            UserSocial searchParam = new UserSocial();
            searchParam.setProvider(attributes.getProvider());
            searchParam.setSocialId(attributes.getSocialId());

            UserSocial existing = userSocialService.selectSocial(searchParam);

            if (existing == null) {
                log.info("신규 소셜 사용자 등록: {}", attributes.getEmail());

                User newUser = new User();
                newUser.setId(UUID.randomUUID().toString());
                String username = attributes.getProvider() + "_" + attributes.getSocialId();
                newUser.setUsername(username);
                newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                newUser.setName(attributes.getName());
                newUser.setEmail(attributes.getEmail());

                int userResult = userService.join(newUser);

                if (userResult <= 0) {
                    throw new OAuth2AuthenticationException("users 테이블 등록 실패");
                }

                User createdUser = userService.select(username);
                log.info("users 테이블 등록 완료 - no: {}, username: {}", createdUser.getNo(), createdUser.getUsername());

                userSocial = attributes.toEntity(createdUser.getNo(), createdUser.getUsername());
                userSocialService.insertSocial(userSocial);
                log.info("users_social 테이블 등록 완료: provider={}, socialId={}", attributes.getProvider(),
                        attributes.getSocialId());
            } else {
                log.info("기존 소셜 계정 정보 업데이트: {}", attributes.getEmail());
                userSocial = attributes.toEntity(existing.getUserNo(), existing.getUsername());
                userSocialService.updateSocial(userSocial);
            }
        } catch (Exception e) {
            log.error("소셜 로그인 사용자 정보 처리 중 오류 발생", e);
            throw new OAuth2AuthenticationException("소셜 로그인 처리 실패: " + e.getMessage());
        }

        return userSocial;
    }
}