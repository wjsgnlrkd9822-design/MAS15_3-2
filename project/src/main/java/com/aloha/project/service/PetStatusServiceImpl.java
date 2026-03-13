package com.aloha.project.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.aloha.project.dto.PetStatus;
import com.aloha.project.mapper.PetStatusMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PetStatusServiceImpl implements PetStatusService {
    
    private final PetStatusMapper petStatusMapper;
    

    @Override
    public PageInfo<Map<String, Object>> getActiveReservationsPage(int page, int size) {
        PageHelper.startPage(page, size);
        List<Map<String, Object>> list = petStatusMapper.selectActiveReservationsWithPetStatus();
        return new PageInfo<>(list);
    } 
    @Override
    public List<Map<String, Object>> getActiveReservationsWithPetStatus() {
        try {
            return petStatusMapper.selectActiveReservationsWithPetStatus();
        } catch (Exception e) {
            log.error("현재 체크인 중인 반려견 목록 조회 실패", e);
            throw new RuntimeException("반려견 목록 조회 실패", e);
        }
    }
    
    @Override
    public PetStatus getPetStatus(Long petNo) {
        try {
            return petStatusMapper.selectPetStatus(petNo);
        } catch (Exception e) {
            log.error("반려견 상태 조회 실패 - petNo: {}", petNo, e);
            return null;
        }
    }
    
    @Override
    public boolean insertPetStatus(PetStatus petStatus) {
        try {
            int result = petStatusMapper.insertPetStatus(petStatus);
            return result > 0;
        } catch (Exception e) {
            log.error("반려견 상태 등록 실패 - petNo: {}", petStatus.getPetNo(), e);
            return false;
        }
    }
    
    @Override
    public boolean updatePetStatus(PetStatus petStatus) {
        try {
            int result = petStatusMapper.updatePetStatus(petStatus);
            return result > 0;
        } catch (Exception e) {
            log.error("반려견 상태 수정 실패 - petNo: {}", petStatus.getPetNo(), e);
            return false;
        }
    }
    
    @Override
    public boolean deletePetStatus(Long petNo) {
        try {
            int result = petStatusMapper.deletePetStatus(petNo);
            return result > 0;
        } catch (Exception e) {
            log.error("반려견 상태 삭제 실패 - petNo: {}", petNo, e);
            return false;
        }
    }
}
