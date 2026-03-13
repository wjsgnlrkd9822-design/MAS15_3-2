package com.aloha.project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.project.dto.User;
import com.aloha.project.dto.UserAuth;

@Mapper
public interface UserMapper {

    // 회원 조회
    public User select(String id) throws Exception;

    // 회원 가입
    public int join(User user) throws Exception;

    // 회원 수정
    public int update(User user) throws Exception;

    // 회원 권한 등록
    public int insertAuth(UserAuth userAuth) throws Exception;

    public int delete(String id) throws Exception;

    List<User> list() throws Exception;

    public int deleteByNo(Long no) throws Exception;

    public String findId(@Param("name") String name, @Param("email") String email);
    
    User selectByNo(@Param("userNo") Long userNo) throws Exception;


}
