package com.example.slide_elearning.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "slides")
public class slides {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "lecture_id", nullable = false)
    private lecture lecture;

    @Column(nullable = false)
    private String title;

    @Column(name = "html_content", columnDefinition = "TEXT")
    private String htmlContent;

    @Column(name = "slide_order")
    private Integer slideOrder;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "id_role")
    private Role role;
}
