package com.example.front.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;


@RestController
@RequestMapping("/proxy")
public class ProxyController {

    private final RestTemplate restTemplate;

    public ProxyController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/api_post/getRecentPosts")
    public ResponseEntity<String> getRecentPost() {
        String url = "http://board.default.svc.cluster.local:8080/api_post/getRecentPosts";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return ResponseEntity.ok(response.getBody());
    }
    
    @GetMapping("/api_post/category/{categoryNo}")
    public ResponseEntity<String> getCategoryPosts(@PathVariable String categoryNo) {
        String url = "http://board.default.svc.cluster.local:8080/api_post/category/" + categoryNo;
        System.out.println("getCategoryPosts 진입");
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        System.out.println("Response Body: " + response.getBody());
        System.out.println("getCategoryPosts 아웃");
        return ResponseEntity.ok(response.getBody());
    }

    @PostMapping("/api_post/write")
    public ResponseEntity<String> write(@RequestParam ("post_file") MultipartFile post_file,
                                        @RequestParam ("point") Integer point,
                                        @RequestParam ("post_category") Integer post_category,
                                        @RequestParam ("post_title") String post_title,
                                        @RequestParam ("post_content") String post_content,
                                        @RequestParam ("user_no") Integer user_no,
                                        @RequestParam ("post_views") Integer post_views,
                                        @RequestParam ("region_no") Integer region_no,
                                        @RequestParam ("post_status") Integer post_status

    ) {
        String url = "http://board.default.svc.cluster.local:8080/api_post/write?";
        String Data ="post_file"+post_file+"&point"+point+"&post_category"+post_category+"&post_title"+post_title+"&post_content"+post_content+"&user_no"+user_no+"&post_views"+post_views+"&region_no"+region_no+"&post_status"+post_status;
        System.out.printf("%d d %d %s",point,post_category,post_category,post_title );
        HttpHeaders headers = new HttpHeaders();
        HttpEntity<String> requestEntity= new HttpEntity<>(Data,headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
        return ResponseEntity.ok("ok");
    }

    // 댓글 조회
    @GetMapping("/comment/selectCommentByPostNo")
    public ResponseEntity<String> selectCommentByPostNo() {
        String url = "http://board.default.svc.cluster.local:8080/comment/selectCommentByPostNo";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return ResponseEntity.ok(response.getBody());
    }

    // 은행 목록 조회
    @GetMapping("/banks")
    public ResponseEntity<String> getAllBanks() {
        String url = "http://user-service.default.svc.cluster.local/user/banks";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return ResponseEntity.ok(response.getBody());
    }


    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Map<String, Object> requestData) {
        String url = "http://user-service.default.svc.cluster.local/user/signup";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestData, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
        return ResponseEntity.ok(response.getBody());
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, Object> requestData, HttpServletResponse response){
        String url = "http://user-service.default.svc.cluster.local/user/login";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); // Content-Type 설정
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestData, headers);
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, requestEntity, String.class);
        response.setHeader("Authorization", "Bearer " + responseEntity.getHeaders().getFirst("Authorization"));
        return ResponseEntity.ok(responseEntity.getBody());
    }


    // 회원 정보 업데이트
    @PutMapping("/user/{userId}/updateInfo")
    public ResponseEntity<String> updateUserInfo(@PathVariable Long userId, @RequestBody Map<String, Object> requestData) {
        String url = String.format("http://user-service.default.svc.cluster.local/user/%d/updateInfo", userId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestData, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, requestEntity, String.class);
        return ResponseEntity.ok(response.getBody());
    }

    // 회원 탈퇴
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        String url = String.format("http://user-service.default.svc.cluster.local/user/%d", userId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<?> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, requestEntity, String.class);
        return ResponseEntity.ok(response.getBody());
    }



}

