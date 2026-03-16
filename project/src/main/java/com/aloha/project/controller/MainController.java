package com.aloha.project.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.aloha.project.dto.CustomUser;
import com.aloha.project.dto.HotelRoom;
import com.aloha.project.dto.Pet;
import com.aloha.project.dto.ReservationDto;
import com.aloha.project.dto.Notice;
import com.aloha.project.service.HotelRoomService;
import com.aloha.project.service.HotelServiceService;
import com.aloha.project.service.PetService;
import com.aloha.project.service.ReservationService;
import com.aloha.project.service.NoticeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
public class MainController {

    private final PetService petService;
    private final HotelRoomService hotelRoomService;       
    private final HotelServiceService hotelServiceService; 
    private final ReservationService reservationService;  
    private final NoticeService noticeService;

    /**
     * ⭐ 메인 페이지 (CCTV 활성 예약 체크 추가)
     */
    @GetMapping("/")
    public String index(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        boolean isLogin = userDetails != null;
        model.addAttribute("isLogin", isLogin);
        
        // ⭐ 공지사항 최근 5개 조회
        try {
            List<Notice> noticeList = noticeService.getRecentNotices(5);
            model.addAttribute("noticeList", noticeList);
        } catch (Exception e) {
            log.error("공지사항 조회 실패", e);
            model.addAttribute("noticeList", List.of()); // 빈 리스트
        }
        
        // ⭐ 활성 예약 여부 체크 (CCTV 버튼 표시용)
        boolean hasActiveReservation = false;
        if (isLogin && userDetails instanceof CustomUser) {
            try {
                CustomUser customUser = (CustomUser) userDetails;
                Long userNo = customUser.getNo();
                LocalDate today = LocalDate.now();
                
                ReservationDto activeReservation = reservationService.getActiveReservation(userNo, today);
                hasActiveReservation = (activeReservation != null);
                
            } catch (Exception e) {
                log.error("활성 예약 조회 실패", e);
            }
        }
        model.addAttribute("hasActiveReservation", hasActiveReservation);
        
        return "index";
    }

    /**
     * ⭐ 활성화된 예약 조회 API (CCTV 기능용)
     */
    @GetMapping("/api/reservation/active")
    @ResponseBody
    public Map<String, Object> getActiveReservation(@AuthenticationPrincipal CustomUser customUser) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            if (customUser == null) {
                result.put("success", false);
                result.put("message", "로그인이 필요합니다.");
                return result;
            }
            
            Long userNo = customUser.getNo();
            LocalDate today = LocalDate.now();
            
            // 활성화된 예약 조회
            ReservationDto activeReservation = reservationService.getActiveReservation(userNo, today);
            
