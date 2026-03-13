package com.aloha.project.service;

import java.util.List;

import com.aloha.project.dto.Coupon;
import com.aloha.project.dto.UserGrade;

public interface CouponService {

    // 미사용 쿠폰 목록
    List<Coupon> getAvailableCoupons(Long userNo);

    // 전체 쿠폰 목록
    List<Coupon> getAllCoupons(Long userNo);

    // 신규가입 쿠폰 발급
    boolean issueNewUserCoupon(Long userNo);

    // 월정 쿠폰 발급 (스케줄러 호출)
    boolean issueMonthlyOnce(Long userNo);

    // 전체 회원 월정 쿠폰 발급 (스케줄러)
    void issueMonthlyToAll();

    // 쿠폰 사용
    boolean useCoupon(Long couponNo, Long reservationNo);

    // 회원 등급 조회
    UserGrade getUserGrade(Long userNo);

    // 회원 등급 갱신 (예약 완료 시 호출)
    void updateUserGrade(Long userNo, long totalSales);
}
