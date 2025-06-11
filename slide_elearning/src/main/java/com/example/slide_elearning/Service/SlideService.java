package com.example.slide_elearning.Service;

import com.example.slide_elearning.Entity.Role;
import com.example.slide_elearning.Entity.slides;
import com.example.slide_elearning.Entity.lecture;
import com.example.slide_elearning.Entity.lecture.LectureStatus;
import com.example.slide_elearning.repository.SlideRepository;
import com.example.slide_elearning.repository.LectureRepository;
import com.example.slide_elearning.repository.RoleRepository;
import com.example.slide_elearning.dto.SlideCreateRequestDto;
import com.example.slide_elearning.dto.SlideUpdateRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SlideService {
    @Autowired
    private SlideRepository slideRepository;

    @Autowired
    private LectureRepository lectureRepository;

    @Autowired
    private RoleRepository roleRepository;

    public List<slides> getSlidesByLectureId(Integer lectureId) {
        return slideRepository.findByLectureIdOrderBySlideOrderAsc(lectureId);
    }

    @Transactional
    public void createSlides(Integer lectureId, List<SlideCreateRequestDto> slideCreateRequestDtos) {
        if (slideCreateRequestDtos == null || slideCreateRequestDtos.isEmpty()) {
            throw new RuntimeException("Slides list is empty or null");
        }

        lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new RuntimeException("Lecture not found with ID: " + lectureId));

        for (SlideCreateRequestDto dto : slideCreateRequestDtos) {
            if (dto.getTitle() == null || dto.getHtmlContent() == null) {
                throw new RuntimeException("Missing required fields in slide");
            }
            Role role = null;
            if (dto.getRoleId() != null) {
                role = roleRepository.findById(dto.getRoleId())
                        .orElseThrow(() -> new RuntimeException("Role not found with ID: " + dto.getRoleId()));
            }

            slides slide = new slides();
            slide.setTitle(dto.getTitle());
            slide.setHtmlContent(dto.getHtmlContent());
            slide.setSlideOrder(dto.getSlideOrder());
            slide.setLecture(lecture);
            slide.setRole(role); // Set the role
            slide.setCreatedAt(LocalDateTime.now());
            slideRepository.save(slide);
        }

        // Update lecture status to Created
        lecture.setStatus(LectureStatus.Created);
        lectureRepository.save(lecture);
    }

    @Transactional
    public void updateSlides(List<SlideUpdateRequestDto> slideUpdateRequests) {
        if (slideUpdateRequests == null || slideUpdateRequests.isEmpty()) {
            throw new RuntimeException("Slides update list is empty or null");
        }

        for (SlideUpdateRequestDto dto : slideUpdateRequests) {
            slides existingSlide = slideRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Slide not found with ID: " + dto.getId()));

            if (dto.getTitle() != null) {
                existingSlide.setTitle(dto.getTitle());
            }
            if (dto.getHtmlContent() != null) {
                existingSlide.setHtmlContent(dto.getHtmlContent());
            }
            if (dto.getSlideOrder() != null) {
                existingSlide.setSlideOrder(dto.getSlideOrder());
            }
            if (dto.getRoleId() != null) {
                Role role = roleRepository.findById(dto.getRoleId())
                        .orElseThrow(() -> new RuntimeException("Role not found with ID: " + dto.getRoleId()));
                existingSlide.setRole(role);
            } else if (dto.getRoleId() == null) {
                // If roleId is explicitly null, set role to null
                existingSlide.setRole(null);
            }
            slideRepository.save(existingSlide);
        }
    }

    @Transactional
    public void updateSlideOrder(Integer lectureId, List<slides> slidesList) {
        for (int i = 0; i < slidesList.size(); i++) {
            slides slide = slidesList.get(i);
            slide.setSlideOrder(i + 1);
            slideRepository.save(slide);
        }
    }

    @Transactional
    public void deleteSlide(Integer slideId) {
        if (!slideRepository.existsById(slideId)) {
            throw new RuntimeException("Slide not found");
        }
        slideRepository.deleteById(slideId);
    }
}