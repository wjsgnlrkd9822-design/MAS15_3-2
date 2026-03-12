package com.aloha.project.mapper;

import java.util.List;

import com.aloha.project.dto.HotelRoom;
import com.aloha.project.dto.HotelService;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface HotelRoomMapper {
    public int insertHotelRoom(HotelRoom room);
    public HotelRoom selectHotelRoomById(Long roomNo);
    public List<HotelRoom> selectAllHotelRooms();
    public int updateHotelRoom(HotelRoom room);
    public int deleteHotelRoom(Long roomNo);
    public List<HotelService> selectAllServices();
    
}
