package com.aloha.project.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UserGrade {

    private Long no;
    private String grade;           // BRONZE / SILVER / GOLD / VIP
    private Long totalSales;
    private LocalDateTime updatedAt;

    // 등급 계산
    public static String calcGrade(long totalSales) {
        if (totalSales >= 1_500_000) return "VIP";
        if (totalSales >= 700_000)   return "GOLD";
        if (totalSales >= 300_000)   return "SILVER";
        return "BRONZE";
    }

    // 등급별 할인 금액
    public static int discountByGrade(String grade) {
        return switch (grade) {
            case "VIP"    -> 20_000;
            case "GOLD"   -> 10_000;
            case "SILVER" ->  5_000;
            default       ->  3_000; // BRONZE
        };
    }
}
