package com.aloha.project.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aloha.project.dto.Trainer;
import com.aloha.project.mapper.TrainerMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TrainerServiceImpl implements TrainerService{
        private final TrainerMapper trainerMapper;


    @Override
    public PageInfo<Trainer> listPage(int page, int size) throws Exception {
        PageHelper.startPage(page, size);
        List<Trainer> list = trainerMapper.list();
        return new PageInfo<>(list);
    }


    @Override
    public List<Trainer> list() throws Exception {
        return trainerMapper.list();
    }

    @Override
    public Trainer select(Long trainerNo) throws Exception {
        return trainerMapper.select(trainerNo);
    }

    @Override
    public boolean insert(Trainer trainer) throws Exception {
        int result = trainerMapper.insert(trainer);
        return result > 0;
    }


    @Override
    public boolean update(Trainer trainer) throws Exception {
        int result = trainerMapper.update(trainer);
        return result > 0;
    }

    @Override
    public boolean delete(Long trainerNo) throws Exception {
        int result = trainerMapper.delete(trainerNo);
        return result > 0;
    }
    
}
