package com.aloha.project.service;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha.project.dto.User;
import com.aloha.project.dto.UserAuth;
import com.aloha.project.mapper.UserMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

     @Override
    public boolean login(User user, HttpServletRequest request) throws Exception {
        // 토큰 생성
        String username = user.getUsername();    // 아이디
        String password = user.getPassword();    // 암호화되지 않은 비밀번호
        UsernamePasswordAuthenticationToken token 
            = new UsernamePasswordAuthenticationToken(username, password);
        
        // 토큰을 이용하여 인증
        Authentication authentication = authenticationManager.authenticate(token);
        
        // 인증 여부 확인
        boolean result = authentication.isAuthenticated();

        // 인증이 성공하면 SecurityContext에 설정
        if (result) {
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // 세션에 인증 정보 설정 (세션이 없으면 새로 생성)
            HttpSession session = request.getSession(true);  // 세션이 없으면 새로 생성
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
        }

        return result;
    }

     @Override
    public User select(String username) throws Exception {
        User user = userMapper.select(username);
        return user;
    }

    @Override
    @Transactional
    public int join(User user) throws Exception {
        String username = user.getUsername();
        String password = user.getPassword();
        // (암호화)
        String encodedPassword = passwordEncoder.encode(password);  // 비밀번호 암호화
        user.setPassword(encodedPassword);

        // 회원 등록
        int result = userMapper.join(user);

        if( result > 0 ) {
          // 회원 기본 권한 등록
          UserAuth userAuth = new UserAuth();
          userAuth.setUsername(username);
          userAuth.setAuth("ROLE_USER");
          result = userMapper.insertAuth(userAuth);
        }
        return result;
    }

    @Override
    public int update(User user) throws Exception {
        // 비밀번호 변경하는 경우 암호화 처리
        String password = user.getPassword();
        if( password != null && !password.isEmpty() ) {
          String encodedPassword = passwordEncoder.encode(password);  // 비밀번호 암호화
          user.setPassword(encodedPassword);
        }
        int result = userMapper.update(user);
        return result;
    }

    @Override
    public int insertAuth(UserAuth userAuth) throws Exception {
        int result = userMapper.insertAuth(userAuth);
        return result;
    }

    @Override
    public int delete(String id) throws Exception {
        int result = userMapper.delete(id);
        return result;
    }

    @Override
    public List<User> list() throws Exception {
        List<User> users = userMapper.list();
        return users;

    }

    @Override
    public String findId(String name, String email) throws Exception {
        String username = userMapper.findId(name, email);
        return username;
    }

    @Override
    public User selectByNo(Long no) throws Exception {
        return userMapper.selectByNo(no);
    }

    @Override
    public int deleteByNO(Long no) throws Exception {
      int result = userMapper.deleteByNo(no);
        return result;
    }

    

}
