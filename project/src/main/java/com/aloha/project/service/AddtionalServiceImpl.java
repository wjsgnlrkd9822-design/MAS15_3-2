package com.aloha.project.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aloha.project.dto.HotelService;
import com.aloha.project.mapper.ServiceMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddtionalServiceImpl implements AddtionalService{

    private final ServiceMapper serviceMapper;


    @Override
    public PageInfo<HotelService> listPage(int page, int size) throws Exception {
        PageHelper.startPage(page, size);
        List<HotelService> list = serviceMapper.list();
        return new PageInfo<>(list);
    }
    @Override
    public List<HotelService> list() throws Exception {
        return serviceMapper.list();
    }

    @Override
    public boolean insert(HotelService hotelService) throws Exception {
        int result = serviceMapper.insert(hotelService);
        return result > 0;
    }

    @Override
    public boolean update(HotelService hotelService) throws Exception {
        int result = serviceMapper.update(hotelService);
        return result > 0;
    }

    @Override
    public boolean delete(Long serviceNo) throws Exception {
        int result = serviceMapper.delete(serviceNo);
        return result > 0;                          
    }

    @Override
    public HotelService select(Long serviceNo) throws Exception {
        return serviceMapper.select(serviceNo);
    }
    


}
