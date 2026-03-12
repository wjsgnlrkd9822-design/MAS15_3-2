package com.aloha.project.config;

import java.util.Arrays;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.aloha.project.handler.CustomAccessDeniedHandler;
import com.aloha.project.handler.LoginFailureHandler;
import com.aloha.project.handler.LoginSuccessHandler;
import com.aloha.project.handler.LogoutSuccessHandler;
import com.aloha.project.handler.OAuth2LoginSuccessHandler;
import com.aloha.project.service.CustomOAuth2UserService;
import com.aloha.project.service.UserDetailServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true, prePostEnabled = true)
public class SecurityConfig {

    private final DataSource dataSource;
    private final UserDetailServiceImpl userDetailServiceImpl;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final LoginSuccessHandler loginSuccessHandler;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final LoginFailureHandler loginFailureHandler;
    private final LogoutSuccessHandler logoutSuccessHandler;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        log.info("스프링 시큐리티 설정 - 테스트 모드");

        // ✅ CORS 설정
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        // ✅ CSRF 비활성화 (React API 호출용)
        http.csrf(csrf -> csrf.disable());

        // ✅ 인가 설정 - 테스트용 전체 허용
        http.authorizeHttpRequests(auth -> auth
            .requestMatchers("/**").permitAll()
        );

        // 폼 로그인 설정
        http.formLogin(login -> login
            .loginPage("/login")
            .loginProcessingUrl("/login")
            .successHandler(loginSuccessHandler)
            .failureHandler(loginFailureHandler)
        );

        // 카카오 OAuth 로그인 설정
        http.oauth2Login(oauth2 -> oauth2
            .loginPage("/login")
            .userInfoEndpoint(userInfo -> userInfo
                .userService(customOAuth2UserService))
            .successHandler(oAuth2LoginSuccessHandler)
            .failureUrl("/login?error=oauth2")
        );

        // 로그아웃 설정
        http.logout(logout -> logout
            .logoutUrl("/logout")
            .invalidateHttpSession(true)
            .deleteCookies("remember-id")
            .logoutSuccessHandler(logoutSuccessHandler)
        );

        // 접근 거부 처리
        http.exceptionHandling(exception -> exception
            .accessDeniedHandler(customAccessDeniedHandler)
        );

        // 사용자 정의 인증
        http.userDetailsService(userDetailServiceImpl);

        // 자동 로그인
        http.rememberMe(me -> me
            .key("aloha")
            .tokenRepository(tokenRepository())
            .tokenValiditySeconds(60 * 60 * 24 * 7)
        );

        return http.build();
    }

    // ✅ CORS 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:3000"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PersistentTokenRepository tokenRepository() {
        JdbcTokenRepositoryImpl repositoryImpl = new JdbcTokenRepositoryImpl();
        repositoryImpl.setDataSource(dataSource);
        try {
            repositoryImpl.getJdbcTemplate().execute(JdbcTokenRepositoryImpl.CREATE_TABLE_SQL);
        } catch (BadSqlGrammarException e) {
            log.info("persistent_logins 테이블이 이미 존재합니다.");
        } catch (Exception e) {
            log.error("자동 로그인 테이블 생성 중 예외 발생", e);
        }
        return repositoryImpl;
    }
}