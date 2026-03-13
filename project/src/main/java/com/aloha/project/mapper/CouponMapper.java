package com.aloha.project.mapper;

import java.util.List;

import com.aloha.project.dto.Coupon;
import com.aloha.project.dto.UserGrade;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CouponMapper {

    // 쿠폰 발급
    int insertCoupon(Coupon coupon);

    // 내 쿠폰 목록 (미사용)
    List<Coupon> selectAvailableCoupons(Long userNo);

    // 전체 쿠폰 목록
    List<Coupon> selectAllCoupons(Long userNo);

    // 쿠폰 사용 처리
    int useCoupon(Coupon coupon);

    // 쿠폰 단건 조회
    Coupon selectCoupon(Long couponNo);

    // 이번 달 월정 쿠폰 발급 여부 확인
    int countMonthlyIssuedCoupon(Long userNo);

    // 신규가입 쿠폰 발급 여부 확인
    int countNewUserCoupon(Long userNo);

    // 전체 회원 목록 (스케줄러용)
    List<Long> selectAllUserNos();

    // ============================== 등급 ==============================

    // 회원 등급 조회
    UserGrade selectUserGrade(Long userNo);

    // 회원 등급 등록
    int insertUserGrade(UserGrade userGrade);

    // 회원 등급 업데이트
    int updateUserGrade(UserGrade userGrade);
}
