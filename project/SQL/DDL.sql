-- Active: 1767920835424@@127.0.0.1@3306@aloha
SET FOREIGN_KEY_CHECKS = 0;

drop TABLE IF EXISTS `users`;
CREATE TABLE `users`( 
    `no` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '회원번호',
    `id` VARCHAR(36) NOT NULL UNIQUE COMMENT '아이디',
    `username` VARCHAR(100) NOT NULL UNIQUE COMMENT '사용자아이디',
    `password` VARCHAR(100) NOT NULL COMMENT '비밀번호', 
    `name` VARCHAR(100) NOT NULL COMMENT '이름',        
    `birth` VARCHAR(10) DEFAULT NULL COMMENT '생년월일',    -- default null
    `email` VARCHAR(100) DEFAULT NULL COMMENT '이메일',     -- default null
    `phone` VARCHAR(15) DEFAULT NULL COMMENT '전화번호',    -- default null
    `address` VARCHAR(255) DEFAULT NULL COMMENT '주소',     -- default null
    `detail_address` VARCHAR(255) DEFAULT NULL COMMENT '상세주소', -- default null
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    `enabled` INT DEFAULT 1 COMMENT '활성화여부'
);

DROP TABLE if EXISTS `users_social`;
CREATE TABLE `users_social` (
    `no` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '소셜 PK',
    `user_no` BIGINT NOT NULL COMMENT '회원번호(FK)',
    `username` VARCHAR(100) NOT NULL COMMENT '유저 아이디',
    `provider` VARCHAR(50) NOT NULL COMMENT 'KAKAO/GOOGLE',
    `social_id` VARCHAR(255) NOT NULL COMMENT '소셜 고유 ID',
    `name` VARCHAR(100) NOT NULL COMMENT '이름',
    `email` VARCHAR(200) DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',

    UNIQUE(provider, social_id),
    FOREIGN KEY (user_no) REFERENCES users(no)
);

DROP TABLE IF EXISTS `user_auth`;
CREATE TABLE `user_auth` (
    `auth_no` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '권한번호',
    `id` VARCHAR(36) NOT NULL COMMENT '사용자ID (UK)',
    `username` VARCHAR(100) NOT NULL COMMENT '사용자아이디',
    `auth` VARCHAR(100) NOT NULL COMMENT '권한 (ROLE_USER, ROLE_ADMIN, ...)',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시'
);

drop TABLE IF EXISTS `pets`;
create Table `pets`(
    `no` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '반려견 번호',
    `owner_no` BIGINT NOT NULL COMMENT  '반려견 주인 번호',
    `name` VARCHAR(50) NOT NULL COMMENT '반려견 이름',
    `profile_img` LONGBLOB DEFAULT NULL COMMENT '프로필 이미지',
    `species` VARCHAR(50) NOT NULL COMMENT '반려견 종',
    `size` VARCHAR(20) NOT NULL COMMENT '반려견 크기',
    `age` INT NOT NULL COMMENT '반려견 나이',
    `weight` FLOAT NOT NULL COMMENT '반려견 몸무게',
    `gender` ENUM('수컷','암컷') NOT NULL COMMENT '반려견 성별',
    `neutered` ENUM('예','아니오') NOT NULL COMMENT '중성화 여부',
    `vaccination` VARCHAR(255) NOT NULL COMMENT '예방접종 여부',
    `certificate_file` MEDIUMBLOB COMMENT '건강 증명서 이미지 파일',
    `etc` TEXT NULL COMMENT '기타 사항',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',

    FOREIGN KEY (owner_no) REFERENCES users(no)     
    on update CASCADE 
    on delete CASCADE
);

SET FOREIGN_KEY_CHECKS = 0;
 DROP Table IF EXISTS `hotelrooms`;

CREATE Table `hotelrooms`(
    `room_no` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '호텔 객실 번호',
    `room_type` VARCHAR(50) NOT NULL COMMENT '객실 종류',
    `room_price` INT NOT NULL COMMENT '가격',
    `etc` TEXT NULL COMMENT '세부 사항',
    `active` VARCHAR(20) NOT NULL DEFAULT '예약가능' COMMENT '예약 여부',
    `img` VARCHAR(255) NOT NULL COMMENT '객실 이미지'

);

