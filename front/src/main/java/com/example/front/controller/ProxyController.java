package com.example.front.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import java.util.Map;


@RestController
@RequestMapping("/proxy")
public class ProxyController {

    private final RestTemplate restTemplate;

    public ProxyController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/api_post/getRecentPost")
    public ResponseEntity<String> getRecentPost() {
        String url = "http://board.default.svc.cluster.local:8080/api_post/getRecentPost";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return ResponseEntity.ok(response.getBody());
    }


    @PostMapping("/api_post/write")
    public ResponseEntity<String> write(@RequestBody Map<String, Object> requestData) {
    String url = "http://board.default.svc.cluster.local:8080/api_post/write";
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestData, headers);
    ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
    return ResponseEntity.ok(response.getBody());
}

    // 댓글 조회
    @GetMapping("/comment/selectCommentByPostNo")
    public ResponseEntity<String> selectCommentByPostNo() {
        String url = "http://board.default.svc.cluster.local:8080/comment/selectCommentByPostNo";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return ResponseEntity.ok(response.getBody());
    }
}