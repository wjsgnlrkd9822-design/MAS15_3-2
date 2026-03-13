package com.aloha.project.handler;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Component
public class LogoutSuccessHandler extends SimpleUrlLogoutSuccessHandler {
  
  @Override
  public void onLogoutSuccess(HttpServletRequest request, 
                              HttpServletResponse response, 
                              Authentication authentication)
      throws IOException, ServletException {
    
    log.info("로그아웃 성공...");

    response.setStatus(HttpServletResponse.SC_OK);
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    response.getWriter().write(
        "{\"message\": \"로그아웃 성공\", \"status\": 200}"
    );
  }

  
  
}
