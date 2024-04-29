package com.example.front.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentDto {
    private String commentNo;
    private String userNo;
    private String postNo;
    private String userNickname;
    private String commentContent;
    private String commentDate;
    private String isChosen;
}