            if (activeReservation != null) {
                result.put("success", true);
                result.put("reservation", activeReservation);
                result.put("message", "활성 예약이 있습니다.");
            } else {
                result.put("success", false);
                result.put("reservation", null);
                result.put("message", "현재 진행 중인 예약이 없습니다.");
            }
            
        } catch (Exception e) {
            log.error("활성 예약 조회 실패", e);
            result.put("success", false);
            result.put("message", "조회 실패: " + e.getMessage());
        }
        
        return result;
    }

    @GetMapping("/pet/introduce")
    public String service() {
        return "pet/introduce";
    }

    /**
     * ⭐ 예약 페이지 (통합 검색 - 초기 로딩)
     */
    @GetMapping("/pet/reservation")
    public String reservation(
            Model model,
            @RequestParam(value="sort", defaultValue="default") String sort,
            @RequestParam(value="sizeType", defaultValue="all") String sizeType
    ) {
        // 초기 로딩 시 전체 객실 표시
        List<HotelRoom> rooms = hotelRoomService.getAllRooms();

        // 견종 필터 (초기 로딩 시에만 적용)
        if (!"all".equals(sizeType)) {
            rooms = rooms.stream()
                    .filter(r -> r.getEtc().contains(sizeType))
                    .collect(Collectors.toList());
        }

        // 가격 정렬 (초기 로딩 시에만 적용)
        if ("priceAsc".equals(sort)) {
            rooms = rooms.stream()
                    .sorted(Comparator.comparingInt(HotelRoom::getRoomPrice))
                    .collect(Collectors.toList());
        } 
        else if ("priceDesc".equals(sort)) {
            rooms = rooms.stream()
                    .sorted(Comparator.comparingInt(HotelRoom::getRoomPrice).reversed())
                    .collect(Collectors.toList());
        }

        model.addAttribute("rooms", rooms);
        model.addAttribute("selectedSort", sort);
        model.addAttribute("selectedSizeType", sizeType);

        return "pet/reservation";
    }

    /**
     * ⭐ 통합 검색 API (AJAX)
     * 날짜 + 견종 + 가격정렬을 모두 처리
     */
    @GetMapping("/api/rooms/search")
    @ResponseBody
    public Map<String, Object> searchRooms(
            @RequestParam(value="checkin", required=false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkin,
            
            @RequestParam(value="checkout", required=false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkout,
            
            @RequestParam(value="sizeType", defaultValue="all") String sizeType,
            
            @RequestParam(value="sort", defaultValue="default") String sort
    ) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            List<HotelRoom> rooms;
            
            // 1️⃣ 날짜가 있으면 예약 가능한 객실만 조회
            if (checkin != null && checkout != null) {
                // 날짜 유효성 검사
                if (checkout.isBefore(checkin) || checkout.isEqual(checkin)) {
                    result.put("success", false);
                    result.put("message", "체크아웃 날짜는 체크인 날짜보다 이후여야 합니다.");
                    return result;
                }
                
                // 견종 필터를 roomType으로 변환
                String roomType = convertSizeTypeToRoomType(sizeType);
                
                // 예약 가능한 객실 조회
                rooms = reservationService.getAvailableRooms(roomType, checkin, checkout);
            } 
            // 2️⃣ 날짜가 없으면 전체 객실 조회
            else {
                rooms = hotelRoomService.getAllRooms();
                
                // 견종 필터 적용
                if (!"all".equals(sizeType)) {
                    final String sizeFilter = sizeType;
                    rooms = rooms.stream()
                            .filter(r -> r.getEtc().contains(sizeFilter))
                            .collect(Collectors.toList());
                }
            }
            
            // 3️⃣ 가격 정렬 적용
            rooms = applySorting(rooms, sort);
            
            // 4️⃣ 응답 구성
            result.put("success", true);
            result.put("rooms", rooms);
            result.put("count", rooms.size());
            
            // 검색 필터 정보도 함께 반환
            Map<String, Object> filters = new HashMap<>();
            filters.put("checkin", checkin != null ? checkin.toString() : null);
            filters.put("checkout", checkout != null ? checkout.toString() : null);
            filters.put("sizeType", sizeType);
            filters.put("sort", sort);
            result.put("filters", filters);
            
            log.info("검색 성공 - 조건: {}, 결과: {}개", filters, rooms.size());
            
        } catch (Exception e) {
            log.error("검색 실패", e);
            result.put("success", false);
            result.put("message", "검색 실패: " + e.getMessage());
        }
        
        return result;
    }

    /**
     * 견종 타입을 roomType으로 변환
     */
    private String convertSizeTypeToRoomType(String sizeType) {
        if ("all".equals(sizeType)) {
            return null; // 전체 조회
        }
        
        switch (sizeType) {
            case "소형견":
                return "Small Dog";
            case "중형견":
                return "Medium Dog";
            case "대형견":
                return "Large Dog";
            default:
                return null;
        }
    }

    /**
     * 가격 정렬 적용
     */
    private List<HotelRoom> applySorting(List<HotelRoom> rooms, String sort) {
        if ("priceAsc".equals(sort)) {
            return rooms.stream()
                    .sorted(Comparator.comparingInt(HotelRoom::getRoomPrice))
                    .collect(Collectors.toList());
        } 
        else if ("priceDesc".equals(sort)) {
            return rooms.stream()
                    .sorted(Comparator.comparingInt(HotelRoom::getRoomPrice).reversed())
                    .collect(Collectors.toList());
        }
        // default: 기본 정렬 (DB 순서 유지)
        return rooms;
    }

    /**
     * 예약 상세 페이지
     */
    @GetMapping("/pet/reservation/{roomNo}")
    public String reservationDetail(
            @PathVariable("roomNo") Long roomNo,
            @RequestParam(value="checkin", required=false) String checkin,
            @RequestParam(value="checkout", required=false) String checkout,
            Model model,
            @AuthenticationPrincipal CustomUser customUser
    ) throws Exception {

        HotelRoom room = hotelRoomService.getRoom(roomNo);
        if (room == null) return "redirect:/pet/reservation";

        model.addAttribute("room", room);
        model.addAttribute("roomServiceList", hotelServiceService.getAllServices());

        // 날짜 파라미터가 있으면 사용, 없으면 기본값
        if (checkin != null && checkout != null) {
            model.addAttribute("checkin", checkin);
            model.addAttribute("checkout", checkout);
        } else {
            LocalDate today = LocalDate.now();
            model.addAttribute("checkin", today.toString()); 
            model.addAttribute("checkout", today.plusDays(1).toString());
        }

        if (customUser != null) {
            Long ownerNo = customUser.getNo();
            List<Pet> pets = petService.selectPetsByOwnerNo(ownerNo);
            model.addAttribute("pets", pets);
        }

        return "pet/reservation-detail";
    }

    /**
     * ⭐ (기존 유지) 날짜별 예약 가능한 객실 조회 (날짜만 사용)
     */
    @GetMapping("/api/rooms/available")
    @ResponseBody
    public Map<String, Object> getAvailableRooms(
            @RequestParam(value="roomType", required=false) String roomType,
            @RequestParam("checkin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkin,
            @RequestParam("checkout") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkout
    ) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<HotelRoom> availableRooms = reservationService.getAvailableRooms(roomType, checkin, checkout);
            
            result.put("success", true);
            result.put("rooms", availableRooms);
            result.put("count", availableRooms.size());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "조회 실패: " + e.getMessage());
        }
        return result;
    }

    /**
     * ⭐ 특정 객실 예약 가능 여부 확인 (AJAX)
     */
    @GetMapping("/api/room/check-availability")
    @ResponseBody
    public Map<String, Object> checkRoomAvailability(
            @RequestParam("roomNo") Long roomNo,
            @RequestParam("checkin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkin,
            @RequestParam("checkout") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkout
    ) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean available = reservationService.isRoomAvailable(roomNo, checkin, checkout);
            
            result.put("success", true);
            result.put("available", available);
            result.put("message", available ? "예약 가능합니다." : "선택하신 날짜에 이미 예약이 있습니다.");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "확인 실패: " + e.getMessage());
        }
        return result;
    }

    /**
     * 예약 생성
     */
    @PostMapping("/pet/reservation/insert/{roomNo}")
    public String insertReservation(
            @PathVariable("roomNo") Long roomNo,
            @RequestParam("checkin") String checkin,
            @RequestParam("checkout") String checkout,
            @RequestParam("petNo") Long petNo,
            @RequestParam(value="serviceIds", required=false) List<Long> serviceIds,
            @AuthenticationPrincipal CustomUser customUser,
            RedirectAttributes redirectAttributes
    ) {
        if(customUser == null) return "redirect:/login";

        Long userNo = customUser.getNo();
        LocalDate checkinDate = LocalDate.parse(checkin);
        LocalDate checkoutDate = LocalDate.parse(checkout);

        // 예약 가능 여부 체크
        boolean available = reservationService.isRoomAvailable(roomNo, checkinDate, checkoutDate);
        if (!available) {
            redirectAttributes.addFlashAttribute("error", "선택하신 날짜에 이미 예약이 있습니다.");
            return "redirect:/pet/reservation/" + roomNo;
        }

        LocalTime resTime = LocalTime.now();

        // 객실 가격 계산
        int roomPrice = hotelRoomService.getRoom(roomNo).getRoomPrice();
        int nights = (int) ChronoUnit.DAYS.between(checkinDate, checkoutDate);

        // 서비스 가격 합산
        int serviceTotal = 0;
        if(serviceIds != null) {
            for(Long serviceNo : serviceIds) {
                serviceTotal += reservationService.getServicePrice(serviceNo);
            }
        }

        int totalPrice = roomPrice * nights + serviceTotal;

        // DB 저장
        reservationService.insert(userNo, petNo, roomNo, checkinDate, checkoutDate, resTime, totalPrice, serviceIds);

        redirectAttributes.addFlashAttribute("checkin", checkin);
        redirectAttributes.addFlashAttribute("checkout", checkout);
        redirectAttributes.addFlashAttribute("nights", nights);
        redirectAttributes.addFlashAttribute("total", totalPrice);

        redirectAttributes.addFlashAttribute("successMsg", "예약이 완료되었습니다!");
        redirectAttributes.addFlashAttribute("paymentMsg", "결제를 진행해주세요.");
        return "redirect:/mypage";
    }

    /**
     * 체크아웃 처리
     */
    @PostMapping("/api/reservation/complete/{resNo}")
    @ResponseBody
    public Map<String, Object> completeReservation(@PathVariable("resNo") Long resNo) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = reservationService.completeReservation(resNo);
            if (success) {
                result.put("success", true);
                result.put("message", "체크아웃이 완료되었습니다.");
            } else {
                result.put("success", false);
                result.put("message", "체크아웃 처리에 실패했습니다.");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "처리 실패: " + e.getMessage());
        }
        return result;
    }

    /**
     * 객실별 예약 스케줄 조회 (AJAX)
     */
    @GetMapping("/api/room/{roomNo}/schedule")
    @ResponseBody
    public Map<String, Object> getRoomSchedule(@PathVariable("roomNo") Long roomNo) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<ReservationDto> schedule = reservationService.getRoomSchedule(roomNo);
            
            result.put("success", true);
            result.put("schedule", schedule);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "조회 실패: " + e.getMessage());
        }
        return result;
    }

    /**
     * 서비스 목록 조회 (AJAX)
     */
    @GetMapping("/api/rooms/services")
    @ResponseBody
    public List<Map<String, Object>> getAllServices() {
        return hotelServiceService.getAllServices()
            .stream()
            .map(s -> {
                Map<String, Object> map = new HashMap<>();
                map.put("serviceNo", s.getServiceNo());
                map.put("serviceName", s.getServiceName());
                map.put("price", s.getServicePrice());
                return map;
            })
            .collect(Collectors.toList());
    }

    /**
     * 오늘 체크인 목록 (관리자용)
     */
    @GetMapping("/admin/today-checkins")
    @ResponseBody
    public Map<String, Object> getTodayCheckIns() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<ReservationDto> checkIns = reservationService.getTodayCheckIns();
            
            result.put("success", true);
            result.put("checkIns", checkIns);
            result.put("count", checkIns.size());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "조회 실패: " + e.getMessage());
        }
        return result;
    }

    /**
     * 오늘 체크아웃 목록 (관리자용)
     */
    @GetMapping("/admin/today-checkouts")
    @ResponseBody
    public Map<String, Object> getTodayCheckOuts() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<ReservationDto> checkOuts = reservationService.getTodayCheckOuts();
            
            result.put("success", true);
            result.put("checkOuts", checkOuts);
            result.put("count", checkOuts.size());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "조회 실패: " + e.getMessage());
        }
        return result;
    }

            /**
             * 로그인 상태 확인 API (React 헤더용)       추가
             */
            @GetMapping("/api/auth/status")
            @ResponseBody
            public Map<String, Object> authStatus(@AuthenticationPrincipal UserDetails userDetails) {
                Map<String, Object> result = new HashMap<>();
                if (userDetails == null) {
                    result.put("isLogin", false);
                    result.put("isAdmin", false);
                } else {
                    boolean isAdmin = userDetails.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                    result.put("isLogin", true);
                    result.put("isAdmin", isAdmin);
                }
                return result;
            }

        }