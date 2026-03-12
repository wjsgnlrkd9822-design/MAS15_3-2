package com.aloha.project.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aloha.project.dto.Notice;
import com.aloha.project.service.NoticeService;

import lombok.RequiredArgsConstructor;
import java.util.HashMap;           /* 추가 */
import java.util.Map;               /* 추가 */
 


@Controller
@RequiredArgsConstructor
public class NoticeController {
    
    private final NoticeService noticeService;

    @GetMapping("/noticelist")
    public String getMethodName(Model model) {
        try{
        List<Notice> noticeList= noticeService.list();
        model.addAttribute("noticeList",noticeList);
        System.out.println("noticeList = " + noticeList);
        }catch(Exception e){
            e.printStackTrace();
        }
        return "notice/notice_list";
    }
    

    @GetMapping("/noticedetail")
    public String detail(@RequestParam("no")Long no, Model model){ 
     try{
        Notice notice = noticeService.select(no);
        model.addAttribute("notice",notice);
        System.out.println("notice = " + notice);
         }catch(Exception e){
        e.printStackTrace();
         }
        return "notice/notice_view";
    }

    @GetMapping("/noticeupdate")
        public String update(@RequestParam("no")Long no, Model model){ 
     try{
        Notice notice = noticeService.select(no);
        model.addAttribute("notice",notice);
        System.out.println("notice = " + notice);
        }catch(Exception e){
        e.printStackTrace();
        }
        return "notice/notice_update";
    }

    @PostMapping("/noticeup/{no}")
    @ResponseBody
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> noticeup(
        @PathVariable("no") Long no,
         @RequestBody Notice notice) {
        try{
                  notice.setNo(no);
            boolean result = noticeService.update(notice);
            if(!result){
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
               return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
 
        
    }

    @DeleteMapping("/noticedelete/{no}")
    public ResponseEntity<?> deleteNotice(@PathVariable("no") Long no){
        try{
            boolean result = noticeService.delete(no);
            if(!result){
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
           }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // 공지사항 목록 조회 (React용 JSON API)    /* 추가 */
@GetMapping("/api/notices")
@ResponseBody
public Map<String, Object> getNoticesApi() {
    Map<String, Object> result = new HashMap<>();
    try {
        List<Notice> noticeList = noticeService.getRecentNotices(5);
        result.put("success", true);
        result.put("noticeList", noticeList);
    } catch (Exception e) {
        e.printStackTrace();
        result.put("success", false);
        result.put("noticeList", List.of());
    }
    return result;
}

    // 공지사항 상세 조회 (React용 JSON API)    /* 추가 */
    @GetMapping("/api/notices/{no}")
    @ResponseBody
    public Map<String, Object> getNoticeDetailApi(@PathVariable("no") Long no) {
        Map<String, Object> result = new HashMap<>();
        try {
            Notice notice = noticeService.select(no);
            result.put("success", true);
            result.put("notice", notice);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
        }
        return result;
    }
    
}

