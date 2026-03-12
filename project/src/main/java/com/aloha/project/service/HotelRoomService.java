package com.aloha.project.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aloha.project.dto.HotelRoom;
import com.aloha.project.dto.HotelService;
import com.aloha.project.mapper.HotelRoomMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HotelRoomService {

    private final HotelRoomMapper mapper;

    public List<HotelRoom> getAllRooms() {
        return mapper.selectAllHotelRooms();
    }

    public HotelRoom getRoom(Long roomNo) {
        return mapper.selectHotelRoomById(roomNo);
    }

    public int addRoom(HotelRoom room) {
        return mapper.insertHotelRoom(room);
    }

    public int updateRoom(HotelRoom room) {
        return mapper.updateHotelRoom(room);
    }

    public int deleteRoom(Long roomNo) {
        return mapper.deleteHotelRoom(roomNo);
    }

    public List<HotelService> getAllServices() {
        return mapper.selectAllServices();
    }
    
}
