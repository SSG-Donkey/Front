package com.example.front.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

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
    public ResponseEntity<String> write() {
        String url = "http://board.default.svc.cluster.local:8080/api_post/write";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
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