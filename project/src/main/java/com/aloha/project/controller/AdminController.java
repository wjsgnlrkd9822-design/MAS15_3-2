package com.aloha.project.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.project.dto.HotelRoom;
import com.aloha.project.dto.HotelService;
import com.aloha.project.dto.MonthlySalesDto;
import com.aloha.project.dto.Notice;
import com.aloha.project.dto.PetStatus;
import com.aloha.project.dto.Trainer;
import com.aloha.project.dto.User;
import com.aloha.project.dto.userTotalSales;
import com.aloha.project.service.AddtionalService;
import com.aloha.project.service.FileService;
import com.aloha.project.service.NoticeService;
import com.aloha.project.service.PetStatusService;
import com.aloha.project.service.ReservationService;
import com.aloha.project.service.RoomService;
import com.aloha.project.service.TrainerService;
import com.aloha.project.service.UserService;
import com.github.pagehelper.PageInfo;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final NoticeService noticeService;
    private final TrainerService trainerService;
    private final AddtionalService addtionalService;
    private final RoomService roomService;
    private final FileService fileService;
    private final UserService userService;
    private final ReservationService reservationService;
    private final PetStatusService petStatusService;

    // ============================== 대시보드 ==============================

    @GetMapping("")
    public ResponseEntity<?> admin() {
        try {
            Long totalSales = reservationService.getTotalSales();
            List<userTotalSales> memberSales = reservationService.getMemberTotalSales();
            List<MonthlySalesDto> monthlySales = reservationService.getMonthlySales();

            Map<String, Object> result = new HashMap<>();
            result.put("totalSales", totalSales);
            result.put("memberSales", memberSales);
            result.put("monthlySales", monthlySales);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ============================== 회원 관리 ==============================

    @GetMapping("/usermanage")
    public ResponseEntity<?> usermanage(
        @RequestParam(name = "page", defaultValue = "1") int page,
        @RequestParam(name = "size", defaultValue = "10") int size) {
        try {
            PageInfo<User> pageInfo = userService.listPage(page, size);
            return ResponseEntity.ok(pageInfo);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/user/delete/{no}")
    public ResponseEntity<?> deleteUser(@PathVariable("no") Long no) {
        try {
            int result = userService.deleteByNO(no);
            if (result == 0) {
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ============================== 시설 & 서비스 관리 ==============================

    @GetMapping("/service")
    public ResponseEntity<?> service(
        @RequestParam(name = "roomPage", defaultValue = "1") int roomPage,
        @RequestParam(name = "servicePage", defaultValue = "1") int servicePage,
        @RequestParam(name = "size", defaultValue = "10") int size){
        try {
            PageInfo<HotelRoom> roomPageInfo = roomService.listPage(roomPage, size);
            PageInfo<HotelService> servicePageInfo = addtionalService.listPage(servicePage, size);

            Map<String, Object> result = new HashMap<>();
            result.put("roomPageInfo", roomPageInfo);
            result.put("servicePageInfo", servicePageInfo);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/roomup")
    public ResponseEntity<?> roomUpdate(@RequestParam("roomNo") Long roomNo) {
        try {
            HotelRoom room = roomService.select(roomNo);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("imgFile") MultipartFile imgFile) {
        try {
            if (imgFile == null || imgFile.isEmpty()) {
                return ResponseEntity.badRequest().body("No file uploaded");
            }
            String savedFileName = fileService.save(imgFile);
            return ResponseEntity.ok(savedFileName);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> createRoom(@RequestBody HotelRoom hotelRoom) {
        try {
            boolean result = roomService.insert(hotelRoom);
            if (!result) {
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/update/{roomNo}")
    public ResponseEntity<?> updateRoom(
            @PathVariable("roomNo") Long roomNo,
            @RequestBody HotelRoom hotelRoom) {
        try {
            hotelRoom.setRoomNo(roomNo);
            boolean result = roomService.update(hotelRoom);
            if (!result) {
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/room/delete/{roomNo}")
    public ResponseEntity<?> deleteRoom(@PathVariable("roomNo") Long roomNo) {
        try {
            boolean result = roomService.delete(roomNo);
            if (!result) {
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/serviceupdate")
    public ResponseEntity<?> serviceUpdate(@RequestParam("serviceNo") Long serviceNo) {
        try {
            HotelService service = addtionalService.select(serviceNo);
            return ResponseEntity.ok(service);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/serviceadd")
    public ResponseEntity<String> createService(@RequestBody HotelService hotelService) {
        try {
            boolean result = addtionalService.insert(hotelService);
            if (!result) {
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{serviceNo}")
    public ResponseEntity<?> updateService(
            @PathVariable("serviceNo") Long serviceNo,
            @RequestBody HotelService hotelService) {
        try {
            hotelService.setServiceNo(serviceNo);
            boolean result = addtionalService.update(hotelService);
            if (!result) {
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/service/delete/{serviceNo}")
    public ResponseEntity<?> deleteService(@PathVariable("serviceNo") Long serviceNo) {
        try {
            boolean result = addtionalService.delete(serviceNo);
            if (!result) {
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ============================== 훈련사 관리 ==============================

    @GetMapping("/trainer")
    public ResponseEntity<?> trainer(
        @RequestParam(name = "page", defaultValue = "1") int page,
        @RequestParam(name = "size", defaultValue = "10") int size)  {
        try {
            PageInfo<Trainer> pageInfo = trainerService.listPage(page, size);
            return ResponseEntity.ok(pageInfo);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/trainerupdate")
    public ResponseEntity<?> trainerupdate(@RequestParam("trainerNo") Long trainerNo) {
        try {
            Trainer trainer = trainerService.select(trainerNo);
            return ResponseEntity.ok(trainer);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/traineradd")
    public ResponseEntity<String> traineradd(@RequestBody Trainer trainer) {
        try {
            boolean result = trainerService.insert(trainer);
            if (!result) {
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/trainerupdate/{trainerNo}")
    public ResponseEntity<?> updateTrainer(
            @PathVariable("trainerNo") Long trainerNo,
            @RequestBody Trainer trainer) {
        try {
            trainer.setTrainerNo(trainerNo);
            boolean result = trainerService.update(trainer);
            if (!result) {
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/trainer/delete/{trainerNo}")
    public ResponseEntity<?> deleteTrainer(@PathVariable("trainerNo") Long trainerNo) {
        try {
            boolean result = trainerService.delete(trainerNo);
            if (!result) {
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ============================== 공지사항 ==============================

    @PostMapping("/noticeadd")
    public ResponseEntity<String> noticeadd(@RequestBody Notice notice) {
        try {
            boolean result = noticeService.insert(notice);
            if (!result) {
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ============================== 반려견 상태 관리 ==============================

    @GetMapping("/petstatus")
    public ResponseEntity<?> petStatusPage(
        @RequestParam(name = "page", defaultValue = "1") int page,
        @RequestParam(name = "size", defaultValue = "10") int size) {
        try {
            PageInfo<Map<String, Object>> pageInfo = petStatusService.getActiveReservationsPage(page, size);
            return ResponseEntity.ok(pageInfo);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/petstatus/update/{petNo}")
    public ResponseEntity<?> updatePetStatus(
            @PathVariable("petNo") Long petNo,
            @RequestBody Map<String, String> request) {
        try {
            PetStatus petStatus = new PetStatus();
            petStatus.setPetNo(petNo);
            petStatus.setStatus(request.get("status"));
            petStatus.setNextSchedule(request.get("nextSchedule"));

            PetStatus existing = petStatusService.getPetStatus(petNo);
            boolean result;

            if (existing == null) {
                result = petStatusService.insertPetStatus(petStatus);
            } else {
                result = petStatusService.updatePetStatus(petStatus);
            }

            if (!result) {
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("ERROR: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/petstatus/delete/{petNo}")
    public ResponseEntity<?> deletePetStatus(@PathVariable("petNo") Long petNo) {
        try {
            boolean result = petStatusService.deletePetStatus(petNo);
            if (!result) {
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}