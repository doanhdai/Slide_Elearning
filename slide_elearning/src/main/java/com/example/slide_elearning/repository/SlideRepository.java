package com.example.slide_elearning.repository;

import com.example.slide_elearning.Entity.slides;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SlideRepository extends JpaRepository<slides, Integer> {
    List<slides> findByLectureIdOrderBySlideOrderAsc(Integer lectureId);
}
