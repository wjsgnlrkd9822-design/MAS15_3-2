package com.aloha.project.dto;

import java.util.Map;
import java.util.UUID;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@ToString
public class OAuthAttributes {
    private Map<String, Object> attributes;
    private String nameAttributeKey;
    private String name;
    private String email;
    private String socialId;
    private String provider;

    @Builder
    public OAuthAttributes(Map<String, Object> attributes, String nameAttributeKey,
            String name, String email, String socialId, String provider) {
        this.attributes = attributes;
        this.nameAttributeKey = nameAttributeKey;
        this.name = name;
        this.email = email;
        this.socialId = socialId;
        this.provider = provider;
    }

    public static OAuthAttributes of(String registrationId, String userNameAttributeName,
            Map<String, Object> attributes) {
        if ("kakao".equals(registrationId)) {
            return ofKakao(userNameAttributeName, attributes);
        }
        if ("google".equals(registrationId)) {
            return ofGoogle(userNameAttributeName, attributes);
        }
        if ("naver".equals(registrationId)) {
            return ofNaver(userNameAttributeName, attributes);
        }
        return null;
    }

    private static OAuthAttributes ofKakao(String userNameAttributeName, Map<String, Object> attributes) {
        log.info("ofKakao attributes: {}", attributes);

        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        log.info("kakaoAccount: {}", kakaoAccount);
        log.info("profile: {}", profile);

        return OAuthAttributes.builder()
                .name((String) profile.get("nickname"))
                .email((String) kakaoAccount.get("email"))
                .socialId(String.valueOf(attributes.get(userNameAttributeName)))
                .provider("kakao")
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    private static OAuthAttributes ofGoogle(String userNameAttributeName, Map<String, Object> attributes) {
        log.info("ofGoogle attributes: {}", attributes);

        return OAuthAttributes.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .socialId(String.valueOf(attributes.get(userNameAttributeName)))
                .provider("google")
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    private static OAuthAttributes ofNaver(String userNameAttributeName, Map<String, Object> attributes) {
        log.info("ofNaver attributes: {}", attributes);

        Map<String, Object> response = (Map<String, Object>) attributes.get("response");

        return OAuthAttributes.builder()
                .name((String) response.get("name"))
                .email((String) response.get("email"))
                .socialId(String.valueOf(response.get("id")))
                .provider("naver")
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    public UserSocial toEntity(Long userNo, String username) {
        if (username == null || username.isEmpty()) {
            String base = (this.name != null && !this.name.isEmpty()) ? this.name : "user";
            username = (base.length() > 90 ? base.substring(0, 90) : base)
                       + "_" + UUID.randomUUID().toString().substring(0, 8);
        }

        UserSocial userSocial = new UserSocial();
        userSocial.setUserNo(userNo); 
        userSocial.setUsername(username); 
        userSocial.setProvider(this.provider); 
        userSocial.setSocialId(this.socialId);
        userSocial.setName(this.name);      
        userSocial.setEmail(this.email);     
        
        return userSocial;
    }

    public UserSocial toEntity() {
        return toEntity(null, null);
    }
}