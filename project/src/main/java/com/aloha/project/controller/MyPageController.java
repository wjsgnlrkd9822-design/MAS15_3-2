package com.aloha.project.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.aloha.project.dto.*;
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

    /**
     * 공통: 사용자 번호 추출 (핵심)
     */
    private Long getUserNo(Object principal) {
        if (principal instanceof CustomUser user) {
            return user.getNo();
        } else if (principal instanceof CustomOAuth2User oauthUser) {
            return oauthUser.getNo();
        }
        return null;
    }

    /**
     * 로그인 사용자 정보
     */
    @GetMapping("/api/users/me")
    @ResponseBody
    public User getCurrentUser(@AuthenticationPrincipal Object principal) {

        if (principal == null)
            return null;

        if (principal instanceof CustomUser user) {
            return user.getUser();
        } else if (principal instanceof CustomOAuth2User oauthUser) {
            return oauthUser.getUser();
        }

        return null;
    }

    /**
     * 마이페이지
     */
    @GetMapping("/mypage")
    public String mypage(Model model, @AuthenticationPrincipal Object principal) {

        if (principal == null) {
            return "redirect:/login";
        }

        Long userNo = getUserNo(principal);

        if (userNo != null) {
            try {
                List<Pet> pets = petService.selectPetsByOwnerNo(userNo);
                model.addAttribute("pets", pets);

                List<ReservationDto> reservations = reservationService.getReservationsByUser(userNo);
                model.addAttribute("reservations", reservations);

            } catch (Exception e) {
                log.error("마이페이지 데이터 조회 실패", e);
                model.addAttribute("pets", List.of());
                model.addAttribute("reservations", List.of());
            }
        }

        return "mypage/mypage";
    }

    /**
     * 내 예약 리스트
     */
    @GetMapping("/api/reservations/my")
    @ResponseBody
    public Map<String, Object> getMyReservations(@AuthenticationPrincipal Object principal) {

        Map<String, Object> result = new HashMap<>();

        if (principal == null) {
            result.put("success", false);
            result.put("message", "로그인이 필요합니다.");
            return result;
        }

        try {
            Long userNo = getUserNo(principal);

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
     * 예약 1건 조회 (본인만)
     */
    @GetMapping("/api/reservation/{resNo}")
    @ResponseBody
    public ReservationDto getReservation(
            @PathVariable("resNo") Long resNo,
            @AuthenticationPrincipal Object principal) {

        if (principal == null)
            return null;

        Long userNo = getUserNo(principal);

        ReservationDto dto = reservationService.getReservationByResNo(resNo);

        // 본인 예약인지 체크
        if (dto == null || !dto.getUserNo().equals(userNo)) {
            return null; // 또는 403 처리
        }

        return dto;
    }

    /**
     * 예약 수정 (본인만)
     */
    @PostMapping("/api/reservation/update/{resNo}")
    @ResponseBody
    public Map<String, Object> updateReservation(
            @PathVariable("resNo") Long resNo,
            @RequestBody ReservationDto dto,
            @AuthenticationPrincipal Object principal) {

        Map<String, Object> result = new HashMap<>();

        if (principal == null) {
            result.put("success", false);
            result.put("message", "로그인이 필요합니다.");
            return result;
        }

        try {
            Long userNo = getUserNo(principal);

            ReservationDto origin = reservationService.getReservationByResNo(resNo);

            // 🔥 본인 예약 검증
            if (origin == null || !origin.getUserNo().equals(userNo)) {
                result.put("success", false);
                result.put("message", "권한이 없습니다.");
                return result;
            }

            // 🔥 핵심: resNo 세팅 (프론트에서 안 보낼 수도 있음)
            dto.setResNo(resNo);

            boolean success = reservationService.updateReservation(dto);

            if (!success) {
                result.put("success", false);
                result.put("message", "해당 날짜에 이미 예약된 객실입니다.");
                return result;
            }

            result.put("success", true);
            result.put("message", "예약이 수정되었습니다.");

        } catch (Exception e) {
            e.printStackTrace(); // 🔥 로그 꼭 찍어
            result.put("success", false);
            result.put("message", "수정 실패: " + e.getMessage());
        }

        return result;
    }

    /**
     * 예약 취소 (본인만)
     */
    @PostMapping("/api/reservation/cancel/{resNo}")
    @ResponseBody
    public Map<String, Object> cancelReservation(
            @PathVariable("resNo") Long resNo,
            @AuthenticationPrincipal Object principal) {

        Map<String, Object> result = new HashMap<>();

        if (principal == null) {
            result.put("success", false);
            result.put("message", "로그인이 필요합니다.");
            return result;
        }

        try {
            Long userNo = getUserNo(principal);

            ReservationDto dto = reservationService.getReservationByResNo(resNo);

            if (dto == null || !dto.getUserNo().equals(userNo)) {
                result.put("success", false);
                result.put("message", "권한이 없습니다.");
                return result;
            }

            boolean success = reservationService.cancelReservation(resNo);

            result.put("success", success);
            result.put("message", success ? "예약이 취소되었습니다." : "취소 실패");

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "취소 실패: " + e.getMessage());
        }

        return result;
    }

    /**
     * 예약 삭제 (본인만)
     */
    @DeleteMapping("/api/reservation/delete/{resNo}")
    @ResponseBody
    public Map<String, Object> deleteReservation(
            @PathVariable("resNo") Long resNo,
            @AuthenticationPrincipal Object principal) {

        Map<String, Object> result = new HashMap<>();

        if (principal == null) {
            result.put("success", false);
            result.put("message", "로그인이 필요합니다.");
            return result;
        }

        try {
            Long userNo = getUserNo(principal);

            ReservationDto dto = reservationService.getReservationByResNo(resNo);

            if (dto == null || !dto.getUserNo().equals(userNo)) {
                result.put("success", false);
                result.put("message", "권한이 없습니다.");
                return result;
            }

            reservationService.delete(resNo);

            result.put("success", true);
            result.put("message", "예약이 삭제되었습니다.");

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "삭제 실패: " + e.getMessage());
        }

        return result;
    }
}