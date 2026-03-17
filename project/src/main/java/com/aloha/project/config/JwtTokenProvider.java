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
import com.aloha.project.mapper.UserMapper;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
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
                .expiration(new Date(System.currentTimeMillis() + 864000000))
                .claim("uno", "" + userNo)
                .claim("uid", username)
                .claim("rol", roles)
                .compact();

        log.info("jwt : " + jwt);
        return jwt;
    }

    // 토큰 해석
    public UsernamePasswordAuthenticationToken getAuthentication(String jwt) {

    if (jwt == null || jwt.isEmpty())
        return null;

    try {
        Jws<Claims> parsedToken = Jwts.parser()
                .verifyWith(getShaKey())
                .build()
                .parseSignedClaims(jwt);

        Claims claims = parsedToken.getPayload();

        Long userNo = claims.get("uno") != null ? Long.parseLong(claims.get("uno").toString()) : null;
        String username = claims.get("uid") != null ? claims.get("uid").toString() : null;

        if (userNo == null || username == null) return null;

        List<SimpleGrantedAuthority> authorities;
        Object rolObj = claims.get("rol");

        if (rolObj instanceof List<?>) {
            authorities = ((List<?>) rolObj).stream()
                    .map(Object::toString)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
        } else {
            authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
        }

        User user = new User();
        user.setNo(userNo);
        user.setUsername(username);

        User dbUser = userMapper.selectByNo(userNo);
        if (dbUser != null) {
            user.setName(dbUser.getName());
            user.setEmail(dbUser.getEmail());
        } else {
            user.setName(username);
            user.setEmail("no-email@aloha.com");
        }

        UserDetails userDetails = new CustomUser(user);

        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                authorities
        );

    } catch (Exception e) {
        log.warn("JWT 인증 실패: {}", e.getMessage());
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