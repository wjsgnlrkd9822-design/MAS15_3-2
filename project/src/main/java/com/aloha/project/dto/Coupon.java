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
    private boolean isUsed;
    private LocalDateTime issuedAt;
    private LocalDateTime expiredAt;
    private LocalDateTime usedAt;
    private Long reservationNo;
}
