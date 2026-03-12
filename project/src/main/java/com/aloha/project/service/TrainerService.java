package com.aloha.project.service;

import java.util.List;

import com.aloha.project.dto.Trainer;
import com.github.pagehelper.PageInfo;

public interface TrainerService {

    List<Trainer> list() throws Exception;              
    Trainer select(Long trainerNo) throws Exception;
    boolean insert(Trainer trainer) throws Exception;                                                               
    boolean update(Trainer trainer) throws Exception;   
    boolean delete(Long trainerNo) throws Exception;
    
    PageInfo<Trainer> listPage(int page, int size) throws Exception;
}
