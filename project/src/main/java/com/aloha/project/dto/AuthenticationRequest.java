package com.aloha.project.dto;

import groovy.transform.ToString;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ToString
public class AuthenticationRequest {

    private String username;
    private String password;
    
}
