package com.aloha.project.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.project.dto.Coupon;
import com.aloha.project.dto.UserGrade;
import com.aloha.project.service.CouponService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/coupon")
public class CouponController {

    private final CouponService couponService;

    // 미사용 쿠폰 목록
    @GetMapping("/available/{userNo}")
    public ResponseEntity<?> getAvailableCoupons(@PathVariable("userNo") Long userNo) {
        try {
            List<Coupon> coupons = couponService.getAvailableCoupons(userNo);
            return ResponseEntity.ok(coupons);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 전체 쿠폰 목록
    @GetMapping("/all/{userNo}")
    public ResponseEntity<?> getAllCoupons(@PathVariable("userNo") Long userNo) {
        try {
            List<Coupon> coupons = couponService.getAllCoupons(userNo);
            return ResponseEntity.ok(coupons);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 신규가입 쿠폰 발급
    @PostMapping("/issue/new/{userNo}")
    public ResponseEntity<?> issueNewUserCoupon(@PathVariable("userNo") Long userNo) {
        try {
            boolean result = couponService.issueNewUserCoupon(userNo);
            return ResponseEntity.ok(result ? "SUCCESS" : "ALREADY_ISSUED");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 월정 쿠폰 발급 (수동/어드민용)
    @PostMapping("/issue/monthly/{userNo}")
    public ResponseEntity<?> issueMonthly(@PathVariable("userNo") Long userNo) {
        try {
            boolean result = couponService.issueMonthlyOnce(userNo);
            return ResponseEntity.ok(result ? "SUCCESS" : "ALREADY_ISSUED");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 쿠폰 삭제 (어드민용)
    @DeleteMapping("/delete/{couponNo}")
    public ResponseEntity<?> deleteCoupon(@PathVariable("couponNo") Long couponNo) {
        try {
            couponService.deleteCoupon(couponNo);
            return ResponseEntity.ok("SUCCESS");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 회원 등급 조회
    @GetMapping("/grade/{userNo}")
    public ResponseEntity<?> getUserGrade(@PathVariable("userNo") Long userNo) {
        try {
            UserGrade grade = couponService.getUserGrade(userNo);
            Map<String, Object> result = new HashMap<>();
            result.put("grade", grade != null ? grade.getGrade() : "BRONZE");
            result.put("totalAmount", grade != null ? grade.getTotalSales() : 0); // totalAmount로 통일
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}