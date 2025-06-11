package com.example.slide_elearning.controller;

import com.example.slide_elearning.Entity.lecture;
import com.example.slide_elearning.Service.LectureService;
import com.example.slide_elearning.dto.ApiResponse;
import com.example.slide_elearning.dto.LectureResponseDto;
import com.example.slide_elearning.dto.LectureCreateRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lecture-requests")
@CrossOrigin(origins = "*")
public class LectureController {
    @Autowired
    private LectureService lectureService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LectureResponseDto>>> getAllLectures() {
        List<LectureResponseDto> lectures = lectureService.getAllLectures();
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin bài giảng thành công.", lectures));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createLecture(@RequestBody LectureCreateRequestDto requestDto) {
        try {
            lecture createdLecture = lectureService.createLecture(requestDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Thêm bài giảng thành công", createdLecture));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(HttpStatus.BAD_REQUEST.value(),
                    "Không thể thêm bài giảng: " + e.getMessage(), null));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<?>> updateStatus(@PathVariable Integer id,
            @RequestBody lecture.LectureStatus status) {
        try {
            lecture updatedLecture = lectureService.updateStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", updatedLecture));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Lecture not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), e.getMessage(), null));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi server: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(HttpStatus.BAD_REQUEST.value(),
                    "Lỗi khi cập nhật trạng thái: " + e.getMessage(), null));
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateDescription(@PathVariable Integer id, @RequestBody lecture lecture) {
        try {
            lecture updatedLecture = lectureService.updateDescription(id, lecture.getDescription());
            return ResponseEntity.ok(ApiResponse.success("Cập nhật mô tả thành công", updatedLecture));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Lecture not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), e.getMessage(), null));
            } else if (e.getMessage().equals("Can only update description when status is New")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error(HttpStatus.FORBIDDEN.value(), e.getMessage(), null));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi server: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(HttpStatus.BAD_REQUEST.value(),
                    "Lỗi khi cập nhật mô tả: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteLecture(@PathVariable Integer id) {
        try {
            lectureService.deleteLecture(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa bài giảng thành công", null));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Lecture not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), e.getMessage(), null));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi server: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(HttpStatus.BAD_REQUEST.value(),
                    "Lỗi khi xóa bài giảng: " + e.getMessage(), null));
        }
    }
}