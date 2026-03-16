package com.aloha.project.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aloha.project.dto.CustomUser;
import com.aloha.project.dto.Pet;
import com.aloha.project.dto.ReservationDto;
import com.aloha.project.dto.User;
import com.aloha.project.service.PetService;
import com.aloha.project.service.ReservationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
public class MyPageController {


    private final PetService petService;     
    private final ReservationService reservationService;  


    // 로그인한 사용자 정보 반환 (비동기식 JSON)
    @GetMapping("/api/users/me")
    @ResponseBody
    public User getCurrentUser(@AuthenticationPrincipal CustomUser customUser) {
        if (customUser != null) {
            log.info("로그인 사용자: " + customUser.getUsername());
            return customUser.getUser(); 
        } else {
            log.info("로그인 사용자 없음");
            return null;
        }
    }

    /**
     * 마이페이지
     */
    @GetMapping("/mypage")
    public String mypage(Model model, @AuthenticationPrincipal CustomUser customUser) throws Exception {
        if(customUser != null){
            Long ownerNo = customUser.getNo();

            // 반려견 목록
            List<Pet> pets = petService.selectPetsByOwnerNo(ownerNo);
            model.addAttribute("pets", pets);

            // 예약 목록
            List<ReservationDto> reservations = reservationService.getReservationsByUser(ownerNo);
            model.addAttribute("reservations", reservations);
        }
        return "mypage/mypage";
    }

    /* 내 예약 리스트 */
    @GetMapping("/api/reservations/my")
@ResponseBody
public Map<String, Object> getMyReservations(@AuthenticationPrincipal CustomUser customUser) {
    Map<String, Object> result = new HashMap<>();
    try {
        Long userNo = customUser.getNo();
        List<ReservationDto> reservations = reservationService.getReservationsByUser(userNo);
        result.put("success", true);
        result.put("reservations", reservations);
    } catch (Exception e) {
        result.put("success", false);
        result.put("message", e.getMessage());
    }
    return result;
}

    /**
     * 예약 1건 조회 (AJAX)
     */
    @GetMapping("/api/reservation/{resNo}")
    @ResponseBody
    public ReservationDto getReservation(@PathVariable("resNo") Long resNo) {
        return reservationService.getReservationByResNo(resNo);
    }

    /**
     * 예약 수정 (AJAX)
     */
    @PostMapping("/api/reservation/update/{resNo}")
    @ResponseBody
    public Map<String, Object> updateReservation(
            @PathVariable("resNo") Long resNo,
            @RequestParam("checkin") String checkin,
            @RequestParam("checkout") String checkout,
            @RequestParam("total") int total,
            @RequestParam("totalPrice") int totalPrice,
            @RequestParam(value="serviceIds", required=false) List<Long> serviceIds,
            @RequestParam("roomNo") Long roomNo   // ⭐ 방 번호 필요 (겹침 체크용)
    ) {
        Map<String, Object> result = new HashMap<>();

        try {
            LocalDate checkinDate = LocalDate.parse(checkin);
            LocalDate checkoutDate = LocalDate.parse(checkout);

            // ⭐ DTO로 묶어서 전달
            ReservationDto dto = new ReservationDto();
            dto.setResNo(resNo);
            dto.setRoomNo(roomNo);
            dto.setCheckin(checkinDate);
            dto.setCheckout(checkoutDate);
            dto.setTotal(total);
            dto.setTotalPrice(totalPrice);
            dto.setServiceIds(serviceIds);

            // ⭐ 겹침 체크 포함 수정 호출
            boolean success = reservationService.updateReservation(dto);

            if (!success) {
                result.put("success", false);
                result.put("message", "해당 날짜에 이미 예약된 객실입니다.");
                return result;
            }

            result.put("success", true);
            result.put("message", "예약이 수정되었습니다.");

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "수정 실패: " + e.getMessage());
        }

        return result;
    }

    /**
     * 예약 취소
     */
    @PostMapping("/api/reservation/cancel/{resNo}")
    @ResponseBody
    public Map<String, Object> cancelReservation(@PathVariable("resNo") Long resNo) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = reservationService.cancelReservation(resNo);
            if (success) {
                result.put("success", true);
                result.put("message", "예약이 취소되었습니다.");
            } else {
                result.put("success", false);
                result.put("message", "이미 취소되었거나 존재하지 않는 예약입니다.");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "취소 실패: " + e.getMessage());
        }
        return result;
    }

    /**
     * 예약 삭제 (AJAX)
     */
    @DeleteMapping("/api/reservation/delete/{resNo}")
    @ResponseBody
    public Map<String, Object> deleteReservation(@PathVariable("resNo") Long resNo) {
        Map<String, Object> result = new HashMap<>();
        try {
            reservationService.delete(resNo);
            result.put("success", true);
            result.put("message", "예약이 삭제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "삭제 실패: " + e.getMessage());
        }
        return result;
    }


}