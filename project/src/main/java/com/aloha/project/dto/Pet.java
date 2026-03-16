package com.aloha.project.dto;

import java.util.Base64;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Pet {
    private Long no;                    // 반려견 번호 (PK)
    private Long ownerNo;               // 반려견 주인 번호 (FK users.no)
    private String name;                // 반려견 이름
    private byte[] profileImg;          // 프로필 이미지 (LONGBLOB)
    private String species;             // 반려견 종
    private String size;                // 반려견 크기
    private Integer age;                // 나이
    private Float weight;               // 몸무게
    private String gender;              // 성별 ('수컷' / '암컷')
    private String neutered;            // 중성화 여부 ('예' / '아니오')
    private String vaccination;         // 예방접종 여부
    private byte[] certificateFile;     // 건강 증명서 이미지 (MEDIUMBLOB)
    private String etc;                 // 기타 사항
    private Date createdAt;        // 생성일시
    private Date updatedAt;        // 수정일시

    // JSON 직렬화용 Base64 필드
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public String getProfileImgBase64() {
        if (profileImg != null && profileImg.length > 0) {
            return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(profileImg);
        }
        return null;
    }

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public String getCertificateFileBase64() {
        if (certificateFile != null && certificateFile.length > 0) {
            return Base64.getEncoder().encodeToString(certificateFile);
        }
        return null;
    }
}
