package com.example.front.Dto;
import org.springframework.web.multipart.MultipartFile;


public class PostWriteData {
    private MultipartFile postFile;
    private Integer point;
    private Integer postCategory;
    private String postTitle;
    private String postContent;
    private Integer userNo;
    private Integer postViews;
    private Integer regionNo;
    private Integer postStatus;



    // 기본 생성자, getter, setter 생략 (Lombok을 사용하여 간단하게 정의 가능)

    public MultipartFile getPostFile() {
        return postFile;
    }

    public Integer getPoint() {
        return point;
    }

    public Integer getPostCategory() {
        return postCategory;
    }

    public String getPostTitle() {
        return postTitle;
    }

    public String getPostContent() {
        return postContent;
    }

    public Integer getUserNo() {
        return userNo;
    }

    public Integer getPostViews() {
        return postViews;
    }

    public Integer getRegionNo() {
        return regionNo;
    }

    public Integer getPostStatus() {
        return postStatus;
    }

    // Setter 메서드
    public void setPostFile(MultipartFile postFile) {
        this.postFile = postFile;
    }

    public void setPoint(Integer point) {
        this.point = point;
    }

    public void setPostCategory(Integer postCategory) {
        this.postCategory = postCategory;
    }

    public void setPostTitle(String postTitle) {
        this.postTitle = postTitle;
    }

    public void setPostContent(String postContent) {
        this.postContent = postContent;
    }

    public void setUserNo(Integer userNo) {
        this.userNo = userNo;
    }

    public void setPostViews(Integer postViews) {
        this.postViews = postViews;
    }

    public void setRegionNo(Integer regionNo) {
        this.regionNo = regionNo;
    }

    public void setPostStatus(Integer postStatus) {
        this.postStatus = postStatus;
    }

}