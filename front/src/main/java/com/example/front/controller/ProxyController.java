package com.example.front.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.front.Dto.CommentDto;
import com.example.front.Dto.PostWriteData;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.java.Log;


@RestController
@Log
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
    public ResponseEntity<String> getCategoryPosts(@PathVariable String categoryNo, @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        String url = "http://board.default.svc.cluster.local:8080/api_post/category/" + categoryNo + "?page=" + page + "&size=" + size;
        log.info("getCategoryPosts 진입 :: page " + page + " size ::" + size);
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return ResponseEntity.ok(response.getBody());
    }

    @PostMapping("/api_post/write")
    public ResponseEntity<String> write(@RequestBody PostWriteData postWriteData

    ) {
        String url = "http://board.default.svc.cluster.local:8080/api_post/write";
        // 클라이언트에서 데이터 생성

        PostWriteData postData = new PostWriteData();

    // JSON conversion with exception handling
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonData;
            try {
                jsonData = objectMapper.writeValueAsString(postData);
            } catch (JsonProcessingException e) {
                e.printStackTrace(); // Log the error for debugging
                // Handle the error here, potentially return an error message
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating JSON request: " + e.getMessage());
            }

    // Create HttpEntity with JSON data
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", MediaType.APPLICATION_JSON_VALUE);
            HttpEntity<String> requestEntity = new HttpEntity<>(jsonData, headers);

    // Send POST request
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
            return ResponseEntity.ok(response.getBody());
    }

    // 댓글 조회
    @GetMapping("/comment/selectCommentByPostNo")
    public ResponseEntity<String> selectCommentByPostNo(@RequestParam String postNo) {
        String url = "http://board.default.svc.cluster.local:8080/comment/selectCommentByPostNo" + "?postNo=" + postNo;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return ResponseEntity.ok(response.getBody());
    }

    //댓글 입력
    @PostMapping("/comment/insertComment")
    public ResponseEntity<String> insertComment(@RequestBody CommentDto commentDto) {
        String url = "http://board.default.svc.cluster.local:8080/comment/insertComment";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); // JSON 타입으로 설정

        HttpEntity<CommentDto> request = new HttpEntity<>(commentDto, headers);

        RestTemplate restTemplate = new RestTemplate();
        
        // JSON 변환을 위한 MappingJackson2HttpMessageConverter 추가
        restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());

        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
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

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, Object> requestData, HttpServletResponse servletResponse) {
        String url = "http://user-service.default.svc.cluster.local/user/login";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); // Content-Type 설정

        ObjectMapper objectMapper = new ObjectMapper();
        String requestBody;
        try {
            requestBody = objectMapper.writeValueAsString(requestData);
        } catch (JsonProcessingException e) {
            log.severe("Error creating JSON from requestData: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error in JSON processing");
        }

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, requestEntity, String.class);

        // 받은 응답에서 Authorization 헤더 추출 및 설정
        String authToken = responseEntity.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authToken != null) {
            servletResponse.setHeader(HttpHeaders.AUTHORIZATION, authToken);
        }

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

