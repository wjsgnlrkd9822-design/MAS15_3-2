package com.aloha.project.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha.project.dto.Coupon;
import com.aloha.project.dto.UserGrade;
import com.aloha.project.mapper.CouponMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponMapper couponMapper;

    @Override
    public List<Coupon> getAvailableCoupons(Long userNo) {
        return couponMapper.selectAvailableCoupons(userNo);
    }

    @Override
    public List<Coupon> getAllCoupons(Long userNo) {
        return couponMapper.selectAllCoupons(userNo);
    }


    @Override
    @Transactional
    public void updateGradeByReservation(Long userNo) {
        long totalSales = couponMapper.selectUserTotalSales(userNo);
        updateUserGrade(userNo, totalSales);
        log.info("등급 재계산 - userNo: {}, totalSales: {}", userNo, totalSales);
    }

    @Override
    @Transactional
    public boolean issueNewUserCoupon(Long userNo) {
        if (couponMapper.countNewUserCoupon(userNo) > 0) return false;
        Coupon coupon = new Coupon();
        coupon.setUserNo(userNo);
        coupon.setCouponType("NEW_USER");
        coupon.setGrade("NEW");
        coupon.setDiscountAmount(5_000);
        coupon.setExpiredAt(LocalDateTime.now().plusDays(30));
        int result = couponMapper.insertCoupon(coupon);
        log.info("신규가입 쿠폰 발급 - userNo: {}", userNo);
        return result > 0;
    }

    @Override
    @Transactional
    public boolean issueMonthlyOnce(Long userNo) {
        if (couponMapper.countMonthlyIssuedCoupon(userNo) > 0) return false;
        UserGrade userGrade = couponMapper.selectUserGrade(userNo);
        String grade = userGrade != null ? userGrade.getGrade() : "BRONZE";
        int discount = UserGrade.discountByGrade(grade);
        Coupon coupon = new Coupon();
        coupon.setUserNo(userNo);
        coupon.setCouponType("MONTHLY");
        coupon.setGrade(grade);
        coupon.setDiscountAmount(discount);
        coupon.setExpiredAt(LocalDateTime.now().plusMonths(1));
        int result = couponMapper.insertCoupon(coupon);
        log.info("월정 쿠폰 발급 - userNo: {}, grade: {}, discount: {}", userNo, grade, discount);
        return result > 0;
    }

    @Override
    public void issueMonthlyToAll() {
        List<Long> userNos = couponMapper.selectAllUserNos();
        for (Long userNo : userNos) {
            try {
                issueMonthlyOnce(userNo);
            } catch (Exception e) {
                log.error("월정 쿠폰 발급 실패 - userNo: {}", userNo, e);
            }
        }
        log.info("전체 월정 쿠폰 발급 완료 - 총 {}명", userNos.size());
    }

    @Override
    @Transactional
    public boolean useCoupon(Long couponNo, Long reservationNo) {
        Coupon coupon = couponMapper.selectCoupon(couponNo);
        if (coupon == null || coupon.isUsed()) return false;
        coupon.setReservationNo(reservationNo);
        int result = couponMapper.useCoupon(coupon);
        log.info("쿠폰 사용 - couponNo: {}, reservationNo: {}", couponNo, reservationNo);
        return result > 0;
    }

    // 쿠폰 삭제 (어드민)
    @Override
    @Transactional
    public void deleteCoupon(Long couponNo) {
        couponMapper.deleteCoupon(couponNo);
        log.info("쿠폰 삭제 - couponNo: {}", couponNo);
    }

    @Override
    public UserGrade getUserGrade(Long userNo) {
        return couponMapper.selectUserGrade(userNo);
    }

    @Override
    @Transactional
    public void updateUserGrade(Long userNo, long totalSales) {
        String newGrade = UserGrade.calcGrade(totalSales);
        UserGrade existing = couponMapper.selectUserGrade(userNo);
        if (existing == null) {
            UserGrade userGrade = new UserGrade();
            userGrade.setNo(userNo);
            userGrade.setGrade(newGrade);
            userGrade.setTotalSales(totalSales);
            couponMapper.insertUserGrade(userGrade);
        } else {
            existing.setGrade(newGrade);
            existing.setTotalSales(totalSales);
            couponMapper.updateUserGrade(existing);
        }
        log.info("회원 등급 갱신 - userNo: {}, grade: {}, totalSales: {}", userNo, newGrade, totalSales);
    }
}