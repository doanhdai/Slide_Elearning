package com.example.slide_elearning.repository;

import com.example.slide_elearning.Entity.lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LectureRepository extends JpaRepository<lecture, Integer> {
    @Query("SELECT l FROM lecture l JOIN FETCH l.user u ORDER BY l.createdAt DESC")
    List<lecture> findAllLecturesWithUser();
}
