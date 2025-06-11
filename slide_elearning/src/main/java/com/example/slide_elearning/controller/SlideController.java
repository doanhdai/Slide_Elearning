package com.example.slide_elearning.controller;

import com.example.slide_elearning.Entity.slides;
import com.example.slide_elearning.Service.SlideService;
import com.example.slide_elearning.dto.ApiResponse;
import com.example.slide_elearning.dto.SlideCreateRequestDto;
import com.example.slide_elearning.dto.SlideUpdateRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/slides")
@CrossOrigin(origins = "*")
public class SlideController {
    @Autowired
    private SlideService slideService;

    @GetMapping("/{lectureId}")
    public ResponseEntity<ApiResponse<List<slides>>> getSlidesByLectureId(@PathVariable Integer lectureId) {
        List<slides> slideList = slideService.getSlidesByLectureId(lectureId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách slides thành công.", slideList));
    }

    @PostMapping("/createSlide/{lectureId}")
    public ResponseEntity<ApiResponse<?>> createSlides(@PathVariable Integer lectureId,
            @RequestBody List<SlideCreateRequestDto> slideCreateRequestDtos) {
        try {
            slideService.createSlides(lectureId, slideCreateRequestDtos);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Thêm slide thành công", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse
                    .error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Không thể thêm slide: " + e.getMessage(), null));
        }
    }

    @PutMapping("/updateSlides")
    public ResponseEntity<ApiResponse<?>> updateSlides(@RequestBody List<SlideUpdateRequestDto> slideUpdateRequests) {
        try {
            if (slideUpdateRequests.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        ApiResponse.error(HttpStatus.BAD_REQUEST.value(),
                                "Không có slides nào được cung cấp để cập nhật", null));
            }
            slideService.updateSlides(slideUpdateRequests);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật slides thành công", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi khi cập nhật slides: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{slideId}")
    public ResponseEntity<ApiResponse<?>> deleteSlide(@PathVariable Integer slideId) {
        try {
            slideService.deleteSlide(slideId);
            return ResponseEntity.ok(ApiResponse.success("Xóa slide thành công", null));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Slide not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), e.getMessage(), null));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi server: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ApiResponse.error(HttpStatus.BAD_REQUEST.value(), "Lỗi khi xóa slide: " + e.getMessage(), null));
        }
    }
}