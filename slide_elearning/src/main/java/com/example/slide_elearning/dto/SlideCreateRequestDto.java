package com.example.slide_elearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlideCreateRequestDto {
    private String title;
    private String htmlContent;
    private Integer slideOrder;
    private Integer roleId;
}