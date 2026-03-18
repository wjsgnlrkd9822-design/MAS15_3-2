package com.aloha.project.controller;

import com.aloha.project.dto.KakaoPayApproveResponse;
import com.aloha.project.dto.KakaoPayCancelResponse;
import com.aloha.project.dto.KakaoPayReadyResponse;
import com.aloha.project.service.KakaoPayService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Controller
@RequiredArgsConstructor
public class KakaoPayController {

    private final KakaoPayService kakaoPayService;

    // 결제 준비
    @PostMapping("/kakaopay/ready")
    public String ready(@RequestParam("resNo") Long resNo,
                        @RequestParam("totalPrice") int totalPrice,
                        HttpSession session) {

        KakaoPayReadyResponse response = kakaoPayService.ready(resNo, totalPrice, session);
        return "redirect:" + response.getNext_redirect_pc_url();
    }

 
@GetMapping("/kakaopay/success")
public String success(@RequestParam("pg_token") String pgToken,
                      @RequestParam(value = "partner_order_id", required = false) String partnerOrderId,
                      HttpSession session) {

    if (session.getAttribute("resNo") == null && partnerOrderId != null) {
        session.setAttribute("resNo", Long.parseLong(partnerOrderId));
    }

    KakaoPayApproveResponse response = kakaoPayService.approve(pgToken, session);

    try {
        String itemName = URLEncoder.encode(response.getItem_name(), StandardCharsets.UTF_8);
        String approvedAt = URLEncoder.encode(response.getApproved_at(), StandardCharsets.UTF_8);

        return "redirect:http://localhost:5173/kakaopay/success"
             + "?item_name=" + itemName
             + "&total=" + response.getAmount().getTotal()
             + "&method=" + response.getPayment_method_type()
             + "&approved_at=" + approvedAt;
    } catch (Exception e) {
        return "redirect:http://localhost:5173/mypage";
    }
}

    // 결제 실패
    @GetMapping("/kakaopay/fail")
    public String fail() {
        log.warn("결제 실패");
        return "kakaopay/fail";
    }

    // 결제 취소
    @GetMapping("/kakaopay/cancel")
    public String cancel() {
        log.warn("결제 취소");
        return "kakaopay/cancel";
    }

    // 환불
    @PostMapping("/kakaopay/refund")
    public String refund(@RequestParam("resNo") Long resNo,
                         @RequestParam("cancelAmount") int cancelAmount) {
 
        kakaoPayService.cancel(resNo, cancelAmount);
        log.info("환불 완료 - resNo: {}, 금액: {}", resNo, cancelAmount);
 
        return "redirect:http://localhost:5173/kakaopay/refund";
    }
}