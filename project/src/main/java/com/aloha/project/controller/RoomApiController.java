package com.aloha.project.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.project.dto.HotelRoom;
import com.aloha.project.service.HotelRoomService;

import lombok.RequiredArgsConstructor;
import java.util.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequiredArgsConstructor
public class RoomApiController {

    private final HotelRoomService hotelRoomService;

    // 객실 목록 전체 조회
    @GetMapping("/api/rooms")
    public List<HotelRoom> getRooms() {
        return hotelRoomService.getAllRooms();
    }

    // 객실 단건 조회
    // 기존 /api/room/{roomNo} 유지하고 아래 추가
    @GetMapping("/api/rooms/{roomNo}")
    public ResponseEntity<?> getRoomDetail(@PathVariable("roomNo") Long roomNo) {
        HotelRoom room = hotelRoomService.getRoom(roomNo);
        if (room == null) return ResponseEntity.notFound().build();
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("room", room);
        result.put("roomServiceList", hotelRoomService.getAllServices());
        result.put("pets", new ArrayList<>());  // 로그인 연동 전 임시
        return ResponseEntity.ok(result);
    }
    
}

