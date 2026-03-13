package com.aloha.project.service;

import java.util.List;

import com.aloha.project.dto.HotelRoom;
import com.github.pagehelper.PageInfo;


public interface RoomService {

    List<HotelRoom> list() throws Exception;
    
    boolean insert(HotelRoom hotelRoom) throws Exception;

    boolean update(HotelRoom hotelRoom) throws Exception;
    
    boolean delete(Long roomNo) throws Exception;

    HotelRoom select(Long roomNo) throws Exception;
    PageInfo<HotelRoom> listPage(int page, int size) throws Exception;
}
