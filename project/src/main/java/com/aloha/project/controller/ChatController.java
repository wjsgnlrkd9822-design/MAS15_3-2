// package com.aloha.project.controller;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.reactive.function.client.WebClient;

// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;

// @Slf4j // ← 추가
// @RestController
// @RequiredArgsConstructor
// public class ChatController {

//     @Value("${wit.api.token}")
//     private String witToken;

//     @PostMapping("/api/chat")
//     public Map<String, Object> chat(@RequestBody Map<String, String> body) {
//         String userMessage = body.get("message");

//         log.info("Wit Token: {}", witToken);

//         // 1. Wit.ai에 메시지 전송
//         WebClient client = WebClient.create("https://api.wit.ai");
//         Map response = client.get()
//             .uri(uriBuilder -> uriBuilder
//             .path("/message")
//             .queryParam("v", "20230215")
//             .queryParam("q", userMessage)
//             .build())
//             .header("Authorization", "Bearer " + witToken)
//             .retrieve()
//             .bodyToMono(Map.class)
//             .block();

//         // 2. Intent 추출
//         String intent = "unknown";
//         try {
//             log.info("Wit.ai 응답: {}", response); // ← 추가
//             List<Map> intents = (List<Map>) response.get("intents");
//             if (intents != null && !intents.isEmpty()) {
//                 intent = (String) intents.get(0).get("name");
//             }
//         } catch (Exception e) {
//             e.printStackTrace();
//         }
//         log.info("인식된 intent: {}", intent); // ← 추가

//         // 3. Intent별 응답
//         String reply = getReply(intent);

//         Map<String, Object> result = new HashMap<>();
//         result.put("success", true);
//         result.put("reply", reply);
//         return result;
//     }

//     private String getReply(String intent) {
//         switch (intent) {
//             case "greeting":
//                 return "안녕하세요! 🐾 PETHOUSE에 오신 걸 환영합니다. 예약, 가격, CCTV, 위치 등 무엇이든 물어보세요!";
//             case "reservation":
//                 return "예약은 상단 메뉴의 [예약] 버튼을 통해 하실 수 있습니다. 체크인/체크아웃 날짜와 반려견 정보를 입력해주세요 🐶";
//             case "price":
//                 return "객실 가격은 소형견 30,000원, 중형견 45,000원, 대형견 60,000원(1박 기준)입니다. 그루밍 등 추가 서비스도 제공됩니다!";
//             case "cctv":
//                 return "CCTV 서비스는 체크인 기간 중 실시간으로 반려견을 확인하실 수 있습니다. 로그인 후 메인 화면에서 CCTV 버튼을 눌러주세요 📹";
//             case "location":
//                 return "저희 PETHOUSE는 서울시 강남구에 위치해 있습니다. 📍 자세한 위치는 [소개] 페이지를 확인해주세요!";
//             default:
//                 return "죄송합니다, 잘 이해하지 못했어요. 예약, 가격, CCTV, 위치에 대해 질문해주세요 😊";
//         }
//     }
// }