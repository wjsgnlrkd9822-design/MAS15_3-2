-- Active: 1767840691076@@127.0.0.1@3306@aloha
-- ============================== 회원 등급 테이블 ==============================
CREATE TABLE IF NOT EXISTS user_grade (
    no          BIGINT          NOT NULL COMMENT '회원번호 (users.no FK)',
    grade       VARCHAR(10)     NOT NULL DEFAULT 'BRONZE' COMMENT 'BRONZE/SILVER/GOLD/VIP',
    total_sales BIGINT          NOT NULL DEFAULT 0 COMMENT '누적 매출',
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (no),
    FOREIGN KEY (no) REFERENCES users(no) ON DELETE CASCADE
);

-- ============================== 쿠폰 테이블 ==============================
CREATE TABLE IF NOT EXISTS coupon (
    coupon_no       BIGINT          AUTO_INCREMENT PRIMARY KEY,
    user_no         BIGINT          NOT NULL COMMENT '회원번호',
    coupon_type     VARCHAR(20)     NOT NULL COMMENT 'MONTHLY/NEW_USER',
    grade           VARCHAR(10)     NOT NULL COMMENT '발급 당시 등급',
    discount_amount INT             NOT NULL COMMENT '할인 금액',
    is_used         TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '0:미사용 1:사용됨',
    issued_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '발급일',
    expired_at      DATETIME        NOT NULL COMMENT '만료일',
    used_at         DATETIME        NULL COMMENT '사용일',
    reservation_no  BIGINT          NULL COMMENT '사용된 예약번호',
    FOREIGN KEY (user_no) REFERENCES users(no) ON DELETE CASCADE
);

-- ============================== 등급별 할인 금액 기준 ==============================
-- BRONZE  : 누적매출 0 ~ 299,999   → 월 3,000원
-- SILVER  : 누적매출 300,000 ~ 699,999  → 월 5,000원
-- GOLD    : 누적매출 700,000 ~ 1,499,999 → 월 10,000원
-- VIP     : 누적매출 1,500,000+    → 월 20,000원
-- NEW_USER: 신규가입 즉시           → 5,000원 1회