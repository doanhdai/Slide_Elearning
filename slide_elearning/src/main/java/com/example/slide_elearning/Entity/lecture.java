package com.example.slide_elearning.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "lectures")
public class lecture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id")
    private user user;

    @Column(name = "lecture_name", nullable = false)
    private String lectureName;

    @Column(nullable = false)
    private String subject;

    private String chapter;

    @Column(name = "lecture_link")
    private String lectureLink;

    @Column(name = "link_genspack")
    private String linkGenspack;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LectureStatus status = LectureStatus.New;

    @Column(length = 5000)
    private String description;

    @Column(name = "study_class")
    private String studyClass;

    @JsonManagedReference
    @OneToMany(mappedBy = "lecture", cascade = CascadeType.ALL)
    private List<slides> slides;

    public enum LectureStatus {
        New, Creating, Created
    }
}
