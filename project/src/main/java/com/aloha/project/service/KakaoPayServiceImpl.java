package com.aloha.project.service;

import com.aloha.project.dto.KakaoPayApproveResponse;
import com.aloha.project.dto.KakaoPayCancelResponse;
import com.aloha.project.dto.KakaoPayReadyRequest;
import com.aloha.project.dto.KakaoPayReadyResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoPayServiceImpl implements KakaoPayService {

    private final ReservationService reservationService;

    @Value("${kakaopay.secret-key}")
    private String secretKey;

    @Value("${kakaopay.cid}")
    private String cid;

    @Value("${kakaopay.ready-url}")
    private String readyUrl;

    @Value("${kakaopay.approve-url}")
    private String approveUrl;

    @Value("${kakaopay.cancel-url}")
    private String cancelUrl;

    private static final String APPROVAL_URL = "http://localhost:8080/kakaopay/success";
    private static final String FAIL_URL     = "http://localhost:8080/kakaopay/fail";
    private static final String CANCEL_URL   = "http://localhost:8080/kakaopay/cancel";

    // 결제 준비 (Ready)
    @Override
    public KakaoPayReadyResponse ready(Long resNo, int totalPrice, HttpSession session) {

        KakaoPayReadyRequest request = new KakaoPayReadyRequest();
        request.setCid(cid);
        request.setPartner_order_id(String.valueOf(resNo));
        request.setPartner_user_id("USER");
        request.setItem_name("펫 호텔 예약");
        request.setQuantity(1);
        request.setTotal_amount(totalPrice);
        request.setTax_free_amount(0);
        request.setApproval_url(APPROVAL_URL);
        request.setFail_url(FAIL_URL);
        request.setCancel_url(CANCEL_URL);

        KakaoPayReadyResponse response = WebClient.create()
                .post()
                .uri(readyUrl)
                .header(HttpHeaders.AUTHORIZATION, "SECRET_KEY " + secretKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(KakaoPayReadyResponse.class)
                .block();

        // 세션 + DB 둘 다 저장 (팝업 세션 문제 대비)
        session.setAttribute("tid", response.getTid());
        session.setAttribute("resNo", resNo);
        reservationService.updateTid(resNo, response.getTid());

        log.info("카카오페이 결제 준비 완료 - tid: {}", response.getTid());
        return response;
    }

    // 결제 승인 (Approve)
    @Override
    public KakaoPayApproveResponse approve(String pgToken, HttpSession session) {

        String tid = (String) session.getAttribute("tid");
        Long resNo = (Long) session.getAttribute("resNo");

        log.info("approve 호출 - tid: {}, resNo: {}", tid, resNo);

        // 세션에 없으면 DB에서 조회 (팝업 세션 문제 대비)
        if (tid == null && resNo != null) {
            tid = reservationService.getTidByResNo(resNo);
            log.info("DB에서 tid 조회 - tid: {}", tid);
        }

        if (tid == null || resNo == null) {
            log.error("tid 또는 resNo가 null - tid: {}, resNo: {}", tid, resNo);
            throw new RuntimeException("결제 정보가 없습니다. 다시 시도해주세요.");
        }

        KakaoPayApproveResponse response = WebClient.create()
                .post()
                .uri(approveUrl)
                .header(HttpHeaders.AUTHORIZATION, "SECRET_KEY " + secretKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(java.util.Map.of(
                        "cid",              cid,
                        "tid",              tid,
                        "partner_order_id", String.valueOf(resNo),
                        "partner_user_id",  "USER",
                        "pg_token",         pgToken
                ))
                .retrieve()
                .bodyToMono(KakaoPayApproveResponse.class)
                .block();

        log.info("카카오페이 결제 승인 완료 - aid: {}", response.getAid());

        reservationService.updateReservationStatus(resNo, "결제완료");
        reservationService.updateTid(resNo, tid);

        session.removeAttribute("tid");
        session.removeAttribute("resNo");

        return response;
    }

    // 결제 취소 (Cancel)
    @Override
    public KakaoPayCancelResponse cancel(Long resNo, int cancelAmount) {

        String tid = reservationService.getTidByResNo(resNo);

        KakaoPayCancelResponse response = WebClient.create()
                .post()
                .uri(cancelUrl)
                .header(HttpHeaders.AUTHORIZATION, "SECRET_KEY " + secretKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(java.util.Map.of(
                        "cid",            cid,
                        "tid",            tid,
                        "cancel_amount",  cancelAmount,
                        "cancel_tax_free_amount", 0
                ))
                .retrieve()
                .bodyToMono(KakaoPayCancelResponse.class)
                .block();

        log.info("카카오페이 환불 완료 - tid: {}", tid);
        reservationService.updateReservationStatus(resNo, "환불");

        return response;
    }
}