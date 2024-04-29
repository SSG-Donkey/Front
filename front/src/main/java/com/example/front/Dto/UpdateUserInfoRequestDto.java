package com.example.front.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserInfoRequestDto {
    private String nickname;
    private String password;
    private Long newBankNo;
    private Long newAccount;
}
