package com.aloha.project.config;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.aloha.project.dto.CustomUser;
import com.aloha.project.dto.User;
import com.aloha.project.dto.UserAuth;
import com.aloha.project.mapper.UserMapper;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtTokenProvider {

    @Autowired
    private JwtProps jwtProps;

    @Autowired
    private UserMapper userMapper;

    // 토큰 생성
    public String createToken(Long userNo, String username, List<String> roles) {
        byte[] signingKey = getSigningKey();

        String jwt = Jwts.builder()
                .signWith(Keys.hmacShaKeyFor(signingKey), Jwts.SIG.HS512)
                .header()
                    .add("typ", SecurityConstants.TOKEN_TYPE)
                .and()
                .expiration(new Date(System.currentTimeMillis() + 864000000)) // 10일
                .claim("uno", "" + userNo)
                .claim("uid", username)
                .claim("rol", roles)
                .compact();

        log.info("jwt : " + jwt);
        return jwt;
    }

    // 토큰 해석
    public UsernamePasswordAuthenticationToken getAuthentication(String authHeader) {
        if (authHeader == null || authHeader.length() == 0)
            return null;

        try {
            String jwt = authHeader.replace("Bearer ", "");

            Jws<Claims> parsedToken = Jwts.parser()
                    .verifyWith(getShaKey())
                    .build()
                    .parseSignedClaims(jwt);

            log.info("parsedToken : " + parsedToken);

            // 사용자 번호
            String userNoStr = parsedToken.getPayload().get("uno").toString();
            Long no = (userNoStr == null ? 0L : Long.parseLong(userNoStr));
            log.info("userNo : " + no);

            // 사용자 아이디
            String username = parsedToken.getPayload().get("uid").toString();
            log.info("username : " + username);

            if (username == null || username.length() == 0)
                return null;

            // 권한
            Claims claims = parsedToken.getPayload();
            Object roles = claims.get("rol");
            log.info("roles : " + roles);

            User user = new User();
            user.setNo(no);
            user.setUsername(username);

            List<UserAuth> authList = ((List<?>) roles)
                    .stream()
                    .map(auth -> UserAuth.builder()
                            .username(username)
                            .auth(auth.toString())
                            .build())
                    .collect(Collectors.toList());
            user.setAuthList(authList);

            List<SimpleGrantedAuthority> authorities = ((List<?>) roles)
                    .stream()
                    .map(auth -> new SimpleGrantedAuthority((String) auth))
                    .collect(Collectors.toList());

            // DB에서 추가 정보 조회
            try {
                User userInfo = userMapper.selectByNo(no);
                if (userInfo != null) {
                    user.setName(userInfo.getName());
                    user.setEmail(userInfo.getEmail());
                }
            } catch (Exception e) {
                log.error(e.getMessage());
                log.error("토큰 유효 -> DB 추가 정보 조회시 에러 발생...");
            }

            UserDetails userDetails = new CustomUser(user);

            return new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

        } catch (ExpiredJwtException e) {
            log.warn("만료된 JWT : {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("지원하지 않는 JWT : {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("잘못된 JWT : {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT 클레임이 비어있음 : {}", e.getMessage());
        }

        return null;
    }

    // 토큰 유효성 검사
    public boolean validateToken(String jwt) {
        try {
            Jws<Claims> claims = Jwts.parser()
                    .verifyWith(getShaKey())
                    .build()
                    .parseSignedClaims(jwt);

            log.info("토큰 만료기간 : {}", claims.getPayload().getExpiration());
            return !claims.getPayload().getExpiration().before(new Date());

        } catch (ExpiredJwtException e) {
            log.error("Token Expired");
            return false;
        } catch (JwtException e) {
            log.error("Token Tampered");
            return false;
        } catch (NullPointerException e) {
            log.error("Token is null");
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    // secretKey ➡ signingKey
    private byte[] getSigningKey() {
        return jwtProps.getSecretKey().getBytes();
    }

    // secretKey ➡ (HMAC-SHA algorithms) ➡ signingKey
    private SecretKey getShaKey() {
        return Keys.hmacShaKeyFor(getSigningKey());
    }
}