package com.aloha.project.service;

import java.util.List;

import com.aloha.project.dto.HotelService;
import com.github.pagehelper.PageInfo;

public interface AddtionalService {
    List<HotelService> list() throws Exception;
    boolean insert(HotelService hotelService) throws Exception;             
    boolean update(HotelService hotelService) throws Exception;
    boolean delete(Long serviceNo) throws Exception;
    HotelService select(Long serviceNo) throws Exception;
      PageInfo<HotelService> listPage(int page, int size) throws Exception;
}