INSERT INTO `hotelrooms` (room_type, room_price, etc, active, img)
VALUES
('Large Dog', 110000, '대형견실', '예약가능', 'room_101.jpg'),
('Large Dog', 110000, '대형견실', '예약가능', 'room_102.jpg'),
('Large Dog', 110000, '대형견실', '예약가능', 'room_103.jpg'),
('Large Dog Deluxe', 140000, '대형견실(넓은공간)', '예약가능', 'room_104.jpg'),
('Medium Dog', 80000, '중형견실', '예약가능', 'room_201.jpg'),
('Medium Dog', 80000, '중형견실', '예약가능', 'room_202.jpg'),
('Medium Dog', 80000, '중형견실', '예약가능', 'room_203.jpg'),
('Medium Dog Deluxe', 100000, '중형견실(넓은공간)', '예약가능', 'room_204.jpg'),
('Medium Dog Deluxe', 100000, '중형견실(넓은공간)', '예약가능', 'room_205.jpg'),
('Small Dog', 50000, '소형견실', '예약가능', 'room_301.jpg'),
('Small Dog', 50000, '소형견실', '예약가능', 'room_302.jpg'),
('Small Dog', 50000, '소형견실', '예약가능', 'room_303.jpg'),
('Small Dog Deluxe', 70000, '소형견실(넓은공간)', '예약가능', 'room_304.jpg'),
('Small Dog Deluxe', 70000, '소형견실(넓은공간)', '예약가능', 'room_305.jpg');


-- add_cctv_column.sql 실행
ALTER TABLE `hotelrooms`
ADD COLUMN `cctv_url` VARCHAR(500) DEFAULT NULL;
UPDATE hotelrooms SET cctv_url = '실제_유튜브_라이브_URL' WHERE room_no = 1;
SELECT * FROM pets

 drop TABLE IF EXISTS `reservations`;

 CREATE TABLE `reservations`(
    `res_no` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '예약 번호',
    `user_no` BIGINT NOT NULL COMMENT '회원 번호',
    `pet_no` BIGINT NOT NULL COMMENT '반려견 번호',
    `room_no` BIGINT NOT NULL COMMENT '객실 번호',
    `res_date` DATE NOT NULL COMMENT '체크인 날짜',
    `checkout_date` DATE NOT NULL COMMENT '체크아웃 날짜',
    `total_price` int NOT NULL COMMENT '총 가격',
    `res_time` TIME NOT NULL COMMENT '예약 시간',
    `reg_date` TIMESTAMP DEFAULT NOW() COMMENT '예약일자',
    `status` VARCHAR(20) NOT NULL DEFAULT '예약중' COMMENT '예약상태 (예약중/결제완료)',  /* 예약 추가 */
    `tid` VARCHAR(100) COMMENT '카카오페이 거래 ID',

    FOREIGN KEY (user_no) REFERENCES users(no),
 

    FOREIGN KEY (pet_no) REFERENCES pets(no)
    on update CASCADE
    on delete CASCADE,
    
    FOREIGN KEY (room_no) REFERENCES hotelrooms(room_no),
 

    INDEX idx_check_dates (res_date, checkout_date),    /* 예약 추가 */
    INDEX idx_room_status (room_no, status)             /* 예약 추가 */
);

DROP Table IF EXISTS `hotelservices`;

CREATE Table `hotelservices`(
    `service_no` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '호텔 서비스 번호',
    `service_name` VARCHAR(100) NOT NULL COMMENT '서비스 이름',
    `description` TEXT NOT NULL COMMENT '서비스 설명',
    `service_price` INT NOT NULL COMMENT '가격'
);
INSERT INTO hotelservices (service_name, description, service_price)
VALUES
('그루밍 서비스', '전문 미용사의 목욕 및 미용 서비스', 30000),
('프리미엄 식사', '수제 영양식과 간식 제공', 15000),
('훈련 프로그램', '전문 트레이너와 1:1 교육', 40000),
('사진 촬영', '전문 포토그래퍼의 반려견 화보 촬영', 25000);




DROP TABLE IF EXISTS `reservation_services`;
CREATE TABLE reservation_services (
    `rs_no` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '예약 서비스 번호',
    `res_no` BIGINT NOT NULL COMMENT '예약 번호',
    `service_no` BIGINT NOT NULL COMMENT '서비스 번호',
    FOREIGN KEY (`res_no`) REFERENCES reservations(res_no) ON DELETE CASCADE,
    FOREIGN KEY (`service_no`) REFERENCES hotelservices(service_no)
);

DROP TABLE IF EXISTS `notices`;

