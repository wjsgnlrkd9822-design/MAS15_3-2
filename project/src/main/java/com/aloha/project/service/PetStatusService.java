package com.aloha.project.service;

import java.util.List;
import java.util.Map;

import com.aloha.project.dto.PetStatus;
import com.github.pagehelper.PageInfo;

public interface PetStatusService {
    
    /**
     * 현재 체크인 중인 반려견 상태 목록 조회
     * @return 반려견 상태 목록 (반려견 정보 + 예약 정보 포함)
     */
    List<Map<String, Object>> getActiveReservationsWithPetStatus();
    
    /**
     * 반려견 상태 조회
     * @param petNo 반려견 번호
     * @return 반려견 상태 정보
     */
    PetStatus getPetStatus(Long petNo);
    
    /**
     * 반려견 상태 등록
     * @param petStatus 반려견 상태 정보
     * @return 성공 여부
     */
    boolean insertPetStatus(PetStatus petStatus);
    
    /**
     * 반려견 상태 수정
     * @param petStatus 반려견 상태 정보
     * @return 성공 여부
     */
    boolean updatePetStatus(PetStatus petStatus);
    
    /**
     * 반려견 상태 삭제
     * @param petNo 반려견 번호
     * @return 성공 여부
     */
    boolean deletePetStatus(Long petNo);
    PageInfo<Map<String, Object>> getActiveReservationsPage(int page, int size);
    
}
