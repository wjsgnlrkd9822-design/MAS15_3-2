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

    // 결제 성공/실패/취소 URL
//     private static final String APPROVAL_URL = "http://localhost:8080/kakaopay/success";
//     private static final String FAIL_URL     = "http://localhost:8080/kakaopay/fail";
//     private static final String CANCEL_URL   = "http://localhost:8080/kakaopay/cancel";
    private static final String APPROVAL_URL = "http://192.168.30.36:8080/kakaopay/success";
    private static final String FAIL_URL     = "http://192.168.30.36:8080/kakaopay/fail";
    private static final String CANCEL_URL   = "http://192.168.30.36:8080/kakaopay/cancel";


    // 결제 준비 (Ready)
    @Override
    public KakaoPayReadyResponse ready(Long resNo, int totalPrice, HttpSession session) {

        KakaoPayReadyRequest request = new KakaoPayReadyRequest();
        request.setCid(cid);
        request.setPartner_order_id(String.valueOf(resNo));   // 예약 번호
        request.setPartner_user_id("USER");                   // 추후 실제 유저 ID로 변경
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

        // tid 세션 저장 (Approve 때 필요)
        session.setAttribute("tid", response.getTid());
        session.setAttribute("resNo", resNo);

        log.info("카카오페이 결제 준비 완료 - tid: {}", response.getTid());

        return response;
    }

    // 결제 승인 (Approve)
    @Override
    public KakaoPayApproveResponse approve(String pgToken, HttpSession session) {

        String tid   = (String) session.getAttribute("tid");
        Long resNo   = (Long) session.getAttribute("resNo");

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

        // 세션 정리
        session.removeAttribute("tid");
        session.removeAttribute("resNo");

        return response;
    }

    // 결제 취소 (Cancel)
@Override
public KakaoPayCancelResponse cancel(Long resNo, int cancelAmount) {

    // DB에서 tid 조회
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

    // status 환불로 변경
    reservationService.updateReservationStatus(resNo, "환불");

    return response;
}

}