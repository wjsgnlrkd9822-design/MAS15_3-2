package com.aloha.project.service;

import java.util.List;

import com.aloha.project.dto.User;
import com.aloha.project.dto.UserAuth;
import com.github.pagehelper.PageInfo;

import jakarta.servlet.http.HttpServletRequest;

public interface UserService {

    // 로그인
    public boolean login(User user, HttpServletRequest request) throws Exception;
    
    // 조회
    public User select(String username) throws Exception;
    
    // 회원 가입
    public int join(User user) throws Exception;

    // 회원 수정
    public int update(User user) throws Exception;

    // 회원 권한 등록
    public int insertAuth(UserAuth userAuth) throws Exception;

    // 회원 삭제
    public int delete(String id) throws Exception;

    public int deleteByNO(Long no) throws Exception;
    
    List<User> list() throws Exception;

    public String findId(String name, String email) throws Exception;

    public User selectById(Long userNo) throws Exception;

    public User selectByNo(Long no) throws Exception;
    
    // 기존 list() 아래에 추가
PageInfo<User> listPage(int page, int size) throws Exception;
}
