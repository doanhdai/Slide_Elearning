package com.example.slide_elearning.dto;

import com.example.slide_elearning.Entity.lecture.LectureStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
// import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LectureResponseDto {
    private Integer id;
    private LocalDateTime createdAt;
    private UserDto user;
    private String lectureName;
    private String subject;
    private String chapter;
    private String lectureLink;
    private String linkGenspack;
    private LectureStatus status;
    private String description;
    private String studyClass;
    // private List<SlidesDto> slides;
}