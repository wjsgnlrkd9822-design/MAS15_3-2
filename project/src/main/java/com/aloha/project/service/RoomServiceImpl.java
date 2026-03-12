package com.aloha.project.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aloha.project.dto.HotelRoom;
import com.aloha.project.mapper.RoomMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomMapper roomMapper;


    @Override
    public PageInfo<HotelRoom> listPage(int page, int size) throws Exception {
        PageHelper.startPage(page, size);
        List<HotelRoom> list = roomMapper.list();
        return new PageInfo<>(list);
    }

    @Override
    public List<HotelRoom> list() throws Exception {
        return roomMapper.list();
    }

    @Override
    public boolean insert(HotelRoom hotelRoom) throws Exception {
        int result = roomMapper.insert(hotelRoom);
        return result > 0;
    }

    @Override
    public boolean update(HotelRoom hotelRoom) throws Exception {
      return roomMapper.update(hotelRoom) > 0;
    }

    @Override
    public boolean delete(Long roomNo) throws Exception {
        int result = roomMapper.delete(roomNo);
        return result > 0;
    }
        

    @Override
    public HotelRoom select(Long roomNo) throws Exception {
        return roomMapper.select(roomNo);
    }
    


}
