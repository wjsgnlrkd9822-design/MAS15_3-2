package com.aloha.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.aloha.project.filter.JwtAuthenticationFilter;
import com.aloha.project.filter.JwtRequestFilter;
import com.aloha.project.handler.CustomAccessDeniedHandler;
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

    private final UserDetailServiceImpl userDetailServiceImpl;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final LogoutSuccessHandler logoutSuccessHandler;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationConfiguration authenticationConfiguration;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        log.info("스프링 시큐리티 설정 (JWT + 카카오 OAuth 통합)");
        http.csrf(csrf -> csrf.disable());
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
        http.sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );

        // 인가 설정
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/admin", "/admin/**").hasRole("ADMIN")
                .requestMatchers("/pet/reservation/**").authenticated()
                .requestMatchers("/**").permitAll()
        );

        // 카카오 OAuth 로그인
        http.oauth2Login(oauth2 -> oauth2
                .loginPage("/login")
                .userInfoEndpoint(userInfo -> userInfo
                        .userService(customOAuth2UserService))
                .successHandler(oAuth2LoginSuccessHandler)
                .failureUrl("/login?error=oauth2")
        );

        // 로그아웃
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

        // ✅ JWT 필터 등록
        http.addFilterAt(
                new JwtAuthenticationFilter(authenticationManager(), jwtTokenProvider),
                UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(
                new JwtRequestFilter(authenticationManager(), jwtTokenProvider),
                UsernamePasswordAuthenticationFilter.class);

                return http.build();
            }
            
            @Bean
            public AuthenticationManager authenticationManager() throws Exception {
                return authenticationConfiguration.getAuthenticationManager();

            }
    // CORS 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOriginPattern("*");     // React 개발서버 허용
        configuration.addAllowedMethod("*");            // GET, POST, PUT, DELETE 등 허용
        configuration.addAllowedHeader("*");            // 모든 헤더 허용
        configuration.setAllowCredentials(true);        // 쿠키/인증 허용
        configuration.addExposedHeader(SecurityConstants.TOKEN_HEADER); // Authorization 헤더 노출

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


}