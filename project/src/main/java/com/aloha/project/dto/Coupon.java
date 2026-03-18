package com.aloha.project.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Coupon {

    private Long couponNo;
    private Long userNo;
    private String couponType;      // MONTHLY / NEW_USER
    private String grade;           // BRONZE / SILVER / GOLD / VIP
    private int discountAmount;
    private boolean used;           // isUsed → used 로 변경 (MyBatis 매핑 문제 해결)
    private LocalDateTime issuedAt;
    private LocalDateTime expiredAt;
    private LocalDateTime usedAt;
    private Long reservationNo;

    // 쿠폰 이름 (화면 표시용)
    public String getCouponName() {
        if ("NEW_USER".equals(couponType)) return "신규가입 축하 쿠폰";
        if ("MONTHLY".equals(couponType)) {
            if ("BRONZE".equals(grade)) return "BRONZE 등급 월정 쿠폰";
            if ("SILVER".equals(grade)) return "SILVER 등급 월정 쿠폰";
            if ("GOLD".equals(grade))   return "GOLD 등급 월정 쿠폰";
            if ("VIP".equals(grade))    return "VIP 등급 월정 쿠폰";
        }
        return "할인 쿠폰";
    }
}