CREATE TABLE `notices`(
    `notice_no` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '공지사항 번호',
    `title` VARCHAR(200) NOT NULL COMMENT '공지사항 제목',
    `content` TEXT NOT NULL COMMENT '공지사항 내용',
    `reg_date` TIMESTAMP DEFAULT NOW() COMMENT '등록일자',
    `update_date` TIMESTAMP DEFAULT NOW() ON UPDATE NOW() COMMENT '수정일자'
);


DROP TABLE IF EXISTS `trainers`;
CREATE Table `trainers`(
    `trainer_no` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '트레이너 번호',
    `trainer_name` VARCHAR(50) NOT NULL COMMENT '트레이너 이름',
    `detail` TEXT NOT NULL COMMENT '트레이너 소개',
    `gender` VARCHAR(10) NOT NULL COMMENT '트레이너 성별',
    `img` VARCHAR(255) DEFAULT NULL COMMENT '트레이너 이미지',
    `reg_date` TIMESTAMP DEFAULT NOW() COMMENT '등록일자'
);


SET FOREIGN_KEY_CHECKS = 1;


UPDATE hotelrooms
SET cctv_url = 'https://www.youtube.com/watch?v=8dYNg7bmS5c'
WHERE room_no = 1;
-- ⭐ hotelrooms 테이블에 cctv_url 컬럼 추가
-- ALTER TABLE `hotelrooms`
-- ADD COLUMN `cctv_url` VARCHAR(500) DEFAULT NULL COMMENT '유튜브 라이브 CCTV URL';

-- ⭐ 샘플 CCTV URL 데이터 (실제 유튜브 라이브 URL로 교체 필요)
-- 예시: https://www.youtube.com/watch?v=VIDEO_ID 또는 https://www.youtube.com/live/VIDEO_ID

UPDATE hotelrooms SET cctv_url = 'https://www.youtube.com/watch?v=8dYNg7bmS5c' WHERE room_no = 1;  -- 대형견실 101
UPDATE hotelrooms SET cctv_url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk' WHERE room_no = 2;  -- 대형견실 102
UPDATE hotelrooms SET cctv_url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk' WHERE room_no = 3;  -- 대형견실 103
UPDATE hotelrooms SET cctv_url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk' WHERE room_no = 4;  -- 대형견실 디럭스 104

UPDATE hotelrooms SET cctv_url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk' WHERE room_no = 5;  -- 중형견실 201
UPDATE hotelrooms SET cctv_url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk' WHERE room_no = 6;  -- 중형견실 202
UPDATE hotelrooms SET cctv_url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk' WHERE room_no = 7;  -- 중형견실 203
UPDATE hotelrooms SET cctv_url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk' WHERE room_no = 8;  -- 중형견실 디럭스 204
UPDATE hotelrooms SET cctv_url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk' WHERE room_no = 9;  -- 중형견실 디럭스 205

UPDATE hotelrooms SET cctv_url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk' WHERE room_no = 10; -- 소형견실 301
UPDATE hotelrooms SET cctv_url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk' WHERE room_no = 11; -- 소형견실 302
UPDATE hotelrooms SET cctv_url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk' WHERE room_no = 12; -- 소형견실 303
UPDATE hotelrooms SET cctv_url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk' WHERE room_no = 13; -- 소형견실 디럭스 304
UPDATE hotelrooms SET cctv_url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk' WHERE room_no = 14; -- 소형견실 디럭스 305


drop TABLE IF EXISTS `pet_status`;

CREATE TABLE pet_status (
    pet_no INT PRIMARY KEY,
    status VARCHAR(30),        -- RESTING, PLAYING, EATING, WALKING
    next_schedule VARCHAR(50),-- 예: "16:00 산책"
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO pet_status (pet_no, status, next_schedule)
VALUES
(5, 'RESTING', '16:00 산책')


-- 1. 현재 예약 중인 데이터 확인
SELECT 
    r.res_no,
    r.res_date,
    r.checkout_date,
    r.status,
    p.no AS pet_no,
    p.name AS pet_name,
    ps.status AS pet_status
FROM reservations r
JOIN pets p ON r.pet_no = p.no
LEFT JOIN pet_status ps ON p.no = ps.pet_no
WHERE r.status = '예약중';

-- 2. 날짜 조건 확인
SELECT 
    CURDATE() as today,
    r.res_no,
    r.res_date,
    r.checkout_date,
    CASE 
        WHEN CURDATE() BETWEEN r.res_date AND r.checkout_date THEN 'YES'
        ELSE 'NO'
    END as is_active
FROM reservations r
WHERE r.status = '예약중';

DELETE FROM hotelservices WHERE service_no = 5;

SELECT * FROM hotelservices;


