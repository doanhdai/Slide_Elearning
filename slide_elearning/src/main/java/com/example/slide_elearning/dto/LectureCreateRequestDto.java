package com.example.slide_elearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LectureCreateRequestDto {
    private String lectureName;
    private String subject;
    private String chapter;
    private String lectureLink;
    private String linkGenspack;
    private String description;
    private Integer userId;
    private String studyClass;
}